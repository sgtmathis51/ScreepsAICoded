This repository is a compact Screeps AI scaffold designed to run from the repository root next to `main.js`.

File naming convention: modules append a namespace-style suffix like `.screeps` so require('module.name.screeps') matches the filename.

Files added:
- `main.js` — main loop, wires managers and role modules.
- `utils.screeps.js` — small helpers (memory cleanup, body builder, counts).
- `spawns.manager.screeps.js` — spawn decision logic for multiple spawns/rooms.
- `room.manager.screeps.js` — runs planning for owned rooms.
- `structure.planner.screeps.js` — places extensions, towers, storage, simple placement logic.
- `role.*.screeps.js` — role modules: harvester, builder, upgrader, repairer, miner, hauler.

Notes:
- The planner uses a simple spiral search to find free build positions near your spawn.
- The code is intentionally light on CPU; heavy planning runs every 13 ticks.
- Tweak desired role counts in `spawns.manager.screeps.js` per-room as needed.

Usage: copy these files into your Screeps script repository next to `main.js` and upload.
