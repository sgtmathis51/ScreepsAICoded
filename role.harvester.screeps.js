var registry = require('registry.screeps');
var utils = registry.utils;

module.exports = {
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (src) {
                if (creep.harvest(src) === ERR_NOT_IN_RANGE) utils.moveTo(creep, src, { range: 1 });
            }
        } else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, target, { range: 1 });
            } else {
                var st = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
                if (st) {
                    if (creep.transfer(st, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, st, { range: 1 });
                }
            }
        }
    }
};
