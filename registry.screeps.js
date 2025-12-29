/**
 * registry.screeps.js
 * Central registry that requires commonly used modules and exports them.
 * Use this to avoid `global` and to centralize requires.
 */
var utils = require('utils.screeps');
var planner = require('structure.planner.screeps');
var towersManager = require('towers.manager.screeps');

// load role modules
var roles = {
    harvester: require('role.harvester.screeps'),
    upgrader: require('role.upgrader.screeps'),
    builder: require('role.builder.screeps'),
    repairer: require('role.repairer.screeps'),
    miner: require('role.miner.screeps'),
    hauler: require('role.hauler.screeps')
};

module.exports = {
    utils: utils,
    planner: planner,
    towersManager: towersManager,
    roles: roles
};
