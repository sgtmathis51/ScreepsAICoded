/*
 * towers.manager.screeps.js
 * Simple tower AI: prioritize hostiles, then heal nearby damaged creeps,
 * then repair damaged structures (excluding walls until needed).
 */
module.exports = {
    runAllTowers: function () {
        for (var rn in Game.rooms) {
            var room = Game.rooms[rn];
            if (!room) continue;
            var towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER });
            if (towers.length === 0) continue;
            this.runRoomTowers(room, towers);
        }
    },

    runRoomTowers: function (room, towers) {
        // detect threats first
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        for (var i = 0; i < towers.length; i++) {
            var tower = towers[i];
            if (hostiles.length) {
                var target = tower.pos.findClosestByRange(hostiles);
                if (target) {
                    tower.attack(target);
                    continue;
                }
            }

            // heal damaged friendly creeps
            var toHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (toHeal && toHeal.hits < toHeal.hitsMax) {
                tower.heal(toHeal);
                continue;
            }

            // repair non-wall structures needing repair
            var repairTarget = room.find(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax * 0.6 && s.structureType !== STRUCTURE_WALL });
            if (repairTarget && repairTarget.length) {
                var rt = tower.pos.findClosestByRange(repairTarget);
                if (rt) { tower.repair(rt); continue; }
            }

            // optional: repair walls only if very low
            var walls = room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_WALL && s.hits < 10000 });
            if (walls && walls.length) {
                var w = tower.pos.findClosestByRange(walls);
                if (w) { tower.repair(w); continue; }
            }
        }
    }
};
