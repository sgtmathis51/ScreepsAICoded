/**
 * registry.screeps.js
 * Central registry that requires commonly used modules and exports them.
 * Use this to avoid `global` and to centralize requires.
 */
var utils = require('utils.screeps');
var planner = require('structure.planner.screeps');
var towersManager = require('towers.manager.screeps');
module.exports = {
    utils: utils,
    planner: planner,
    towersManager: towersManager
};
