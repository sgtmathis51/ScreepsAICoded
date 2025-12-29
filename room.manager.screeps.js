var registry = require('registry.screeps');
var planner = registry.planner;

module.exports = {
    runAllRooms: function () {
        for (var rn in Game.rooms) {
            var room = Game.rooms[rn];
            try {
                this.manageRoom(room);
            } catch (e) {
                console.log('Room manager error for', rn, e.stack || e);
            }
        }
    },

    manageRoom: function (room) {
        // only plan for owned rooms
        if (!room.controller || !room.controller.my) return;
        planner.planRoom(room);
    }
};
