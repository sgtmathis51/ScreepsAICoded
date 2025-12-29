module.exports = {
    run: function (creep) {
        var registry = require('registry.screeps');
        var utils = registry.utils;
        if (creep.store.getFreeCapacity() > 0) {
            var source = Game.getObjectById(creep.memory.sourceId) || creep.pos.findClosestByPath(FIND_SOURCES);
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) utils.moveTo(creep, source, { range: 1 });
            }
        } else {
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_CONTAINER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) utils.moveTo(creep, container, { range: 1 });
            } else {
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
};
