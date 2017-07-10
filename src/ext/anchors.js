/**
 * Copyright (C) 2014-2017 Triumph LLC
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

/**
 * Anchors are Empty objects assigned in Blender.
 * They are used to project 3D points or HTML elements to the 2D screen.
 * <p>For more info about anchor configuration check out the {@link https://www.blend4web.com/doc/en/objects.html#anchor-settings|user manual}.
 * @module anchors
 * @local AnchorMoveCallback
 */
var exports = {};

import m_anchors from "../anchors"

/**
 * The callback for the movement of the anchor.
 * @callback AnchorMoveCallback
 * @param {number} x X (left) canvas coordinate.
 * @param {number} y Y (top) canvas coordinate.
 * @param {string} appearance Anchor appearance, one of "visible", "out",
 * "covered"
 * @param {Object3D} obj Anchor object.
 * @param {?HTMLElement} anchor Anchor HTML element
 */

/**
 * Attach the movement callback to the anchor object.
 * @method module:anchors.attach_move_cb
 * @param {Object3D} obj Anchor object.
 * @param {AnchorMoveCallback} anchor_move_cb Anchor movement callback
 */
exports.attach_move_cb = m_anchors.attach_move_cb;

/**
 * Detach the movement callback from the anchor object.
 * @method module:anchors.detach_move_cb
 * @param {Object3D} obj Anchor object.
 */
exports.detach_move_cb = m_anchors.detach_move_cb;

/**
 * Check if the given object is an anchor.
 * @method module:anchors.is_anchor
 * @param {Object3D} obj Anchor object.
 * @returns {boolean} Check result.
 */
exports.is_anchor = m_anchors.is_anchor;

/**
 * Get anchor element ID.
 * @method module:anchors.get_element_id
 * @param {Object3D} obj Anchor object.
 * @returns {string|boolean} Element ID or FALSE if the given object is not a 
 * valid anchor.
 */
exports.get_element_id = m_anchors.get_element_id;

/**
 * Force update positions of anchors.
 * @method module:anchors.update
 */
exports.update = function() {
    m_anchors.update(true);
}

export default exports;