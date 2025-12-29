module.exports = {
    // find a nearby suitable position for construction (spiral out)
    findBuildPosition: function (room, center, maxRange) {
        maxRange = maxRange || 6;
        for (var r = 1; r <= maxRange; r++) {
            for (var dx = -r; dx <= r; dx++) {
                for (var dy = -r; dy <= r; dy++) {
                    if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                    var x = center.x + dx, y = center.y + dy;
                    if (x < 1 || x > 48 || y < 1 || y > 48) continue;
                    var pos = new RoomPosition(x, y, room.name);
                    if (room.lookForAt(LOOK_CREEPS, pos).length) continue;
                    var terrain = room.getTerrain().get(x, y);
                    if (terrain === TERRAIN_MASK_WALL) continue;
                    // don't place on existing structures
                    if (room.lookForAt(LOOK_STRUCTURES, pos).length) continue;
                    if (room.lookForAt(LOOK_CONSTRUCTION_SITES, pos).length) continue;
                    return pos;
                }
            }
        }
        return null;
    },

    // Create extension sites until target count is reached
    ensureExtensions: function (room, centerSpawn, target) {
        var extensions = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_EXTENSION }).length;
        var sites = room.find(FIND_CONSTRUCTION_SITES, { filter: s => s.structureType === STRUCTURE_EXTENSION }).length;
        while (extensions + sites < target) {
            var pos = this.findBuildPosition(room, centerSpawn.pos, 6);
            if (!pos) break;
            var res = room.createConstructionSite(pos, STRUCTURE_EXTENSION);
            if (res !== OK) break;
            sites++;
        }
    },

    // A simple planner to add towers, storage, and roads near spawn/controller
    planRoom: function (room) {
        if (!room || !room.controller || !room.controller.my) return;
        var spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return;
        var spawn = spawns[0];

        // Extensions target based on controller level
        var lvl = room.controller.level;
        var extTargets = [0, 0, 5, 5, 10, 10, 20, 30, 60];
        var targetExt = extTargets[lvl] || 0;
        this.ensureExtensions(room, spawn, targetExt);

        // Place one tower if missing and controller >=3
        if (lvl >= 3) {
            var towers = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_TOWER }).length;
            var towerSites = room.find(FIND_CONSTRUCTION_SITES, { filter: s => s.structureType === STRUCTURE_TOWER }).length;
            if (towers + towerSites < 1) {
                var pos = this.findBuildPosition(room, spawn.pos, 8);
                if (pos) room.createConstructionSite(pos, STRUCTURE_TOWER);
            }
        }

        // Storage when controller >=4
        if (lvl >= 4) {
            var storage = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_STORAGE }).length;
            if (storage === 0 && room.find(FIND_CONSTRUCTION_SITES, { filter: s => s.structureType === STRUCTURE_STORAGE }).length === 0) {
                var pos = this.findBuildPosition(room, spawn.pos, 10);
                if (pos) room.createConstructionSite(pos, STRUCTURE_STORAGE);
            }
        }
    }
};
