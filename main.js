// central registry for shared modules (avoids using `global`)
var registry = require('registry.screeps');
var utils_screeps = registry.utils;
var spawns_manager_screeps = require('spawns.manager.screeps');
var room_manager_screeps = require('room.manager.screeps');
var towers_manager_screeps = registry.towersManager;

module.exports.loop = function () {
    // Housekeeping
    utils_screeps.cleanupMemory();

    // Spawn management
    spawns_manager_screeps.runAllSpawns();

    // Room planning (infrequent CPU-heavy tasks)
    if (Game.time % 13 === 0) {
        room_manager_screeps.runAllRooms();
    }

    // Towers (defense, repair, heal) - run every tick
    towers_manager_screeps.runAllTowers();

    // Creep role dispatch
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep || !creep.memory || !creep.memory.role) continue;
        try {
            var roleModule = registry.roles[creep.memory.role];
            if (roleModule && roleModule.run) roleModule.run(creep);
        } catch (err) {
            console.log('Role runtime error:', creep.memory.role, err.stack || err);
        }
    }
};
