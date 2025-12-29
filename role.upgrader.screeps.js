module.exports = {
    run: function (creep) {
var registry = require('registry.screeps');
var utils = registry.utils;

    if (creep.store.getFreeCapacity() > 0) {
            var src = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (src) {
                if (creep.harvest(src) === ERR_NOT_IN_RANGE) utils.moveTo(creep, src, { range: 1 });
            } else {
                var tomb = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType === RESOURCE_ENERGY });
                if (tomb && creep.pickup(tomb) === ERR_NOT_IN_RANGE) utils.moveTo(creep, tomb, { range: 1 });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) utils.moveTo(creep, creep.room.controller, { range: 3 });
        }
    }
};
