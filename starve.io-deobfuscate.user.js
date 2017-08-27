// ==UserScript==
// ==UserScript==
// @name         Starve.io Deobfuscated Auto
// @namespace    http://tampermonkey.net/
// @version      0.15.11
// @description  Auto deobfuscation includes at least bare minimum for scripts to function normally
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// Compatible with version 15 of Starve.io client

(function() {
    'use strict';

    // Restore console.{debug,error,info,log,trace,warn}
    window.console = console;
    window.deoblist = { ob2deob: [], deob2ob: [] };

    // Performance tests
    // https://jsperf.com/isarray-two
    // https://jsperf.com/count-the-number-of-characters-in-a-string
    // https://jsperf.com/string-ocurrence-split-vs-match/2

    function autodetect(stage) {
        if (stage === 0) {
            // First detect OBFUSCATOR_ARR and OBFUSCATOR_FN to reference in next stage
            for (var s in window) {
                if (s === 'webkitStorageInfo') continue; // deprecated
                if (typeof window[s] === 'function') {
                    if (window[s].length === 2) {
                        if (window[s].toString().match(/^function \([a-z],[a-z]\){return _0x[a-z0-9]{4}\[[a-z]-0\]}$/)) {
                            window.OBFUSCATOR_FN = window[s];
                            deobmatch('OBFUSCATOR_FN', s);
                        }
                    }
                } else if (typeof window[s] === 'object') {
                    if (Array.isArray(window[s])) {
                        if (window[s].every(function(i) { return typeof i === "string" })) {
                            if (window[s].length > 100) {
                                window.OBFUSCATED_ARR = window[s];
                                deobmatch('OBFUSCATED_ARR', s);
                            }
                        }
                    }
                }
            }
        } else if (stage === 1) {
            // Then detect all global variables, constants and functions
            for (var s in window) { // v15 680-690 matches
                if (s === 'webkitStorageInfo') continue; // deprecated
                if (typeof window[s] === 'boolean') { // v15 6 matches
                } else if (typeof window[s] === 'function') { // v15 376 matches
                    var deobfunc = deobfuscate_func(window[s].toString());
                    if (window[s].length === 0) { // v15 83 matches
                        if (window[s].toString().match(/new XMLHttpRequest/)) { // v15 1 match
                            window.Client = s;
                            deobmatch('Client', s);
                        } else if (deobfunc.abbr.replace(/\n/g, '') === 'function @(){SAVE;TUPT;this.text&&(@.globalAlpha=this.chat.o?1-this.chat.v:1,this.label||(this.label=create_message(scale,this.text)),@.drawImage(this.label,-this.label.width/2,-this.label.height/2-110*scale),this.chat.update()&&0==this.chat.o&&(this.text="",this.label=null));RESTORE}') {
                                window.draw_chat = s;
                                deobmatch('draw_chat', s);
                        } else if (deobfunc.abbr.match(/[a-z]=sprite\[@\.DRAGON\]\[@\.time\];/)) {
                                window.draw_dragon = s;
                                deobmatch('draw_dragon', s);
                        } else if (deobfunc.abbr.match(/IFWBGC/) && deobfunc.abbr.match(/@\.items\.push/)) { // v15 1 match
                            window.init_fake_world = s;
                            deobmatch('init_fake_world', s);
                        }
                    } else if (window[s].length === 1) { // v15 51 matches
                        if (deobfunc.abbr.match(/[a-z]=-[a-z]\.width;/) && deobfunc.abbr.match(/ROTATE;if\(this\.hit\.update\)/)) {
                                window.draw_door = s;
                                deobmatch('draw_door', s);
                        }
                    } else if (window[s].length === 2) { // v15 85 matches
                        if (deobfunc.abbr.match(/function @\([a-z],[a-z]\){var [a-z]=[a-z]\.getBoundingClientRect\(\);return{x:[a-z]\.clientX-[a-z]\.left,y:[a-z]\.clientY-[a-z]\.top}}/)) { // v15 1 match
                            window.get_mouse_pos = s;
                            deobmatch('get_mouse_pos', s);
                        } else if (deobfunc.abbr.match(/[a-z]=sprite\[[a-z]\]\[@\.time\];[a-z]=-[a-z]\.width\*this\.breath\.v/)) {
                                window.draw_simple_mobs = s;
                                deobmatch('draw_simple_mobs', s);
                        } else if (deobfunc.abbr.match(/[a-z]=-[a-z]\.width;/) && deobfunc.abbr.match(/@\.drawImage\([a-z],-[a-z]\/2,-[a-z]\/2,[a-z],[a-z]\)/)) {
                                window.draw_simple_mobs_2 = s;
                                deobmatch('draw_simple_mobs_2', s);
                        } else {
                        }
                    } else if (window[s].length === 3) { // v15 125 matches
                    } else if (window[s].length === 4) { // v15 13 matches
                    } else if (window[s].length === 5) { // v15 3 matches
                    } else if (window[s].length === 6) { // v15 3 matches
                    } else if (window[s].length === 7) { // v15 6 matches
                    } else if (window[s].length === 9) { // v15 1 match
                    } else if (window[s].length === 11) { // v15 2 matches
                    }
                } else if (typeof window[s] === 'number') { // v15 50-52 matches
                    if (window[s] === window.innerHeight && s !== 'innerHeight') { // v15 1 match
                        if (s !== 'canh') {
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.height,') > -1) {
                                window.canh = s;
                                deobmatch('canh', s);
                            }
                        }
                    } else if (window[s] === window.innerHeight / 2) { // v15 1 match
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.height/2)') > -1) {
                                window.canh2 = s;
                                deobmatch('canh2', s);
                            }
                    }
                    if (window[s] === window.innerWidth && s !== 'innerWidth') { // v15 1 match
                        if (s !== 'canw') {
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf('innerWidth,' + s + '=can.width,') > -1) {
                                window.canw = s;
                                deobmatch('canw', s);
                            }
                        }
                    } else if (window[s] === window.innerWidth / 2) { // v15 1 match
                            if (deobfuscate_func(resize_canvas.toString()).orig.indexOf(',' + s + '=can.width/2)') > -1) {
                                window.canw2 = s;
                                deobmatch('canw2', s);
                            }
                    }

                    // Detecting or validating these may require more evaluation
                    if (window[s] === 92) { // v15 1 match
                        if (SPRITE.hasOwnProperty(s)) { // Validate with SPRITE.COUNTER, does SPRITE[s] exist?
                            window.COUNTER = s;
                            deobmatch('COUNTER', s);
                        }
                    }

                    // Detecting these requires more evaluation
                    if (window[s] === 0) {
                        if (typeof window['create_leaderboard_'+s] === 'function' || // v15 1 match
                            typeof window['create_gauges_'+s] === 'function' ||
                            (typeof window.create_images === 'function' && window.create_images.toString().indexOf(s + '?(sprite') > -1) ||
                            (typeof window.create_images === 'function' && window.create_images.toString().indexOf(s + '?CTI(') > -1) ||
                            OBFUSCATED_ARR.indexOf(s+'AutoEnable') > -1 || // v15 1 match
                            OBFUSCATED_ARR.indexOf('_'+s+'Enabled') > -1 || // v15 1 match
                            OBFUSCATED_ARR.indexOf('_'+s+'Unloaded') > -1 // v15 1 match
                            ) {
                                window.mobile = s;
                                deobmatch('mobile', s);
                        }

                        if ((typeof window.gui_create_button === 'function' && window.gui_create_button.toString().indexOf('==' + s + '&&') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + ')&&game') > -1) // v15 1 match
                        ) {
                            window.MOUSE_MOVE = s;
                            deobmatch('MOUSE_MOVE', s);
                        }
                    } else if (window[s] === 1) {
                        if ((typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + ')));') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',mouse.pos,' + s + '));user') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + '));if(-1!=') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + '))var ') > -1) // v15 1 match
                        ) {
                            window.MOUSE_DOWN = s;
                            deobmatch('MOUSE_DOWN', s);
                        }

                    } else if (window[s] === 2) {
                        if ((typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + ')?1!=') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',mouse.pos,' + s + ')&&0>user') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + ')&&(ret=') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf(',' + s + ')&&(audio') > -1) || // v15 1 match
                            (typeof window.Game === 'function' && window.Game.toString().indexOf('.can,mouse.pos,' + s + ')&& ') > -1) // v15 1 match
                            ) {
                                window.MOUSE_UP = s;
                                deobmatch('MOUSE_UP', s);
                        }
                    }
                    // variable value
                    if ((typeof window.draw === 'function' && window.draw.toString().indexOf('-' + s + ')/1E3;') > -1 ) || // v15 1 match
                        (typeof window.draw === 'function' && window.draw.toString().indexOf(')/1E3;' + s + '=') > -1 ) // v15 1 match
                        ) {
                            window.old_timestamp = s;
                            deobmatch('old_timestamp', s);
                    }
                } else if (typeof window[s] === 'object') { // v15 206-208 matches
                    if (window[s] === window) { } // ignore
                    else if (window[s] === null) { } // ignore
                    else if (Array.isArray(window[s])) { // v15 14-17 matches
                        if (window[s].every(function(i) { return typeof i === "string" })) {
                        } else if (!window[s].some(isNaN)) { // v15 6 matches
                            // Every item is coercible to a number
                            if (window[s].length === 10000) { // v15 1 match
                                window.RANDOM_NUMS = window[s];
                                deobmatch('RANDOM_NUMS', s);
                            } else if (window[s].length === 500) {
                                window.RIGHT_HAND_ITEMS = window[s];
                                deobmatch('RIGHT_HAND_ITEMS', s);
                            }
                        } else if (window[s].some(isNaN)) { // v15 6 matches
                            if (window[s].length > 600) { // v15 1 match
                                if (s !== 'sprite') {
                                    window.sprite = window[s];
                                    deobmatch('sprite', s);
                                }
                            } else if (window[s].length === 118) { // v15 1 match
                                window.INV_INFO = window[s];
                                deobmatch('INV_INFO', s);
                            } else if (window[s].length === 92) { // v15 1 match
                                window.RECIPES = window[s];
                                deobmatch('RECIPES', s);
                            } else if (window[s].length === 9) { // v15 1 match
                                if (s !== 'KIT') {
                                    window.KIT = window[s];
                                    deobmatch('KIT', s);
                                }
                            } else if (window[s].length === 7) { // v15 1 match
                                if (s !== 'QUESTS') {
                                    window.QUESTS = window[s];
                                    deobmatch('QUESTS', s);
                                }
                            }
                        } else if (window[s].every(function(i) { return !Array.isArray(i); })) { // v15 11 matches
                        } else {

                        }
                    } else if (typeof window[s].hasOwnProperty !== 'undefined') { // v15 79 matches
                        if (window[s].hasOwnProperty('already_used_key') || // v15 1 match
                            window[s].hasOwnProperty('claimed') || // v15 1 match
                            window[s].hasOwnProperty('connect') || // v15 1 match
                            window[s].hasOwnProperty('delete_one_inv') || // v15 1 match
                            window[s].hasOwnProperty('fire') || // v15 1 match
                            window[s].hasOwnProperty('full') || // v15 1 match
                            window[s].hasOwnProperty('fun_after') || // v15 1 match
                            window[s].hasOwnProperty('gather') || // v15 1 match
                            window[s].hasOwnProperty('give_well') || // v15 1 match
                            window[s].hasOwnProperty('hitten') || // v15 1 match
                            window[s].hasOwnProperty('join_team') || // v15 1 match
                            window[s].hasOwnProperty('kick') || // v15 1 match
                            window[s].hasOwnProperty('kick_team') || // v15 1 match
                            window[s].hasOwnProperty('killed') || // v15 1 match
                            window[s].hasOwnProperty('message') || // v15 1 match
                            window[s].hasOwnProperty('mute') || // v15 1 match
                            window[s].hasOwnProperty('ping') || // v15 1 match
                            window[s].hasOwnProperty('reborn') || // v15 1 match
                            window[s].hasOwnProperty('recycle_inv') || // v15 1 match
                            window[s].hasOwnProperty('recycle_ok') || // v15 1 match
                            window[s].hasOwnProperty('recycle_stop') || // v15 1 match
                            window[s].hasOwnProperty('survive') || // v15 1 match
                            window[s].hasOwnProperty('take_bread') || // v15 1 match
                            window[s].hasOwnProperty('timeout') || // v15 1 match
                            window[s].hasOwnProperty('timeout_number') || // v15 1 match
                            window[s].hasOwnProperty('timeout_server') || // v15 1 match
                            window[s].hasOwnProperty('wrong_key') || // v15 1 match
                            window[s].hasOwnProperty('xhttp') || // v15 1 match
                            window[s].hasOwnProperty('xhttp_get') // v15 1 match
                            ) {
                                window.client = s;
                                deobmatch('client', s);
                        } else if (typeof window[s].canvas === 'object' &&
                            typeof window[s].fillStyle === 'string' &&
                            typeof window[s].filter === 'string' &&
                            typeof window[s].font === 'string' &&
                            typeof window[s].globalAlpha === 'number' &&
                            typeof window[s].globalCompositeOperation === 'string' &&
                            typeof window[s].imageSmoothingEnabled === 'boolean' &&
                            typeof window[s].lineCap === 'string' &&
                            typeof window[s].lineDashOffset === 'number' &&
                            typeof window[s].lineJoin === 'string' &&
                            typeof window[s].lineWidth === 'number' &&
                            typeof window[s].miterLimit === 'number' &&
                            typeof window[s].shadowBlur === 'number' &&
                            typeof window[s].shadowColor === 'string' &&
                            typeof window[s].shadowOffsetX === 'number' &&
                            typeof window[s].shadowOffsetY === 'number' &&
                            typeof window[s].strokeStyle === 'string' &&
                            typeof window[s].textAlign === 'string' &&
                            typeof window[s].textBaseline === 'string'
                            ) {
                                window.ctx = window[s];
                                deobmatch('ctx', s);
                                // Populate duplicates
                                game.ctx = game[s];
                                loader.ctx = loader[s];
                                scoreboard.ctx = scoreboard[s];
                                user.ldb.ctx = user.ldb[s];
                                ui.ctx = ui[s];
                        } else if (window[s].hasOwnProperty('ARROW_CLOCK') || // v15 1 match
                            window[s].hasOwnProperty('AUTO_FEED') || // v15 1 match
                            window[s].hasOwnProperty('BEACH_WINTER_MIN_X') || // v15 1 match
                            window[s].hasOwnProperty('BIG_FIRE_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('BIGMAP') || // v15 1 match
                            window[s].hasOwnProperty('BODY') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_LIGHT_DOWN') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_LIGHT_UP') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_OVEN_BREAD') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_OVEN_OFF') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_OVEN_ON') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_OVEN_UI') || // v15 1 match
                            window[s].hasOwnProperty('BREAD_OVEN_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('BUBBLES_SIZES') || // v15 1 match
                            window[s].hasOwnProperty('BUBBLES') || // v15 1 match
                            window[s].hasOwnProperty('CAVE_STEP') || // v15 1 match
                            window[s].hasOwnProperty('CAVE_STONES') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_AMETHYST_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_AMETHYST_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_AMETHYST_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_AMETHYST_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BAG') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BANDAGE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BIG_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BLUE_CORD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BOOK') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BOTTLE_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BOTTLE_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BREAD_OVEN') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BREAD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BRIDGE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BUCKET_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_BUCKET_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CAKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CAP_SCARF') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_COAT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_COOKED_MEAT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_COOKIE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CORD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CROWN_BLUE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CROWN_GREEN') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CROWN_ORANGE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_CURSED_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIAMOND_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIAMOND_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIAMOND_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIAMOND_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DIVING_MASK') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DOOR_GOLD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DOOR_STONE_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DOOR_WOOD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DRAGON_CUBE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DRAGON_HEART') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DRAGON_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DRAGON_ORB') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_DRAGON_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_EARMUFFS') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_EXPLORER_HAT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FLOUR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FOODFISH_COOKED') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FOODFISH') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FURNACE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FUR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FUR_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_FUR_WOLF') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GEMME_BLUE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GEMME_GREEN') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GOLD_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GOLD_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GOLD_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GOLD_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_GROUND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_HAMMER_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_HAMMER_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_HAMMER_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_ICE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_KRAKEN_SKIN') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_LOCKPICK') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_LOCK') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_MEAT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_O_O115590_0') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_O_O115620_0') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PAPER') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PICK_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PICK_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PICK_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PICK') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PICK_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PLANT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PLOT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_PLUS') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_RESURRECTION') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SAND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SANDWICH') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SCALES') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SHOVEL_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SHOVEL_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SHOVEL_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SHOVEL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SLOT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SPANNER') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SPECIAL_FUR_2') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SPECIAL_FUR') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_STONE_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_STONE_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_STONE') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_STONE_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SUPER_DIVING_SUIT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SUPER_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SWORD_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SWORD_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SWORD_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_TOTEM') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WATERING_CAN_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WATERING_CAN') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WELL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WHEAT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WILD_WHEAT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WINDMILL') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WINTER_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WORKBENCH') || // v15 1 match
                            window[s].hasOwnProperty('CHEST_WORK') || // v15 1 match
                            window[s].hasOwnProperty('CLOCK') || // v15 1 match
                            window[s].hasOwnProperty('COLD_SYMBOL_HUD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_AMETHYST_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_AMETHYST_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_AMETHYST_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_AMETHYST_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BAG') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BANDAGE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BIG_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BLUE_CORD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BOOK') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BOTTLE_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BOTTLE_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BREAD_OVEN') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BREAD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BRIDGE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BUCKET_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_BUCKET_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CAKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CAP_SCARF') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_COAT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_COOKED_MEAT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_COOKIE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CROWN_BLUE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CROWN_GREEN') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CROWN_ORANGE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_CURSED_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DIAMOND_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DIAMOND_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DIAMOND_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DIAMOND_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DIVING_MASK') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DOOR_GOLD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DOOR_STONE_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DOOR_WOOD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DRAGON_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_DRAGON_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_EARMUFFS') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_EXPLORER_HAT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_FOODFISH_COOKED') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_FURNACE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_GOLD_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_GOLD_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_GOLD_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_GOLD_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_HAMMER_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_HAMMER_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_HAMMER_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_LOADING') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_LOCKPICK') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_LOCK') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_O_O115590_0') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_O_O115620_0') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PAPER') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PICK_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PICK_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PICK_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PICK') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PICK_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_PLOT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_RESURRECTION') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SANDWICH') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SHOVEL_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SHOVEL_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SHOVEL_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SHOVEL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SPANNER') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_STONE_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_STONE_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_STONE_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SUPER_DIVING_SUIT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SUPER_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SWORD_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SWORD_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SWORD_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_TOTEM') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WALL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WATERING_CAN_FULL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WATERING_CAN') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WELL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WHEAT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WINDMILL') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WINTER_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('CRAFT_WORK') || // v15 1 match
                            window[s].hasOwnProperty('CURSED_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_DRINK') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_TEAM') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_WEAPON') || // v15 1 match
                            window[s].hasOwnProperty('DIAMOND_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_AMETHYST_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_AMETHYST_OPEN') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_AMETHYST_OPEN_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_DIAMOND_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_DIAMOND_OPEN') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_DIAMOND_OPEN_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_GOLD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_GOLD_OPEN') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_GOLD_OPEN_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_STONE_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_STONE_OPEN') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_STONE_OPEN_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_WOOD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_WOOD_OPEN') || // v15 1 match
                            window[s].hasOwnProperty('DOOR_WOOD_OPEN_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('DRAGON_GROUND') || // v15 1 match
                            window[s].hasOwnProperty('DRAGON_SWORD_HALO') || // v15 1 match
                            window[s].hasOwnProperty('DRIED_PLANT') || // v15 1 match
                            window[s].hasOwnProperty('DRIED_WHEAT') || // v15 1 match
                            window[s].hasOwnProperty('EMPTY_SLOT') || // v15 1 match
                            window[s].hasOwnProperty('FIR') || // v15 1 match
                            window[s].hasOwnProperty('FLAKES_NUMBER') || // v15 1 match
                            window[s].hasOwnProperty('FLAKES_SIZES') || // v15 1 match
                            window[s].hasOwnProperty('FLAKES') || // v15 1 match
                            window[s].hasOwnProperty('FLOAM_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('FOOD_SYMBOL_HUD') || // v15 1 match
                            window[s].hasOwnProperty('FULL_TEAM_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('FURNACE_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('FURNACE_OFF') || // v15 1 match
                            window[s].hasOwnProperty('FURNACE_ON') || // v15 1 match
                            window[s].hasOwnProperty('FURNACE_SLOT') || // v15 1 match
                            window[s].hasOwnProperty('GAUGES') || // v15 1 match
                            window[s].hasOwnProperty('GEAR2') || // v15 1 match
                            window[s].hasOwnProperty('GEAR') || // v15 1 match
                            window[s].hasOwnProperty('GHOST_BUBBLES') || // v15 1 match
                            window[s].hasOwnProperty('GLOVES_O_O115620_0') || // v15 1 match
                            window[s].hasOwnProperty('GOLD_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('GRD_SHOVEL_CO') || // v15 1 match
                            window[s].hasOwnProperty('GROUND_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('GROUND_FIRE_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('HALO_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('HAND_SHADOW') || // v15 1 match
                            window[s].hasOwnProperty('HEART_SYMBOL_HUD') || // v15 1 match
                            window[s].hasOwnProperty('HELMET_LOADING') || // v15 1 match
                            window[s].hasOwnProperty('HERB_CAVE') || // v15 1 match
                            window[s].hasOwnProperty('HERB') || // v15 1 match
                            window[s].hasOwnProperty('HERB_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('HURT_BEAR') || // v15 1 match
                            window[s].hasOwnProperty('HURT_DEAD_BOX') || // v15 1 match
                            window[s].hasOwnProperty('HURT_DRAGON') || // v15 1 match
                            window[s].hasOwnProperty('HURT_FOX') || // v15 1 match
                            window[s].hasOwnProperty('HURT_KRAKEN') || // v15 1 match
                            window[s].hasOwnProperty('HURT_PIRANHA') || // v15 1 match
                            window[s].hasOwnProperty('HURT_RABBIT') || // v15 1 match
                            window[s].hasOwnProperty('HURT_SPIDER') || // v15 1 match
                            window[s].hasOwnProperty('HURT_TREASURE_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('HURT_WING_LEFT') || // v15 1 match
                            window[s].hasOwnProperty('HURT_WING_RIGHT') || // v15 1 match
                            window[s].hasOwnProperty('HURT_WOLF') || // v15 1 match
                            window[s].hasOwnProperty('ICE_SHOVEL_CO') || // v15 1 match
                            window[s].hasOwnProperty('ICON_LEADER') || // v15 1 match
                            window[s].hasOwnProperty('ICON_MEMBER') || // v15 1 match
                            window[s].hasOwnProperty('INV_AMETHYST_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('INV_AMETHYST_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('INV_AMETHYST_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('INV_AMETHYST_WALL') || // v15 1 match
                            window[s].hasOwnProperty('INV_BAG') || // v15 1 match
                            window[s].hasOwnProperty('INV_BANDAGE') || // v15 1 match
                            window[s].hasOwnProperty('INV_BIG_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('INV_BLUE_CORD') || // v15 1 match
                            window[s].hasOwnProperty('INV_BOOK') || // v15 1 match
                            window[s].hasOwnProperty('INV_BOTTLE_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('INV_BOTTLE_FULL') || // v15 1 match
                            window[s].hasOwnProperty('INV_BREAD_OVEN') || // v15 1 match
                            window[s].hasOwnProperty('INV_BREAD') || // v15 1 match
                            window[s].hasOwnProperty('INV_BRIDGE') || // v15 1 match
                            window[s].hasOwnProperty('INV_BUCKET_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('INV_BUCKET_FULL') || // v15 1 match
                            window[s].hasOwnProperty('INV_CAKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_CAP_SCARF') || // v15 1 match
                            window[s].hasOwnProperty('INV_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('INV_COAT') || // v15 1 match
                            window[s].hasOwnProperty('INV_COOKED_MEAT') || // v15 1 match
                            window[s].hasOwnProperty('INV_COOKIE') || // v15 1 match
                            window[s].hasOwnProperty('INV_CORD') || // v15 1 match
                            window[s].hasOwnProperty('INV_CROWN_BLUE') || // v15 1 match
                            window[s].hasOwnProperty('INV_CROWN_GREEN') || // v15 1 match
                            window[s].hasOwnProperty('INV_CROWN_ORANGE') || // v15 1 match
                            window[s].hasOwnProperty('INV_CURSED_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIAMOND_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIAMOND_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIAMOND_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIAMOND_WALL') || // v15 1 match
                            window[s].hasOwnProperty('INV_DIVING_MASK') || // v15 1 match
                            window[s].hasOwnProperty('INV_DOOR_AMETHYST_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DOOR_DIAMOND_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DOOR_GOLD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DOOR_STONE_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DOOR_WOOD_CLOSE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DRAGON_CUBE') || // v15 1 match
                            window[s].hasOwnProperty('INV_DRAGON_HEART') || // v15 1 match
                            window[s].hasOwnProperty('INV_DRAGON_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('INV_DRAGON_ORB') || // v15 1 match
                            window[s].hasOwnProperty('INV_DRAGON_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('INV_EARMUFFS') || // v15 1 match
                            window[s].hasOwnProperty('INV_EXPLORER_HAT') || // v15 1 match
                            window[s].hasOwnProperty('INV_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('INV_FLOUR') || // v15 1 match
                            window[s].hasOwnProperty('INV_FOODFISH_COOKED') || // v15 1 match
                            window[s].hasOwnProperty('INV_FOODFISH') || // v15 1 match
                            window[s].hasOwnProperty('INV_FURNACE') || // v15 1 match
                            window[s].hasOwnProperty('INV_FUR') || // v15 1 match
                            window[s].hasOwnProperty('INV_FUR_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('INV_FUR_WOLF') || // v15 1 match
                            window[s].hasOwnProperty('INV_GEMME_BLUE') || // v15 1 match
                            window[s].hasOwnProperty('INV_GEMME_GREEN') || // v15 1 match
                            window[s].hasOwnProperty('INV_GOLD_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('INV_GOLD_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('INV_GOLD_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('INV_GOLD_WALL') || // v15 1 match
                            window[s].hasOwnProperty('INV_GROUND') || // v15 1 match
                            window[s].hasOwnProperty('INV_HAMMER_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('INV_HAMMER_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('INV_HAMMER_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('INV_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('INV_ICE') || // v15 1 match
                            window[s].hasOwnProperty('INV_KRAKEN_SKIN') || // v15 1 match
                            window[s].hasOwnProperty('INV_LOCKPICK') || // v15 1 match
                            window[s].hasOwnProperty('INV_LOCK') || // v15 1 match
                            window[s].hasOwnProperty('INV_MEAT') || // v15 1 match
                            window[s].hasOwnProperty('INV_O_O115590_0') || // v15 1 match
                            window[s].hasOwnProperty('INV_O_O115620_0') || // v15 1 match
                            window[s].hasOwnProperty('INV_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('INV_PAPER') || // v15 1 match
                            window[s].hasOwnProperty('INV_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('INV_PICK_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('INV_PICK_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('INV_PICK_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('INV_PICK') || // v15 1 match
                            window[s].hasOwnProperty('INV_PICK_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('INV_PLANT') || // v15 1 match
                            window[s].hasOwnProperty('INV_PLOT') || // v15 1 match
                            window[s].hasOwnProperty('INV_RESURRECTION') || // v15 1 match
                            window[s].hasOwnProperty('INV_SAND') || // v15 1 match
                            window[s].hasOwnProperty('INV_SANDWICH') || // v15 1 match
                            window[s].hasOwnProperty('INV_SCALES') || // v15 1 match
                            window[s].hasOwnProperty('INV_SHOVEL_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('INV_SHOVEL_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('INV_SHOVEL_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('INV_SHOVEL') || // v15 1 match
                            window[s].hasOwnProperty('INV_SPANNER') || // v15 1 match
                            window[s].hasOwnProperty('INV_SPEAR') || // v15 1 match
                            window[s].hasOwnProperty('INV_SPECIAL_FUR_2') || // v15 1 match
                            window[s].hasOwnProperty('INV_SPECIAL_FUR') || // v15 1 match
                            window[s].hasOwnProperty('INV_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_STONE_HELMET') || // v15 1 match
                            window[s].hasOwnProperty('INV_STONE_SPIKE') || // v15 1 match
                            window[s].hasOwnProperty('INV_STONE') || // v15 1 match
                            window[s].hasOwnProperty('INV_STONE_WALL') || // v15 1 match
                            window[s].hasOwnProperty('INV_SUPER_DIVING_SUIT') || // v15 1 match
                            window[s].hasOwnProperty('INV_SUPER_HAMMER') || // v15 1 match
                            window[s].hasOwnProperty('INV_SWORD_AMETHYST') || // v15 1 match
                            window[s].hasOwnProperty('INV_SWORD_DIAMOND') || // v15 1 match
                            window[s].hasOwnProperty('INV_SWORD_GOLD') || // v15 1 match
                            window[s].hasOwnProperty('INV_SWORD') || // v15 1 match
                            window[s].hasOwnProperty('INV_TOTEM') || // v15 1 match
                            window[s].hasOwnProperty('INV_WALL') || // v15 1 match
                            window[s].hasOwnProperty('INV_WATERING_CAN_FULL') || // v15 1 match
                            window[s].hasOwnProperty('INV_WATERING_CAN') || // v15 1 match
                            window[s].hasOwnProperty('INV_WELL') || // v15 1 match
                            window[s].hasOwnProperty('INV_WHEAT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('INV_WILD_WHEAT') || // v15 1 match
                            window[s].hasOwnProperty('INV_WINDMILL') || // v15 1 match
                            window[s].hasOwnProperty('INV_WINTER_PEASANT') || // v15 1 match
                            window[s].hasOwnProperty('INV_WOOD') || // v15 1 match
                            window[s].hasOwnProperty('INV_WORK') || // v15 1 match
                            window[s].hasOwnProperty('ISLAND_BLOCK') || // v15 1 match
                            window[s].hasOwnProperty('ISLAND_STEP') || // v15 1 match
                            window[s].hasOwnProperty('ISLAND') || // v15 1 match
                            window[s].hasOwnProperty('ITEM1') || // v15 1 match
                            window[s].hasOwnProperty('ITEM2') || // v15 1 match
                            window[s].hasOwnProperty('ITEM3') || // v15 1 match
                            window[s].hasOwnProperty('ITEM4') || // v15 1 match
                            window[s].hasOwnProperty('KEY') || // v15 1 match
                            window[s].hasOwnProperty('LACK') || // v15 1 match
                            window[s].hasOwnProperty('LAKE_DEEP') || // v15 1 match
                            window[s].hasOwnProperty('LAKE_EDGE') || // v15 1 match
                            window[s].hasOwnProperty('LAKE') || // v15 1 match
                            window[s].hasOwnProperty('LEADERBOARD') || // v15 1 match
                            window[s].hasOwnProperty('LOCKED') || // v15 1 match
                            window[s].hasOwnProperty('MANAGE_TEAM_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('MINIMAP') || // v15 1 match
                            window[s].hasOwnProperty('NIGHT') || // v15 1 match
                            window[s].hasOwnProperty('OCEAN') || // v15 1 match
                            window[s].hasOwnProperty('O_O115690_0') || // v15 1 match
                            window[s].hasOwnProperty('O_O118380_0') || // v15 1 match
                            window[s].hasOwnProperty('O_O118480_0') || // v15 1 match
                            window[s].hasOwnProperty('O_O118490_0') || // v15 1 match
                            window[s].hasOwnProperty('O_O118600_0') || // v15 1 match
                            window[s].hasOwnProperty('OPTION_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('PADLOCK_ON_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('PADLOCK') || // v15 1 match
                            window[s].hasOwnProperty('PALM') || // v15 1 match
                            window[s].hasOwnProperty('PLANT_MINI') || // v15 1 match
                            window[s].hasOwnProperty('PLANT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('POINTS') || // v15 1 match
                            window[s].hasOwnProperty('QUEST_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('RECIPE_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('RECONNECT') || // v15 1 match
                            window[s].hasOwnProperty('RESURRECTION_GROUND') || // v15 1 match
                            window[s].hasOwnProperty('RESURRECTION_HOLE') || // v15 1 match
                            window[s].hasOwnProperty('RESURRECTION_O_O116860_0') || // v15 1 match
                            window[s].hasOwnProperty('SAND_BORDER') || // v15 1 match
                            window[s].hasOwnProperty('SAND_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('SAND_MAX_X') || // v15 1 match
                            window[s].hasOwnProperty('SAND_MIN_X') || // v15 1 match
                            window[s].hasOwnProperty('SAND_SHOVEL_CO') || // v15 1 match
                            window[s].hasOwnProperty('SAND_STEP') || // v15 1 match
                            window[s].hasOwnProperty('SHADOW_CAVE_STONES') || // v15 1 match
                            window[s].hasOwnProperty('SHINGLE') || // v15 1 match
                            window[s].hasOwnProperty('SHOP') || // v15 1 match
                            window[s].hasOwnProperty('SHOW_SPECTATORS') || // v15 1 match
                            window[s].hasOwnProperty('SHOW_TEAM_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('SKIN0') || // v15 1 match
                            window[s].hasOwnProperty('SKIN1') || // v15 1 match
                            window[s].hasOwnProperty('SKIN2') || // v15 1 match
                            window[s].hasOwnProperty('SKIN3') || // v15 1 match
                            window[s].hasOwnProperty('SKIN4') || // v15 1 match
                            window[s].hasOwnProperty('SKIN5') || // v15 1 match
                            window[s].hasOwnProperty('SKIN6') || // v15 1 match
                            window[s].hasOwnProperty('SLOT_NUMBER') || // v15 1 match
                            window[s].hasOwnProperty('SMOG_PUSH') || // v15 1 match
                            window[s].hasOwnProperty('SMOG_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('SMOG') || // v15 1 match
                            window[s].hasOwnProperty('SNOW_GROUND') || // v15 1 match
                            window[s].hasOwnProperty('SNOW_STEP') || // v15 1 match
                            window[s].hasOwnProperty('SOUND_BUTTON_OFF') || // v15 1 match
                            window[s].hasOwnProperty('SOUND_BUTTON_ON') || // v15 1 match
                            window[s].hasOwnProperty('SPECIAL_O_O116150_0') || // v15 1 match
                            window[s].hasOwnProperty('STEP_SPACE') || // v15 1 match
                            window[s].hasOwnProperty('STONES') || // v15 1 match
                            window[s].hasOwnProperty('STONES_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('SWIM_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('SWIM_SPACE') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_BUTTON') || // v15 1 match
                            window[s].hasOwnProperty('TREE_BRANCH') || // v15 1 match
                            window[s].hasOwnProperty('TREE') || // v15 1 match
                            window[s].hasOwnProperty('WATER_1_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('WATER_2_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('WATER_3_COLOR') || // v15 1 match
                            window[s].hasOwnProperty('WATERBLOCK') || // v15 1 match
                            window[s].hasOwnProperty('WATER_SYMBOL_HUD') || // v15 1 match
                            window[s].hasOwnProperty('WAVE_ONE') || // v15 1 match
                            window[s].hasOwnProperty('WAVE_TWO') || // v15 1 match
                            window[s].hasOwnProperty('WEAPON_LOADING') || // v15 1 match
                            window[s].hasOwnProperty('WELL_EMPTY') || // v15 1 match
                            window[s].hasOwnProperty('WELL_FULL') || // v15 1 match
                            window[s].hasOwnProperty('WHEAT_O_O118450_0_DRIED') || // v15 1 match
                            window[s].hasOwnProperty('WINDMILL_CASES') || // v15 1 match
                            window[s].hasOwnProperty('WINDMILL_FLOUR') || // v15 1 match
                            window[s].hasOwnProperty('WINDMILL_HEAD') || // v15 1 match
                            window[s].hasOwnProperty('WINDMILL_WHEAT_O_O118450_0') || // v15 1 match
                            window[s].hasOwnProperty('WINDMILL_WINGS') || // v15 1 match
                            window[s].hasOwnProperty('WING_LEFT') || // v15 1 match
                            window[s].hasOwnProperty('WING_RIGHT') || // v15 1 match
                            window[s].hasOwnProperty('WINTER_BIOME_Y') || // v15 1 match
                            window[s].hasOwnProperty('WOOD_FIRE') || // v15 1 match
                            window[s].hasOwnProperty('YOUR_SCORE') // v15 1 match
                            ) {
                                window.SPRITE = window[s];
                                deobmatch('SPRITE', s);
                        } else if (window[s].hasOwnProperty('breath') || // v15 1 match
                            window[s].hasOwnProperty('clock') || // v15 1 match
                            window[s].hasOwnProperty('dw') || // v15 1 match
                            window[s].hasOwnProperty('find_bridge') || // v15 1 match
                            window[s].hasOwnProperty('mode') || // v15 1 match
                            window[s].hasOwnProperty('shade') || // v15 1 match
                            window[s].hasOwnProperty('units') // v15 1 match
                            ) {
                                window.world = window[s];
                                deobmatch('world', s);
                        } else if (window[s].hasOwnProperty('ATTACK') || // v15 1 match
                            window[s].hasOwnProperty('CAM_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('DELAY_CONNECTION_UPDATE') || // v15 1 match
                            window[s].hasOwnProperty('LAG_DISTANCE') || // v15 1 match
                            window[s].hasOwnProperty('LOOSE_FOCUS') || // v15 1 match
                            window[s].hasOwnProperty('MOVE_SPEED_MOD_ATTACK') || // v15 1 match
                            window[s].hasOwnProperty('MUTE_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('PING') || // v15 1 match
                            window[s].hasOwnProperty('PING_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('ROTATE') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_FULL') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_JOIN') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_LEAVE') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_MANAGE') || // v15 1 match
                            window[s].hasOwnProperty('TEAM_SHOW') || // v15 1 match
                            window[s].hasOwnProperty('TIMEOUT_NUMBER') || // v15 1 match
                            window[s].hasOwnProperty('TIMEOUT_SERVER') || // v15 1 match
                            window[s].hasOwnProperty('TIMEOUT_TIME') || // v15 1 match
                            window[s].hasOwnProperty('TOKEN_LEN') || // v15 1 match
                            window[s].hasOwnProperty('VERSION_NUMBER') || // v15 1 match
                            window[s].hasOwnProperty('WAITING_FOR_SERVER') // v15 1 match
                            ) {
                                window.CLIENT = window[s];
                                deobmatch('CLIENT', s);
                        } else if (window[s].hasOwnProperty('items') || // v15 1 match
                            window[s].hasOwnProperty('time') // v15 1 match
                            ) {
                                window.fake_world = s;
                                deobmatch('fake_world', s);
                        } else if (window[s].hasOwnProperty('BEAR') || // v15 1 match
                            window[s].hasOwnProperty('DEAD_BOX') || // v15 1 match
                            window[s].hasOwnProperty('DRAGON') || // v15 1 match
                            window[s].hasOwnProperty('FOX') || // v15 1 match
                            window[s].hasOwnProperty('FRUIT') || // v15 1 match
                            window[s].hasOwnProperty('KRAKEN') || // v15 1 match
                            window[s].hasOwnProperty('PIRANHA') || // v15 1 match
                            window[s].hasOwnProperty('RABBIT') || // v15 1 match
                            window[s].hasOwnProperty('SPIDER') || // v15 1 match
                            window[s].hasOwnProperty('TREASURE_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('WHEAT_MOB') || // v15 1 match
                            window[s].hasOwnProperty('WOLF') // v15 1 match
                            ) {
                                window.ITEMS = window[s];
                                deobmatch('ITEMS', s);
                        } else if (window[s].hasOwnProperty('add_vector') || // v15 1 match
                            window[s].hasOwnProperty('Box') || // v15 1 match
                            window[s].hasOwnProperty('build_vector') || // v15 1 match
                            window[s].hasOwnProperty('compare_array') || // v15 1 match
                            window[s].hasOwnProperty('compare_object') || // v15 1 match
                            window[s].hasOwnProperty('copy_vector') || // v15 1 match
                            window[s].hasOwnProperty('ease_in_out_cubic') || // v15 1 match
                            window[s].hasOwnProperty('ease_in_out_quad') || // v15 1 match
                            window[s].hasOwnProperty('ease_in_out_quart') || // v15 1 match
                            window[s].hasOwnProperty('ease_out_cubic') || // v15 1 match
                            window[s].hasOwnProperty('ease_out_quart') || // v15 1 match
                            window[s].hasOwnProperty('ease_out_quint') || // v15 1 match
                            window[s].hasOwnProperty('Ease') || // v15 1 match
                            window[s].hasOwnProperty('Ease2d') || // v15 1 match
                            window[s].hasOwnProperty('get_rand_pos_in_circle') || // v15 1 match
                            window[s].hasOwnProperty('gup') || // v15 1 match
                            window[s].hasOwnProperty('middle') || // v15 1 match
                            window[s].hasOwnProperty('middle_point') || // v15 1 match
                            window[s].hasOwnProperty('move') || // v15 1 match
                            window[s].hasOwnProperty('mul_vector') || // v15 1 match
                            window[s].hasOwnProperty('norm') || // v15 1 match
                            window[s].hasOwnProperty('open_in_new_box') || // v15 1 match
                            window[s].hasOwnProperty('randomize_list') || // v15 1 match
                            window[s].hasOwnProperty('sign') || // v15 1 match
                            window[s].hasOwnProperty('sub_vector') || // v15 1 match
                            window[s].hasOwnProperty('translate_new_vector') // v15 1 match
                            ) {
                                window.Utils = window[s];
                                deobmatch('Utils', s);
                        } else if (window[s].hasOwnProperty('BEAR_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('DAY') || // v15 1 match
                            window[s].hasOwnProperty('DIST_BREAD_OVEN') || // v15 1 match
                            window[s].hasOwnProperty('DIST_CHEST') || // v15 1 match
                            window[s].hasOwnProperty('DIST_FURNACE') || // v15 1 match
                            window[s].hasOwnProperty('DIST_RESURRECTION') || // v15 1 match
                            window[s].hasOwnProperty('DIST_WELL') || // v15 1 match
                            window[s].hasOwnProperty('DIST_WINDMILL') || // v15 1 match
                            window[s].hasOwnProperty('DRAGON_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('FOX_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('GHOST') || // v15 1 match
                            window[s].hasOwnProperty('GHOST_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('KRAKEN_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('LW3SX') || // v15 1 match
                            window[s].hasOwnProperty('LWT1SY') || // v15 1 match
                            window[s].hasOwnProperty('LWT2') || // v15 1 match
                            window[s].hasOwnProperty('LWT2SY') || // v15 1 match
                            window[s].hasOwnProperty('MODE_HUNGER_GAMES') || // v15 1 match
                            window[s].hasOwnProperty('MODE_PVP') || // v15 1 match
                            window[s].hasOwnProperty('PIRANHA_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('RABBIT_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('SPEED') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_COLLIDE') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_DIVING') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_DIVING_WEAPON') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_WEAPON') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_WINTER') || // v15 1 match
                            window[s].hasOwnProperty('SPEED_WINTER_WEAPON') || // v15 1 match
                            window[s].hasOwnProperty('W3SX') || // v15 1 match
                            window[s].hasOwnProperty('WOLF_SPEED') || // v15 1 match
                            window[s].hasOwnProperty('WT1EY') || // v15 1 match
                            window[s].hasOwnProperty('WT1SY') || // v15 1 match
                            window[s].hasOwnProperty('WY2EY') || // v15 1 match
                            window[s].hasOwnProperty('WT2SY') // v15 1 match
                            ) {
                                window.WORLD = window[s];
                                deobmatch('WORLD', s);
                        } else if (window[s].hasOwnProperty('AMBIENCE') || // v15 1 match
                            window[s].hasOwnProperty('DIG') || // v15 1 match
                            window[s].hasOwnProperty('PUNCH') || // v15 1 match
                            window[s].hasOwnProperty('WEAPON') // v15 1 match
                            ) {
                                window.AUDIO = s;
                                deobmatch('AUDIO', s);
                        } else if (window[s].hasOwnProperty('DISABLE_EFFECT') || // v15 1 match
                            window[s].hasOwnProperty('FOREST_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('FOREST_FADE') || // v15 1 match
                            window[s].hasOwnProperty('MISC') || // v15 1 match
                            window[s].hasOwnProperty('PLAYERS') || // v15 1 match
                            window[s].hasOwnProperty('SEA_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('SEA_FADE') || // v15 1 match
                            window[s].hasOwnProperty('SNOW_DELAY') || // v15 1 match
                            window[s].hasOwnProperty('SNOW_FADE') || // v15 1 match
                            window[s].hasOwnProperty('TRANSITION') // v15 1 match
                            ) {
                                window.CONST_AUDIO = window[s];
                                deobmatch('CONST_AUDIO', s);
                        } else if (typeof window.Game === 'function' && window.Game.toString().indexOf('.select(' + s) > -1) { // v15 1 match
                            window.RECIPE_CATEGORIES = window[s];
                            deobmatch('RECIPE_CATEGORIES', s);
                        } else if (window[s].hasOwnProperty('DELETE') || // v15 1 match
                            (window[s].hasOwnProperty('IDLE') && s !== 'mouse') // v15 1 match
                            ) {
                                window.STATE = window[s];
                                deobmatch('STATE', s);
                        } else if (window[s].hasOwnProperty('a') || // v15 1 match
                            window[s].hasOwnProperty('c') // v15 1 match
                            ) {
                                window.RANDOM_SEED = window[s];
                                deobmatch('RANDOM_SEED', s);
                        }
                    }
                } else if (typeof window[s] === 'string') { // v15 41 matches
                } else if (typeof window[s] === 'undefined') { // v15 4 matches
                }
            }
        } else if (stage === 2) {
            // Then detect most properties of global variables to reference in next stage

            if (typeof CLIENT === 'object') {
                for (var s in window.CLIENT) {
                    if (typeof window.CLIENT[s] === 'number') {
                    }
                }
            }

            if (typeof client === 'string' && typeof window[client] === 'object') {
                for (var s in window[client]) {
                    if (typeof window[client][s] === 'boolean') {
                    } else if (typeof window[client][s] === 'function') {
                        var deobfunc = deobfuscate_func(window[client][s].toString());
                        if (window[client][s].length === 0) {
                            if (deobfunc.abbr.match(/this\.@=JSON\.parse\(this\.xhttp\.responseText\)/)) {
                                window.store_server_list = s;
                                deobmatch('store_server_list', s);
                            } else if (deobfunc.abbr.match(/function \(\){for\(var [a-z]=0,[a-z]=0;[a-z]<@\.@\.length;[a-z]\+\+\)[a-z]\+=@\.@\[[a-z]\]\.nu;/)) {
                                window.update_server_list = s;
                                deobmatch('update_server_list', s);
                            } else if (deobfunc.abbr.match(/You have an old version/)) {
                                window.old_version = s;
                                deobmatch('old_version', s);
                            } else if (deobfunc.abbr.match(/user\.reconnect\.enabled=!1;user\.alive=!1;/)) {
                                window.fail_restore = s;
                                deobmatch('fail_restore', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[11\]\)\)}/)) {
                                window.get_focus = s;
                                deobmatch('get_focus', s);
                            } else if (deobfunc.abbr.match(/Resource is empty/)) {
                                window.empty_res = s;
                                deobmatch('empty_res', s);
                            } else if (deobfunc.abbr.match(/Inventory is full/)) {
                                window.inv_full = s;
                                deobmatch('inv_full', s);
                            } else if (deobfunc.abbr.match(/IFWBGC/)) {
                                window.change_ground = s;
                                deobmatch('change_ground', s);
                            } else if (deobfunc.abbr.match(/^function \(\){user\.craft\.restart\(\)}$/)) {
                                window.cancel_craft = s;
                                deobmatch('cancel_craft', s);
                            } else if (deobfunc.abbr.match(/\.stringify\(\[10\]\)\)}$/)) {
                                window.cancel_crafting = s;
                                deobmatch('cancel_crafting', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/\.stringify\(\[5,user\.craft\.preview\]\)\)}$/)) {
                                window.send_build = s;
                                deobmatch('send_build', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[14\]\)\)}/)) {
                                window.stop_attack = s;
                                deobmatch('stop_attack', s);
                            } else if (deobfunc.abbr.match(/^function \(\){if\(@-this\.@>@\.@\){this\.@=@;var [a-z]=user\.cam,[a-z]=Math.floor\([a-z]\.x\/100\),[a-z]=Math\.floor\([a-z]\.y\/100\);/)) {
                                window.update_cam = s;
                                deobmatch('update_cam', s);
                            } else if (deobfunc.abbr.match(/^function \(\){@-this\.@>@\.PING_DELAY&&\(this\.@=@,this\.ping\(\)\)}$/)) {
                                window.try_ping = s;
                                deobmatch('try_ping', s);
                            } else if (deobfunc.abbr.match(/Your team was destroyed/)) {
                                window.team_destroyed = s;
                                deobmatch('team_destroyed', s);
                            } else if (deobfunc.abbr.match(/^function \(\){3==this\.@\.readyState&&\(this\.timeout_server-=@\.TIMEOUT_SERVER\)}$/)) {
                                window.check_state = s;
                                deobmatch('check_state', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/@-this\.timeout_server>@\.TIMEOUT_SERVER&&\(this\.timeout_server=@,this\.lost\(\)\)}$/)) {
                                window.check_pong = s;
                                deobmatch('check_pong', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/^function \(\){var [a-z]=ui\.@\.id\.selectedIndex/)) {
                                window.connect_timeout = s;
                                deobmatch('connect_timeout', s);
                            }
                        } else if (window[client][s].length === 1) {
                            if (deobfunc.abbr.match(/user\.inv\.max==user\.inv\.can_select\.length/)) {
                                window.select_craft = s;
                                deobmatch('select_craft', s);
                            } else if (deobfunc.abbr.match(/^function \([a-z]\){@\.@\[user\.uid\]\.text=[a-z];this\.@\[@\]\(@\[@\]\.stringify\(\[0,[a-z]\]\)\)}$/)) {
                                window.send_chat = s;
                                deobmatch('send_chat', s);
                            } else if (deobfunc.abbr.match(/function \([a-z]\){[a-z]==INV\.BAG\?/)) {
                                window.build_stop = s;
                                deobmatch('build_stop', s);
                            } else if (deobfunc.abbr.match(/user\.craft\.do_craft\([a-z]\)/)) {
                                window.build_ok = s;
                                deobmatch('build_ok', s);
                            } else if (deobfunc.abbr.match(/{var [a-z]=[a-z]\[1\],[a-z]=@\.@;[a-z]\[[a-z]\]\.nickname=[a-z]\[2\];/)) {
                                window.new_player = s;
                                deobmatch('new_player', s);
                            } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[21,[a-z]\]\)\);user\.shop\.open/)) {
                                window.send_survivalkit = s;
                                deobmatch('send_survivalkit', s);
                            } else if (deobfunc.abbr.match(/user\.inv\.max>user\.inv\.can_select\.length;[a-z]\+\+/)) {
                                window.survival_kit = s;
                                deobmatch('survival_kit', s);
                            } else if (deobfunc.abbr.match(/{game\.quests\.modify\([a-z],2\)}$/)) {
                                window.succeed_quest = s;
                                deobmatch('succeed_quest', s);
                            } else if (deobfunc.abbr.match(/{game\.quests\.modify\([a-z],0\)}$/)) {
                                window.quest_update = s;
                                deobmatch('quest_update', s);
                            } else if (deobfunc.abbr.match(/^function \([a-z]\){user\.gauges\.l=[a-z]\/100}$/)) {
                                window.gauge_life = s;
                                deobmatch('gauge_life', s);
                            } else if (deobfunc.abbr.match(/^function \([a-z]\){user\.gauges\.t=[a-z]\/100}$/)) {
                                window.gauge_thirst = s;
                                deobmatch('gauge_thirst', s);
                            } else if (deobfunc.abbr.match(/^function \([a-z]\){user\.gauges\.h=[a-z]\/100}$/)) {
                                window.gauge_hunger = s;
                                deobmatch('gauge_hunger', s);
                            } else if (deobfunc.abbr.match(/{@\.time=[a-z];@\.transition=!0;audio\.transition=1}/)) {
                                window.get_time = s;
                                deobmatch('get_time', s);
                            } else if (deobfunc.abbr.match(/@\.mode==@\.MODE_HUNGER_GAMES&&'spectator'!==@\.@\[[a-z]\]\.nickname/)) {
                                window.kill_player = s;
                                deobmatch('kill_player', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/function \([a-z]\){[a-z]=new Uint16Array\([a-z]\);player\.cam\.change/)) {
                                window.set_cam = s;
                                deobmatch('set_cam', s);
                            } else if (deobfunc.abbr.match(/new Uint16Array\([a-z]\);user\.cam\.change/)) {
                                window.recover_focus = s;
                                deobmatch('recover_focus', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[23,[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.take_flour = s;
                                deobmatch('take_flour', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[9,[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.take_chest = s;
                                deobmatch('take_chest', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[15,[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.unlock_chest= s;
                                deobmatch('unlock_chest', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[16,[a-z]\.iid\]\)\)}/)) {
                                window.lock_chest= s;
                                deobmatch('lock_chest', s);
                            } else if (deobfunc.abbr.match(/This is not the right tool/)) {
                                window.dont_harvest = s;
                                deobmatch('dont_harvest', s);
                            } else if (deobfunc.abbr.match(/^function \([a-z]\){user\.craft\.preview=-1;/)) {
                                window.accept_build = s;
                                deobmatch('accept_build', s);
                            } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[4,Math\.floor/)) {
                                window.send_attack = s;
                                deobmatch('send_attack', s);
                            } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[3,Math\.floor/)) {
                                window.send_angle = s;
                                deobmatch('send_angle', s);
                            } else if (deobfunc.abbr.match(/this\.@\[@\]\(@\[@\]\.stringify\(\[2,[a-z]\]\)\)}$/)) {
                                window.send_move = s;
                                deobmatch('send_move', s);
                            } else if (deobfunc.abbr.match(/function \([a-z]\){var [a-z]=player\.select\.units;if\(0!=[a-z]\.length\){var [a-z]=\[2\],[a-z]=\[\];/)) {
                                window.move_units = s;
                                deobmatch('move_units', s);
                            } else if (deobfunc.abbr.match(/You joined a team/)) {
                                window.join_team = s;
                                deobmatch('join_team', s);
                            } else if (deobfunc.abbr.match(/ joined the team/)) {
                                window.joined_team = s;
                                deobmatch('joined_team', s);
                            } else if (deobfunc.abbr.match(/You left the team/)) {
                                window.left_team = s;
                                deobmatch('left_team', s);
                            } else if (deobfunc.abbr.match(/Someone stole your token/)) {
                                window.steal_token = s;
                                deobmatch('steal_token', s);
                            } else if (deobfunc.abbr.match(/function \([a-z]\){___adsvid\+\+;clearTimeout\(this\.@\);/)) {
                                window.handshake = s;
                                deobmatch('handshake', s);
                            } else if (deobfunc.abbr.match(/\.stringify\(\[27,[a-z]\]\)\)/)) {
                                // What is this for?
                                window.unknown = s;
                                deobmatch('unknown', s);
                            }
                        } else if (window[client][s].length === 2) {
                            if (deobfunc.abbr.split('case INV').length > 80) {
                                window.select_inv = s;
                                deobmatch('select_inv', s);
                            } else if (deobfunc.abbr.match(/{for\(var [a-z]=new Uint16Array\([a-z]\),[a-z]=\([a-z]\.length-2\)\/4,[a-z]=0;/)) {
                                window.hitten_other = s;
                                deobmatch('hitten_other', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[22,[a-z],[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.resurrection2 = s;
                                deobmatch('resurrection2', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[12,[a-z],[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.give_wood = s;
                                deobmatch('give_wood', s);
                            } else if (deobfunc.abbr.replace(/\n/g, '').match(/user\.inv\.decrease\([a-z],[a-z],user\.inv\.find_item\([a-z]\)\);user\.craft\.update\(\)/)) {
                                window.decrease_item = s;
                                deobmatch('decrease_item', s);
                            } else if (deobfunc.abbr.match(/user\.inv\.delete_item\([a-z],[a-z]\)/)) {
                                window.delete_inv = s;
                                deobmatch('delete_inv', s);
                            }
                        } else if (window[client][s].length === 3) {
                            if (deobfunc.abbr.match(/\.stringify\(\[25,[a-z],[a-z]\.pid,[a-z]\.iid\]\)\);/)) {
                                window.give_breadoven = s;
                                deobmatch('give_breadoven', s);
                            } else if (deobfunc.abbr.match(/{this\.@\[@\]\(@\[@\]\.stringify\(\[8,[a-z],[a-z],[a-z]\.pid,[a-z]\.iid\]\)\)}/)) {
                                window.give_item = s;
                                deobmatch('give_item', s);
                            }
                        } else if (window[client][s].length === 4) {
                        } else if (window[client][s].length === 5) {
                        } else {
                        }
                    } else if (typeof window[client][s] === 'number') {
                        if (window[client][s] === 0) {
                            if ((typeof window[client].lost !== 'undefined' && deobfuscate_func(window[client].lost.toString()).orig.toString().indexOf('user.reconnect.enabled=!0;this.' + s + '==this.') > -1) ||
                                (typeof window[client].kick !== 'undefined' && deobfuscate_func(window[client].kick.toString()).orig.toString().indexOf('this.' + s + '==this.') > -1) ||
                                (typeof window[client].kick !== 'undefined' && deobfuscate_func(window[client].lost.toString()).orig.toString().indexOf('this.' + s + '==this.') > -1) ||
                                (typeof window[client].kick !== 'undefined' && deobfuscate_func(window[client].killed.toString()).orig.toString().indexOf('this.' + s + '==this.') > -1)
                                ) {
                                window._current_id = s;
                                deobmatch('_current_id', s);
                            }
                        }
                    } else if (typeof window[client][s] === 'object') {
                        if (window[client][s] === null) {
                            var deobfunc = deobfuscate_func(window[Client].toString());
                            if (deobfunc.orig.split(s).length > 50) {
                                window.socket = s;
                                deobmatch('socket', s);
                            } else if (deobfunc.orig.split(new RegExp('clearTimeout\\([^.]*\.' + s + '\\);')).length >= 8) {
                                window.connect_timer = s;
                                deobmatch('connect_timer', s);
                            }
                        } else if (Array.isArray(window[client][s])) {
                                window.server_list = s;
                                deobmatch('server_list', s);
                        } else if (typeof window[client][s].hasOwnProperty !== 'undefined') {
                            if (window[client][s].hasOwnProperty('i') && window[client][s].hasOwnProperty('j')) {
                                window.last_cam = s;
                                deobmatch('last_cam', s);
                            }
                        }
                    } else if (typeof window[client][s] === 'string') {
                    } else if (typeof window[client][s] === 'undefined') {
                    }
                }
            }

            if (typeof CRAFT === 'object') {
                for (var s in window.CRAFT) {
                    if (typeof window.CRAFT[s] === 'number') {
                    }
                }
            }

            if (typeof game === 'object') {
                for (var s in window.game) {
                    if (typeof window.game[s] === 'boolean') {
                    } else if (typeof window.game[s] === 'function') {
                        var deobfunc = deobfuscate_func(window.game[s].toString());
                        if (deobfunc.abbr.match(/draw_ui_gear/)) {
                            window.draw_UI = s;
                            deobmatch('draw_UI', s);
                        } else if (deobfunc.abbr.match(/this\.chest_lockpick\.info\.translate\.y/)) {
                            window.update_inv_buttons = s;
                            deobmatch('update_inv_buttons', s);
                        }
                    } else if (typeof window.game[s] === 'number') {
                    } else if (typeof window.game[s] === 'object') {
                        if (window.game[s] === null) {
                        } else if (Array.isArray(window.game[s])) {
                            if (window.game[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.game[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.game[s].some(isNaN)) {
                            } else if (window.game[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.game[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.game[s] === 'string') {
                    } else if (typeof window.game[s] === 'undefined') {
                    }
                }
            }

            if (typeof INV === 'object') {
                for (var s in window.INV) {
                    if (typeof window.INV[s] === 'number') {
                    }
                }
            }

            if (typeof ITEMS === 'object') {
                for (var s in window.ITEMS) {
                    if (typeof window.ITEMS[s] === 'number') {
                    }
                }
            }

            if (typeof keyboard === 'object') {
                for (var s in window.keyboard) {
                    if (typeof window.keyboard[s] === 'boolean') {
                    } else if (typeof window.keyboard[s] === 'function') {
                    } else if (typeof window.keyboard[s] === 'number') {
                    } else if (typeof window.keyboard[s] === 'object') {
                        if (window.keyboard[s] === null) {
                        } else if (Array.isArray(window.keyboard[s])) {
                            if (window.keyboard[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.keyboard[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.keyboard[s].some(isNaN)) {
                            } else if (window.keyboard[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.keyboard[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.keyboard[s] === 'string') {
                    } else if (typeof window.keyboard[s] === 'undefined') {
                    }
                }
            }

            if (typeof loader === 'object') {
                for (var s in window.loader) {
                    if (typeof window.loader[s] === 'boolean') {
                    } else if (typeof window.loader[s] === 'function') {
                    } else if (typeof window.loader[s] === 'number') {
                    } else if (typeof window.loader[s] === 'object') {
                        if (window.loader[s] === null) {
                        } else if (Array.isArray(window.loader[s])) {
                            if (window.loader[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.loader[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.loader[s].some(isNaN)) {
                            } else if (window.loader[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.loader[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.loader[s] === 'string') {
                    } else if (typeof window.loader[s] === 'undefined') {
                    }
                }
            }

            if (typeof RECIPE_CATEGORIES === 'object') {
                for (var s in window.RECIPE_CATEGORIES) {
                    if (typeof window.RECIPE_CATEGORIES[s] === 'number') {
                    }
                }
            }

            if (typeof scoreboard === 'object') {
                for (var s in window.scoreboard) {
                    if (typeof window.scoreboard[s] === 'boolean') {
                    } else if (typeof window.scoreboard[s] === 'function') {
                    } else if (typeof window.scoreboard[s] === 'number') {
                    } else if (typeof window.scoreboard[s] === 'object') {
                        if (window.scoreboard[s] === null) {
                        } else if (Array.isArray(window.scoreboard[s])) {
                            if (window.scoreboard[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.scoreboard[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.scoreboard[s].some(isNaN)) {
                            } else if (window.scoreboard[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.scoreboard[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.scoreboard[s] === 'string') {
                    } else if (typeof window.scoreboard[s] === 'undefined') {
                    }
                }
            }

            if (typeof SPRITE === 'object') {
                for (var s in window.SPRITE) {
                    if (typeof window.SPRITE[s] === 'object') {
                        if (Array.isArray(window.SPRITE[s])) {
                            if (window.SPRITE[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.SPRITE[s].some(isNaN)) {
                                // Every item is coercible to a number
                            }
                        }
                    } else if (typeof window.SPRITE[s] === 'number') {
                    }
                }
            }

            if (typeof STATE === 'object') {
                for (var s in window.STATE) {
                    if (typeof window.STATE[s] === 'number') {
                        if (window.STATE[s] === 16) {
                            STATE.ATTACK = STATE[s];
                            deobmatch('ATTACK', s);
                            // Also fill in for CLIENT.ATTACK and WORLD.SPEED_ATTACK
                            CLIENT.ATTACK = CLIENT[s];
                            WORLD.SPEED_ATTACK = WORLD['SPEED_'+s];
                        }
                    }
                }
            }

            if (typeof ui === 'object') {
                for (var s in window.ui) {
                    if (typeof window.ui[s] === 'boolean') {
                    } else if (typeof window.ui[s] === 'function') {
                        var deobfunc = deobfuscate_func(window.ui[s].toString());
                        if (deobfunc.abbr.match(/Cookies\.set\(.starve_mapping.,.azerty.\)/)) {
                            window.ui.set_azerty = ui[s];
                            deobmatch('set_azerty', s);
                        } else if (deobfunc.abbr.match(/Cookies\.set\(.starve_mapping.,.qwerty.\)/)) {
                            window.ui.set_qwerty = ui[s];
                            deobmatch('set_qwerty', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z]\){@\(this\.can,[a-z]\)}$/)) { // v15 2 matches
                            if (deobfuscate_func(window.UI.toString().replace(/\n/g, '')).orig.split(new RegExp('EventListener\\(\'mousedown\',this\.' + s)).length > 1) {
                                window.ui.trigger_mousedown = ui[s];
                                deobmatch('trigger_mousedown', s);
                                // Populate duplicates
                                game.trigger_mousedown = game[s];
                            } else if (deobfuscate_func(window.UI.toString().replace(/\n/g, '')).orig.split(new RegExp('EventListener\\(\'mouseup\',this\.' + s)).length > 1) {
                                window.ui.trigger_mouseup = ui[s];
                                deobmatch('trigger_mouseup', s);
                                // Populate duplicates
                                game.trigger_mouseup = game[s];
                            }
                        } else if (deobfunc.abbr.match(/^function \([a-z]\){@\(this\.can,[a-z]\);[a-z]\.style\.cursor=.auto.}$/)) {
                                window.ui.trigger_mousemove = ui[s];
                                deobmatch('trigger_mousemove', s);
                                // Populate duplicates
                                game.trigger_mousemove = game[s];
                        } else if (deobfunc.abbr.match(/window\.addEventListener/)) {
                                window.ui.add_event_listener = ui[s];
                                deobmatch('add_event_listener', s);
                                // Populate duplicates
                                game.add_event_listener = game[s];
                        } else if (deobfunc.abbr.match(/window\.removeEventListener/)) {
                                window.ui.remove_event_listener = ui[s];
                                deobmatch('remove_event_listener', s);
                                // Populate duplicates
                                game.remove_event_listener = game[s];
                        }
                    } else if (typeof window.ui[s] === 'number') {
                    } else if (typeof window.ui[s] === 'object') {
                        if (window.ui[s] === null) {
                        } else if (Array.isArray(window.ui[s])) {
                            if (window.ui[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.ui[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.ui[s].some(isNaN)) {
                            } else if (window.ui[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.ui[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.ui[s] === 'string') {
                    } else if (typeof window.ui[s] === 'undefined') {
                    }
                }
            }

            if (typeof user === 'object') {
                for (var s in window.user) {
                    if (typeof window.user[s] === 'boolean') {
                    } else if (typeof window.user[s] === 'function') {
                    } else if (typeof window.user[s] === 'number') {
                    } else if (typeof window.user[s] === 'object') {
                        if (window.user[s] === null) { } //ignore
                        else if (Array.isArray(window.user[s])) {
                            if (window.user[s].every(function(i) { return typeof i === "string" })) {
                            } else if (!window.user[s].some(isNaN)) {
                                // Every item is coercible to a number
                            } else if (window.user[s].some(isNaN)) {
                            } else if (window.user[s].every(function(i) { return !Array.isArray(i); })) {
                            } else {
                            }
                        } else if (typeof window.user[s].hasOwnProperty !== 'undefined') {
                            if ((window.user[s].hasOwnProperty('enabled') || window.user[s].hasOwnProperty('invert') || window.user[s].hasOwnProperty('translate'))
                                && !window.user[s].hasOwnProperty('can') && !window.user[s].hasOwnProperty('delay') && !window.user[s].hasOwnProperty('draw')
                                && !window.user[s].hasOwnProperty('ids') && !window.user[s].hasOwnProperty('init') && !window.user[s].hasOwnProperty('label')
                                && !window.user[s].hasOwnProperty('now') && !window.user[s].hasOwnProperty('rotate') && !window.user[s].hasOwnProperty('sort')
                                && !window.user[s].hasOwnProperty('update')
                                ) {
                                    window.spectators = s;
                                    deobmatch('spectators', s);
                            }
                        }
                    } else if (typeof window.user[s] === 'string') {
                    } else if (typeof window.user[s] === 'undefined') {
                    }
                }
            }

            if (typeof Utils === 'object') {
                for (var s in window.Utils) {
                    if (typeof window.Utils[s] === 'function') {
                        var deobfunc = deobfuscate_func(window.Utils[s].toString());
                        if (deobfunc.abbr.match(/^function \([a-z]\){window\.open\([a-z],'_blank'\)\.focus\(\)}$/)) {
                            window.Utils.open_in_new_tab = Utils[s];
                            deobmatch('open_in_new_tab', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return{x:[a-z]\.x-[a-z]\.x,y:[a-z]\.y-[a-z]\.y}}$/)) {
                            window.Utils.get_vector = Utils[s];
                            deobmatch('get_vector', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return [a-z]\.x\*[a-z]\.x\+[a-z]\.y\*[a-z]\.y}$/)) {
                            window.Utils.scalar_product = Utils[s];
                            deobmatch('scalar_product', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return [a-z]\.x\*[a-z]\.y-[a-z]\.y\*[a-z]\.x}$/)) {
                            window.Utils.cross_product = Utils[s];
                            deobmatch('cross_product', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return Math\.acos/)) {
                            window.Utils.get_angle = Utils[s];
                            deobmatch('get_angle', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return this\.@\({x:1,y:0\},this\.@\([a-z],[a-z]\)\)}$/)) {
                            window.Utils.get_std_angle = Utils[s];
                            deobmatch('get_std_angle', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z],[a-z]\){[a-z]\.x\+=[a-z];[a-z]\.y\+=[a-z]}$/)) {
                            window.Utils.translate_vector = Utils[s];
                            deobmatch('translate_vector', s);
                        } else if (deobfunc.abbr.match(/^function \(\){return\.5<Math\.random\(\)\?1:-1}$/)) {
                            window.Utils.rand_sign = Utils[s];
                            deobmatch('rand_sign', s);
                        } else if (deobfunc.abbr.match(/2E4/)) {
                            window.Utils.restore_number = Utils[s];
                            deobmatch('restore_number', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z]\){if\(1E4<=/)) {
                            window.Utils.simplify_number= Utils[s];
                            deobmatch('simplify number', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z]\){return [a-z]\*\(2-[a-z]\)}$/)) {
                            window.Utils.ease_out_quad= Utils[s];
                            deobmatch('ease_out_quad', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z],[a-z],[a-z],[a-z],[a-z]\){this\.o=/)) {
                            window.Utils.LinearAnimation= Utils[s];
                            deobmatch('LinearAnimation', s);
                        } else if (deobfunc.abbr.match(/fromCharCode/)) {
                            window.Utils.rand_string = Utils[s];
                            deobmatch('rand_string', s);
                        } else if (deobfunc.abbr.match(/^function \([a-z],[a-z]\){return [a-z]\.x>=[a-z]\.x&&[a-z]\.x<=[a-z]\.x\+[a-z]\.w/)) {
                            window.Utils.contains = Utils[s];
                            deobmatch('contains', s);
                        }
                    }
                }
            }

            if (typeof WORLD === 'object') {
                for (var s in window.WORLD) {
                    if (typeof window.WORLD[s] === 'number') {
                    }
                }
            }

            if (typeof world === 'object') {
                for (var s in window.world) {
                    if (typeof window.world[s] === 'boolean') {
                    } else if (typeof window.world[s] === 'function') {
                    } else if (typeof window.world[s] === 'number') {
                    } else if (typeof window.world[s] === 'object') {
                        if (window.world[s] === null) {
                        } else if (Array.isArray(window.world[s])) {
                            if (deobfuscate_func(window.draw_team_buttons.toString()).orig.split(s).length === 2) {
                                window.fast_units = s;
                                deobmatch('fast_units', s);
                            } else if (typeof audio[s] !== 'undefined') {
                                window.players = s;
                                deobmatch('players', s);
                            } else if (window.world[s].every(function(i) { return !Array.isArray(i); })) {
                            }
                        } else if (typeof window.world[s].hasOwnProperty !== 'undefined') {
                        }
                    } else if (typeof window.world[s] === 'string') {
                    } else if (typeof window.world[s] === 'undefined') {
                    }
                }
            }
        } else if (stage === 3) {
            // Then detect remaining properties of global variables

            if (typeof client === 'string' && typeof window[client] === 'object') {
                for (var s in window[client]) {
                    if (typeof window[client][s] === 'number') {
                        if (window[client][s] === 0) {
                            if ((typeof window.update_cam !== 'undefined' && deobfuscate_func(window[client][update_cam].toString()).orig.toString().indexOf(s) > -1)) {
                                window.cam_delay = s;
                                deobmatch('cam_delay', s);
                            } else if ((typeof window.try_ping !== 'undefined' && deobfuscate_func(window[client][try_ping].toString()).orig.toString().indexOf(s) > -1)) {
                                window.ping_delay = s;
                                deobmatch('ping_delay', s);
                            }
                        }
                    }
                }
            }
        } else if (stage === 4) {
            // Then check if anything was missed

            for (var s in window) {
                if (s.match(/.*O_O[0-9]{3,6}0_0.*/) && !deoblist.deob2ob.hasOwnProperty(s)) {
                    if (window[s] === window) {} // ignore
                    else if (window[s] === 10000) {} // ignore
                    else if (typeof window[s] === 'string' && window[s].match(/^[0-9a-zA-Z_-]*$/)) { } // ignore
                    else {
                        // Useful for seeing what's missing
                        // Still missing variables, will add later
                        //console.log(['missing',s,window[s]]);
                    }
                }
            }
        }
    }

    function checkDependencies() {
        if (typeof game !== 'undefined' && typeof ui !== 'undefined' && typeof user !== 'undefined') {
            deobfuscate();
        } else {
            setTimeout(checkDependencies, 50);
        }
    }

    function deobfuscate() {
        // First detect OBFUSCATOR_ARR and OBFUSCATOR_FN to reference in next stage
        autodetect(0);
        // Then detect all global variables, constants and functions
        autodetect(1);
        // Then detect most properties of global variables to reference in next stage
        autodetect(2);
        // Then detect remaining properties of global variables
        autodetect(3);
        // Then check if anything was missed
        autodetect(4);

        window.OBFUSCATOR_FN_INV = function(n) { for (var x=0; x<OBFUSCATED_ARR.length; x++) { if (OBFUSCATOR_FN(x) === n) return '0x'+x.toString(16); } };

        window.deobauto = true;
    }

    window.deobfuscate_func = function(deobfunc) {
        deobfunc = deobfunc.replace(/(\[?)_0x[0-9a-fA-F]{4}\("(0x[0-9a-fA-F]+)"\)(\]?)/g, function() {
            return (arguments[1] === '[' ? '.' : '\'') + OBFUSCATOR_FN(arguments[2]) + (arguments[3] === ']' ? '' : '\'');
        });
        return {
            orig: deobfunc,
            abbr: deobfunc
                .replace(/[A-Za-z0-9_]*yolo[0-9]{3,}[A-Za-z0-9_]*/g, '@')
                .replace(/[A-Za-z0-9_]*Lapa[0-9]{3,}Mauve[A-Za-z0-9_]*/g, '@')
                .replace(/[A-Za-z0-9_]*O_O[0-9]{3,}0_0[A-Za-z0-9_]*/g, '@')
                .replace(/[a-z@]\.restore\(\)/g, 'RESTORE') // v15 104 matches in all functions
                .replace(/[a-z@]\.rotate\([a-z]*.angle\)/g, 'ROTATE') // v15 26 matches in all functions
                .replace(/[a-z@]\.save\(\)/g, 'SAVE') // v15 104 matches in all functions
                .replace(/@.translate\(user\.cam\.x\+this\.x,user\.cam.y\+this\.y\)/g, 'TUPT') // v15 21 matches in all functions
                // simplify init_fake_world
                .replace(/document\.getElementById\('game_body'\)\.style\.backgroundColor=@.GROUND\[@\.time\]/, 'IFWBGC') // v15 2 matches in all functions
        }
    }

    function deobmatch(name, deob) {
        if (deoblist.ob2deob.hasOwnProperty(deob)) {
            console.log(['duplicate', name, deob, window[deob]]);
            return true;
        } else {
            deoblist.deob2ob[deob] = name;
            deoblist.ob2deob[name] = deob;
            return false;
        }
    }

    checkDependencies();
})();