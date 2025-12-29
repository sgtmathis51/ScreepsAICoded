var registry = require('registry.screeps');
var utils = registry.utils;

module.exports = {
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY });
            if (source) {
                if (creep.pickup(source) === ERR_NOT_IN_RANGE) utils.moveTo(creep, source, { range: 1 });
                return;
            }
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0 });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, container, { range: 1 });
                return;
            }
            var source2 = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source2) {
                if (creep.harvest(source2) === ERR_NOT_IN_RANGE) utils.moveTo(creep, source2, { range: 1 });
            }
        } else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, target, { range: 1 });
            } else {
                var st = creep.room.storage || creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
                if (st) {
                    if (creep.transfer(st, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, st);
                }
            }
        }
    }
};
