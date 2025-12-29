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
            var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (site) {
                if (creep.build(site) === ERR_NOT_IN_RANGE) utils.moveTo(creep, site, { range: 1 });
            } else {
                var toRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax * 0.5 && s.structureType !== STRUCTURE_WALL });
                if (toRepair) {
                    if (creep.repair(toRepair) === ERR_NOT_IN_RANGE) utils.moveTo(creep, toRepair, { range: 1 });
                }
            }
        }
    }
};
