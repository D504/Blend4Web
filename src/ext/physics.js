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
 * Physics module. Provides API to uranium.js physics engine. 
 * @see https://www.blend4web.com/doc/en/physics.html
 * @module physics
 * @local CollisionCallback
 * @local CollisionImpulseCallback
 * @local RayTestCallback
 * @local RayTestCallbackPosNorm
 * @local CharacterMoveType
 * @local NavmeshDistanceCallback
 * @local NavmeshPathOptions
 */
var exports = {};

/**
 * Navmesh distance callback. Used to determine start and end polygon of navmesh
 * @callback NavmeshDistanceCallback
 * @param {Vec3} position Position to which we must calculate a distance
 * @param {Vec3} centroid Center of current polygon
 * @param {Uint32Array} vertex_ids Indices of polygon vertices
 * @param {Array} vertices Vertex array
 * @param {number} current_max_distance Current maximum distance
 */

import m_phy from "../physics"
import m_print from "../print"
import m_util from "../util"
import m_nmesh from "../navmesh"

/**
 * Collision result callback.
 * @callback CollisionCallback
 * @param {boolean} result Collision result flag.
 * @param {?Object3D} coll_obj The target collision object, i.e the object
 * the source object collides with (null for no collision or when this object 
 * is represented by collision material).
 * @param {?Vec3} coll_pos Position of collision point.
 * @param {?Vec3} coll_norm Normal of collision point.
 * @param {?number} coll_dist Distance between collision points of colliding
 * objects.
 * @cc_externs coll_obj coll_pos coll_norm coll_dist
 */

/**
 * Collision impulse result callback.
 * @callback CollisionImpulseCallback
 * @param {number} impulse Impulse applied on collision point.
 */

/**
 * Ray test callback.
 * @callback RayTestCallback
 * @param {number} id Ray Test ID
 * @param {number} hit_fract Fraction of ray length where hit has occurred (0-1)
 * or -1 if there is no hit anymore
 * @param {?Object3D} obj_hit Hit Object 3D
 * @param {number} hit_time Time the hit happened.
 * @cc_externs hit_fract obj_hit hit_time
 */

/**
 * Ray test callback with additional position/normal.
 * @callback RayTestCallbackPosNorm
 * @param {number} id Ray Test ID
 * @param {number} hit_fract Fraction of ray length where hit has occurred (0-1)
 * or -1 if there is no hit anymore
 * @param {?Object3D} obj_hit Hit Object 3D
 * @param {number} hit_time Time the hit happened.
 * @param {Vec3} hit_pos Hit position in world space
 * @param {Vec3} hit_norm Hit normal in world space
 * @cc_externs hit_fract obj_hit hit_time hit_pos hit_norm
 */

/**
 * Configurable options of navmesh path.
 * @typedef {Object} NavmeshPathOptions
 * @property {number} [island=0] ID; see {@link module:physics.navmesh_get_island|physics.navmesh_get_island}
 * @property {number} [allowed_distance=Number.MAX_VALUE] Distance limit from
 * start/target position to navmesh
 * @property {boolean} [do_not_pull_string=false] Returns centroids path instead of pulled string
 * @property {boolean} [return_normals=false] Return path normals in PathInformation.
 * @property {NavmeshDistanceCallback} [distance_to_closest] Callback for distance
 * calculation to determine closest node
 * @property {NavmeshDistanceCallback} [distance_to_farthest] Callback for distance
 * calculation to determine farthest node
 * @cc_externs island allowed_distance do_not_pull_string return_normals
 * @cc_externs distance_to_closest distance_to_farthest
 */

/**
 * Navmesh path information.
 * @typedef {Object} PathInformation
 * @property {Float32Array} positions Positions of path points - plane array of 
 * Vec3-type positions
 * @property {?Float32Array} normals Normals of path points - plane array of 
 * Vec3-type normals
 * @cc_externs positions normals
 */

/**
 * Character's type of movement enum. One of CM_*.
 * @typedef {number} CharacterMoveType
 */

/**
 * The character's type of movement is "walk".
 * @const {CharacterMoveType} module:physics.CM_WALK
 */
exports.CM_WALK = 0;
/**
 * The character's type of movement is "run".
 * @const {CharacterMoveType} module:physics.CM_RUN
 */
exports.CM_RUN = 1;
/**
 * The character's type of movement is "climb".
 * @const {CharacterMoveType} module:physics.CM_CLIMB
 */
exports.CM_CLIMB = 2;
/**
 * The character's type of movement is "fly".
 * @const {CharacterMoveType} module:physics.CM_FLY
 */
exports.CM_FLY = 3;

/**
 * Enable physics simulation.
 * @method module:physics.enable_simulation
 * @param {Object3D} obj Object 3D
 */
exports.enable_simulation = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.enable_simulation(obj);
}
/**
 * Disable physics simulation.
 * @method module:physics.disable_simulation
 * @param {Object3D} obj Object 3D
 */
exports.disable_simulation = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.disable_simulation(obj);
}
/**
 * Check if the object has any physics
 * @method module:physics.has_physics
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Check result
 */
exports.has_physics = function(obj) {
    return m_phy.obj_has_physics(obj);
}
/**
 * Check if the object has any simulated physics
 * @method module:physics.has_simulated_physics
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Check result
 */
exports.has_simulated_physics = function(obj) {
    return m_phy.has_simulated_physics(obj);
}
/**
 * Check if the object has dynamic simulated physics
 * @method module:physics.has_dynamic_physics
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Check result
 */
exports.has_dynamic_physics = function(obj) {
    return m_phy.has_dynamic_physics(obj);
}
/**
 * Set the object's gravity.
 * @method module:physics.set_gravity
 * @param {Object3D} obj Object 3D
 * @param {number} gravity Positive object gravity
 */
exports.set_gravity = function(obj, gravity) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_gravity(obj, gravity);
}
/**
 * Set the object's transform (for static/kinematic objects)
 * @method module:physics.set_transform
 * @param {Object3D} obj Object 3D
 * @param {Vec3} trans Translation vector
 * @param {Quat} quat Rotation quaternion
 */
exports.set_transform = function(obj, trans, quat) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_transform(obj, trans, quat);
}

/**
 * Sync the object's transform (for static/kinematic objects)
 * @method module:physics.sync_transform
 * @param {Object3D} obj Object 3D
 */
exports.sync_transform = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.sync_transform(obj);
}

/**
 * Apply velocity to the object (in the local space)
 * @method module:physics.apply_velocity
 * @param {Object3D} obj Object 3D
 * @param {number} vx_local Vx local space velocity
 * @param {number} vy_local Vy local space velocity
 * @param {number} vz_local Vz local space velocity 
 */
exports.apply_velocity = function(obj, vx_local, vy_local, vz_local) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_velocity(obj, vx_local, vy_local, vz_local);
}
/**
 * Apply velocity to the object (in the world space)
 * @method module:physics.apply_velocity_world
 * @param {Object3D} obj Object 3D
 * @param {number} vx Vx world space velocity
 * @param {number} vy Vy world space velocity
 * @param {number} vz Vz world space velocity
 */
exports.apply_velocity_world = function(obj, vx, vy, vz) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_velocity_world(obj, vx, vy, vz);
}
/**
 * Apply a constant force to the object (in the local space).
 * Pass zero values to remove applied force.
 * @method module:physics.apply_force
 * @param {Object3D} obj Object 3D
 * @param {number} fx_local Fx force in the local space
 * @param {number} fy_local Fy force in the local space
 * @param {number} fz_local Fz force in the local space 
 */
exports.apply_force = function(obj, fx_local, fy_local, fz_local) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_force(obj, fx_local, fy_local, fz_local, false);
}

/**
 * Apply a constant force to the object (in the world space).
 * Pass zero values to remove applied force.
 * @method module:physics.apply_force_world
 * @param {Object3D} obj Object 3D
 * @param {number} fx_world Fx force in the world space
 * @param {number} fy_world Fy force in the world space
 * @param {number} fz_world Fz force in the world space 
 */
exports.apply_force_world = function(obj, fx_world, fy_world, fz_world) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_force(obj, fx_world, fy_world, fz_world, true);
}

/**
 * Apply constant torque to the object (in the local space).
 * Pass zero values to remove applied torque.
 * @method module:physics.apply_torque
 * @param {Object3D} obj Object 3D
 * @param {number} tx_local Tx torque
 * @param {number} ty_local Ty torque
 * @param {number} tz_local Tz torque
 */
exports.apply_torque = function(obj, tx_local, ty_local, tz_local) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_torque(obj, tx_local, ty_local, tz_local);
}

/**
 * Set object's angular velocity.
 * @method module:physics.set_angular_velocity
 * @param {Object3D} obj Object 3D
 * @param {number} av_x X projection of angular velocity in the local space
 * @param {number} av_y Y projection of angular velocity in the local space
 * @param {number} av_z Z projection of angular velocity in the local space
 * @example var m_physics = require("physics");
 *
 * var obj = m_scenes.get_object_by_name("Cube");
 * m_physics.set_angular_velocity(obj, 0.0, 0.0, 0.5);
 */
exports.set_angular_velocity = function(obj, av_x, av_y, av_z) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_angular_velocity(obj, av_x, av_y, av_z);
}
/**
 * Apply throttle to vehicle.
 * @method module:physics.vehicle_throttle
 * @param {Object3D} obj Object 3D
 * @param {number} engine_force Engine force (-1..1)
 */
exports.vehicle_throttle = function(obj, engine_force) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    m_phy.vehicle_throttle(obj, m_util.clamp(engine_force, -1, 1));
}
/**
 * Increment vehicle throttle.
 * @method module:physics.vehicle_throttle_inc
 * @param {Object3D} obj Object 3D
 * @param {number} engine_force_inc Engine force increment (0..1)
 * @param {number} dir Throttling direction -1,0,1
 */
exports.vehicle_throttle_inc = function(obj, engine_force_inc, dir) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    engine_force_inc = m_util.clamp(engine_force_inc, 0, 1);

    var vehicle = obj.vehicle;

    var force = vehicle.engine_force;

    if (dir == -1 || dir == 1) {
        force += dir * engine_force_inc;
        force = Math.max(-1, Math.min(force, 1));
    } else if (dir == 0 && force >= 0) {
        force -= engine_force_inc;
        force = Math.max(0, force);
    } else if (dir == 0 && force < 0) {
        force += engine_force_inc;
        force = Math.min(0, force);
    } else
        m_print.error("Wrong steering direction");

    m_phy.vehicle_throttle(obj, m_util.clamp(force, -1, 1));
}
/**
 * Change vehicle steering.
 * @method module:physics.vehicle_steer
 * @param {Object3D} obj Object 3D
 * @param {number} steering_value Steering value (-1..1)
 */
exports.vehicle_steer = function(obj, steering_value) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    m_phy.vehicle_steer(obj, m_util.clamp(steering_value, -1, 1));
}
/**
 * Increment vehicle steering.
 * @method module:physics.vehicle_steer_inc
 * @param {Object3D} obj Object 3D
 * @param {number} steering_value_inc Steering value increment (0..1)
 * @param {number} dir Steering direction -1,0,1
 */
exports.vehicle_steer_inc = function(obj, steering_value_inc, dir) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    steering_value_inc = m_util.clamp(steering_value_inc, 0, 1);

    var vehicle = obj.vehicle;

    var steering = vehicle.steering;

    if (dir == -1 || dir == 1) {
        steering += dir * steering_value_inc;
        steering = Math.max(-1, Math.min(steering, 1));
    } else if (dir == 0 && steering >= 0) {
        steering -= steering_value_inc;
        steering = Math.max(0, steering);
    } else if (dir == 0 && steering < 0) {
        steering += steering_value_inc;
        steering = Math.min(0, steering);
    } else
        m_print.error("Wrong steering direction");

    m_phy.vehicle_steer(obj, m_util.clamp(steering, -1, 1));
}
/**
 * Stop the vehicle by applying the brake force.
 * @method module:physics.vehicle_brake
 * @param {Object3D} obj Object 3D
 * @param {number} brake_force Brake force (0..1)
 */
exports.vehicle_brake = function(obj, brake_force) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    m_phy.vehicle_brake(obj, m_util.clamp(brake_force, 0, 1));
}
/**
 * Increment the brake force
 * @method module:physics.vehicle_brake_inc
 * @param {Object3D} obj Object 3D
 * @param {number} brake_force_inc Brake force increment (-1..1)
 */
exports.vehicle_brake_inc = function(obj, brake_force_inc) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    if (!m_phy.is_vehicle_chassis(obj) && !m_phy.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    brake_force_inc = m_util.clamp(brake_force_inc, -1, 1);

    var vehicle = obj.vehicle;

    var brake_force = vehicle.brake_force;

    brake_force += brake_force * brake_force_inc;
    m_phy.vehicle_brake(obj, m_util.clamp(brake_force, 0, 1));
}
/**
 * Check if the given object is a vehicle chassis.
 * @method module:physics.is_vehicle_chassis
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Checking result.
 */
exports.is_vehicle_chassis = function(obj) {
    return m_phy.is_vehicle_chassis(obj);
}
/**
 * Check if the given object is a vehicle hull.
 * @method module:physics.is_vehicle_hull
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Checking result.
 */
exports.is_vehicle_hull = function(obj) {
    return m_phy.is_vehicle_hull(obj);
}
/**
 * Get the vehicle name.
 * @method module:physics.get_vehicle_name
 * @param {Object3D} obj Object 3D
 * @returns {?string} Vehicle name.
 */
exports.get_vehicle_name = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return null;
    }
    if (m_phy.is_vehicle_chassis(obj) || m_phy.is_vehicle_hull(obj))
        return obj.vehicle_settings.name;
    else {
        m_print.error("Wrong object");
        return null;
    }
}
/**
 * Get the vehicle's throttle value.
 * @method module:physics.get_vehicle_throttle
 * @param {Object3D} obj Object 3D
 * @returns {?number} Throttle value.
 */
exports.get_vehicle_throttle = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return null;
    }
    if (m_phy.is_vehicle_chassis(obj) || m_phy.is_vehicle_hull(obj))
        return obj.vehicle.engine_force;
    else {
        m_print.error("Wrong object");
        return null;
    }
}
/**
 * Get the vehicle's steering value.
 * @method module:physics.get_vehicle_steering
 * @param {Object3D} obj Object 3D
 * @returns {number} Steering value
 */
exports.get_vehicle_steering = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return 0;
    }
    if (m_phy.is_vehicle_chassis(obj) || m_phy.is_vehicle_hull(obj))
        return obj.vehicle.steering;
    else
        m_print.error("Wrong object");

    return 0;
}
/**
 * Get the vehicle's brake force.
 * @method module:physics.get_vehicle_brake
 * @param {Object3D} obj Object 3D
 * @returns {number} Brake value
 */
exports.get_vehicle_brake = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return 0;
    }
    if (m_phy.is_vehicle_chassis(obj) || m_phy.is_vehicle_hull(obj))
        return obj.vehicle.brake_force;
    else
        m_print.error("Wrong object");

    return 0;
}
/**
 * Get the vehicle speed in km/h.
 * @method module:physics.get_vehicle_speed
 * @param {Object3D} obj Object 3D
 * @returns {number} Vehicle speed
 */
exports.get_vehicle_speed = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return 0;
    }
    if (m_phy.is_vehicle_chassis(obj) || m_phy.is_vehicle_hull(obj))
        return m_phy.get_vehicle_speed(obj);
    else
        m_print.error("Wrong object");

    return 0;
}
/**
 * Check if the given object is a character.
 * @method module:physics.is_character
 * @param {Object3D} obj Object 3D
 * @returns {boolean} Check result
 */
exports.is_character = function(obj) {
    return m_phy.has_character_physics(obj);
}
/**
 * Move the character in the corresponding direction.
 * @method module:physics.set_character_move_dir
 * @param {Object3D} obj Object 3D
 * @param {number} forw Apply forward speed
 * @param {number} side Apply side speed
 */
exports.set_character_move_dir = function(obj, forw, side) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_move_dir(obj, forw, side);
}
/**
 * Set the character moving type.
 * @method module:physics.set_character_move_type
 * @param {Object3D} obj Object 3D
 * @param {CharacterMoveType} type Character moving type (one of CM_*).
 */
exports.set_character_move_type = function(obj, type) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_move_type(obj, type);
}

/**
 * Set the character's walk speed.
 * @method module:physics.set_character_walk_velocity
 * @param {Object3D} obj Object 3D
 * @param {number} velocity Walking velocity
 */
exports.set_character_walk_velocity = function(obj, velocity) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_walk_velocity(obj, velocity);
}
/**
 * Set the character's run speed.
 * @method module:physics.set_character_run_velocity
 * @param {Object3D} obj Object 3D
 * @param {number} velocity Running velocity
 */
exports.set_character_run_velocity = function(obj, velocity) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_run_velocity(obj, velocity);
}
/**
 * Set the character's fly speed.
 * @method module:physics.set_character_fly_velocity
 * @param {Object3D} obj Object 3D
 * @param {number} velocity Flying velocity
 */
exports.set_character_fly_velocity = function(obj, velocity) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_fly_velocity(obj, velocity);
}
/**
 * Make the character jump
 * @method module:physics.character_jump
 * @param {Object3D} obj Object 3D
 */
exports.character_jump = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.character_jump(obj);
}
/**
 * Increment the character rotation
 * @method module:physics.character_rotation_inc
 * @param {Object3D} obj Object 3D
 * @param {number} h_angle Angle (in radians) in horizontal plane
 * @param {number} v_angle Angle (in radians) in vertical plane
 */
exports.character_rotation_inc = function(obj, h_angle, v_angle) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.character_rotation_inc(obj, h_angle, v_angle);
}
/**
 * Set the character rotation in horizontal and vertical planes
 * @method module:physics.set_character_rotation
 * @param {Object3D} obj Object 3D
 * @param {number} angle_h Angle (in radians) in horizontal plane
 * @param {number} angle_v Angle (in radians) in vertical plane
 */
exports.set_character_rotation = function(obj, angle_h, angle_v) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_rotation(obj, angle_h, angle_v);
}
/**
 * Set the character vertical rotation
 * @method module:physics.set_character_rotation_v
 * @param {Object3D} obj Object 3D
 * @param {number} angle Angle (in radians) in vertical plane
 */
exports.set_character_rotation_v = function(obj, angle) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_rotation_v(obj, angle);
}
/**
 * Set the character horizontal rotation
 * @method module:physics.set_character_rotation_h
 * @param {Object3D} obj Object 3D
 * @param {number} angle Angle (in radians) in horizontal plane
 */
exports.set_character_rotation_h = function(obj, angle) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.set_character_rotation_h(obj, angle);
}
/**
 * Append a new async collision test to the given object.
 * @method module:physics.append_collision_test
 * @param {Object3D} obj_src Object 3D
 * @param {?string} collision_id Collision ID, pass "ANY" or null for any collision ID.
 * @param {CollisionCallback} callback Collision callback
 * @param {boolean} [calc_pos_norm=false] Pass collision point/normal/distance in callback
 */
exports.append_collision_test = function(obj_src, collision_id, callback,
        calc_pos_norm) {
    if (!m_phy.obj_has_physics(obj_src)) {
        m_print.error_once("No physics for object " + obj_src.name);
        return;
    }

    collision_id = collision_id || "ANY";

    calc_pos_norm = calc_pos_norm || false;
    m_phy.append_collision_test(obj_src, collision_id, callback, calc_pos_norm);
}
/**
 * Remove the collision test from the given object.
 * @method module:physics.remove_collision_test
 * @param {Object3D} obj Object 3D.
 * @param {?string} collision_id Collision ID, pass "ANY" or null for any collision ID.
 * @param {CollisionCallback} callback Collision callback.
 */
exports.remove_collision_test = function(obj, collision_id, callback) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }

    collision_id = collision_id || "ANY";

    m_phy.remove_collision_test(obj, collision_id, callback);
}
/**
 * Apply a new async collision impulse test to the given object.
 * @method module:physics.apply_collision_impulse_test
 * @param {Object3D} obj Object 3D
 * @param {CollisionImpulseCallback} callback Collision impulse test callback.
 */
exports.apply_collision_impulse_test = function(obj, callback) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.apply_collision_impulse_test(obj, callback);
}
/**
 * Remove the collision impulse test from the given object.
 * @method module:physics.clear_collision_impulse_test
 * @param {Object3D} obj Object 3D
 */
exports.clear_collision_impulse_test = function(obj) {
    if (!m_phy.obj_has_physics(obj)) {
        m_print.error_once("No physics for object " + obj.name);
        return;
    }
    m_phy.clear_collision_impulse_test(obj);
}
/**
 * Append a new async ray test.
 * @method module:physics.append_ray_test
 * @param {?Object3D} obj_src Source object, pass a non-null value to perform ray casting
 * in object space, e.g. from/to vectors specified in object space.
 * @param {Vec3} from From vector
 * @param {Vec3} to To vector
 * @param {?string} collision_id Collision ID, pass "ANY" or null for any collision ID.
 * @param {RayTestCallback} callback Ray Test callback
 * @param {boolean} [autoremove=false] Automatically remove test after ray casting.
 * @returns {number} Ray Test ID
 */
exports.append_ray_test = function(obj_src, from, to, collision_id, callback, 
        autoremove) {

    obj_src = obj_src || null;

    if (obj_src != null && !m_phy.obj_has_physics(obj_src)) {
        m_print.error_once("No physics for object " + obj_src.name);
        return 0;
    }

    collision_id = collision_id || "ANY";
    autoremove = autoremove || false;

    var calc_all_hits = false;
    var calc_pos_norm = false;
    var ign_src_rot = false;

    return m_phy.append_ray_test(obj_src, from, to, collision_id, callback, 
            autoremove, calc_all_hits, calc_pos_norm, ign_src_rot);
}

/**
 * Append a new async ray test (extended version).
 * @method module:physics.append_ray_test_ext
 * @param {?Object3D} obj_src Source object, pass a non-null value to perform ray casting
 * in object space, e.g. from/to vectors specified in object space
 * @param {Vec3} from From vector
 * @param {Vec3} to To vector
 * @param {?string} collision_id Collision ID, pass "ANY" or null for any collision ID.
 * @param {RayTestCallback|RayTestCallbackPosNorm} callback Ray Test callback
 * @param {boolean} [autoremove=false] Automatically remove test after ray casting.
 * @param {boolean} [calc_all_hits=false] Test for all possible objects along the ray or
 * just for closest object
 * @param {boolean} [calc_pos_norm=false] Calculate and return hit point's position/normal in
 * callback
 * @param {boolean} [ign_src_rot=false] Ignore rotation of source object
 * @returns {number} Ray Test ID
 */
exports.append_ray_test_ext = function(obj_src, from, to, collision_id, callback, 
        autoremove, calc_all_hits, calc_pos_norm, ign_src_rot) {

    obj_src = obj_src || null;

    if (obj_src != null && !m_phy.obj_has_physics(obj_src)) {
        m_print.error_once("No physics for object " + obj_src.name);
        return 0;
    }

    collision_id = collision_id || "ANY";
    autoremove = autoremove || false;
    calc_all_hits = calc_all_hits || false;
    calc_pos_norm = calc_pos_norm || false;
    ign_src_rot = ign_src_rot || false;

    return m_phy.append_ray_test(obj_src, from, to, collision_id, callback,
            autoremove, calc_all_hits, calc_pos_norm, ign_src_rot);
}
/**
 * Remove ray test.
 * @method module:physics.remove_ray_test
 * @param {number} id Ray Test ID
 */
exports.remove_ray_test = function(id) {
    if (!m_phy.is_ray_test(id)) {
        m_print.error("Wrong ray test ID");
        return;
    }

    m_phy.remove_ray_test(id);
}

/**
 * Change from/to vectors for the given ray test.
 * @method module:physics.change_ray_test_from_to
 * @param {number} id Ray Test ID
 * @param {Vec3} from New from vector
 * @param {Vec3} to New to vector
 */
exports.change_ray_test_from_to = function(id, from, to) {
    if (!m_phy.is_ray_test(id)) {
        m_print.error("Wrong ray test ID");
        return;
    }

    m_phy.change_ray_test_from_to(id, from, to);
}


/**
 * Apply physics constraint.
 * @method module:physics.apply_constraint
 * @param {string} pivot_type Pivot type
 * @param {Object3D} obj_a Object 3D A
 * @param {Vec3} trans_a Translation of pivot frame relative to A
 * @param {Quat} quat_a Rotation of pivot frame relative to A
 * @param {Object3D} obj_b Object 3D B
 * @param {Vec3} trans_b Translation of pivot frame relative to B
 * @param {Quat} quat_b Rotation of pivot frame relative to B
 * @param {ConstraintLimits} limits Object containing constraint limits
 * @param {Float32Array} [stiffness=null] 6-dimensional vector with constraint stiffness
 * @param {Float32Array} [damping=null] 6-dimensional vector with constraint damping
 */
exports.apply_constraint = function(pivot_type, obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b, limits, stiffness, damping) {

    if (!m_phy.obj_has_physics(obj_a) || !m_phy.obj_has_physics(obj_b)) {
        m_print.error("Wrong objects");
        return;
    }

    m_phy.apply_constraint(pivot_type, obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b, limits, stiffness, damping);
}
/**
 * Remove physics constraint.
 * constraint identified by object A from apply_constraint function
 * @method module:physics.remove_constraint
 * @param {Object3D} obj_a Object A.
 */
exports.clear_constraint = function(obj_a) {
    if (!m_phy.obj_has_physics(obj_a) || !m_phy.has_constraint(obj_a)) {
        m_print.error("Wrong object");
        return;
    }

    m_phy.clear_constraint(obj_a);
}
/**
 * Pull object A to constraint pivot with object B.
 * @method module:physics.pull_to_constraint_pivot
 * @param {Object3D} obj_a Object 3D A
 * @param {Vec3} trans_a Translation of pivot frame relative to A
 * @param {Quat} quat_a Rotation of pivot frame relative to A
 * @param {Object3D} obj_b Object 3D B
 * @param {Vec3} trans_b Translation of pivot frame relative to B
 * @param {Quat} quat_b Rotation of pivot frame relative to B
 */
exports.pull_to_constraint_pivot = function(obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b) {

    if (!m_phy.obj_has_physics(obj_a) || !m_phy.obj_has_physics(obj_b)) {
        m_print.error("Wrong objects");
        return;
    }
    m_phy.pull_to_constraint_pivot(obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b);
}

function distance_to_closest_default(position, centroid, vertex_ids, vertices,
        current_max_distance) {
    return m_util.dist_to_triange(position, vertices[vertex_ids[0]],
            vertices[vertex_ids[1]], vertices[vertex_ids[2]]);
}

// NOTE: don't remove this function.
// function distance_to_closest_default(position, centroid, vertex_ids, vertices,
//         current_max_distance) {
//     m_vec3.subtract(position, centroid, _vec3_tmp);
//     return m_vec3.dot(_vec3_tmp, _vec3_tmp);
// }

function distance_to_farthest_default(position, centroid, vertex_ids, vertices,
        current_max_distance) {
    var distance = Math.abs(position[2] - centroid[2]);
    if (distance < current_max_distance &&
            m_nmesh.is_vector_in_poly(position, vertex_ids, vertices))
        return distance;
    else
        return Number.MAX_VALUE;
}

/**
 * Get the id of a closest navmesh island(group)
 * @method module:physics.navmesh_get_island
 * @param {Object3D} navmesh_obj Navigation mesh object
 * @param {Vec3} position Path start position
 * @param {?NavmeshDistanceCallback} distance_to_closest Callback for distance
 * calculation to determine the closest node. If null then the default function will 
 * be used. It calculates the distance from a point to a triangle in the 3D space.
 * @returns {number} island ID
 * @example 
 * var m_phys = require("physics");
 * var m_scenes = require("scenes");
 *
 * var start_point = new Float32Array([5, 2, -7]);
 * var end_point = new Float32Array([-2, 0, 3]);
 * var navmesh_obj = m_scenes.get_object_by_name("navmesh");
 *
 * var island_id = m_phys.navmesh_get_island(navmesh_obj, start_point);
 * var path = m_phys.navmesh_find_path(navmesh_obj, start_point, end_point, { island: island_id });
 */
exports.navmesh_get_island = navmesh_get_island;
function navmesh_get_island(navmesh_obj, position,
        distance_to_closest) {
    if (!distance_to_closest)
        distance_to_closest = distance_to_closest_default;

    if (!m_phy.obj_has_physics(navmesh_obj)) {
        m_print.error_once("No physics for object " + navmesh_obj.name);
        return;
    }

    var navmesh = navmesh_obj.physics.navmesh;

    if (!navmesh) {
        m_print.error(navmesh_obj.name + " is not a navigation mesh object");
        return null;
    }
    return m_nmesh.navmesh_get_island(navmesh, position, distance_to_closest);
}

/**
 * Find path between start_pos and dest_pos, return flat array containing
 * positions of path.
 * @method module:physics.navmesh_find_path
 * @param {Object3D} navmesh_obj Navigation mesh object
 * @param {Vec3} start_pos Start position
 * @param {Vec3} dest_pos Target position
 * @param {NavmeshPathOptions} [options={}] Configurable options of navmesh path
 * @returns {?PathInformation} Path information or null if path does not exist
 * @example 
 * var m_phys = require("physics");
 * var m_scenes = require("scenes");
 *
 * var start_point = new Float32Array([5, 2, -7]);
 * var end_point = new Float32Array([-2, 0, 3]);
 * var navmesh_obj = m_scenes.get_object_by_name("navmesh");
 *
 * var island_id = m_phys.navmesh_get_island(navmesh_obj, start_point);
 * var path = m_phys.navmesh_find_path(navmesh_obj, start_point, end_point, { island: island_id });
 */
exports.navmesh_find_path = function (navmesh_obj, start_pos, dest_pos, options) {
    if (!m_phy.obj_has_physics(navmesh_obj)) {
        m_print.error_once("No physics for object " + navmesh_obj.name);
        return;
    }
    var navmesh = navmesh_obj.physics.navmesh;
    if (!navmesh) {
        m_print.error(navmesh_obj.name + " is not a navigation mesh object");
        return null;
    }
    options = options || {};
    var nav_options = {};

    nav_options.do_not_pull_string = Boolean(options.do_not_pull_string);

    nav_options.distance_to_closest = options.distance_to_closest ||
            distance_to_closest_default;

    nav_options.distance_to_farthest = options.distance_to_farthest ||
            distance_to_farthest_default;

    nav_options.island = options.island || 0;

    nav_options.allowed_distance = options.allowed_distance || Number.MAX_VALUE;

    nav_options.return_normals = options.return_normals || false;

    return m_nmesh.navmesh_find_path(navmesh, start_pos, dest_pos, nav_options);
}

export default exports;
