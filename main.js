// central registry for shared modules (avoids using `global`)
var registry = require('registry.screeps');
var utils_screeps = registry.utils;
var spawns_manager_screeps = require('spawns.manager.screeps');
var room_manager_screeps = require('room.manager.screeps');
var towers_manager_screeps = registry.towersManager;
var pixel_manager_screeps = require('pixel.manager.screeps');
// Load role modules locally to avoid circular requires (roles may require registry)
var roles = {
    harvester: require('role.harvester.screeps'),
    upgrader: require('role.upgrader.screeps'),
    builder: require('role.builder.screeps'),
    repairer: require('role.repairer.screeps'),
    miner: require('role.miner.screeps'),
    hauler: require('role.hauler.screeps')
};

module.exports.loop = function () {
    // Housekeeping
    utils_screeps.cleanupMemory();

    // Pixel manager — use spare CPU bucket to generate Pixels
    pixel_manager_screeps.run();

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
            var roleModule = roles[creep.memory.role];
            if (roleModule && roleModule.run) roleModule.run(creep);
        } catch (err) {
            console.log('Role runtime error:', creep.memory.role, err.stack || err);
        }
    }
};
