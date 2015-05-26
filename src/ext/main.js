"use strict";

/**
 * Main Blend4Web module.
 * Implements methods to initialize and change the global params of the engine.
 * @module main
 * @local fps_callback
 * @local render_callback
 */
b4w.module["main"] = function(exports, require) {

var m_anchors  = require("__anchors");
var animation  = require("__animation");
var m_compat   = require("__compat");
var m_cfg      = require("__config");
var m_print    = require("__print");
var m_cont     = require("__container");
var controls   = require("__controls");
var m_data     = require("__data");
var m_debug    = require("__debug");
var extensions = require("__extensions");
var geometry   = require("__geometry");
var hud        = require("__hud");
var nla        = require("__nla");
var assets     = require("__assets");
var m_phy      = require("__physics");
var renderer   = require("__renderer");
var scenes     = require("__scenes");
var sfx        = require("__sfx");
var shaders    = require("__shaders");
var textures   = require("__textures");
var m_time     = require("__time");
var m_trans    = require("__transform");
var util       = require("__util");
var version    = require("__version");

var cfg_ctx = m_cfg.context;
var cfg_def = m_cfg.defaults;

var _elem_canvas_webgl = null;
var _elem_canvas_hud = null;

var _last_abs_time = 0;
var _pause_time = 0;
var _resume_time = 0;
var _loop_cb = [];

/**
 * FPS callback
 * @callback fps_callback
 * @param {Number} fps_avg Averaged rendering FPS
 * @param {Number} phy_fps_avg Averaged physics FPS (not implemented, always 0)
 */
var _fps_callback = function() {};

var _fps_counter = function() {};

var _render_callback = function() {};
var _canvas_data_url_callback = null;

var CONTEXT_NAMES = ["webgl", "experimental-webgl"];

var _gl = null;

/**
 * NOTE: According to the spec, this function takes only one param
 */
var _requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) {return window.setTimeout(callback,
             1000/cfg_def.max_fps);};
})();

// public enums

/**
 * Create the WebGL context and initialize the engine.
 * @method module:main.init
 * @param {HTMLCanvasElement} elem_canvas_webgl Canvas element for WebGL
 * @param {HTMLCanvasElement} [elem_canvas_hud] Canvas element for HUD
 * @returns {Object|Null} WebGL context or null
 */
exports.init = function(elem_canvas_webgl, elem_canvas_hud) {
    m_cfg.set_paths();

    // NOTE: for debug purposes
    // works in chrome with --enable-memory-info --js-flags="--expose-gc"
    //window.setInterval(function() {window.gc();}, 1000);

    m_print.set_verbose(cfg_def.console_verbose);

    var ver_str = version.version() + " " + version.type() +
            " (" + version.date() + ")";
    m_print.log("%cINIT ENGINE", "color: #00a", ver_str);

    // check gl context and performance.now()
    if (!window["WebGLRenderingContext"])
        return null;

    setup_clock();

    _elem_canvas_webgl = elem_canvas_webgl;
    m_compat.apply_context_alpha_hack(gl);

    var gl = get_context(elem_canvas_webgl);
    if (!gl)
        return null;

    _gl = gl;

    init_context(_elem_canvas_webgl, gl);
    m_cfg.apply_quality();
    m_compat.set_hardware_defaults(gl);
    
    if (cfg_def.ie11_touchscreen_hack)
        elem_canvas_webgl.style["touch-action"] = "none";

    m_print.log("%cSET PRECISION:", "color: #00a", cfg_def.precision);

    if (elem_canvas_hud) {
        hud.init(elem_canvas_hud);
        _elem_canvas_hud = elem_canvas_hud;
    } else {
        // disable features which depend on HUD
        m_cfg.defaults.show_hud_debug_info = false;
        m_cfg.sfx.mix_mode = false;
    }

    m_cont.init(elem_canvas_webgl);

    return gl;
}

function setup_clock() {
    if (!window.performance) {
        m_print.log("Apply performance workaround");
        window.performance = {};
    }

    var curr_time = Date.now();

    if (!window.performance.now) {
        m_print.log("Apply performance.now() workaround");

        //cfg_def.no_phy_interp_hack = true;

        window.performance.now = function() {
            return Date.now() - curr_time;
        }
    }

    m_time.set_timeline(0);
}


function get_context(canvas) {

    var ctx = null;

    for (var i = 0; i < CONTEXT_NAMES.length; i++) {
        var name = CONTEXT_NAMES[i];

        try {
            ctx = canvas.getContext(name, cfg_ctx);
        } catch(e) {
            // nothing
        }

        if (ctx)
            break;
    }

    return ctx;
}

function init_context(canvas, gl) {
    canvas.addEventListener("webglcontextlost",
            function(event) {
                event.preventDefault();

                m_print.error("WebGL context lost");

                // at least prevent freeze
                pause();

            }, false);

    extensions.setup_context(gl);

    var rinfo = extensions.get_renderer_info();
    if (rinfo)
        m_print.log("%cRENDERER INFO:", "color: #00a",
            gl.getParameter(rinfo.UNMASKED_VENDOR_WEBGL) + ", " +
            gl.getParameter(rinfo.UNMASKED_RENDERER_WEBGL));

    renderer.setup_context(gl);
    geometry.setup_context(gl);
    textures.setup_context(gl);
    shaders.setup_context(gl);
    m_debug.setup_context(gl);
    m_data.setup_canvas(gl.canvas);

    scenes.setup_dim(canvas.width, canvas.height, 1,
                     calc_canvas_offset("x"), calc_canvas_offset("y"));

    sfx.init();

    _fps_counter = init_fps_counter();

    loop();
}

function calc_canvas_offset(axis) {
    if (axis == "x")
        var offset = _elem_canvas_webgl.offsetLeft;
    else if (axis == "y")
        var offset = _elem_canvas_webgl.offsetTop;
    else
        return 0

    return get_parent_offset(offset, _elem_canvas_webgl, axis);
}

function get_parent_offset(offset, elem, axis) {
    offset = offset || 0;

    var parent_elem_offset = elem.offsetParent;

    if (parent_elem_offset) {
        if (axis == "x")
            var parent_offset = parent_elem_offset.offsetLeft;
        else if (axis == "y")
            var parent_offset = parent_elem_offset.offsetTop;

        offset += parent_offset;

        offset = get_parent_offset(offset, parent_elem_offset, axis);
    }

    return offset;
}

/**
 * Whether to perform the checks of WebGL errors during rendering or not.
 * Note: additional checks can slow down the engine.
 * @param {Boolean} val Check flag
 * @method module:main.set_check_gl_errors
 */
exports.set_check_gl_errors = function(val) {
    m_debug.set_check_gl_errors(val);
}

/**
 * Resize the rendering canvas.
 * @method module:main.resize
 * @param {Number} width New canvas width
 * @param {Number} height New canvas height
 * @param {Boolean} [update_canvas_css=true] Change canvas CSS width/height
 */
exports.resize = function(width, height, update_canvas_css) {

    if (update_canvas_css !== false) {
        _elem_canvas_webgl.style.width = width + "px";
        _elem_canvas_webgl.style.height = height + "px";

        if (_elem_canvas_hud) {
            _elem_canvas_hud.style.width = width + "px";
            _elem_canvas_hud.style.height = height + "px";
        }
    }

    if (_elem_canvas_hud) {
        // no HIDPI/resolution factor for HUD canvas
        _elem_canvas_hud.width  = width;
        _elem_canvas_hud.height = height;
        hud.update_dim();
    }


    if (navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i))
            cfg_def.canvas_resolution_factor = 1;

    var cw = width * cfg_def.canvas_resolution_factor;
    var ch = height * cfg_def.canvas_resolution_factor;

    if (cfg_def.allow_hidpi && window.devicePixelRatio > 1) {
        cw *= window.devicePixelRatio;
        ch *= window.devicePixelRatio;
    }

    _elem_canvas_webgl.width  = cw;
    _elem_canvas_webgl.height = ch;

    if (cw > _gl.drawingBufferWidth || ch > _gl.drawingBufferHeight) {
        m_print.warn("Canvas size exceeds platform limits, downscaling");

        var downscale = Math.min(_gl.drawingBufferWidth/cw,
                _gl.drawingBufferHeight/ch);

        cw *= downscale;
        ch *= downscale;

        _elem_canvas_webgl.width  = cw;
        _elem_canvas_webgl.height = ch;
    }

    scenes.setup_dim(cw, ch, cw/width, calc_canvas_offset("x"),
                                       calc_canvas_offset("y"));

    // needed for frustum culling/constraints
    if (scenes.check_active())
        m_trans.update_transform(scenes.get_active()["camera"]);

    frame(m_time.get_timeline(), 0);

    m_data.update_media_controls(_elem_canvas_webgl.width, _elem_canvas_webgl.height);
}

/**
 * Set the callback for the FPS counter
 * @method module:main.set_fps_callback
 * @param {fps_callback} fps_cb FPS callback
 */
exports.set_fps_callback = function(fps_cb) {
    _fps_callback = fps_cb;
}
/**
 * Remove the callback for the FPS counter
 * @method module:main.clear_fps_callback
 */
exports.clear_fps_callback = function() {
    _fps_callback = function() {};
}

/**
 * @method module:main.set_on_before_render_callback
 * @deprecated Use set_render_callback() instead
 */
exports.set_on_before_render_callback = function(callback) {
    m_print.error("set_on_before_render_callback() deprecated, use set_render_callback() instead");
    set_render_callback(callback);
}

/**
 * Rendering callback.
 * @callback render_callback
 * @param {Number} delta Delta
 * @param {Number} timeline Timeline
 */

/**
 * Set the rendering callback which is executed for every frame
 * @method module:main.set_render_callback
 * @param {render_callback} callback Render callback
 */
exports.set_render_callback = function(callback) {
    set_render_callback(callback);
}
function set_render_callback(callback) {
    _render_callback = callback;
}

/**
 * @method module:main.clear_on_before_render_callback
 * @deprecated Use clear_render_callback() instead
 */
exports.clear_on_before_render_callback = function() {
    m_print.error("clear_on_before_render_callback() deprecated, use clear_render_callback() instead");
    clear_render_callback();
}
/**
 * Remove the rendering callback
 * @method module:main.clear_render_callback
 */
exports.clear_render_callback = function() {
    clear_render_callback();
}
function clear_render_callback() {
    _render_callback = function() {};
}




/**
 * Return the engine's global timeline value
 * @method module:main.global_timeline
 * @returns {Number} Floating-point number of seconds elapsed since the engine start-up
 * @deprecated Use time.get_timeline() instead
 */
exports.global_timeline = function() {
    return m_time.get_timeline();
}

/**
 * Force redraw.
 * @method module:main.redraw
 * @deprecated Never required
 */
exports.redraw = function() {
    m_print.error("redraw() deprecated");
    frame(m_time.get_timeline(), 0);
}

exports.pause = pause;
/**
 * Pause the engine
 * @method module:main.pause
 */
function pause() {
    if (is_paused())
        return;

    _pause_time = performance.now() / 1000;
    sfx.pause();
    m_phy.pause();
    textures.pause();
    m_anchors.pause();
}

/**
 * Resume the engine (after pausing)
 * @method module:main.resume
 */
exports.resume = function() {
    if (!is_paused())
        return;

    _resume_time = performance.now() / 1000;
    sfx.resume();
    m_phy.resume();
    textures.play(true);
    m_anchors.resume();
}

/**
 * Check if the engine is paused
 * @method module:main.is_paused
 * @returns {Boolean} Paused flag
 */
exports.is_paused = is_paused;
function is_paused() {
    return (_resume_time < _pause_time);
}

function loop() {
    _requestAnimFrame(loop);

    // float sec
    var abstime = performance.now() / 1000;

    if (!_last_abs_time)
        _last_abs_time = abstime;

    var delta = abstime - _last_abs_time;

    // do not render short frames
    if (delta < 1/cfg_def.max_fps)
        return;

    var timeline = m_time.get_timeline();

    for (var i = 0; i < _loop_cb.length; i++)
        _loop_cb[i](timeline, delta);

    if (!is_paused()) {
        // correct delta if resume occured since last frame
        if (_resume_time > _last_abs_time)
            delta -= (_resume_time - Math.max(_pause_time, _last_abs_time));

        timeline += delta;
        m_time.set_timeline(timeline);

        m_debug.update();

        assets.update();
        m_data.update();
        frame(timeline, delta);

        _fps_counter(delta);
    }

    _last_abs_time = abstime;
}

function frame(timeline, delta) {
    // possible unload between frames
    if (!m_data.is_primary_loaded())
        return;

    hud.reset();

    m_trans.update(delta);

    nla.update(timeline, delta);

    // sound
    sfx.update(timeline, delta);

    // animation
    if (delta)
        animation.update(delta);

    // possible unload in animation callbacks
    if (!m_data.is_primary_loaded())
        return;

    m_phy.update(timeline, delta);

    // possible unload in physics callbacks
    if (!m_data.is_primary_loaded())
        return;

    // user callback
    _render_callback(delta, timeline);

    // possible unload in render callback
    if (!m_data.is_primary_loaded())
        return;

    // controls
    controls.update(timeline, delta);

    // possible unload in controls callbacks
    if (!m_data.is_primary_loaded())
        return;

    // anchors
    m_anchors.update();

    // rendering
    scenes.update(timeline, delta);

    // anchors
    m_anchors.update_visibility();

    if (_canvas_data_url_callback) {
        _canvas_data_url_callback(_elem_canvas_webgl.toDataURL());
        _canvas_data_url_callback = null;
    }
}

function init_fps_counter() {
    var fps_avg = 60;       // decent default value

    var fps_frame_counter = 0;
    var interval = cfg_def.fps_measurement_interval;
    var interval_cb = cfg_def.fps_callback_interval;

    var fps_counter = function(delta) {
        fps_avg = util.smooth(1/delta, fps_avg, delta, interval);

        // stays zero for disabled physics/FPS calculation
        var phy_fps_avg = m_phy.get_fps();

        fps_frame_counter = (fps_frame_counter + 1) % interval_cb;
        if (fps_frame_counter == 0) {
            _fps_callback(Math.round(fps_avg), phy_fps_avg);
        }
    }

    return fps_counter;
}

/**
 * Reset the engine.
 * Unloads the scene and releases the engine's resources.
 * @method module:main.reset
 */
exports.reset = function() {
    m_data.unload(0);

    _elem_canvas_webgl = null;
    _elem_canvas_hud = null;

    _last_abs_time = 0;

    _pause_time = 0;
    _resume_time = 0;

    _fps_callback = function() {};
    _fps_counter = function() {};

    _render_callback = function() {};

    _loop_cb.length = 0;

    _gl = null;

    m_time.reset();
}

exports.canvas_data_url = function(callback) {
    _canvas_data_url_callback = callback;
}

/**
 * Return the main canvas element.
 * @method module:main.get_canvas_elem
 * @returns {HTMLCanvasElement} Canvas element
 * @deprecated Use container.get_canvas() instead
 */
exports.get_canvas_elem = function() {
    return _elem_canvas_webgl;
}

exports.detect_mobile = function() {
    return m_compat.detect_mobile();
}
/**
 * Append callback to be executed every frame.
 * @method module:main.append_loop_cb
 * @param callback Callback
 */
exports.append_loop_cb = function(callback) {
    for (var i = 0; i < _loop_cb.length; i++)
        if (_loop_cb[i] == callback)
            return;
    _loop_cb.push(callback);
}
/**
 * Remove loop callback.
 * @method module:main.remove_loop_cb
 * @param callback Callback
 */
exports.remove_loop_cb = function(callback) {
    for (var i = 0; i < _loop_cb.length; i++)
        if (_loop_cb[i] == callback) {
            _loop_cb.splice(i, 1);
            break;
        }
}

}
