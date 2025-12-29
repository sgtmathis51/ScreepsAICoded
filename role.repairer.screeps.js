module.exports = {
    run: function (creep) {
var registry = require('registry.screeps');
var utils = registry.utils;

    if (creep.store.getFreeCapacity() > 0) {
            var src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (src) {
                if (creep.harvest(src) === ERR_NOT_IN_RANGE) utils.moveTo(creep, src, { range: 1 });
            }
        } else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax * 0.8 && s.structureType !== STRUCTURE_WALL });
            if (target) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) utils.moveTo(creep, target, { range: 1 });
            }
        }
    }
};
