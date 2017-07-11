
import m_anchors from "./ext/anchors.js"
import m_animation from "./ext/animation.js"
import m_armature from "./ext/armature.js"
import m_assets from "./ext/assets.js"
import m_camera from "./ext/camera.js"
import m_config from "./ext/config.js"
import m_constraints from "./ext/constraints.js"
import m_container from "./ext/container.js"
import m_controls from "./ext/controls.js"
import m_data from "./ext/data.js"
import m_debug from "./ext/debug.js"
import m_geometry from "./ext/geometry.js"
import m_hud from "./ext/hud.js"
import m_input from "./ext/input.js"
import m_lights from "./ext/lights.js"
import m_logic_nodes from "./ext/logic_nodes.js"
import m_main from "./ext/main.js"
import m_material from "./ext/material.js"
import m_math from "./ext/math.js"
import m_nla from "./ext/nla.js"
import m_objects from "./ext/objects.js"
import m_particles from "./ext/particles.js"
import m_physics from "./ext/physics.js"
import m_rgb from "./ext/rgb.js"
import m_scenes from "./ext/scenes.js"
import m_screen from "./ext/screen.js"
import m_sfx from "./ext/sfx.js"
import m_textures from "./ext/textures.js"
import m_time from "./ext/time.js"
import m_transform from "./ext/transform.js"
import m_tsr from "./ext/tsr.js"
import m_util from "./ext/util.js"
import m_version from "./ext/version.js"


import _m_anchors from "./anchors.js"
import _m_animation from "./animation.js"
import _m_armature from "./armature.js"
import _m_assets from "./assets.js"
import _m_batch from "./batch.js"
import _m_boundings from "./boundings.js"
import _m_camera from "./camera.js"
import _m_compat from "./compat.js"
import _m_config from "./config.js"
import _m_constraints from "./constraints.js"
import _m_container from "./container.js"
import _m_controls from "./controls.js"
import _m_curve from "./curve.js"
import _m_data from "./data.js"
import _m_debug from "./debug.js"
import _m_extensions from "./extensions.js"
import _m_geometry from "./geometry.js"
import _m_graph from "./graph.js"
import _m_hud from "./hud.js"
import _m_input from "./input.js"
import _m_ipc from "./ipc.js"
import _m_lights from "./lights.js"
import _m_loader from "./loader.js"
import _m_logic_nodes from "./logic_nodes.js"
import _m_main from "./main.js"
import _m_math from "./math.js"
import _m_navmesh from "./navmesh.js"
import _m_nla from "./nla.js"
import _m_nodemat from "./nodemat.js"
import _m_obj_util from "./obj_util.js"
import _m_objects from "./objects.js"
import _m_particles from "./particles.js"
import _m_physics from "./physics.js"
import _m_prerender from "./prerender.js"
import _m_primitives from "./primitives.js"
import _m_print from "./print.js"
import _m_reformer from "./reformer.js"
import _m_renderer from "./renderer.js"
import _m_scenegraph from "./scenegraph.js"
import _m_scenes from "./scenes.js"
import _m_sfx from "./sfx.js"
import _m_shaders from "./shaders.js"
import _m_subscene from "./subscene.js"
import _m_tbn from "./tbn.js"
import _m_texcomp from "./texcomp.js"
import _m_textures from "./textures.js"
import _m_time from "./time.js"
import _m_transform from "./transform.js"
import _m_tsr from "./tsr.js"
import _m_util from "./util.js"
import _m_version from "./version.js"

import m_app from "./addons/app.js"
import m_camera_anim from "./addons/camera_anim.js"
import m_fps from "./addons/fps.js"
import m_gp_conf from "./addons/gp_conf.js"
import m_gyroscope from "./addons/gyroscope.js"
import m_hmd from "./addons/hmd.js"
import m_hmd_conf from "./addons/hmd_conf.js"
import m_mixer from "./addons/mixer.js"
import m_mouse from "./addons/mouse.js"
import m_npc_ai from "./addons/npc_ai.js"
import m_preloader from "./addons/preloader.js"
import m_screenshooter from "./addons/screenshooter.js"
import m_storage from "./addons/storage.js"


var b4w = {}

// if (process.env.)
// EXTERNAL MODULES
b4w.anchors = m_anchors;
b4w.animation = m_animation;
b4w.armature = m_armature;
b4w.assets = m_assets;
b4w.camera = m_camera;
b4w.config = m_config;
b4w.constraints = m_constraints;
b4w.container = m_container;
b4w.controls = m_controls;
b4w.data = m_data;
b4w.debug = m_debug;
b4w.geometry = m_geometry;
b4w.hud = m_hud;
b4w.input = m_input;
b4w.lights = m_lights;
b4w.logic_nodes = m_logic_nodes;
b4w.main = m_main;
b4w.material = m_material;
b4w.math = m_math;
b4w.nla = m_nla;
b4w.objects = m_objects;
b4w.particles = m_particles;
b4w.physics = m_physics;
b4w.rgb = m_rgb;
b4w.scenes = m_scenes;
b4w.screen = m_screen;
b4w.sfx = m_sfx;
b4w.textures = m_textures;
b4w.time = m_time;
b4w.transform = m_transform;
b4w.tsr = m_tsr;
b4w.util = m_util;
b4w.version = m_version;

// INTERNAL MODULES
b4w._anchors = _m_anchors;
b4w._animation = _m_animation;
b4w._armature = _m_armature;
b4w._assets = _m_assets;
b4w._batch = _m_batch;
b4w._boundings = _m_boundings;
b4w._camera = _m_camera;
b4w._compat = _m_compat;
b4w._config = _m_config;
b4w._constraints = _m_constraints;
b4w._container = _m_container;
b4w._controls = _m_controls;
b4w._curve = _m_curve;
b4w._data = _m_data;
b4w._debug = _m_debug;
b4w._extensions = _m_extensions;
b4w._geometry = _m_geometry;
b4w._graph = _m_graph;
b4w._hud = _m_hud;
b4w._input = _m_input;
b4w._ipc = _m_ipc;
b4w._lights = _m_lights;
b4w._loader = _m_loader;
b4w._logic_nodes = _m_logic_nodes;
b4w._main = _m_main;
b4w._math = _m_math;
b4w._navmesh = _m_navmesh;
b4w._nla = _m_nla;
b4w._nodemat = _m_nodemat;
b4w._obj_util = _m_obj_util;
b4w._objects = _m_objects;
b4w._particles = _m_particles;
b4w._physics = _m_physics;
b4w._prerender = _m_prerender;
b4w._primitives = _m_primitives;
b4w._print = _m_print;
b4w._reformer = _m_reformer;
b4w._renderer = _m_renderer;
b4w._scenegraph = _m_scenegraph;
b4w._scenes = _m_scenes;
b4w._sfx = _m_sfx;
b4w._shaders = _m_shaders;
b4w._subscene = _m_subscene;
b4w._tbn = _m_tbn;
b4w._texcomp = _m_texcomp;
b4w._textures = _m_textures;
b4w._time = _m_time;
b4w._transform = _m_transform;
b4w._tsr = _m_tsr;
b4w._util = _m_util;
b4w._version = _m_version;


b4w.app = m_app
b4w.camera_anim = m_camera_anim
b4w.fps = m_fps
b4w.gp_conf = m_gp_conf
b4w.gyroscope = m_gyroscope
b4w.hmd = m_hmd
b4w.hmd_conf = m_hmd_conf
b4w.mixer = m_mixer
b4w.mouse = m_mouse
b4w.npc_ai = m_npc_ai
b4w.preloader = m_preloader
b4w.screenshooter = m_screenshooter
b4w.storage = m_storage

export default b4w;