// ==UserScript==
// @name         Starve.io Deobfuscated Auto
// @namespace    https://github.com/jasonkhanlar/starve-io-extensions
// @version      0.16.0
// @description  Auto deobfuscation includes at least bare minimum for scripts to function normally
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        GM_webRequest
// @webRequest   [{"selector":"http://starve.io/js/client.min.js","action":"cancel"}]
// @run-at       document-start
// ==/UserScript==

/*
    Userscript Manager Compatibility:
        Tampermonkey Beta
            Beta v4.5.5553 or higher required! See https://github.com/Tampermonkey/tampermonkey/issues/397
        Violentmonkey

    Web Browser Compatibility:
        Chrome/Chromium
            Tampermonkey Beta, Violentmonkey
        Firefox
            Violentmonkey
        Opera
            Violentmonkey
*/

// Compatible with version 16 of Starve.io client

(function() {
    'use strict';

    // Since HTTP request to http://starve.io/js/client.min.js was cancelled, download now and strip IIFE header and footer
    // see http://benalman.com/news/2010/11/immediately-invoked-function-expression/
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var script = document.createElement('script');
            unsafeWindow.document.body.appendChild(script);
            script.text = this.responseText.trim().replace(/[\r\n]/g, ' ').replace(/ +/g, ' ').replace(/^\(function \(\) {(.*)}\)\(\)$/g, '$1');
        }
    };
    // Add ? to avoid cancelling the HTTP request again
    xhr.open('GET', 'http://starve.io/js/client.min.js?', true);
    xhr.send();

    unsafeWindow.deoblist = { o2d: [], d2o: [] };

    // Performance tests
    // https://jsperf.com/isarray-two
    // https://jsperf.com/count-the-number-of-characters-in-a-string
    // https://jsperf.com/string-ocurrence-split-vs-match/2
    // https://jsperf.com/exec-vs-match-vs-test-vs-search/10

    function autodetect(stage) {
        if (stage === 0) {
            // First detect OBFUSCATOR_ARR and OBFUSCATOR_FN to reference in next stage
            Object.keys(unsafeWindow).forEach(function(s) {
                if (s === 'webkitStorageInfo') { } // deprecated
                else if (typeof unsafeWindow[s] === 'function') {
                    if (unsafeWindow[s].length === 2) {
                        if (unsafeWindow[s].toString().match(/^function ?\([a-z],[a-z]\){return _0x[a-z0-9]{4}\[[a-z]-0\]}$/)) {
                            unsafeWindow.OBFUSCATOR_FN = unsafeWindow[s];
                            deobmatch('OBFUSCATOR_FN', s);
                        }
                    }
                } else if (typeof unsafeWindow[s] === 'object') {
                    if (Array.isArray(unsafeWindow[s])) {
                        if (unsafeWindow[s].every(function(i) { return typeof i === "string" })) {
                            if (unsafeWindow[s].length > 100) {
                                unsafeWindow.OBFUSCATED_ARR = unsafeWindow[s];
                                deobmatch('OBFUSCATED_ARR', s);
                            }
                        }
                    }
                }
            });
        } else if (stage === 1) {
            // Then detect all global variables, constants and functions
            Object.keys(unsafeWindow).forEach(function(s) { // v15 680-690 matches
                if (s === 'webkitStorageInfo') { } // deprecated
                else if (typeof unsafeWindow[s] === 'boolean') { } // v15 6 matches
                else if (typeof unsafeWindow[s] === 'function') { // v15 376 matches
                    if ((/\{\s*\[native code\]\s*\}/).test('' + unsafeWindow[s])) { } // ignore native functions
                    else {
                        var deobfunc = deobfuscate_func(unsafeWindow[s].toString());
                        if (unsafeWindow[s].length === 0) { // v15 83 matches
                            if (unsafeWindow[s].toString().match(/new XMLHttpRequest/)) { // v15 1 match
                                unsafeWindow.Client = s;
                                deobmatch('Client', s);
                            } else if (deobfunc.abbr.match(/SAVE;TUPT;this\.text/)) {
                                unsafeWindow.draw_chat = s;
                                deobmatch('draw_chat', s);
                            } else if (deobfunc.abbr.match(/[a-z]=sprite\[@\.DRAGON\]\[@\.time\];/)) {
                                unsafeWindow.draw_dragon = s;
                                deobmatch('draw_dragon', s);
                            } else if (deobfunc.abbr.match(/IFWBGC/) && deobfunc.abbr.match(/@\.items\.push/)) { // v15 1 match
                                unsafeWindow.init_fake_world = s;
                                deobmatch('init_fake_world', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/ICON_LEADER/)) { // v15 1 match
                                unsafeWindow.draw_player = s;
                                deobmatch('draw_player', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/[a-z]\+game\.minimap\.marker\.y\*scale/)) { // v15 1 match
                                unsafeWindow.draw_minimap = s;
                                deobmatch('draw_minimap', s);
                            } else if (deobfunc.orig.match(/\.SAND_MIN_X/) && deobfunc.orig.match(/\.BEACH_WINTER_MIN_X/)) { // v15 1 match
                                unsafeWindow.draw_ground = s;
                                deobmatch('draw_ground', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/DRAGON_GROUND/)) { // v15 1 match
                                unsafeWindow.draw_world = s;
                                deobmatch('draw_world', s);
                            } else if (deobfunc.orig.match(/game\.leaderboard/)) { // v15 1 match
                                unsafeWindow.draw_leaderboard = s;
                                deobmatch('draw_leaderboard', s);
                            } else if (s !== 'Item' && deobfunc.orig.match(/fruits\[4/)) { // v15 1 match
                                unsafeWindow.draw_fake_world = s;
                                deobmatch('draw_fake_world', s);
                            } else if (deobfunc.orig.match(/DIST_BREAD_OVEN/)) { // v15 1 match
                                unsafeWindow.draw_breadoven_inventory = s;
                                deobmatch('draw_breadoven_inventory', s);
                            } else if (deobfunc.orig.match(/DIST_FURNACE/)) { // v15 1 match
                                unsafeWindow.draw_furnace_inventory = s;
                                deobmatch('draw_furnace_inventory', s);
                            } else if (deobfunc.orig.match(/DIST_CHEST/)) { // v15 1 match
                                unsafeWindow.draw_chest_inventory = s;
                                deobmatch('draw_chest_inventory', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/BIGMAP/)) { // v15 1 match
                                unsafeWindow.draw_bigmap = s;
                                deobmatch('draw_bigmap', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/RECONNECT/)) { // v15 1 match
                                unsafeWindow.draw_reconnect = s;
                                deobmatch('draw_reconnect', s);
                            } else if (deobfunc.orig.match(/user\.auto_feed\.translate\.x,user\.auto_feed\.translate\.y/)) { // v15 1 match
                                unsafeWindow.draw_auto_feed = s;
                                deobmatch('draw_auto_feed', s);
                            } else if (deobfunc.abbr.match(/sprite\[@\.SHOW_SPECTATORS\],/)) { // v15 1 match
                                unsafeWindow.draw_show_spectators = s;
                                deobmatch('draw_show_spectators', s);
                            } else if (deobfunc.abbr.match(/DELAY_TEAM/) && deobfunc.abbr.match(/WEAPON_LOADING/)) { // v15 1 match
                                unsafeWindow.draw_totem_switch_delay = s;
                                deobmatch('draw_totem_switch_delay', s);
                            } else if (deobfunc.abbr.match(/[a-z]=user\.weapon/) && deobfunc.abbr.match(/WEAPON_LOADING/)) { // v15 1 match
                                unsafeWindow.draw_weapon_switch_delay = s;
                                deobmatch('draw_weapon_switch_delay', s);
                            } else if (deobfunc.abbr.match(/^function @\(\){var [a-z]=user\.craft/)) { // v15 1 match
                                unsafeWindow.draw_ui_crafting = s;
                                deobmatch('draw_ui_crafting', s);
                            } else if (deobfunc.abbr.match(/var [a-z]=user\.inv,/)) { // v15 1 match
                                unsafeWindow.draw_ui_inventory = s;
                                deobmatch('draw_ui_inventory', s);
                            } else if (deobfunc.abbr.match(/user\.gauges\.warn_life/)) { // v15 1 match
                                unsafeWindow.draw_gauges = s;
                                deobmatch('draw_gauges', s);
                            } else if (deobfunc.abbr.match(/img=sprite\[@\.LOCK\]/)) { // v15 1 match
                                unsafeWindow.draw_chest = s;
                                deobmatch('draw_chest', s);
                            } else if (deobfunc.abbr.match(/^function @\(\){if\(!\(10>this\.info\)\)/)) { // v15 1 match
                                unsafeWindow.draw_seed = s;
                                deobmatch('draw_seed', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/DRIED_PLANT/)) { // v15 1 match
                                unsafeWindow.draw_plant = s;
                                deobmatch('draw_plant', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/FURNACE_ON/)) { // v15 1 match
                                unsafeWindow.draw_furnace = s;
                                deobmatch('draw_furnace', s);
                            } else if (deobfunc.abbr.match(/GROUND_FIRE/) && deobfunc.abbr.match(/@\.globalAlpha=1;RESTORE\}$/)) { // v15 1 match
                                unsafeWindow.draw_furnace_ground = s;
                                deobmatch('draw_furnace_ground', s);
                            } else if (deobfunc.abbr.match(/SMOG_PUSH/)) { // v15 1 match
                                unsafeWindow.draw_breadoven_smog = s;
                                deobmatch('draw_breadoven_smog', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/BREAD_OVEN_ON/)) { // v15 1 match
                                unsafeWindow.draw_breadoven = s;
                                deobmatch('draw_breadoven', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/RESURRECTION_HOLE/)) { // v15 1 match
                                unsafeWindow.draw_resurrection = s;
                                deobmatch('draw_resurrection', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/RESURRECTION_GROUND/)) { // v15 1 match
                                unsafeWindow.draw_resurrection_halo = s;
                                deobmatch('draw_resurrection_halo', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/HALO_FIRE/) && deobfunc.orig.match(/ROTATE;this\.halo\.update\(\)/)) { // v15 1 match
                                unsafeWindow.draw_furnace_halo = s;
                                deobmatch('draw_furnace_halo', s);
                            } else if (s !== 'create_images' && deobfunc.orig.match(/HALO_FIRE/) && !deobfunc.orig.match(/ROTATE;this\.halo\.update\(\)/)) { // v15 1 match
                                unsafeWindow.draw_fire_halo = s;
                                deobmatch('draw_fire_halo', s);
                            } else if (deobfunc.orig.match(/1E3\/1E3/)) { // v15 1 match
                                unsafeWindow.draw_alert_ghost = s;
                                deobmatch('draw_alert_ghost', s);
                            } else if (deobfunc.orig.match(/DIST_RESURRECTION/)) { // v15 1 match
                                unsafeWindow.draw_resurrection_inventory = s;
                                deobmatch('draw_resurrection_inventory', s);
                            } else if (s != 'create_images' && s != 'Game' && deobfunc.orig.match(/SHOW_SPECTATORS/)) { // v15 1 match
                                unsafeWindow.draw_show_spectators = s;
                                deobmatch('draw_show_spectators', s);
                            } else if (deobfunc.abbr.match(/@\.FLAKES,/)) { // v15 1 match
                                unsafeWindow.draw_winter= s;
                                deobmatch('draw_winter', s);
                            } else if (deobfunc.abbr.match(/function @\(\){if\(@\.transition\)var [a-z]=@\.shade\.update\(\);/)) { // v15 1 match
                                unsafeWindow.draw_world_with_effect = s;
                                deobmatch('draw_world_with_effect', s);
                            } else if (deobfunc.abbr.match(/SOUND_PLAYER\.FACTOR\)/)) { // v15 1 match
                                unsafeWindow.GameAudio = s;
                                deobmatch('GameAudio', s);
                            } else if (s != 'UI' && deobfunc.abbr.match(/sadblock/)) { // v15 1 match
                                unsafeWindow.sadblock = s;
                                deobmatch('sadblock', s);
                            }
                        } else if (unsafeWindow[s].length === 1) { // v15 51 matches
                            if (deobfunc.abbr.match(/[a-z]=-[a-z]\.width;/) && deobfunc.abbr.match(/ROTATE;if\(this\.hit\.update\)/)) {
                                unsafeWindow.draw_door = s;
                                deobmatch('draw_door', s);
                            } else if (deobfunc.abbr.match(/^function @\([a-z]\){SAVE;TUPT;ROTATE;if\(this\.hit\.update\){/) && deobfunc.abbr.match(/img/)) {
                                unsafeWindow.draw_simple_item = s;
                                deobmatch('draw_simple_item', s);
                            } else if (deobfunc.abbr.match(/this\.breath\.update\(\);img=sprite/)) {
                                unsafeWindow.draw_breath = s;
                                deobmatch('draw_breath', s);
                            } else if (deobfunc.abbr.match(/case @\.WATERING_CAN_FULL:SAVE/)) {
                                unsafeWindow.draw_player_effect = s;
                                deobmatch('draw_player_effect', s);
                            } else if (deobfunc.abbr.match(/2147483648/)) {
                                unsafeWindow.randS32 = s;
                                deobmatch('randS32', s);
                            } else if (deobfunc.abbr.match(/Leaderboard/)) { // v15 1 match
                                unsafeWindow.create_leaderboard_mobile = s;
                                deobmatch('create_leaderboard_mobile', s);
                            } else if (deobfunc.abbr.match(/[a-z]\.width=335\*[a-z];[a-z]\.height=120\*[a-z];/)) { // v15 1 match
                                unsafeWindow.create_gauges_mobile = s;
                                deobmatch('create_gauges_mobile', s);
                            } else if (deobfunc.abbr.match(/=600\*[a-z]/)) { // v15 1 match
                                unsafeWindow.create_old_gauges = s;
                                deobmatch('create_old_gauges', s);
                            } else if (deobfunc.abbr.match(/GROUND_FIRE/) && deobfunc.abbr.match(/@\.globalAlpha=1;this\.hit\.update/)) { // v15 1 match
                                unsafeWindow.draw_fire_ground = s;
                                deobmatch('draw_fire_ground', s);
                            } else if (deobfunc.abbr.match(/CROWN_GREEN:case/) && deobfunc.abbr.match(/[a-z]\.width\/2,/)) { // v15 1 match
                                unsafeWindow.draw_player_clothe = s;
                                deobmatch('draw_player_clothe', s);
                            }
                        } else if (unsafeWindow[s].length === 2) { // v15 85 matches
                            if (deobfunc.abbr.match(/function @\([a-z],[a-z]\){var [a-z]=[a-z]\.getBoundingClientRect\(\);return{x:[a-z]\.clientX-[a-z]\.left,y:[a-z]\.clientY-[a-z]\.top}}/)) { // v15 1 match
                                unsafeWindow.get_mouse_pos = s;
                                deobmatch('get_mouse_pos', s);
                            } else if (deobfunc.abbr.match(/[a-z]=sprite\[[a-z]\]\[@\.time\];[a-z]=-[a-z]\.width\*this\.breath\.v/)) {
                                unsafeWindow.draw_simple_mobs = s;
                                deobmatch('draw_simple_mobs', s);
                            } else if (deobfunc.abbr.match(/[a-z]=-[a-z]\.width;/) && deobfunc.abbr.match(/@\.drawImage\([a-z],-[a-z]\/2,-[a-z]\/2,[a-z],[a-z]\)/)) {
                                unsafeWindow.draw_simple_mobs_2 = s;
                                deobmatch('draw_simple_mobs_2', s);
                            } else if (deobfunc.orig.match(/==BUTTON_CLICK&&/)) {
                                unsafeWindow.draw_amount = s;
                                deobmatch('draw_amount', s);
                            } else if (deobfunc.abbr.match(/this\.text&&\(@\.globalAlpha=this\.timeout\.o/)) {
                                unsafeWindow.draw_alert = s;
                                deobmatch('draw_alert', s);
                            } else if (deobfunc.orig.match(/draw_bg\([a-z]\)/)) {
                                unsafeWindow.draw_bg_transition = s;
                                deobmatch('draw_bg_transition', s);
                            } else if (deobfunc.orig.match(/draw_fg\([a-z]\)/)) {
                                unsafeWindow.draw_fg_transition = s;
                                deobmatch('draw_fg_transition', s);
                            } else if (deobfunc.abbr.match(/!==@\.SAND_STEP/)) {
                                unsafeWindow.draw_foot = s;
                                deobmatch('draw_foot', s);
                            } else if (deobfunc.orig.match(/[a-z]\.width=149\*[a-z];[a-z]\.height=356\*[a-z];/)) {
                                unsafeWindow.create_breadoven_ui = s;
                                deobmatch('create_breadoven_ui', s);
                            }
                        } else if (unsafeWindow[s].length === 3) { // v15 125 matches
                            if (deobfunc.orig.match(/BUTTON_CLICK\|\|/)) {
                                unsafeWindow.draw_slot_number = s;
                                deobmatch('draw_slot_number', s);
                            } else if (deobfunc.abbr.match(/^function @\([a-z],[a-z],[a-z]\){@\.transition/) && deobfunc.abbr.match(/drawImage/)) { // v15 1 match
                                unsafeWindow.draw_image_transition = s;
                                deobmatch('draw_image_transition', s);
                            } else if (deobfunc.abbr.match(/^function @\([a-z],[a-z],[a-z]\){@\.transition\?/) && deobfunc.abbr.match(/\.draw\(/)) { // v15 1 match
                                unsafeWindow.draw_transition = s;
                                deobmatch('draw_transition', s);
                            } else if (deobfunc.orig.match(/[a-z]\.width=440\*[a-z];[a-z]\.height=388\*[a-z];/) && deobfunc.orig.length < 1000) {
                                unsafeWindow.create_breadoven_off = s;
                                deobmatch('create_breadoven_off', s);
                            } else if (deobfunc.orig.match(/[a-z]\.width=440\*[a-z];[a-z]\.height=388\*[a-z];/) && deobfunc.orig.length > 1000) {
                                unsafeWindow.create_breadoven = s;
                                deobmatch('create_breadoven', s);
                            } else if (deobfunc.abbr.match(/switch\(img=sprite\[[a-z]\]\[@\.time\],[a-z]\)/)) {
                                unsafeWindow.draw_player_right_stuff = s;
                                deobmatch('draw_player_right_stuff', s);
                            }
                        } else if (unsafeWindow[s].length === 4) { // v15 13 matches
                        } else if (unsafeWindow[s].length === 5) { // v15 3 matches
                            if (deobfunc.abbr.match(/@\.transition&&/) && deobfunc.abbr.match(/@\.time=@\.time/)) { // v15 1 match
                                unsafeWindow.draw_imgs_transition = s;
                                deobmatch('draw_imgs_transition', s);
                            }
                        } else if (unsafeWindow[s].length === 6) { // v15 3 matches
                            if (deobfunc.orig.match(/for\(;[a-z]<=[a-z];[a-z]\+\+\)/)) {
                                unsafeWindow.draw_map_object = s;
                                deobmatch('draw_map_object', s);
                            }
                        } else if (unsafeWindow[s].length === 7) { // v15 6 matches
                        } else if (unsafeWindow[s].length === 8) {
                            if (deobfunc.orig.match(/for\([a-z]=void/) && deobfunc.orig.match(/breath/)) {
                                unsafeWindow.draw_map_2_objects = s;
                                deobmatch('draw_map_2_objects', s);
                            } else if (deobfunc.orig.match(/for\([a-z]=void/) && !deobfunc.orig.match(/breath/)) {
                                unsafeWindow.draw_map_objects = s;
                                deobmatch('draw_map_objects', s);
                            }
                        } else if (unsafeWindow[s].length === 9) { // v15 1 match
                            if (deobfunc.abbr.match(/@\.shade\.v,[a-z]\(/)) { // v15 1 match
                                unsafeWindow.draw_map_transition = s;
                                deobmatch('draw_map_transition', s);
                            }
                        } else if (unsafeWindow[s].length === 11) { // v15 2 matches
                            if (deobfunc.abbr.match(/AMBIENCE\.sound\.playing/)) { // v15 1 match
                                unsafeWindow.sound_track = s;
                                deobmatch('sound_track', s);
                            }
                        }
                    }
                } else if (typeof unsafeWindow[s] === 'number') { // v15 50-52 matches
                    if (unsafeWindow[s] === unsafeWindow.innerHeight && s !== 'innerHeight') { // v15 1 match
                        // Not detected if resizing window while loading
                        if (s !== 'canh') {
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.height,') > -1) {
                                unsafeWindow.canh = s;
                                deobmatch('canh', s);
                            }
                        }
                    } else if (unsafeWindow[s] === unsafeWindow.innerHeight / 2) { // v15 1 match
                        // Not detected if resizing window while loading
                        if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.height/2)') > -1) {
                            unsafeWindow.canh2 = s;
                            deobmatch('canh2', s);
                        }
                    }
                    if (unsafeWindow[s] === unsafeWindow.innerWidth && s !== 'innerWidth') { // v15 1 match
                        // Not detected if resizing window while loading
                        if (s !== 'canw') {
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf('innerWidth,' + s + '=can.width,') > -1) {
                                unsafeWindow.canw = s;
                                deobmatch('canw', s);
                            }
                        }
                    } else if (unsafeWindow[s] === unsafeWindow.innerWidth / 2) { // v15 1 match
                        // Not detected if resizing window while loading
                        if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.width/2)') > -1) {
                            unsafeWindow.canw2 = s;
                            deobmatch('canw2', s);
                        }
                    }

                    // Detecting these requires more evaluation
                    if (unsafeWindow[s] === 0) {
                        if (typeof unsafeWindow['create_leaderboard_'+s] === 'function' || // v15 1 match
                            typeof unsafeWindow['create_gauges_'+s] === 'function' ||
                            (typeof unsafeWindow.create_images === 'function' && deobfuscate_func(unsafeWindow.create_images.toString()).orig.indexOf(s + '?(sprite') > -1) ||
                            (typeof unsafeWindow.create_images === 'function' && deobfuscate_func(unsafeWindow.create_images.toString()).orig.indexOf(s + '?CTI(') > -1) ||
                            OBFUSCATED_ARR.indexOf(s+'AutoEnable') > -1 || // v15 1 match
                            OBFUSCATED_ARR.indexOf('_'+s+'Enabled') > -1 || // v15 1 match
                            OBFUSCATED_ARR.indexOf('_'+s+'Unloaded') > -1 // v15 1 match
                            ) {
                                unsafeWindow.mobile = s;
                                deobmatch('mobile', s);
                        } else if ((typeof unsafeWindow.gui_create_button === 'function' && deobfuscate_func(unsafeWindow.gui_create_button.toString()).orig.indexOf('==' + s + '&&') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + ')&&game') > -1) // v15 1 match
                            ) {
                            unsafeWindow.MOUSE_MOVE = s;
                            deobmatch('MOUSE_MOVE', s);
                        }
                    } else if (unsafeWindow[s] === 1) {
                        if ((typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + ')));') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',mouse.pos,' + s + '));user') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + '));if(-1!=') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + '))var ') > -1) // v15 1 match
                        ) {
                            unsafeWindow.MOUSE_DOWN = s;
                            deobmatch('MOUSE_DOWN', s);
                        }
                    } else if (unsafeWindow[s] === 2) {
                        if ((typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + ')?1!=') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',mouse.pos,' + s + ')&&0>user') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + ')&&(ret=') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf(',' + s + ')&&(audio') > -1) || // v15 1 match
                            (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf('.can,mouse.pos,' + s + ')&& ') > -1) // v15 1 match
                            ) {
                                unsafeWindow.MOUSE_UP = s;
                                deobmatch('MOUSE_UP', s);
                        }
                    }
                    // variable value
                    if (typeof unsafeWindow.draw === 'function') {
                        if (deobfuscate_func(unsafeWindow.draw.toString()).orig.indexOf('-' + s + ')/1E3;') > -1 || // v15 1 match
                            deobfuscate_func(unsafeWindow.draw.toString()).orig.indexOf(')/1E3;' + s + '=') > -1 // v15 1 match
                            ) {
                                unsafeWindow.old_timestamp = s;
                                deobmatch('old_timestamp', s);
                        } else if (typeof unsafeWindow.draw_life === 'function' &&
                            deobfuscate_func(draw.toString()).orig.split(s).length >= 4 &&
                            deobfuscate_func(draw_life.toString()).orig.match(new RegExp('\\*' + s + '\\*600\\*scale'))
                            ) {
                            unsafeWindow.delta = s;
                            deobmatch('delta', s);
                        }
                    }
                } else if (typeof unsafeWindow[s] === 'object') { // v15 206-208 matches
                    if (unsafeWindow[s] === unsafeWindow) { } // ignore
                    else if (unsafeWindow[s] === null) { } // ignore
                    else if (typeof unsafeWindow[s].unsafeWindow !== 'undefined') { } // ignore potential cross-origin objects
                    else if (Array.isArray(unsafeWindow[s])) { // v15 14-17 matches
                        if (unsafeWindow[s].every(function(i) { return typeof i === "string" })) {
                        } else if (!unsafeWindow[s].some(isNaN)) { // v15 6 matches
                            // Every item is coercible to a number
                            if (unsafeWindow[s].length === 10000) { // v15 1 match
                                unsafeWindow.RANDOM_NUMS = unsafeWindow[s];
                                deobmatch('RANDOM_NUMS', s);
                            } else if (unsafeWindow[s].length === 500) {
                                unsafeWindow.RIGHT_HAND_ITEMS = unsafeWindow[s];
                                deobmatch('RIGHT_HAND_ITEMS', s);
                            }
                        } else if (unsafeWindow[s].some(isNaN)) { // v15 6 matches
                            if (unsafeWindow[s].length > 600) { // v15 1 match
                                if (s !== 'sprite') {
                                    unsafeWindow.sprite = unsafeWindow[s];
                                    deobmatch('sprite', s);
                                }
                            } else if (unsafeWindow[s].length === 118) { // v15 1 match
                                unsafeWindow.INV_INFO = unsafeWindow[s];
                                deobmatch('INV_INFO', s);
                            } else if (unsafeWindow[s].length === 92) { // v15 1 match
                                unsafeWindow.RECIPES = unsafeWindow[s];
                                deobmatch('RECIPES', s);
                            } else if (unsafeWindow[s].length === 9) { // v15 1 match
                                if (s !== 'KIT') {
                                    unsafeWindow.KIT = unsafeWindow[s];
                                    deobmatch('KIT', s);
                                }
                            } else if (unsafeWindow[s].length === 7) { // v15 1 match
                                if (s !== 'QUESTS') {
                                    unsafeWindow.QUESTS = unsafeWindow[s];
                                    deobmatch('QUESTS', s);
                                }
                            }
                        } else if (unsafeWindow[s].every(function(i) { return !Array.isArray(i); })) { // v15 11 matches
                        } else {

                        }
                    } else if (typeof unsafeWindow[s].hasOwnProperty !== 'undefined') { // v15 79 matches
                        if (unsafeWindow[s].hasOwnProperty('already_used_key') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('claimed') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('connect') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('delete_one_inv') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('fire') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('full') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('fun_after') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('gather') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('give_well') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('hitten') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('join_team') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('kick') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('kick_team') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('killed') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('message') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('mute') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ping') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('reborn') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('recycle_inv') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('recycle_ok') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('recycle_stop') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('survive') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('take_bread') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('timeout') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('timeout_number') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('timeout_server') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('wrong_key') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('xhttp') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('xhttp_get') // v15 1 match
                            ) {
                                unsafeWindow.client = s;
                                deobmatch('client', s);
                        } else if (typeof unsafeWindow[s].canvas === 'object' &&
                            typeof unsafeWindow[s].fillStyle === 'string' &&
                            typeof unsafeWindow[s].filter === 'string' &&
                            typeof unsafeWindow[s].font === 'string' &&
                            typeof unsafeWindow[s].globalAlpha === 'number' &&
                            typeof unsafeWindow[s].globalCompositeOperation === 'string' &&
                            typeof unsafeWindow[s].imageSmoothingEnabled === 'boolean' &&
                            typeof unsafeWindow[s].lineCap === 'string' &&
                            typeof unsafeWindow[s].lineDashOffset === 'number' &&
                            typeof unsafeWindow[s].lineJoin === 'string' &&
                            typeof unsafeWindow[s].lineWidth === 'number' &&
                            typeof unsafeWindow[s].miterLimit === 'number' &&
                            typeof unsafeWindow[s].shadowBlur === 'number' &&
                            typeof unsafeWindow[s].shadowColor === 'string' &&
                            typeof unsafeWindow[s].shadowOffsetX === 'number' &&
                            typeof unsafeWindow[s].shadowOffsetY === 'number' &&
                            typeof unsafeWindow[s].strokeStyle === 'string' &&
                            typeof unsafeWindow[s].textAlign === 'string' &&
                            typeof unsafeWindow[s].textBaseline === 'string'
                            ) {
                                unsafeWindow.ctx = unsafeWindow[s];
                                deobmatch('ctx', s);
                                // Populate duplicates
                                game.ctx = game[s];
                                loader.ctx = loader[s];
                                scoreboard.ctx = scoreboard[s];
                                user.ldb.ctx = user.ldb[s];
                                ui.ctx = ui[s];
                        } else if (unsafeWindow[s].hasOwnProperty('ARROW_CLOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('AUTO_FEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BEACH_WINTER_MIN_X') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BIG_FIRE_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BIGMAP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BODY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_LIGHT_DOWN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_LIGHT_UP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_OVEN_BREAD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_OVEN_OFF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_OVEN_ON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_OVEN_UI') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BREAD_OVEN_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BUBBLES_SIZES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('BUBBLES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CAVE_STEP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CAVE_STONES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_AMETHYST_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_AMETHYST_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_AMETHYST_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_AMETHYST_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BAG') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BANDAGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BIG_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BLUE_CORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BOOK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BOTTLE_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BOTTLE_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BREAD_OVEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BREAD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BRIDGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BUCKET_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_BUCKET_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CAKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CAP_SCARF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_COAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_COOKED_MEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_COOKIE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CROWN_BLUE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CROWN_GREEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CROWN_ORANGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_CURSED_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIAMOND_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIAMOND_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIAMOND_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIAMOND_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DIVING_MASK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DOOR_GOLD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DOOR_STONE_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DOOR_WOOD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DRAGON_CUBE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DRAGON_HEART') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DRAGON_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DRAGON_ORB') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_DRAGON_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_EARMUFFS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_EXPLORER_HAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FLOUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FOODFISH_COOKED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FOODFISH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FURNACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FUR_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_FUR_WOLF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GEMME_BLUE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GEMME_GREEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GOLD_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GOLD_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GOLD_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GOLD_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_GROUND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_HAMMER_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_HAMMER_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_HAMMER_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_ICE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_KRAKEN_SKIN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_LOCKPICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_LOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_MEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PAPER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PICK_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PICK_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PICK_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PICK_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PLANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_PLUS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_RESURRECTION') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SAND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SANDWICH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SCALES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SHOVEL_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SHOVEL_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SHOVEL_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SHOVEL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SPANNER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SPECIAL_FUR_2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SPECIAL_FUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_STONE_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_STONE_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_STONE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_STONE_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SUPER_DIVING_SUIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SUPER_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SWORD_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SWORD_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SWORD_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_TOTEM') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WATERING_CAN_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WATERING_CAN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WELL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WILD_WHEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WINDMILL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WINTER_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WORKBENCH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CHEST_WORK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CLOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('COLD_SYMBOL_HUD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_AMETHYST_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_AMETHYST_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_AMETHYST_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_AMETHYST_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BAG') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BANDAGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BIG_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BLUE_CORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BOOK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BOTTLE_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BOTTLE_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BREAD_OVEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BREAD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BRIDGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BUCKET_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_BUCKET_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CAKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CAP_SCARF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_COAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_COOKED_MEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_COOKIE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CROWN_BLUE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CROWN_GREEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CROWN_ORANGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_CURSED_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DIAMOND_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DIAMOND_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DIAMOND_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DIAMOND_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DIVING_MASK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DOOR_GOLD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DOOR_STONE_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DOOR_WOOD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DRAGON_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_DRAGON_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_EARMUFFS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_EXPLORER_HAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_FOODFISH_COOKED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_FURNACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_GOLD_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_GOLD_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_GOLD_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_GOLD_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_HAMMER_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_HAMMER_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_HAMMER_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_LOADING') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_LOCKPICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_LOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PAPER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PICK_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PICK_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PICK_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PICK_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_PLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_RESURRECTION') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SANDWICH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SHOVEL_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SHOVEL_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SHOVEL_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SHOVEL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SPANNER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_STONE_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_STONE_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_STONE_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SUPER_DIVING_SUIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SUPER_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SWORD_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SWORD_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SWORD_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_TOTEM') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WATERING_CAN_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WATERING_CAN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WELL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WINDMILL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WINTER_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CRAFT_WORK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CURSED_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_DRINK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_TEAM') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_WEAPON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIAMOND_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_AMETHYST_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_AMETHYST_OPEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_AMETHYST_OPEN_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_DIAMOND_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_DIAMOND_OPEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_DIAMOND_OPEN_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_GOLD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_GOLD_OPEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_GOLD_OPEN_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_STONE_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_STONE_OPEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_STONE_OPEN_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_WOOD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_WOOD_OPEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DOOR_WOOD_OPEN_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRAGON_GROUND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRAGON_SWORD_HALO') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRIED_PLANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRIED_WHEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('EMPTY_SLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FIR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FLAKES_NUMBER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FLAKES_SIZES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FLAKES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FLOAM_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FOOD_SYMBOL_HUD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FULL_TEAM_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FURNACE_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FURNACE_OFF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FURNACE_ON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FURNACE_SLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GAUGES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GEAR2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GHOST_BUBBLES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GOLD_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GRD_SHOVEL_CO') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GROUND_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GROUND_FIRE_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HALO_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HAND_SHADOW') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HEART_SYMBOL_HUD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HELMET_LOADING') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HERB_CAVE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HERB') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HERB_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_BEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_DEAD_BOX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_DRAGON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_FOX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_KRAKEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_PIRANHA') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_RABBIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_SPIDER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_TREASURE_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_WING_LEFT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_WING_RIGHT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('HURT_WOLF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ICE_SHOVEL_CO') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ICON_LEADER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ICON_MEMBER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_AMETHYST_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_AMETHYST_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_AMETHYST_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_AMETHYST_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BAG') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BANDAGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BIG_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BLUE_CORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BOOK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BOTTLE_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BOTTLE_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BREAD_OVEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BREAD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BRIDGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BUCKET_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_BUCKET_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CAKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CAP_SCARF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_COAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_COOKED_MEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_COOKIE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CROWN_BLUE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CROWN_GREEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CROWN_ORANGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_CURSED_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIAMOND_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIAMOND_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIAMOND_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIAMOND_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DIVING_MASK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DOOR_GOLD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DOOR_STONE_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DOOR_WOOD_CLOSE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DRAGON_CUBE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DRAGON_HEART') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DRAGON_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DRAGON_ORB') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_DRAGON_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_EARMUFFS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_EXPLORER_HAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FLOUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FOODFISH_COOKED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FOODFISH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FURNACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FUR_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_FUR_WOLF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GEMME_BLUE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GEMME_GREEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GOLD_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GOLD_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GOLD_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GOLD_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_GROUND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_HAMMER_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_HAMMER_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_HAMMER_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_ICE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_KRAKEN_SKIN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_LOCKPICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_LOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_MEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PAPER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PICK_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PICK_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PICK_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PICK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PICK_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PLANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_PLOT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_RESURRECTION') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SAND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SANDWICH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SCALES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SHOVEL_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SHOVEL_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SHOVEL_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SHOVEL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SPANNER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SPEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SPECIAL_FUR_2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SPECIAL_FUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_STONE_HELMET') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_STONE_SPIKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_STONE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_STONE_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SUPER_DIVING_SUIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SUPER_HAMMER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SWORD_AMETHYST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SWORD_DIAMOND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SWORD_GOLD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_SWORD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_TOTEM') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WALL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WATERING_CAN_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WATERING_CAN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WELL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WILD_WHEAT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WINDMILL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WINTER_PEASANT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WOOD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('INV_WORK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ISLAND_BLOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ISLAND_STEP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ISLAND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ITEM1') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ITEM2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ITEM3') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ITEM4') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('KEY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LACK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LAKE_DEEP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LAKE_EDGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LAKE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LEADERBOARD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LOCKED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MANAGE_TEAM_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MINIMAP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('NIGHT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('OCEAN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('OPTION_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PADLOCK_ON_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PADLOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PALM') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PLANT_MINI') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('POINTS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('QUEST_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RECIPE_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RECONNECT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RESURRECTION_GROUND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RESURRECTION_HOLE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_BORDER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_MAX_X') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_MIN_X') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_SHOVEL_CO') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SAND_STEP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SHADOW_CAVE_STONES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SHINGLE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SHOP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SHOW_SPECTATORS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SHOW_TEAM_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN0') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN1') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN3') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN4') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN5') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SKIN6') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SLOT_NUMBER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SMOG_PUSH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SMOG_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SMOG') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SNOW_GROUND') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SNOW_STEP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SOUND_BUTTON_OFF') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SOUND_BUTTON_ON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('STEP_SPACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('STONES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('STONES_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SWIM_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SWIM_SPACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_BUTTON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TREE_BRANCH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TREE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WATER_1_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WATER_2_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WATER_3_COLOR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WATERBLOCK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WATER_SYMBOL_HUD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WAVE_ONE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WAVE_TWO') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WEAPON_LOADING') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WELL_EMPTY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WELL_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WINDMILL_CASES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WINDMILL_FLOUR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WINDMILL_HEAD') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WINDMILL_WINGS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WING_LEFT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WING_RIGHT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WINTER_BIOME_Y') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WOOD_FIRE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('YOUR_SCORE') // v15 1 match
                            ) {
                                unsafeWindow.SPRITE = unsafeWindow[s];
                                deobmatch('SPRITE', s);
                        } else if (unsafeWindow[s].hasOwnProperty('breath') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('clock') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('dw') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('find_bridge') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('mode') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('shade') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('units') // v15 1 match
                            ) {
                                unsafeWindow.world = unsafeWindow[s];
                                deobmatch('world', s);
                        } else if (unsafeWindow[s].hasOwnProperty('ATTACK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('CAM_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DELAY_CONNECTION_UPDATE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LAG_DISTANCE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LOOSE_FOCUS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MOVE_SPEED_MOD_ATTACK') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MUTE_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PING') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PING_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ROTATE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_FULL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_JOIN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_LEAVE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_MANAGE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TEAM_SHOW') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TIMEOUT_NUMBER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TIMEOUT_SERVER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TIMEOUT_TIME') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TOKEN_LEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('VERSION_NUMBER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WAITING_FOR_SERVER') // v15 1 match
                            ) {
                                unsafeWindow.CLIENT = unsafeWindow[s];
                                deobmatch('CLIENT', s);
                        } else if (unsafeWindow[s].hasOwnProperty('items') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('time') // v15 1 match
                            ) {
                                unsafeWindow.fake_world = s;
                                deobmatch('fake_world', s);
                        } else if (unsafeWindow[s].hasOwnProperty('BEAR') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DEAD_BOX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRAGON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FOX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FRUIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('KRAKEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PIRANHA') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RABBIT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPIDER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TREASURE_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WHEAT_MOB') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WOLF') // v15 1 match
                            ) {
                                unsafeWindow.ITEMS = unsafeWindow[s];
                                deobmatch('ITEMS', s);
                                // Also fill in for SPRITE.SPECIAL_ITEMS
                                unsafeWindow.SPECIAL_ITEMS = unsafeWindow['SPECIAL_' + s];
                                deobmatch('SPECIAL_ITEMS', 'SPECIAL_' + s);
                        } else if (unsafeWindow[s].hasOwnProperty('add_vector') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('Box') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('build_vector') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('compare_array') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('compare_object') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('copy_vector') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_in_out_cubic') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_in_out_quad') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_in_out_quart') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_out_cubic') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_out_quart') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('ease_out_quint') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('Ease') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('Ease2d') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('get_rand_pos_in_circle') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('gup') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('middle') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('middle_point') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('move') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('mul_vector') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('norm') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('open_in_new_box') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('randomize_list') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('sign') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('sub_vector') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('translate_new_vector') // v15 1 match
                            ) {
                                unsafeWindow.Utils = unsafeWindow[s];
                                deobmatch('Utils', s);
                        } else if (unsafeWindow[s].hasOwnProperty('BEAR_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_BREAD_OVEN') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_CHEST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_FURNACE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_RESURRECTION') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_WELL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIST_WINDMILL') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DRAGON_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FOX_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GHOST') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('GHOST_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('KRAKEN_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LW3SX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LWT1SY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LWT2') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('LWT2SY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MODE_HUNGER_GAMES') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MODE_PVP') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PIRANHA_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('RABBIT_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_COLLIDE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_DIVING') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_DIVING_WEAPON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_WEAPON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_WINTER') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SPEED_WINTER_WEAPON') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('W3SX') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WOLF_SPEED') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WT1EY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WT1SY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WY2EY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WT2SY') // v15 1 match
                            ) {
                                unsafeWindow.WORLD = unsafeWindow[s];
                                deobmatch('WORLD', s);
                        } else if (unsafeWindow[s].hasOwnProperty('AMBIENCE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('DIG') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PUNCH') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('WEAPON') // v15 1 match
                            ) {
                                unsafeWindow.AUDIO = s;
                                deobmatch('AUDIO', s);
                        } else if (unsafeWindow[s].hasOwnProperty('DISABLE_EFFECT') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FOREST_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('FOREST_FADE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('MISC') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('PLAYERS') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SEA_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SEA_FADE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SNOW_DELAY') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('SNOW_FADE') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('TRANSITION') // v15 1 match
                            ) {
                                unsafeWindow.CONST_AUDIO = unsafeWindow[s];
                                deobmatch('CONST_AUDIO', s);
                        } else if (typeof unsafeWindow.Game === 'function' && deobfuscate_func(unsafeWindow.Game.toString()).orig.indexOf('.select(' + s) > -1) { // v15 1 match
                            unsafeWindow.RECIPE_CATEGORIES = unsafeWindow[s];
                            deobmatch('RECIPE_CATEGORIES', s);
                        } else if (unsafeWindow[s].hasOwnProperty('DELETE') || // v15 1 match
                            (unsafeWindow[s].hasOwnProperty('IDLE') && s !== 'mouse') // v15 1 match
                            ) {
                                unsafeWindow.STATE = unsafeWindow[s];
                                deobmatch('STATE', s);
                        } else if (unsafeWindow[s].hasOwnProperty('a') || // v15 1 match
                            unsafeWindow[s].hasOwnProperty('c') // v15 1 match
                            ) {
                                unsafeWindow.RANDOM_SEED = unsafeWindow[s];
                                deobmatch('RANDOM_SEED', s);
                        }
                    }
                } else if (typeof unsafeWindow[s] === 'string') { // v15 41 matches
                } else if (typeof unsafeWindow[s] === 'undefined') { // v15 4 matches
                }
            });
        } else if (stage === 2) {
            // Then detect some properties that require reference to other properties for identification

            // Detecting or validating these may require more evaluation
            Object.keys(unsafeWindow).forEach(function(s) { // v15 680-690 matches
                if (s === 'webkitStorageInfo') { } // deprecated
                else if (typeof unsafeWindow[s] === 'number') { // v15 50-52 matches
                    if (unsafeWindow[s] === 92) { // v15 1 match
                        if (SPRITE.hasOwnProperty(s)) { // Validate with SPRITE.COUNTER, does SPRITE[s] exist?
                            unsafeWindow.COUNTER = s;
                            deobmatch('COUNTER', s);
                            // Also fill in for SPRITE.COUNTER
                            SPRITE.COUNTER = SPRITE[s];
                        }
                    }
                }
            });

            // Then detect most properties of global variables to reference in next stage

            if (typeof CLIENT === 'object') {
                Object.keys(unsafeWindow.CLIENT).forEach(function(s) {
                    if (typeof unsafeWindow.CLIENT[s] === 'number') {
                    }
                });
            }

            if (typeof client === 'string' && typeof unsafeWindow[client] === 'object') {
                Object.keys(unsafeWindow[client]).forEach(function(s) {
                    if (typeof unsafeWindow[client][s] === 'boolean') {
                    } else if (typeof unsafeWindow[client][s] === 'function') {
                        if ((/\{\s*\[native code\]\s*\}/).test('' + unsafeWindow[client][s])) { } // ignore native functions
                        else {
                            var deobfunc = deobfuscate_func(unsafeWindow[client][s].toString());
                            if (unsafeWindow[client][s].length === 0) {
                                if (deobfunc.abbr.match(/this\.@=JSON\.parse\(this\.xhttp\.responseText\)/)) {
                                    unsafeWindow.store_server_list = s;
                                    deobmatch('store_server_list', s);
                                } else if (deobfunc.abbr.match(/function ?\(\){for\(var [a-z]=0,[a-z]=0;[a-z]<@\.@\.length;[a-z]\+\+\)[a-z]\+=@\.@\[[a-z]\]\.nu;/)) {
                                    unsafeWindow.update_server_list = s;
                                    deobmatch('update_server_list', s);
                                } else if (deobfunc.abbr.match(/You have an old version/)) {
                                    unsafeWindow.old_version = s;
                                    deobmatch('old_version', s);
                                } else if (deobfunc.abbr.match(/user\.reconnect\.enabled=!1;user\.alive=!1;/)) {
                                    unsafeWindow.fail_restore = s;
                                    deobmatch('fail_restore', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[11\]\)\)}/)) {
                                    unsafeWindow.get_focus = s;
                                    deobmatch('get_focus', s);
                                } else if (deobfunc.abbr.match(/Resource is empty/)) {
                                    unsafeWindow.empty_res = s;
                                    deobmatch('empty_res', s);
                                } else if (deobfunc.abbr.match(/Inventory is full/)) {
                                    unsafeWindow.inv_full = s;
                                    deobmatch('inv_full', s);
                                } else if (deobfunc.abbr.match(/IFWBGC/)) {
                                    unsafeWindow.change_ground = s;
                                    deobmatch('change_ground', s);
                                } else if (deobfunc.abbr.match(/^function ?\(\){user\.craft\.restart\(\)}$/)) {
                                    unsafeWindow.cancel_craft = s;
                                    deobmatch('cancel_craft', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[31\]\)\)}$/)) {
                                    unsafeWindow.cancel_crafting = s;
                                    deobmatch('cancel_crafting', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[10,user\.craft\.preview/)) {
                                    unsafeWindow.send_build = s;
                                    deobmatch('send_build', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[14\]\)\)}/)) {
                                    unsafeWindow.stop_attack = s;
                                    deobmatch('stop_attack', s);
                                } else if (deobfunc.abbr.match(/^function ?\(\){if\(@-this\.@>@\.@\){this\.@=@;var [a-z]=user\.cam,[a-z]=Math.floor\([a-z]\.x\/100\),[a-z]=Math\.floor\([a-z]\.y\/100\);/)) {
                                    unsafeWindow.update_cam = s;
                                    deobmatch('update_cam', s);
                                } else if (deobfunc.abbr.match(/^function ?\(\){@-this\.@>@\.PING_DELAY&&\(this\.@=@,this\.ping\(\)\)}$/)) {
                                    unsafeWindow.try_ping = s;
                                    deobmatch('try_ping', s);
                                } else if (deobfunc.abbr.match(/Your team was destroyed/)) {
                                    unsafeWindow.team_destroyed = s;
                                    deobmatch('team_destroyed', s);
                                } else if (deobfunc.abbr.match(/^function ?\(\){3==this\.@\.readyState&&\(this\.timeout_server-=@\.TIMEOUT_SERVER\)}$/)) {
                                    unsafeWindow.check_state = s;
                                    deobmatch('check_state', s);
                                } else if (deobfunc.abbr.match(/@-this\.timeout_server>@\.TIMEOUT_SERVER&&\(this\.timeout_server=@,this\.lost\(\)\)}$/)) {
                                    unsafeWindow.check_pong = s;
                                    deobmatch('check_pong', s);
                                } else if (deobfunc.abbr.match(/^function ?\(\){var [a-z]=ui\.@\.id\.selectedIndex/)) {
                                    unsafeWindow.connect_timeout = s;
                                    deobmatch('connect_timeout', s);
                                }
                            } else if (unsafeWindow[client][s].length === 1) {
                                if (deobfunc.abbr.match(/\.stringify\(\[7,/)) {
                                    unsafeWindow.select_craft = s;
                                    deobmatch('select_craft', s);
                                } else if (deobfunc.abbr.match(/^function ?\([a-z]\){@\.@\[user\.uid\]\.text=[a-z];this\.@\[@\]\(@\[@\]\.stringify\(\[0,[a-z]\]\)\)}$/)) {
                                    unsafeWindow.send_chat = s;
                                    deobmatch('send_chat', s);
                                } else if (deobfunc.abbr.match(/function ?\([a-z]\){[a-z]==INV\.BAG\?/)) {
                                    unsafeWindow.build_stop = s;
                                    deobmatch('build_stop', s);
                                } else if (deobfunc.abbr.match(/user\.craft\.do_craft\([a-z]\)/)) {
                                    unsafeWindow.build_ok = s;
                                    deobmatch('build_ok', s);
                                } else if (deobfunc.abbr.match(/{var [a-z]=[a-z]\[1\],[a-z]=@\.@;[a-z]\[[a-z]\]\.nickname=[a-z]\[2\];/)) {
                                    unsafeWindow.new_player = s;
                                    deobmatch('new_player', s);
                                } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[21,[a-z]\]\)\);user\.shop\.open/)) {
                                    unsafeWindow.send_survivalkit = s;
                                    deobmatch('send_survivalkit', s);
                                } else if (deobfunc.abbr.match(/user\.inv\.max>user\.inv\.can_select\.length;[a-z]\+\+/)) {
                                    unsafeWindow.survival_kit = s;
                                    deobmatch('survival_kit', s);
                                } else if (deobfunc.abbr.match(/{game\.quests\.modify\([a-z],2\)}$/)) {
                                    unsafeWindow.succeed_quest = s;
                                    deobmatch('succeed_quest', s);
                                } else if (deobfunc.abbr.match(/{game\.quests\.modify\([a-z],0\)}$/)) {
                                    unsafeWindow.quest_update = s;
                                    deobmatch('quest_update', s);
                                } else if (deobfunc.abbr.match(/^function ?\([a-z]\){user\.gauges\.l=[a-z]\/100}$/)) {
                                    unsafeWindow.gauge_life = s;
                                    deobmatch('gauge_life', s);
                                } else if (deobfunc.abbr.match(/^function ?\([a-z]\){user\.gauges\.t=[a-z]\/100}$/)) {
                                    unsafeWindow.gauge_thirst = s;
                                    deobmatch('gauge_thirst', s);
                                } else if (deobfunc.abbr.match(/^function ?\([a-z]\){user\.gauges\.h=[a-z]\/100}$/)) {
                                    unsafeWindow.gauge_hunger = s;
                                    deobmatch('gauge_hunger', s);
                                } else if (deobfunc.abbr.match(/{@\.time=[a-z];@\.transition=!0;audio\.transition=1}/)) {
                                    unsafeWindow.get_time = s;
                                    deobmatch('get_time', s);
                                } else if (deobfunc.abbr.match(/@\.mode==@\.MODE_HUNGER_GAMES&&'spectator'!==@\.@\[[a-z]\]\.nickname/)) {
                                    unsafeWindow.kill_player = s;
                                    deobmatch('kill_player', s);
                                } else if (deobfunc.abbr.match(/function ?\([a-z]\){[a-z]=new Uint16Array\([a-z]\);player\.cam\.change/)) {
                                    unsafeWindow.set_cam = s;
                                    deobmatch('set_cam', s);
                                } else if (deobfunc.abbr.match(/new Uint16Array\([a-z]\);user\.cam\.change/)) {
                                    unsafeWindow.recover_focus = s;
                                    deobmatch('recover_focus', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[23,/)) {
                                    unsafeWindow.take_flour = s;
                                    deobmatch('take_flour', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[9,[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                    unsafeWindow.take_chest = s;
                                    deobmatch('take_chest', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[15,[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                    unsafeWindow.unlock_chest= s;
                                    deobmatch('unlock_chest', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[16,[a-z]\.iid\]\)\)}/)) {
                                    unsafeWindow.lock_chest= s;
                                    deobmatch('lock_chest', s);
                                } else if (deobfunc.abbr.match(/This is not the right tool/)) {
                                    unsafeWindow.dont_harvest = s;
                                    deobmatch('dont_harvest', s);
                                } else if (deobfunc.abbr.match(/^function ?\([a-z]\){user\.craft\.preview=-1;/)) {
                                    unsafeWindow.accept_build = s;
                                    deobmatch('accept_build', s);
                                } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[4,Math\.floor/)) {
                                    unsafeWindow.send_attack = s;
                                    deobmatch('send_attack', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[3,/)) {
                                    unsafeWindow.send_angle = s;
                                    deobmatch('send_angle', s);
                                } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[2,[a-z]\]\)\)}$/)) {
                                    unsafeWindow.send_move = s;
                                    deobmatch('send_move', s);
                                } else if (deobfunc.abbr.match(/function ?\([a-z]\){var [a-z]=player\.select\.units;if\(0!=[a-z]\.length\){var [a-z]=\[2\],[a-z]=\[\];/)) {
                                    unsafeWindow.move_units = s;
                                    deobmatch('move_units', s);
                                } else if (deobfunc.abbr.match(/You joined a team/)) {
                                    unsafeWindow.join_team = s;
                                    deobmatch('join_team', s);
                                } else if (deobfunc.abbr.match(/ joined the team/)) {
                                    unsafeWindow.joined_team = s;
                                    deobmatch('joined_team', s);
                                } else if (deobfunc.abbr.match(/You left the team/)) {
                                    unsafeWindow.left_team = s;
                                    deobmatch('left_team', s);
                                } else if (deobfunc.abbr.match(/Someone stole your token/)) {
                                    unsafeWindow.steal_token = s;
                                    deobmatch('steal_token', s);
                                } else if (deobfunc.abbr.match(/function ?\([a-z]\){___adsvid\+\+;clearTimeout\(this\.@\);/)) {
                                    unsafeWindow.handshake = s;
                                    deobmatch('handshake', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[27,/)) {
                                    // What is this for?
                                    unsafeWindow.unknown = s;
                                    deobmatch('unknown', s);
                                }
                            } else if (unsafeWindow[client][s].length === 2) {
                                if (deobfunc.abbr.split('case INV').length > 80) {
                                    unsafeWindow.select_inv = s;
                                    deobmatch('select_inv', s);
                                } else if (deobfunc.abbr.match(/{for\(var [a-z]=new Uint16Array\([a-z]\),[a-z]=\([a-z]\.length-2\)\/4,[a-z]=0;/)) {
                                    unsafeWindow.hitten_other = s;
                                    deobmatch('hitten_other', s);
                                } else if (deobfunc.abbr.match(/\.stringify\(\[22,/)) {
                                    unsafeWindow.resurrection2 = s;
                                    deobmatch('resurrection2', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[12,[a-z],[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                    unsafeWindow.give_wood = s;
                                    deobmatch('give_wood', s);
                                } else if (deobfunc.abbr.match(/user\.inv\.decrease\([a-z],[a-z],user\.inv\.find_item\([a-z]\)\);/)) {
                                    unsafeWindow.decrease_item = s;
                                    deobmatch('decrease_item', s);
                                } else if (deobfunc.abbr.match(/user\.inv\.delete_item\([a-z],[a-z]\)/)) {
                                    unsafeWindow.delete_inv = s;
                                    deobmatch('delete_inv', s);
                                }
                            } else if (unsafeWindow[client][s].length === 3) {
                                if (deobfunc.abbr.match(/\.stringify\(\[25,[a-z],[a-z]\.pid,[a-z]\.iid\]\)\);/)) {
                                    unsafeWindow.give_breadoven = s;
                                    deobmatch('give_breadoven', s);
                                } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[8,[a-z],[a-z],[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                    unsafeWindow.give_item = s;
                                    deobmatch('give_item', s);
                                } else if (deobfunc.abbr.match(/game\.market\.open&&game\.market\.update_breads/)) {
                                    unsafeWindow.decrease_item2 = s;
                                    deobmatch('decrease_item2', s);
                                }
                            } else if (unsafeWindow[client][s].length === 4) {
                            } else if (unsafeWindow[client][s].length === 5) {
                            } else {
                            }
                        }
                    } else if (typeof unsafeWindow[client][s] === 'number') {
                        if (unsafeWindow[client][s] === 0) {
                            if ((typeof unsafeWindow[client].lost !== 'undefined' && deobfuscate_func(unsafeWindow[client].lost.toString()).orig.indexOf('user.reconnect.enabled=!0;this.' + s + '==this.') > -1) ||
                                (typeof unsafeWindow[client].kick !== 'undefined' && deobfuscate_func(unsafeWindow[client].kick.toString()).orig.indexOf('this.' + s + '==this.') > -1) ||
                                (typeof unsafeWindow[client].kick !== 'undefined' && deobfuscate_func(unsafeWindow[client].lost.toString()).orig.indexOf('this.' + s + '==this.') > -1) ||
                                (typeof unsafeWindow[client].kick !== 'undefined' && deobfuscate_func(unsafeWindow[client].killed.toString()).orig.indexOf('this.' + s + '==this.') > -1)
                                ) {
                                    unsafeWindow._current_id = s;
                                    deobmatch('_current_id', s);
                            }
                        }
                    } else if (typeof unsafeWindow[client][s] === 'object') {
                        if (unsafeWindow[client][s] === null) {
                            var deobfunc = deobfuscate_func(unsafeWindow[Client].toString());
                            if (deobfunc.orig.split(s).length > 50) {
                                unsafeWindow.socket = s;
                                deobmatch('socket', s);
                            } else if (deobfunc.orig.split(new RegExp('clearTimeout\\([^.]*\.' + s + '\\);')).length >= 8) {
                                unsafeWindow.connect_timer = s;
                                deobmatch('connect_timer', s);
                            }
                        } else if (Array.isArray(unsafeWindow[client][s])) {
                                unsafeWindow.server_list = s;
                                deobmatch('server_list', s);
                        } else if (typeof unsafeWindow[client][s].hasOwnProperty !== 'undefined') {
                            if (unsafeWindow[client][s].hasOwnProperty('i') && unsafeWindow[client][s].hasOwnProperty('j')) {
                                unsafeWindow.last_cam = s;
                                deobmatch('last_cam', s);
                            }
                        }
                    } else if (typeof unsafeWindow[client][s] === 'string') {
                    } else if (typeof unsafeWindow[client][s] === 'undefined') {
                    }
                });
            }

            if (typeof CRAFT === 'object') {
                Object.keys(unsafeWindow.CRAFT).forEach(function(s) {
                    if (typeof unsafeWindow.CRAFT[s] === 'number') {
                    }
                });
            }

            if (typeof game === 'object') {
                Object.keys(unsafeWindow.game).forEach(function(s) {
                    if (typeof unsafeWindow.game[s] === 'boolean') {
                    } else if (typeof unsafeWindow.game[s] === 'function') {
                        if ((/\{\s*\[native code\]\s*\}/).test('' + unsafeWindow.game[s])) { } // ignore native functions
                        else {
                            var deobfunc = deobfuscate_func(unsafeWindow.game[s].toString());
                            if (deobfunc.abbr.match(/draw_ui_gear/)) {
                                unsafeWindow.draw_UI = s;
                                deobmatch('draw_UI', s);
                            } else if (deobfunc.abbr.match(/this\.chest_lockpick\.info\.translate\.y/)) {
                                unsafeWindow.update_inv_buttons = s;
                                deobmatch('update_inv_buttons', s);
                            } else if (deobfunc.abbr.match(/82===[a-z]\.keyCode/)) {
                                unsafeWindow.trigger_keyup = s;
                                deobmatch('trigger_keyup', s);
                            }
                        }
                    } else if (typeof unsafeWindow.game[s] === 'number') {
                    } else if (typeof unsafeWindow.game[s] === 'object') {
                        if (unsafeWindow.game[s] === null) {
                        } else if (Array.isArray(unsafeWindow.game[s])) {
                            if (unsafeWindow.game[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.game[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.game[s].some(isNaN)) {
                            } else if (unsafeWindow.game[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.game[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.game[s] === 'string') {
                    } else if (typeof unsafeWindow.game[s] === 'undefined') {
                    }
                });
            }

            if (typeof INV === 'object') {
                Object.keys(unsafeWindow.INV).forEach(function(s) {
                    if (typeof unsafeWindow.INV[s] === 'number') {
                    }
                });
            }

            if (typeof ITEMS === 'object') {
                Object.keys(unsafeWindow.ITEMS).forEach(function(s) {
                    if (typeof unsafeWindow.ITEMS[s] === 'number') {
                    }
                });
            }

            if (typeof keyboard === 'object') {
                Object.keys(unsafeWindow.keyboard).forEach(function(s) {
                    if (typeof unsafeWindow.keyboard[s] === 'boolean') {
                    } else if (typeof unsafeWindow.keyboard[s] === 'function') {
                    } else if (typeof unsafeWindow.keyboard[s] === 'number') {
                    } else if (typeof unsafeWindow.keyboard[s] === 'object') {
                        if (unsafeWindow.keyboard[s] === null) {
                        } else if (Array.isArray(unsafeWindow.keyboard[s])) {
                            if (unsafeWindow.keyboard[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.keyboard[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.keyboard[s].some(isNaN)) {
                            } else if (unsafeWindow.keyboard[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.keyboard[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.keyboard[s] === 'string') {
                    } else if (typeof unsafeWindow.keyboard[s] === 'undefined') {
                    }
                });
            }

            if (typeof loader === 'object') {
                Object.keys(unsafeWindow.loader).forEach(function(s) {
                    if (typeof unsafeWindow.loader[s] === 'boolean') {
                    } else if (typeof unsafeWindow.loader[s] === 'function') {
                    } else if (typeof unsafeWindow.loader[s] === 'number') {
                    } else if (typeof unsafeWindow.loader[s] === 'object') {
                        if (unsafeWindow.loader[s] === null) {
                        } else if (Array.isArray(unsafeWindow.loader[s])) {
                            if (unsafeWindow.loader[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.loader[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.loader[s].some(isNaN)) {
                            } else if (unsafeWindow.loader[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.loader[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.loader[s] === 'string') {
                    } else if (typeof unsafeWindow.loader[s] === 'undefined') {
                    }
                });
            }

            if (typeof RECIPE_CATEGORIES === 'object') {
                Object.keys(unsafeWindow.RECIPE_CATEGORIES).forEach(function(s) {
                    if (typeof unsafeWindow.RECIPE_CATEGORIES[s] === 'number') {
                    }
                });
            }

            if (typeof scoreboard === 'object') {
                Object.keys(unsafeWindow.scoreboard).forEach(function(s) {
                    if (typeof unsafeWindow.scoreboard[s] === 'boolean') {
                    } else if (typeof unsafeWindow.scoreboard[s] === 'function') {
                    } else if (typeof unsafeWindow.scoreboard[s] === 'number') {
                    } else if (typeof unsafeWindow.scoreboard[s] === 'object') {
                        if (unsafeWindow.scoreboard[s] === null) {
                        } else if (Array.isArray(unsafeWindow.scoreboard[s])) {
                            if (unsafeWindow.scoreboard[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.scoreboard[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.scoreboard[s].some(isNaN)) {
                            } else if (unsafeWindow.scoreboard[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.scoreboard[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.scoreboard[s] === 'string') {
                    } else if (typeof unsafeWindow.scoreboard[s] === 'undefined') {
                    }
                });
            }

            if (typeof SPRITE === 'object') {
                Object.keys(unsafeWindow.SPRITE).forEach(function(s) {
                    if (typeof unsafeWindow.SPRITE[s] === 'object') {
                        if (Array.isArray(unsafeWindow.SPRITE[s])) {
                            if (unsafeWindow.SPRITE[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.SPRITE[s].some(isNaN)) {
                                // Every item is coercible to a number
                            }
                        }
                    } else if (typeof unsafeWindow.SPRITE[s] === 'number') {
                        if (INV.hasOwnProperty(s) && INV_INFO.hasOwnProperty(INV[s])) {
                            if (INV_INFO[INV[s]].name === 'Berries bush') {
                                SPRITE.SEED = SPRITE[s];
                                deobmatch('SEED', s);
                                // Also fill in for SPRITE.WINDMILL_WHEAT_SEED : Too expensive to identify separately
                                SPRITE.WINDMILL_WHEAT_SEED = SPRITE['WINDMILL_WHEAT_' + s];
                                deobmatch('WINDMILL_WHEAT_SEED', 'WINDMILL_WHEAT_' + s);
                                // Also fill in for SPRITE.CHEST_SEED, SPRITE.CRAFT_SEED, and SPRITE.INV_SEED
                                SPRITE.CHEST_SEED = SPRITE['CHEST_' + s];
                                deobmatch('CHEST_SEED', 'CHEST_' + s);
                                SPRITE.CRAFT_SEED = SPRITE['CRAFT_' + s];
                                deobmatch('CRAFT_SEED', 'CRAFT_' + s);
                                SPRITE.INV_SEED = SPRITE['INV_' + s];
                                deobmatch('INV_SEED', 'INV_' + s);
                                // Also fill in for SPRITE.CHEST_WHEAT_SEED, SPRITE.CRAFT_WHEAT_SEED, and SPRITE.INV_WHEAT_SEED
                                SPRITE.CHEST_WHEAT_SEED = SPRITE['CHEST_WHEAT_' + s];
                                deobmatch('CHEST_WHEAT_SEED', 'CHEST_WHEAT_' + s);
                                SPRITE.CRAFT_WHEAT_SEED = SPRITE['CRAFT_WHEAT_' + s];
                                deobmatch('CRAFT_WHEAT_SEED', 'CRAFT_WHEAT_' + s);
                                SPRITE.INV_WHEAT_SEED = SPRITE['INV_WHEAT_' + s];
                                deobmatch('INV_WHEAT_SEED', 'INV_WHEAT_' + s);
                            } else if (INV_INFO[INV[s]].name === 'Hood') {
                                SPRITE.HOOD = SPRITE[s];
                                deobmatch('HOOD', s);
                                // Also fill in for INV.HOOD
                                INV.HOOD = INV[s];
                                // Also fill in for SPRITE.CHEST_HOOD, SPRITE.CRAFT_HOOD, SPRITE.GLOVES_HOOD, and SPRITE.INV_HOOD
                                SPRITE.CHEST_HOOD = SPRITE['CHEST_' + s];
                                deobmatch('CHEST_WINTER_HOOD', 'CHEST_' + s);
                                SPRITE.CRAFT_HOOD = SPRITE['CRAFT_' + s];
                                deobmatch('CRAFT_HOOD', 'CRAFT_' + s);
                                SPRITE.GLOVES_HOOD = SPRITE['GLOVES_' + s];
                                deobmatch('GLOVES_HOOD', 'GLOVES_' + s);
                                SPRITE.INV_HOOD = SPRITE['INV_' + s];
                                deobmatch('INV_HOOD', 'INV_' + s);
                            } else if (INV_INFO[INV[s]].name === 'Wheat') {
                                SPRITE.WHEAT_SEED = SPRITE[s];
                                deobmatch('WHEAT_SEED', s);
                            } else if (INV_INFO[INV[s]].name === 'Winter hood') {
                                SPRITE.WINTER_HOOD = SPRITE[s];
                                deobmatch('WINTER_HOOD', s);
                                // Also fill in for INV.WINTER_HOOD
                                INV.WINTER_HOOD = INV[s];
                                // Also fill in for SPRITE.CHEST_WINTER_HOOD, SPRITE.CRAFT_WINTER_HOOD, SPRITE.GLOVES_WINTER_HOOD, and SPRITE.INV_WINTER_HOOD
                                SPRITE.CHEST_WINTER_HOOD = SPRITE['CHEST_' + s];
                                deobmatch('CHEST_WINTER_HOOD', 'CHEST_' + s);
                                SPRITE.CRAFT_WINTER_HOOD = SPRITE['CRAFT_' + s];
                                deobmatch('CRAFT_WINTER_HOOD', 'CRAFT_' + s);
                                SPRITE.GLOVES_WINTER_HOOD = SPRITE['GLOVES_' + s];
                                deobmatch('GLOVES_WINTER_HOOD', 'GLOVES_' + s);
                                SPRITE.INV_WINTER_HOOD = SPRITE['INV_' + s];
                                deobmatch('INV_WINTER_HOOD', 'INV_' + s);
                            }
                        } else if (deobfuscate_func(unsafeWindow[draw_gauges].toString()).orig.match(new RegExp(s + '\\],[a-z],[a-z]\\)\\)}$'))) {
                            SPRITE.OLD_GAUGES = SPRITE[s];
                            deobmatch('OLD_GAUGES', s);
                        } else if (deobfuscate_func(unsafeWindow[draw_seed].toString()).orig.match(new RegExp('\\.' + s + '\\]\\['))) {
                            SPRITE.PLANT_SEED = SPRITE[s];
                            deobmatch('PLANT_SEED', s);
                        } else if (deobfuscate_func(draw_wheat.toString()).orig.match(new RegExp('var [a-z]=this\\.info&16\\?sprite\\[[^[]*\\.' + s + '\\]\\[[^.]*\.time\\]:'))) {
                            SPRITE.WHEAT_SEED_DRIED = SPRITE[s];
                            deobmatch('WHEAT_SEED_DRIED', s);
                        } else if (deobfuscate_func(unsafeWindow[draw_resurrection].toString()).orig.match(new RegExp('rotate1\\);img=sprite\\[[^.]*.' + s + '\\]\\[[^.]*\.time\\];'))) {
                            SPRITE.RESURRECTION_ROTATE = SPRITE[s];
                            deobmatch('RESURRECTION_ROTATE', s);
                        } else if (deobfuscate_func(world[move_units].toString()).orig.match(new RegExp('b\.y<[^.]*.' + s + '&&b\.x'))) {
                            SPRITE.CAVE_MAX_Y = SPRITE[s];
                            deobmatch('CAVE_MAX_Y', s);
                        } else if (deobfuscate_func(world[move_units].toString()).orig.match(new RegExp('b\\.x>[^.]*\\.' + s + '\\?[a-zA-Z]='))) {
                            SPRITE.CAVE_MIN_X = SPRITE[s];
                            deobmatch('CAVE_MIN_X', s);
                        } else if (deobfuscate_func(world[move_units].toString()).orig.match(new RegExp(s + '\\|\\|MAP\\.tiles'))) {
                            SPRITE.BEACH_MIN_X = SPRITE[s];
                            deobmatch('BEACH_MIN_X', s);
                        }
                    }
                });
            }

            if (typeof STATE === 'object') {
                Object.keys(unsafeWindow.STATE).forEach(function(s) {
                    if (typeof unsafeWindow.STATE[s] === 'number') {
                        if (unsafeWindow.STATE[s] === 16) {
                            STATE.ATTACK = STATE[s];
                            deobmatch('ATTACK', s);
                            // Also fill in for CLIENT.ATTACK and WORLD.SPEED_ATTACK
                            CLIENT.ATTACK = CLIENT[s];
                            WORLD.SPEED_ATTACK = WORLD['SPEED_'+s];
                        }
                    }
                });
            }

            if (typeof ui === 'object') {
                Object.keys(unsafeWindow.ui).forEach(function(s) {
                    if (typeof unsafeWindow.ui[s] === 'boolean') {
                    } else if (typeof unsafeWindow.ui[s] === 'function') {
                        if ((/\{\s*\[native code\]\s*\}/).test('' + unsafeWindow.ui[s])) { } // ignore native functions
                        else {
                            var deobfunc = deobfuscate_func(unsafeWindow.ui[s].toString());
                            if (deobfunc.abbr.match(/Cookies\.set\(.starve_mapping.,.azerty.\)/)) {
                                unsafeWindow.ui.set_azerty = ui[s];
                                deobmatch('set_azerty', s);
                            } else if (deobfunc.abbr.match(/Cookies\.set\(.starve_mapping.,.qwerty.\)/)) {
                                unsafeWindow.ui.set_qwerty = ui[s];
                                deobmatch('set_qwerty', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z]\){@\((this|[a-z])\.can,[a-z]\)}$/)) { // v15 2 matches
                                if (deobfuscate_func(unsafeWindow.UI.toString()).orig.split(new RegExp('EventListener\\(\'mousedown\',this\.' + s)).length > 1) {
                                    unsafeWindow.ui.trigger_mousedown = ui[s];
                                    deobmatch('trigger_mousedown', s);
                                    // Populate duplicates
                                    game.trigger_mousedown = game[s];
                                } else if (deobfuscate_func(unsafeWindow.UI.toString()).orig.split(new RegExp('EventListener\\(\'mouseup\',this\.' + s)).length > 1) {
                                    unsafeWindow.ui.trigger_mouseup = ui[s];
                                    deobmatch('trigger_mouseup', s);
                                    // Populate duplicates
                                    game.trigger_mouseup = game[s];
                                }
                            } else if (deobfunc.abbr.match(/^function ?\([a-z]\){@\((this|[a-z])\.can,[a-z]\);[a-z]\.style\.cursor=.auto.}$/)) {
                                unsafeWindow.ui.trigger_mousemove = ui[s];
                                deobmatch('trigger_mousemove', s);
                                // Populate duplicates
                                game.trigger_mousemove = game[s];
                            } else if (deobfunc.abbr.match(/window\.addEventListener/)) {
                                unsafeWindow.ui.add_event_listener = ui[s];
                                deobmatch('add_event_listener', s);
                                // Populate duplicates
                                game.add_event_listener = game[s];
                            } else if (deobfunc.abbr.match(/window\.removeEventListener/)) {
                                unsafeWindow.ui.remove_event_listener = ui[s];
                                deobmatch('remove_event_listener', s);
                                // Populate duplicates
                                game.remove_event_listener = game[s];
                            }
                        }
                    } else if (typeof unsafeWindow.ui[s] === 'number') {
                    } else if (typeof unsafeWindow.ui[s] === 'object') {
                        if (unsafeWindow.ui[s] === null) {
                        } else if (Array.isArray(unsafeWindow.ui[s])) {
                            if (unsafeWindow.ui[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.ui[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.ui[s].some(isNaN)) {
                            } else if (unsafeWindow.ui[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.ui[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.ui[s] === 'string') {
                    } else if (typeof unsafeWindow.ui[s] === 'undefined') {
                    }
                });
            }

            if (typeof user === 'object') {
                Object.keys(unsafeWindow.user).forEach(function(s) {
                    if (typeof unsafeWindow.user[s] === 'boolean') {
                    } else if (typeof unsafeWindow.user[s] === 'function') {
                    } else if (typeof unsafeWindow.user[s] === 'number') {
                    } else if (typeof unsafeWindow.user[s] === 'object') {
                        if (unsafeWindow.user[s] === null) { } //ignore
                        else if (Array.isArray(unsafeWindow.user[s])) {
                            if (unsafeWindow.user[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!unsafeWindow.user[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (unsafeWindow.user[s].some(isNaN)) {
                            } else if (unsafeWindow.user[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof unsafeWindow.user[s].hasOwnProperty !== 'undefined') {
                            if ((unsafeWindow.user[s].hasOwnProperty('enabled') || unsafeWindow.user[s].hasOwnProperty('invert') || unsafeWindow.user[s].hasOwnProperty('translate'))
                                && !unsafeWindow.user[s].hasOwnProperty('can') && !unsafeWindow.user[s].hasOwnProperty('delay') && !unsafeWindow.user[s].hasOwnProperty('draw')
                                && !unsafeWindow.user[s].hasOwnProperty('ids') && !unsafeWindow.user[s].hasOwnProperty('init') && !unsafeWindow.user[s].hasOwnProperty('label')
                                && !unsafeWindow.user[s].hasOwnProperty('now') && !unsafeWindow.user[s].hasOwnProperty('rotate') && !unsafeWindow.user[s].hasOwnProperty('sort')
                                && !unsafeWindow.user[s].hasOwnProperty('update')
                                ) {
                                    unsafeWindow.spectators = s;
                                    deobmatch('spectators', s);
                            }
                        }
                    } else if (typeof unsafeWindow.user[s] === 'string') {
                    } else if (typeof unsafeWindow.user[s] === 'undefined') {
                    }
                });
            }

            if (typeof Utils === 'object') {
                Object.keys(unsafeWindow.Utils).forEach(function(s) {
                    if (typeof unsafeWindow.Utils[s] === 'function') {
                        if ((/\{\s*\[native code\]\s*\}/).test('' + unsafeWindow.Utils[s])) { } // ignore native functions
                        else {
                            var deobfunc = deobfuscate_func(unsafeWindow.Utils[s].toString());
                            if (deobfunc.abbr.match(/^function ?\([a-z]\){window\.open\([a-z],'_blank'\)\.focus\(\)}$/)) {
                                unsafeWindow.Utils.open_in_new_tab = Utils[s];
                                deobmatch('open_in_new_tab', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z]\){return{x:[a-z]\.x-[a-z]\.x,y:[a-z]\.y-[a-z]\.y}}$/)) {
                                unsafeWindow.Utils.get_vector = Utils[s];
                                deobmatch('get_vector', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z]\){return [a-z]\.x\*[a-z]\.x\+[a-z]\.y\*[a-z]\.y}$/)) {
                                unsafeWindow.Utils.scalar_product = Utils[s];
                                deobmatch('scalar_product', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z]\){return [a-z]\.x\*[a-z]\.y-[a-z]\.y\*[a-z]\.x}$/)) {
                                unsafeWindow.Utils.cross_product = Utils[s];
                                deobmatch('cross_product', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z]\){return Math\.acos/)) {
                                unsafeWindow.Utils.get_angle = Utils[s];
                                deobmatch('get_angle', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z], ?[a-z]\){return this\.@\({x:1,y:0\},this\.@\([a-z],[a-z]\)\)}$/)) {
                                unsafeWindow.Utils.get_std_angle = Utils[s];
                                deobmatch('get_std_angle', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z],[a-z]\){[a-z]\.x\+=[a-z];[a-z]\.y\+=[a-z]}$/)) {
                                unsafeWindow.Utils.translate_vector = Utils[s];
                                deobmatch('translate_vector', s);
                            } else if (deobfunc.abbr.match(/^function ?\(\){return\.5<Math\.random\(\)\?1:-1}$/)) {
                                unsafeWindow.Utils.rand_sign = Utils[s];
                                deobmatch('rand_sign', s);
                            } else if (deobfunc.abbr.match(/2E4/)) {
                                unsafeWindow.Utils.restore_number = Utils[s];
                                deobmatch('restore_number', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z]\){if\(1E4<=/)) {
                                unsafeWindow.Utils.simplify_number= Utils[s];
                                deobmatch('simplify number', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z]\){return [a-z]\*\(2-[a-z]\)}$/)) {
                                unsafeWindow.Utils.ease_out_quad= Utils[s];
                                deobmatch('ease_out_quad', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z],[a-z],[a-z],[a-z],[a-z]\){this\.o=/)) {
                                unsafeWindow.Utils.LinearAnimation= Utils[s];
                                deobmatch('LinearAnimation', s);
                            } else if (deobfunc.abbr.match(/fromCharCode/)) {
                                unsafeWindow.Utils.rand_string = Utils[s];
                                deobmatch('rand_string', s);
                            } else if (deobfunc.abbr.match(/^function ?\([a-z],[a-z]\){return [a-z]\.x>=[a-z]\.x&&[a-z]\.x<=[a-z]\.x\+[a-z]\.w/)) {
                                unsafeWindow.Utils.contains = Utils[s];
                                deobmatch('contains', s);
                            }
                        }
                    }
                });
            }

            if (typeof WORLD === 'object') {
                Object.keys(unsafeWindow.WORLD).forEach(function(s) {
                    if (typeof unsafeWindow.WORLD[s] === 'number') {
                    }
                });
            }

            if (typeof world === 'object') {
                Object.keys(unsafeWindow.world).forEach(function(s) {
                    if (typeof unsafeWindow.world[s] === 'boolean') {
                    } else if (typeof unsafeWindow.world[s] === 'function') {
                    } else if (typeof unsafeWindow.world[s] === 'number') {
                    } else if (typeof unsafeWindow.world[s] === 'object') {
                        if (unsafeWindow.world[s] === null) {
                        } else if (Array.isArray(unsafeWindow.world[s])) {
                            if (deobfuscate_func(unsafeWindow.draw_team_buttons.toString()).orig.split(s).length === 2) {
                                unsafeWindow.fast_units = s;
                                deobmatch('fast_units', s);
                            } else if (typeof audio[s] !== 'undefined') {
                                unsafeWindow.players = s;
                                deobmatch('players', s);
                            } else if (unsafeWindow.world[s].every(function(i) { return !Array.isArray(i); })) {
                            }
                        } else if (typeof unsafeWindow.world[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof unsafeWindow.world[s] === 'string') {
                    } else if (typeof unsafeWindow.world[s] === 'undefined') {
                    }
                });
            }
        } else if (stage === 3) {
            // Then detect remaining properties of global variables

            if (typeof client === 'string' && typeof unsafeWindow[client] === 'object') {
                Object.keys(unsafeWindow[client]).forEach(function(s) {
                    if (typeof unsafeWindow[client][s] === 'number') {
                        if (unsafeWindow[client][s] === 0) {
                            if ((typeof unsafeWindow.update_cam !== 'undefined' && deobfuscate_func(unsafeWindow[client][update_cam].toString()).orig.indexOf(s) > -1)) {
                                unsafeWindow.cam_delay = s;
                                deobmatch('cam_delay', s);
                            } else if ((typeof unsafeWindow.try_ping !== 'undefined' && deobfuscate_func(unsafeWindow[client][try_ping].toString()).orig.indexOf(s) > -1)) {
                                unsafeWindow.ping_delay = s;
                                deobmatch('ping_delay', s);
                            }
                        }
                    }
                });
            }
        } else if (stage === 4) {
            // Then check if anything was missed

            Object.keys(unsafeWindow).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    if (unsafeWindow[s] === unsafeWindow) {} // ignore
                    else if (unsafeWindow[s] === 10000) {} // ignore
                    else if (typeof unsafeWindow[s] === 'string' && unsafeWindow[s].match(/^[0-9a-zA-Z_-]*$/)) { } // ignore
                    else {
                        // Useful for seeing what's missing
                        console.log(['missing',s,unsafeWindow[s]]); // v15 nothing missing
                    }
                }
            });

            Object.keys(CLIENT).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in CLIENT',s,CLIENT[s]]);
                }
            });

            Object.keys(unsafeWindow[client]).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in client',s,unsafeWindow[client][s]]); // v15 nothing missing
                }
            });

            Object.keys(CRAFT).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in CRAFT',s,CRAFT[s]]);
                }
            });

            Object.keys(game).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in game',s,game[s]]);
                }
            });

            Object.keys(INV).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in INV',s,INV[s]]);
                }
            });

            Object.keys(ITEMS).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in ITEMS',s,ITEMS[s]]);
                }
            });

            Object.keys(keyboard).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in keyboard',s,keyboard[s]]);
                }
            });

            Object.keys(loader).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in loader',s,loader[s]]); // v15 nothing missing
                }
            });

            Object.keys(RECIPE_CATEGORIES).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in RECIPE_CATEGORIES',s,RECIPE_CATEGORIES[s]]);
                }
            });

            Object.keys(scoreboard).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in scoreboard',s,scoreboard[s]]); // v15 nothing missing
                }
            });

            Object.keys(SPRITE).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in SPRITE',s,SPRITE[s]]); // v15 nothing missing
                }
            });

            Object.keys(STATE).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in STATE',s,STATE[s]]); // v15 nothing missing
                }
            });

            Object.keys(ui).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in ui',s,ui[s]]); // v15 nothing missing
                }
            });

            Object.keys(user).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    if (user[s].hasOwnProperty('amount_bread') ||
                        user[s].hasOwnProperty('amount_flour') ||
                        user[s].hasOwnProperty('amount_wood') ||
                        user[s].hasOwnProperty('iid') ||
                        user[s].hasOwnProperty('open') ||
                        user[s].hasOwnProperty('pid')) {
                            unsafeWindow.breadoven = s;
                            deobmatch('breadoven', s);
                    } else {
                        console.log(['missing in user',s,user[s]]); // v15 nothing missing
                    }
                }
            });

            Object.keys(user.gauges).forEach(function(s) {
                if (typeof user.gauges[s] === 'object') {
                    if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                        if (deobfuscate_func(user.gauges.update.toString()).orig.indexOf('this.warn_hunger.update();this.' + s + '.update();') > -1) {
                            unsafeWindow.warn_thirst = s;
                            deobmatch('warn_thirst', s);
                        } else if (deobfuscate_func(user.gauges.update.toString()).orig.indexOf('this.' + s + '.update();this.cold.ease(this.c);') > -1) {
                            unsafeWindow.warn_old = s;
                            deobmatch('warn_old', s);
                        } else if (deobfuscate_func(user.gauges.update.toString()).orig.indexOf('this.' + s + '.ease(this.t)') > -1) {
                            unsafeWindow.thirst = s;
                            deobmatch('thirst', s);
                        } else if (deobfuscate_func(user.gauges.update.toString()).orig.indexOf('this.' + s + '.ease(this.o)') > -1) {
                            unsafeWindow.old = s;
                            deobmatch('old', s);
                        } else {
                            console.log(['missing in user.gauges',s,user.gauges[s]]); // v15 nothing missing
                        }
                    }
                }
            });

            Object.keys(user.ldb).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in user.ldb',s,user.ldb[s]]);
                }
            });

            Object.keys(Utils).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    console.log(['missing in Utils',s,Utils[s]]); // v15 nothing missing
                }
            });

            Object.keys(WORLD).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in WORLD',s,WORLD[s]]);
                }
            });

            Object.keys(world).forEach(function(s) {
                if (s.match(/.*ceilio[0-9]{3,6}.*/) && !deoblist.d2o.hasOwnProperty(s)) {
                    //console.log(['missing in world',s,world[s]]);
                }
            });
        }
    }

    function checkDependencies() {
        if (typeof GM_info !== 'undefined') {
            if (GM_info.hasOwnProperty('scriptHandler') && GM_info.scriptHandler === 'Tampermonkey') {
                if (GM_info.version < '4.5.5553') {
                    alert('Tampermonkey Beta v4.5.5553 or higher is required.');
                    return false;
                }
            }
        }

        if (typeof ui !== 'undefined' && typeof old_ui_run === 'undefined') {
            unsafeWindow.old_ui_run = unsafeWindow.ui.run;
            unsafeWindow.ui.run = function() {
                old_ui_run.apply(this);
                // Deobfuscate only first time user interface is run
                if (typeof unsafeWindow.deobauto === 'undefined') {
                    resetconsole();
                    unsafeWindow.deobauto = 'deobfuscating';
                    //deobfuscate();
                    }
            };
        } else {
            setTimeout(checkDependencies, 50);
        }
    }

    function deobfuscate() {
        // First detect OBFUSCATOR_ARR and OBFUSCATOR_FN to reference in next stage
        autodetect(0);
        // Then detect all global variables, constants and functions
        autodetect(1);
        // Then detect some properties that require reference to other properties for identification
        // Then detect most properties of global variables to reference in next stage
        autodetect(2);
        // Then detect remaining properties of global variables
        autodetect(3);
        // Then check if anything was missed
        autodetect(4);

        unsafeWindow.OBFUSCATOR_FN_INV = function(n) { for (var x=0; x<OBFUSCATED_ARR.length; x++) { if (OBFUSCATOR_FN(x) === n) return '0x'+x.toString(16); } };

        unsafeWindow.deobauto = '0.16.0';
    }

    unsafeWindow.deobfuscate_func = function(deobfunc) {
        // https://mathiasbynens.be/demo/javascript-identifier-regex
        deobfunc = deobfunc.replace(/\n/g, '').replace(/([,:]?)(\[?)_0x[0-9a-fA-F]{4}\("(0x[0-9a-fA-F]+)"\)([,\]]?)/g, function() {
            if (arguments[1].match(/[,:]/) || arguments[4] === ',' || (arguments[1] === '' && arguments[2] === '')) {
                return arguments[1] + arguments[2] + '\'' + OBFUSCATOR_FN(arguments[3]) + '\'' + arguments[4];
            }
            return (arguments[2] === '[' ? '.' : '\'') + OBFUSCATOR_FN(arguments[3]) + (arguments[4] === ']' ? '' : '\'');
        });
        if (typeof deobauto !== 'undefined') { // Slow, only use manually
            deobfunc = deobfunc.replace(/([[.]?)((?:[A-Za-z$_][A-Za-z0-9$_]*)*ceilio[0-9]{3,6}[A-Za-z0-9$_]*)(\]?)/g, function() {
                if (unsafeWindow.hasOwnProperty(arguments[2]) && typeof unsafeWindow[arguments[2]] === 'string') {
                    return '.' + unsafeWindow[arguments[2]];
                } else if (unsafeWindow.hasOwnProperty(arguments[2]) && unsafeWindow[arguments[2]] === unsafeWindow) {
                    return 'unsafeWindow';
                } else if (deoblist.d2o.hasOwnProperty(arguments[2])) {
                    if (arguments[1] === '.') {
                        arguments[1] = '[';
                        arguments[3] = ']';
                    }
                    return arguments[1] + deoblist.d2o[arguments[2]] + arguments[3];
                }
                return arguments[0];
            });
        }
        return {
            orig: deobfunc,
            abbr: deobfunc
                .replace(/[A-Za-z0-9_]*yolo[0-9]{3,}[A-Za-z0-9_]*/g, '@')
                .replace(/[A-Za-z0-9_]*Lapa[0-9]{3,}Mauve[A-Za-z0-9_]*/g, '@')
                .replace(/[A-Za-z0-9_]*O_O[0-9]{3,}0_0[A-Za-z0-9_]*/g, '@')
                .replace(/[A-Za-z0-9_]*ceilio[0-9]{3,}[A-Za-z0-9_]*/g, '@')
                .replace(/(ctx|[a-z@])\.restore\(\)/g, 'RESTORE') // v15 104 matches in all functions
                .replace(/(ctx|[a-z@])\.rotate\([a-z]*.angle\)/g, 'ROTATE') // v15 26 matches in all functions
                .replace(/(ctx|[a-z@])\.save\(\)/g, 'SAVE') // v15 104 matches in all functions
                .replace(/(ctx|@).translate\(user\.cam\.x\+this\.x,user\.cam.y\+this\.y\)/g, 'TUPT') // v15 21 matches in all functions
                // simplify init_fake_world
                .replace(/document\.getElementById\('game_body'\)\.style\.backgroundColor=@.GROUND\[@\.time\]/, 'IFWBGC') // v15 2 matches in all functions
        }
    };

    function deobmatch(name, deob) {
        if (deoblist.o2d.hasOwnProperty(deob)) {
            console.log(['duplicate', name, deob, unsafeWindow[deob]]);
            return true;
        } else {
            deoblist.d2o[deob] = name;
            deoblist.o2d[name] = deob;
            return false;
        }
    }

    function resetconsole() {
        var i = document.createElement('iframe');
        i.style.display = 'none';
        unsafeWindow.document.body.appendChild(i);
        Object.assign(console, i.contentWindow.console);
        Object.assign(unsafeWindow.console, i.contentWindow.console);
    }

    checkDependencies();
})();