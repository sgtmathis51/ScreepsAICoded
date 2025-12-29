/*
 * utils.screeps.js
 * Small utility helpers used across modules:
 * - Memory cleanup
 * - Counting creeps by role
 * - Body builder for spawn
 * - Path caching and cached move helper to reduce PathFinder calls
 */
module.exports = {
    cleanupMemory: function () {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) delete Memory.creeps[name];
        }
    },

    countCreepsByRoleInRoom: function (roomName, role) {
        var count = 0;
        for (var n in Game.creeps) {
            var c = Game.creeps[n];
            if (c.memory && c.memory.role === role && c.room && c.room.name === roomName) count++;
        }
        return count;
    },

    // Build a simple body from available energy (prioritize WORK/MOVE/CARRY)
    buildBody: function (energy, role) {
        var parts = [];
        var presets = {
            harvester: [WORK, CARRY, MOVE],
            upgrader: [WORK, CARRY, MOVE],
            builder: [WORK, CARRY, MOVE],
            repairer: [WORK, CARRY, MOVE],
            miner: [WORK, WORK, MOVE],
            hauler: [CARRY, CARRY, MOVE]
        };
        var base = presets[role] || [WORK, CARRY, MOVE];
        var cost = function (body) {
            var c = 0;
            for (var i = 0; i < body.length; i++) c += BODYPART_COST[body[i]];
            return c;
        };
        while (cost(parts.concat(base)) <= energy && parts.length + base.length <= 50) {
            parts = parts.concat(base);
        }
        if (parts.length === 0) parts = [MOVE, CARRY];
        return parts;
    },

    // Path caching helpers
    _getPathKey: function (fromPos, toPos) {
        return fromPos.roomName + ':' + fromPos.x + ',' + fromPos.y + '->' + toPos.x + ',' + toPos.y;
    },

    // Return a cached path as an array of {x,y} objects for same-room paths
    getCachedPath: function (fromPos, toPos, opts) {
        opts = opts || {};
        var ttl = opts.ttl || 20;
        if (!fromPos || !toPos) return null;
        if (fromPos.roomName !== toPos.roomName) return null; // only cache intra-room paths
        Memory.pathCache = Memory.pathCache || {};
        var key = this._getPathKey(fromPos, toPos);
        var entry = Memory.pathCache[key];
        if (entry && entry.expire > Game.time && entry.path) return entry.path;

        var room = Game.rooms[fromPos.roomName];
        if (!room) return null;
        var range = opts.range || 1;
        var res = PathFinder.search(fromPos, { pos: toPos, range: range }, { maxOps: opts.maxOps || 2000 });
        if (!res || !res.path || res.path.length === 0) return null;
        // store as compact x,y array to avoid relying on room.serializePath
        var compact = [];
        for (var i = 0; i < res.path.length; i++) {
            compact.push({ x: res.path[i].x, y: res.path[i].y });
        }
        Memory.pathCache[key] = { path: compact, expire: Game.time + ttl };
        return compact;
    },

    // Move helper that uses cached serialized paths when available
    moveTo: function (creep, target, opts) {
        opts = opts || {};
        if (!creep || !target) return;
        var toPos = target.pos ? target.pos : target;
        if (!toPos) return;
        // if already near target, skip
        var range = opts.range || 1;
        if (creep.pos.inRangeTo(toPos.x, toPos.y, range)) return;

        var compactPath = this.getCachedPath(creep.pos, toPos, opts);
        if (compactPath) {
            // reconstruct RoomPosition array for moveByPath
            var positions = [];
            for (var i = 0; i < compactPath.length; i++) {
                positions.push(new RoomPosition(compactPath[i].x, compactPath[i].y, creep.pos.roomName));
            }
            var res = creep.moveByPath(positions);
            if (res === ERR_NOT_FOUND || res === ERR_INVALID_TARGET) {
                delete Memory.pathCache[this._getPathKey(creep.pos, toPos)];
                creep.moveTo(toPos, opts.moveToOpts || { reusePath: 5 });
            }
        } else {
            creep.moveTo(toPos, opts.moveToOpts || { reusePath: 5 });
        }
    }
};
