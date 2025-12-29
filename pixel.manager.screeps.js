/**
 * pixel.manager.screeps.js
 * Use spare CPU bucket to generate Pixels via `Game.cpu.generatePixel()` when available.
 * Configuration in `Memory.settings.pixel`:
 * { enabled: true, threshold: 10000, cooldown: 100 }
 */
module.exports = {
    run: function () {
        if (typeof Game === 'undefined' || !Game.cpu) return;

        Memory.settings = Memory.settings || {};
        var cfg = Memory.settings.pixel || { enabled: true, threshold: 10000, cooldown: 100 };
        if (!cfg.enabled) return;

        if (typeof Game.cpu.generatePixel !== 'function') return;

        // Only attempt when bucket is at or above threshold and cooldown elapsed
        if ((Game.cpu.bucket || 0) >= cfg.threshold) {
            var last = Memory._lastPixelGenTick || 0;
            if (Game.time - last < (cfg.cooldown || 100)) return;
            try {
                var res = Game.cpu.generatePixel();
                Memory._lastPixelGenTick = Game.time;
                if (res === OK) {
                    console.log('pixel.manager: generated a Pixel at', Game.time);
                } else {
                    // non-OK result (likely ERR_TIRED / ERR_NOT_ENOUGH resources), record and continue
                    // no further action needed
                }
            } catch (e) {
                // In case generatePixel throws unexpectedly, record tick to avoid hot loop
                Memory._lastPixelGenTick = Game.time;
                console.log('pixel.manager: generatePixel error', e.stack || e);
            }
        }
    }
};
