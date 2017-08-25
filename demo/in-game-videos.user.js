// ==UserScript==
// @name         Starve.io to Demo: YouTube videos in game world
// @namespace    http://tampermonkey.net/
// @version      0.15.1
// @description  Demo showing how YouTube videos can appear in Starve.io game world.  This demo replaces dead boxes with videos. The more players that die, the more videos.
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

    function checkDependencies() {
        if ((typeof deobauto === 'undefined' || deobauto !== true)) {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    }

    function main() {
        window.old_draw_simple_mobs_2 = window[draw_simple_mobs_2];
        window[draw_simple_mobs_2] = function(c, g) {
            if (c === 570) {
                draw_youtube_video.apply(this, arguments);
            } else {
                old_draw_simple_mobs_2.apply(this, arguments);
            }
        };

        window.ext_video = document.createElement('video');
        var ext_source = document.createElement('source');
        ext_video.autoplay = true;
        ext_video.controls = true;
        ext_video.id = 'ext_video';
        ext_video.loop = true;
        ext_video.muted = true;
        ext_video.style.display = 'none';
        ext_source.src = '<INSERT DIRECT LINK TO VIDEO FILE HERE>';
        ext_source.type = 'video/mp4';
        ext_video.appendChild(ext_source);
        document.body.append(ext_video);

        //video.addEventListener(
        //ext_video.currentTime = 0
        ctx.drawImage(ext_video, 5, 5, 270, 125);
    }

    window.draw_youtube_video = function(c, g) {
        ext_video.muted = false;
        ctx.save();
        ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
        ctx.rotate(this.angle);
        var f = sprite[c][world.time];
        w = -f.width;
        h = -f.height;
        // The following line is the only change: ext_video which draws the video instead of the sprite
        ctx.drawImage(ext_video, -w/2, -h/2, w, h);
        if (this.action & O_O156640_0.HURT) {
            if (this.hit.update() && 0 === this.hit.o) {
                this.action -= O_O156640_0.HURT;
            }
            ctx.globalAlpha = 0.6 - this.hit.v;
            f = sprite[g];
            ctx.drawImage(f, -w/2, -h/2, w, h);
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    };

    checkDependencies();
})();