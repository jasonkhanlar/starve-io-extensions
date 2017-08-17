// ==UserScript==
// @name         Starve.io extensions
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  (1) On screen chat buffer (2) On screen help (3) Auto-book (4) Auto-cook
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var chat_log = document.createElement('div');
    var chat_log_table = document.createElement('table');
    var chat_log_tbody = document.createElement('tbody');
    var chat_log_last = {};
    chat_log.id = 'chat_log';
    chat_log.style.marginLeft= '1em';
    //chat_log.style.maxWidth = (can.width / 2 - sprite[SPRITE.BODY][0].width * 0.6 * 2) + 'px';
    chat_log.style.maxWidth = (can.width / 2 - 88) + 'px';
    chat_log.style.opacity = 0.5;
    chat_log.style.overflowY = 'hidden';
    chat_log.style.position = 'fixed';
    chat_log.style.top = '100px';
    chat_log_table.style.borderSpacing = '0';
    chat_log_table.style.color = '#FFFFFF';
    chat_log_table.style.textShadow = '#000000 1px 1px 1px';
    chat_log_table.appendChild(chat_log_tbody);
    chat_log.appendChild(chat_log_table);
    document.body.appendChild(chat_log);
    setInterval(function() {
        //temp1[0].info.img[0]
        if (typeof user !== 'undefined' && typeof user.craft !== 'undefined') {
            var _top = 0;
            if (user.craft.can_craft.length === 1) _top = user.craft.can_craft[0].info.translate.y + user.craft.can_craft[0].info.img[0].height;
            else if (user.craft.can_craft.length === 2) _top = user.craft.can_craft[1].info.translate.y + user.craft.can_craft[1].info.img[0].height;
            else if (user.craft.can_craft.length === 3) _top = user.craft.can_craft[2].info.translate.y + user.craft.can_craft[2].info.img[0].height;
            else if (user.craft.can_craft.length >= 4) _top = user.craft.can_craft[3].info.translate.y + user.craft.can_craft[3].info.img[0].height;

            if (_top < 100) _top = 100;
            chat_log.style.top = _top + 'px';
            chat_log.style.maxHeight = (can.height - _top - 100) +'px';

        }
    }, 50);

    var unique_index_counter = 500;
    function find_unique_index() {
        while(typeof sprite[unique_index_counter] !== 'undefined') {
            unique_index_counter++;
        }
        return unique_index_counter;
    }

    var create_help = function() {
        var title = 'HELP MENU';
        var title_font = "bold 40px Baloo Paaji";
        var letter_font = "bold 35px Baloo Paaji";
        var msg_font = "30px Baloo Paaji";

        var title_font_height = 40 * 1.1;
        var letter_font_height = 35 * 1.1;
        var msg_font_height = 30 * 1.1;

        var help_messages = [
         [ 'H', 'Open Help - open this help menu' ],
         [ 'Y', 'Open Map - open the larger map' ],
         [ 'R', 'Auto-Feed - auto-consume food/drink when low' ],
         [ 'T', 'Auto-Book - auto-equip book on craft' ],
         [ 'P', 'Show Spectators - only in hunger games' ],
         [ 'C', 'Auto-Cook - auto-cook meals when possible' ],
         [ '`', 'Chat Buffer - hide/show chat messages' ]
        ];

        var edge_padding_x = 5;
        var top_edge_padding_y = 15;
        var bot_edge_padding_y = 3;
        var title_padding_extra_y = 5;
        var line_padding_y = 3;
        var letter_msg_padding = 3;

        var temp_canv = document.createElement("canvas");
        var temp_ctx = temp_canv.getContext("2d");

        var longest_letter = 0;
        var longest_msg = 0;
        var total_height = top_edge_padding_y + title_font_height + title_padding_extra_y;
        for (var i = 0; i < help_messages.length; i++) {
          total_height += line_padding_y;

          temp_ctx.font = letter_font;
          var letter_metrics = temp_ctx.measureText(help_messages[i][0]);

          temp_ctx.font = msg_font;
          var msg_metrics = temp_ctx.measureText(help_messages[i][1]);
          longest_letter = Math.max(longest_letter, letter_metrics.width);
          longest_msg = Math.max(longest_msg, msg_metrics.width);
          total_height += Math.max(msg_font_height, letter_font_height);
        }
        total_height += bot_edge_padding_y;

        var total_width = edge_padding_x + longest_letter + letter_msg_padding + longest_msg + edge_padding_x;

        temp_canv.width = total_width;
        temp_canv.height = total_height;

        temp_ctx.globalAlpha = 0.5;
        round_rect(temp_ctx, 0, 0, temp_canv.width, temp_canv.height, 10);
        fill_path(temp_ctx, "#000");

        temp_ctx.globalAlpha = 1.0;

        temp_ctx.textAlign = 'left';
        temp_ctx.fillStyle = '#FFF';
        temp_ctx.font = title_font;
        temp_ctx.fillText(title, (temp_canv.width / 2) - (temp_ctx.measureText(title).width / 2), top_edge_padding_y + title_font_height / 2);

        temp_ctx.textAlign = 'left';
        var y = top_edge_padding_y + title_font_height + title_padding_extra_y;
        for (i = 0; i < help_messages.length; i++) {
          y += line_padding_y;

          var x = edge_padding_x;
          temp_ctx.font = letter_font;
          temp_ctx.fillText(help_messages[i][0], x, y + letter_font_height / 2);
          x += longest_letter + letter_msg_padding;

          temp_ctx.font = msg_font;
          temp_ctx.fillText(help_messages[i][1], x, y + msg_font_height / 2);
          y += Math.max(letter_font_height, msg_font_height);
        }

        return temp_canv;
    };

    function draw_ext_auto_book() {
        if (user.auto_book.enabled) { ctx.drawImage(sprite[SPRITE.AUTO_BOOK], user.auto_book.translate.x, user.auto_book.translate.y); }
    }

    function draw_ext_auto_cook() {
        if (user.auto_cook.enabled) { ctx.drawImage(sprite[SPRITE.AUTO_COOK], user.auto_cook.translate.x, user.auto_cook.translate.y); }
    }

    function draw_ext_help() {
        if (user.ext_help.enabled) { ctx.drawImage(sprite[SPRITE.EXT_HELP], user.ext_help.translate.x, user.ext_help.translate.y); }
    }

    // Required before game is fully loaded
    window.ctx = Lapa3343Mauve; // '0x537'
    window.loaded = false;
    window.SPRITE = Lapa3295Mauve;

    window.checkLoaded = function() {
        if (typeof game !== "undefined" && typeof ui !== "undefined" && typeof scoreboard !== "undefined" && typeof user !== "undefined") {
            Loaded();
        } else {
            setTimeout(checkLoaded, 50);
        }
    };

    window.Loaded = function() {
        // DEOBFUSCATION
        window.client = Lapa3279Mauve;
        window.CLIENT_BUILD_STOP_FN_NAME = 'Lapa3244Mauve'; // '0x5f6'
        window.CLIENT_DELETE_INV_FN_NAME = 'Lapa3253Mauve'; // '0x639'
        window.CLIENT_GET_TIME_FN_NAME = 'Lapa3258Mauve'; // '0x60f'
        window.CLIENT_MAKE_RECIPE_FN_NAME = 'Lapa3272Mauve'; // '0x626'
        window.CLIENT_SELECT_INV_FN_NAME = 'Lapa3273Mauve'; // '0x631'
        window.CLIENT_SERVER_LIST = client.Lapa3432Mauve; // '0x5cf'
        window.CLIENT_SOCKET_VAR_NAME = 'Lapa3229Mauve'; // '0x5cd'
        window.CURRENT_FRAME_RATE_VAR_NAME = 'Lapa3348Mauve';
        window.DRAW_UI_INVENTORY_FN_NAME = 'Lapa3236Mauve';
        window.GAME_DRAW_UI_FN_NAME = 'Lapa3345Mauve'; // '0x816'
        window.GAME_TRIGGER_KEYUP_FN_NAME = 'Lapa3328Mauve'; // '0x81d'
        window.GAME_UPDATE_SCENE_FN_NAME = 'Lapa3340Mauve'; // '0x817'
        window.get_mouse_pos = Lapa3412Mauve;
        window.ITEM_NAMES_VAR_NAME = Lapa3206Mauve;
        window.INV_SEEDS_VAR_NAME = 'INV_Lapa3464Mauve'; // '0x1bb'
        window.INV_WHEAT_SEEDS_VAR_NAME = 'INV_WHEAT_Lapa3464Mauve'; // '0x1b4'
        window.OBFUSCATED_VAR_NAME = _0xbf9d;
        window.OBFUSCATOR_FN = _0xdbf9;
        window.OBFUSCATOR_FN_INV = function(n) { for (var x=0; x<OBFUSCATED_VAR_NAME.length; x++) { if (OBFUSCATOR_FN(x) === n) return '0x'+x.toString(16); } };
        window.RECIPES = Lapa3294Mauve;
        window.SELECT_CRAFT_FN_NAME = 'Lapa3272Mauve'; // '0x626'
        window.SPRITE_COUNTER_VAR_NAME = 'Lapa3203Mauve'; // '0x459'
        window.UI_PLAY_GAME_FUNCTION_NAME = 'play_game'; // '0x78b'
        window.UPDATE_INV_BUTTONS_FN_NAME = 'Lapa3337Mauve'; // '0x5f7'
        window.USER_SHOW_SPECTATORS_FN_NAME = 'Lapa3413Mauve'; // '0x533'
        window.USER_GAUGES_WATER_METER_VAR_NAME = 't';
        window.USER_INV_DELETE_ITEM_FN_NAME = 'delete_item'; // '0x63a'
        window.USER_INV_VAR_NAME = 'inv'; // '0x523'
        window.USER_UID_VAR_NAME = 'uid'; // '0x4f7'
        window.world = Lapa3360Mauve;
        window.WORLD = Lapa3241Mauve;
        window.WORLD_FAST_UNITS_ARR_NAME = 'Lapa3322Mauve'; // '0x4f6'
        // END DEOBFUSCATION

        SPRITE.AUTO_BOOK = find_unique_index();
        sprite[SPRITE.AUTO_BOOK] = create_text(1, "Auto-Book", 25, "#FFF", void 0, void 0, "#000", 5, 140);
        SPRITE.AUTO_COOK = find_unique_index();
        sprite[SPRITE.AUTO_COOK] = create_text(1, "Auto-Cook", 25, "#FFF", void 0, void 0, "#000", 5, 140);
        SPRITE.EXT_HELP = find_unique_index();
        sprite[SPRITE.EXT_HELP] = CTI(create_help());
        SPRITE.SLOT_NUMBERS_MAPPED = find_unique_index();
        sprite[SPRITE.SLOT_NUMBERS_MAPPED] = {};
        sprite[SPRITE.SLOT_NUMBERS_MAPPED][9] = create_text(1, '0', 12, "#FFF");
        sprite[SPRITE.SLOT_NUMBERS_MAPPED][10] = create_text(1, 'P', 12, "#FFF");

        user.auto_book = {
            enabled: false,
            translate: {x: 0,y: 0},
            equip_book: function() {
                if (this.enabled) {
                    if (user.inv.n[INV.BOOK]) {
                        var thePlayer = world[WORLD_FAST_UNITS_ARR_NAME][user.uid];
                        if (thePlayer.right != INV.BOOK) {
                            client[CLIENT_SELECT_INV_FN_NAME](INV.BOOK, user.inv.find_item(INV.BOOK));
                        }
                    }
                }
            }
        };
        user.auto_cook = {
            enabled: false,
            translate: {x: 0,y: 0},
            cook: function() {
                if (this.enabled) {
                    if (user.craft.fire && user.inv.n[INV.PLANT] >= 2 && user.inv.n[INV.FLOUR] >= 5 && user.inv.n[INV.ICE] >= 2) {
                        // Cake recipe (id 35) :: 2 berries (id 4), 5 flour (id 77), 2 ice (id 91)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](35);
                    } else if (user.craft.fire && user.inv.n[INV.PLANT] >= 1 && user.inv.n[INV.FLOUR] >= 3) {
                        // Cookies recipe (id 34) :: 1 berry (id 4), 3 flour (id 77)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](34);
                    } else if (user.craft.fire && user.inv.n[INV.FOODFISH] >= 1) {
                        // Cooked Fish recipe (id 32) :: 1 fish (id 86)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](32);
                    } else if (user.craft.fire && user.inv.n[INV.MEAT] >= 1) {
                        // Cooked Meat recipe (id 31) :: 1 meat (id 18)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](31);
                    } else if (user.craft.fire && user.inv.n[INV.FLOUR] >= 3) {
                        // Bread recipe (id 33) :: 3 flour (id 77)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](33);
                    } else if (user.inv.n[INV.BREAD] >= 1 && user.inv.n[INV.COOKED_MEAT] >= 1) {
                        // Sandwich recipe (id 78) :: 1 bread (id 92), 1 cooked meat (id 19)
                        client[CLIENT_MAKE_RECIPE_FN_NAME](78);
                    }
                }
            }
        };
        user.craft.do_craft = function(recipeID) {
            var recipe = RECIPES[recipeID];
            this.id = recipeID;
            this.crafting = true;
            if ((user.auto_book.enabled && user.inv.n[INV.BOOK]) ||
            world[WORLD_FAST_UNITS_ARR_NAME][user.uid].right == INV.BOOK) {
                this.timeout.max_speed = recipe.time * 3;
            } else {
                this.timeout.max_speed = recipe.time;
            }
            this.id2 = recipe.id2;
            for (var counter = 0; counter < recipe.r.length; counter++) {
                var resource = recipe.r[counter];
                user.inv.decrease(resource[0], resource[1], user.inv.find_item(resource[0]));
            }
            game[UPDATE_INV_BUTTONS_FN_NAME]();
        };
        window.old_user_craft_update = user.craft.update;
        user.craft.update = function() {
            old_user_craft_update.apply(this);
            user.auto_cook.cook();
        };
        user.ext_help = { enabled: false, translate: { x: 0, y: 0 } };
        user.keycodes_to_mapped_keycodes = {}; // contains things like: { 68: 96 }

        window.old_game_drawUI = game[GAME_DRAW_UI_FN_NAME];
        game[GAME_DRAW_UI_FN_NAME] = function() {
            old_game_drawUI.apply(this, arguments);
            draw_ext_auto_book();
            draw_ext_auto_cook();
            draw_ext_help();
        };

        window.old_game_update = game.update;
        game.update = function() {
            old_game_update.apply(this);
            user.auto_book.translate.x = game.leaderboard.translate.x - sprite[SPRITE.AUTO_BOOK].width - 10;
            user.auto_book.translate.y = user[USER_SHOW_SPECTATORS_FN_NAME].translate.y + sprite[SPRITE.SHOW_SPECTATORS].height + 5;
            user.auto_cook.translate.x = game.leaderboard.translate.x - sprite[SPRITE.AUTO_COOK].width - 10;
            user.auto_cook.translate.y = user.auto_book.translate.y + sprite[SPRITE.AUTO_BOOK].height + 5;
            user.ext_help.translate.x = can.width / 2 - sprite[SPRITE.EXT_HELP].width / 2;
            user.ext_help.translate.y = can.height / 2 - sprite[SPRITE.EXT_HELP].height / 2;
        };

        var my_trigger_key_up = function(c) {
            var keycode = c.keyCode;
            if (user.keycodes_to_mapped_keycodes[keycode]) {
                keycode = user.keycodes_to_mapped_keycodes[keycode];
            }

            if (!user.chat.open)  {
                if (keycode == 84) { user.auto_book.enabled = !user.auto_book.enabled; }
                else if (keycode == 72) { user.ext_help.enabled = !user.ext_help.enabled; }
                else if (keycode == 67) { user.auto_cook.enabled = !user.auto_cook.enabled; user.auto_cook.cook(); }
                else if (keycode == 192) { document.getElementById('chat_log').style.display = document.getElementById('chat_log').style.display == 'none' ? '' : 'none'; }
            }
        };

        window.addEventListener("keyup", my_trigger_key_up, false);

        window.old_select_craft = client[SELECT_CRAFT_FN_NAME];
        client[SELECT_CRAFT_FN_NAME] = function() {
            if (user.weapon.timeout.v !== 0 && user.inv.n[INV.BOOK]) {
                var alertMsg = "You can't equip your book right now.";
                if (user.alert.text) user.alert.list.push(alertMsg);
                else user.alert.text = alertMsg;
                return;
            }
            user.auto_book.equip_book();
            old_select_craft.apply(this, arguments);
        };

        window.old_Lapa3376Mauve = Lapa3376Mauve;
        Lapa3376Mauve = function() {
            old_Lapa3376Mauve.apply(this);
            // Show only unique chat messages per player, even if someone repeats themselves
            if (this.text && (!chat_log_last.hasOwnProperty(this.player.nickname) || chat_log_last[this.player.nickname] !== this.text) && this.text !== this.player.nickname) {
                chat_log_last[this.player.nickname] = this.text;
                var chat_log_tr = document.createElement('tr');
                var chat_log_msg = document.createElement('td');
                var chat_log_nick = document.createElement('td');
                chat_log_nick.style.fontFamily = 'Baloo Paaji';
                chat_log_nick.style.fontSize = '0.9em';
                chat_log_nick.style.fontWeight = 'bold';
                chat_log_nick.style.lineHeight= '1.5em';
                chat_log_nick.style.paddingRight = '8px';
                chat_log_nick.style.textAlign = 'right';
                chat_log_nick.style.verticalAlign = 'top';
                chat_log_nick.style.whiteSpace = 'nowrap';
                chat_log_nick.innerHTML = this.player.nickname + ':';
                chat_log_msg.innerHTML = this.text;
                chat_log_msg.style.fontFamily = 'sans-serif';
                chat_log_msg.style.lineHeight = '1em';
                chat_log_tr.append(chat_log_nick);
                chat_log_tr.append(chat_log_msg);
                chat_log_tbody.prepend(chat_log_tr);
            }
        };
    };

    // rearrange inventory
    function reset_inventory_indexes() {
        user.inventory_index_to_mapped_index = []
        for(var index = 0; index < 15; index++) {
            user.inventory_index_to_mapped_index[index] = index;
        }
    }
    //reset_inventory_indexes();

    checkLoaded();
})();
