var registry = require('registry.screeps');
var utils = registry.utils;

module.exports = {
    runAllSpawns: function () {
        for (var s in Game.spawns) {
            var spawn = Game.spawns[s];
            this.manageSpawn(spawn);
        }
    },

    manageSpawn: function (spawn) {
        if (!spawn || !spawn.room || spawn.spawning) return;
        var room = spawn.room;

        // Desired counts scaled by room energy capacity
        var cap = room.energyCapacityAvailable || 300;
        var desired = {
            harvester: cap >= 550 ? 4 : 2,
            upgrader: cap >= 550 ? 2 : 1,
            builder: 2,
            miner: 1,
            hauler: cap >= 550 ? 2 : 1,
            repairer: 1
        };

        // Count current creeps
        for (var role in desired) {
            var have = utils.countCreepsByRoleInRoom(room.name, role);
            if (have < desired[role]) {
                this.spawnRole(spawn, role);
                return; // spawn one at a time
            }
        }
    },

    spawnRole: function (spawn, role) {
        var energy = spawn.room.energyAvailable;
        var body = utils.buildBody(energy, role);
        var name = role + '_' + Game.time;
        var memory = { role: role, home: spawn.room.name };
        var res = spawn.spawnCreep(body, name, { memory: memory });
        if (res !== OK) {
            // try a minimal fallback
            var fallback = [MOVE, CARRY];
            spawn.spawnCreep(fallback, role + '_min_' + Game.time, { memory: memory });
        }
    }
};
