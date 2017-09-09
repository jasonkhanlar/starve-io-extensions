// ==UserScript==
// @name         Starve.io extensions
// @namespace    http://tampermonkey.net/
// @version      0.15.32
// @description  (1) On screen chat buffer (2) On screen help (3) Auto attack (4) Auto book (5) Auto cook
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency
// Compatible with version 15 of Starve.io client

(function() {
    'use strict';

    // Server select menu looks ugly, fix it
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    var sheet = style.sheet;
    sheet.insertRule('.md-select ul[role=listbox] { background: #be7c24; }');
    sheet.insertRule('.md-select ul[role=listbox] li { white-space: nowrap; }');
    sheet.insertRule('.md-select ul[role=listbox] li:hover { background: #68e0d1; }');
    sheet.insertRule('.md-select ul[role=listbox] li.active { background: #38BDB1; }');
    sheet.insertRule('#selectDisabled { background-color: #38BDB1; color: #133A2B; }');
    sheet.insertRule('.md-select.active ul { background: #be7c24; }');

    var chat_log = document.createElement('div');
    var chat_log_table = document.createElement('table');
    var chat_log_tbody = document.createElement('tbody');
    var chat_log_last = {};
    chat_log.id = 'chat_log';
    chat_log.style.marginLeft= '1em';
    //chat_log.style.maxWidth = (can.width / 2 - sprite[SPRITE.BODY][0].width * 0.6 * 2) + 'px';
    chat_log.style.maxWidth = 'calc(50% - 88px)';
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

    function find_recipe(ingredients) {
        for (var recipeID = 0; recipeID < RECIPES.length; recipeID++) {
            if (RECIPES[recipeID].r.length === ingredients.length) {
                var match = true;
                for (var ingrID = 0; ingrID < ingredients.length; ingrID++) {
                    if (JSON.stringify(RECIPES[recipeID].r).indexOf(JSON.stringify(ingredients[ingrID])) === -1) match = false;
                }
                if (match) return recipeID;
            }
        }
    }

    var unique_index_counter = 500;
    function find_unique_index() {
        while(typeof sprite[unique_index_counter] !== 'undefined') {
            unique_index_counter++;
        }
        return unique_index_counter;
    }

    // rearrange inventory
    function reset_inventory_indexes() {
        user.inventory_index_to_mapped_index = [];
        for(var index = 0; index < 15; index++) {
            user.inventory_index_to_mapped_index[index] = index;
        }
    }
    //reset_inventory_indexes();

    var create_help = function(title, help_messages) {
        var title_font = 'bold 40px Baloo Paaji';
        var letter_font = 'bold 35px Baloo Paaji';
        var msg_font = '30px Baloo Paaji';

        var title_font_height = 40 * 1.1;
        var letter_font_height = 35 * 1.1;
        var msg_font_height = 30 * 1.1;

        var edge_padding_x = 5;
        var top_edge_padding_y = 15;
        var bot_edge_padding_y = 3;
        var title_padding_extra_y = 5;
        var line_padding_y = 3;
        var letter_msg_padding = 3;

        var temp_canv = document.createElement('canvas');
        var temp_ctx = temp_canv.getContext('2d');

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
        fill_path(temp_ctx, '#000');

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

    function ext_update_settings_menu() {
        var ext_settings_auto_book_ing = document.createElement('div'),
        ext_settings_auto_cook_ing = document.createElement('div'),
        ext_settings_server_info_ing = document.createElement('div'),
        ext_settings_auto_attack_ing = document.createElement('div'),
        ext_settings_chat_buffer_ing = document.createElement('div'),
        ext_settings_auto_book_case_agree_opt = document.createElement('div'),
        ext_settings_auto_cook_case_agree_opt = document.createElement('div'),
        ext_settings_server_info_case_agree_opt = document.createElement('div'),
        ext_settings_auto_attack_case_agree_opt = document.createElement('div'),
        ext_settings_chat_buffer_case_agree_opt = document.createElement('div'),
        ext_settings_auto_book_agree_ing = document.createElement('img'),
        ext_settings_auto_cook_agree_ing = document.createElement('img'),
        ext_settings_server_info_agree_ing = document.createElement('img'),
        ext_settings_auto_attack_agree_ing = document.createElement('img'),
        ext_settings_chat_buffer_agree_ing = document.createElement('img');

        ext_settings_auto_book_ing.id = 'auto_book_ing';
        ext_settings_auto_cook_ing.id = 'auto_cook_ing';
        ext_settings_server_info_ing.id = 'server_info_ing';
        ext_settings_auto_attack_ing.id = 'auto_attack_ing';
        ext_settings_chat_buffer_ing.id = 'chat_buffer_ing';

        ext_settings_auto_book_ing.innerText = 'Auto Book';
        ext_settings_auto_cook_ing.innerText = 'Auto Cook';
        ext_settings_server_info_ing.innerText = 'Server Info';
        ext_settings_auto_attack_ing.innerText = 'Auto Attack';
        ext_settings_chat_buffer_ing.innerText = 'Chat Buffer';

        ext_settings_auto_attack_ing.style.display = 'inline-block';
        ext_settings_chat_buffer_ing.style.display = 'inline-block';

        ext_settings_auto_attack_ing.style.float = 'left';
        ext_settings_chat_buffer_ing.style.float = 'left';

        ext_settings_auto_book_ing.style.left = '250px';
        ext_settings_auto_cook_ing.style.left = '250px';
        ext_settings_server_info_ing.style.left = '250px';

        ext_settings_auto_book_ing.style.position = 'absolute';
        ext_settings_auto_cook_ing.style.position = 'absolute';
        ext_settings_server_info_ing.style.position = 'absolute';

        ext_settings_auto_attack_ing.style.marginLeft = '18px';
        ext_settings_chat_buffer_ing.style.marginLeft = '18px';

        ext_settings_auto_attack_ing.style.marginRight = '150px';
        ext_settings_chat_buffer_ing.style.marginRight = '150px';

        ext_settings_auto_attack_ing.style.marginTop = '15px';
        ext_settings_chat_buffer_ing.style.marginTop = '15px';

        ext_settings_auto_attack_ing.style.outline = 'none';
        ext_settings_chat_buffer_ing.style.outline = 'none';

        ext_settings_auto_book_ing.style.top = '250px';
        ext_settings_auto_cook_ing.style.top = '300px';
        ext_settings_server_info_ing.style.top = '350px';

        ext_settings_auto_book_case_agree_opt.id = 'auto_book_case_agree_opt';
        ext_settings_auto_cook_case_agree_opt.id = 'auto_cook_case_agree_opt';
        ext_settings_server_info_case_agree_opt.id = 'server_info_case_agree_opt';
        ext_settings_auto_attack_case_agree_opt.id = 'auto_attack_case_agree_opt';
        ext_settings_chat_buffer_case_agree_opt.id = 'chat_buffer_case_agree_opt';

        ext_settings_auto_book_case_agree_opt.style.border = 'solid 2px #755219';
        ext_settings_auto_cook_case_agree_opt.style.border = 'solid 2px #755219';
        ext_settings_server_info_case_agree_opt.style.border = 'solid 2px #755219';
        ext_settings_auto_attack_case_agree_opt.style.border = 'solid 2px #755219';
        ext_settings_chat_buffer_case_agree_opt.style.border = 'solid 2px #755219';

        ext_settings_auto_book_case_agree_opt.style.borderRadius = '7px';
        ext_settings_auto_cook_case_agree_opt.style.borderRadius = '7px';
        ext_settings_server_info_case_agree_opt.style.borderRadius = '7px';
        ext_settings_auto_attack_case_agree_opt.style.borderRadius = '7px';
        ext_settings_chat_buffer_case_agree_opt.style.borderRadius = '7px';

        ext_settings_auto_book_case_agree_opt.style.boxShadow = '0px 5px #302009';
        ext_settings_auto_cook_case_agree_opt.style.boxShadow = '0px 5px #302009';
        ext_settings_server_info_case_agree_opt.style.boxShadow = '0px 5px #302009';
        ext_settings_auto_attack_case_agree_opt.style.boxShadow = '0px 5px #302009';
        ext_settings_chat_buffer_case_agree_opt.style.boxShadow = '0px 5px #302009';

        ext_settings_auto_book_case_agree_opt.style.cursor = 'pointer';
        ext_settings_auto_cook_case_agree_opt.style.cursor = 'pointer';
        ext_settings_server_info_case_agree_opt.style.cursor = 'pointer';
        ext_settings_auto_attack_case_agree_opt.style.cursor = 'pointer';
        ext_settings_chat_buffer_case_agree_opt.style.cursor = 'pointer';

        ext_settings_auto_book_case_agree_opt.style.display = 'inline-block';
        ext_settings_auto_cook_case_agree_opt.style.display = 'inline-block';
        ext_settings_server_info_case_agree_opt.style.display = 'inline-block';
        ext_settings_auto_attack_case_agree_opt.style.display = 'inline-block';
        ext_settings_chat_buffer_case_agree_opt.style.display = 'inline-block';

        ext_settings_auto_book_case_agree_opt.style.float = 'left';
        ext_settings_auto_cook_case_agree_opt.style.float = 'left';
        ext_settings_server_info_case_agree_opt.style.float = 'left';
        ext_settings_auto_attack_case_agree_opt.style.float = 'left';
        ext_settings_chat_buffer_case_agree_opt.style.float = 'left';

        ext_settings_auto_book_case_agree_opt.style.height = '35px';
        ext_settings_auto_cook_case_agree_opt.style.height = '35px';
        ext_settings_server_info_case_agree_opt.style.height = '35px';
        ext_settings_auto_attack_case_agree_opt.style.height = '35px';
        ext_settings_chat_buffer_case_agree_opt.style.height = '35px';

        ext_settings_auto_book_case_agree_opt.style.left = '125px';
        ext_settings_auto_cook_case_agree_opt.style.left = '125px';
        ext_settings_server_info_case_agree_opt.style.left = '125px';
        ext_settings_auto_attack_case_agree_opt.style.left = '160px';
        ext_settings_chat_buffer_case_agree_opt.style.left = '160px';

        ext_settings_auto_book_case_agree_opt.style.outline = 'none';
        ext_settings_auto_cook_case_agree_opt.style.outline = 'none';
        ext_settings_server_info_case_agree_opt.style.outline = 'none';
        ext_settings_auto_attack_case_agree_opt.style.outline = 'none';
        ext_settings_chat_buffer_case_agree_opt.style.outline = 'none';

        ext_settings_auto_book_case_agree_opt.style.position = 'absolute';
        ext_settings_auto_cook_case_agree_opt.style.position = 'absolute';
        ext_settings_server_info_case_agree_opt.style.position = 'absolute';
        ext_settings_auto_attack_case_agree_opt.style.position = 'absolute';
        ext_settings_chat_buffer_case_agree_opt.style.position = 'absolute';

        ext_settings_auto_book_case_agree_opt.style.textAlign = 'center';
        ext_settings_auto_cook_case_agree_opt.style.textAlign = 'center';
        ext_settings_server_info_case_agree_opt.style.textAlign = 'center';
        ext_settings_auto_attack_case_agree_opt.style.textAlign = 'center';
        ext_settings_chat_buffer_case_agree_opt.style.textAlign = 'center';

        ext_settings_auto_book_case_agree_opt.style.top = '0px';
        ext_settings_auto_cook_case_agree_opt.style.top = '0px';
        ext_settings_server_info_case_agree_opt.style.top = '0px';
        ext_settings_auto_attack_case_agree_opt.style.top = '300px';
        ext_settings_chat_buffer_case_agree_opt.style.top = '350px';

        ext_settings_auto_book_case_agree_opt.style.width = '35px';
        ext_settings_auto_cook_case_agree_opt.style.width = '35px';
        ext_settings_server_info_case_agree_opt.style.width = '35px';
        ext_settings_auto_attack_case_agree_opt.style.width = '35px';
        ext_settings_chat_buffer_case_agree_opt.style.width = '35px';

        ext_settings_auto_book_agree_ing.id = 'auto_book_agree_ing';
        ext_settings_auto_cook_agree_ing.id = 'auto_cook_agree_ing';
        ext_settings_server_info_agree_ing.id = 'server_info_agree_ing';
        ext_settings_auto_attack_agree_ing.id = 'auto_attack_agree_ing';
        ext_settings_chat_buffer_agree_ing.id = 'chat_buffer_agree_ing';

        ext_settings_auto_book_agree_ing.src = './img/agree.png';
        ext_settings_auto_cook_agree_ing.src = './img/agree.png';
        ext_settings_server_info_agree_ing.src = './img/agree.png';
        ext_settings_auto_attack_agree_ing.src = './img/agree.png';
        ext_settings_chat_buffer_agree_ing.src = './img/agree.png';

        // Adjust css display property in main()

        ext_settings_auto_book_agree_ing.style.marginLeft = '-5px';
        ext_settings_auto_cook_agree_ing.style.marginLeft = '-5px';
        ext_settings_server_info_agree_ing.style.marginLeft = '-5px';
        ext_settings_auto_attack_agree_ing.style.marginLeft = '-5px';
        ext_settings_chat_buffer_agree_ing.style.marginLeft = '-5px';

        ext_settings_auto_book_agree_ing.style.marginTop = '-10px';
        ext_settings_auto_cook_agree_ing.style.marginTop = '-10px';
        ext_settings_server_info_agree_ing.style.marginTop = '-10px';
        ext_settings_auto_attack_agree_ing.style.marginTop = '-10px';
        ext_settings_chat_buffer_agree_ing.style.marginTop = '-10px';

        ext_settings_auto_book_agree_ing.style.outline = 'none';
        ext_settings_auto_cook_agree_ing.style.outline = 'none';
        ext_settings_server_info_agree_ing.style.outline = 'none';
        ext_settings_auto_attack_agree_ing.style.outline = 'none';
        ext_settings_chat_buffer_agree_ing.style.outline = 'none';

        ext_settings_auto_book_agree_ing.style.width = '50px';
        ext_settings_auto_cook_agree_ing.style.width = '50px';
        ext_settings_server_info_agree_ing.style.width = '50px';
        ext_settings_auto_attack_agree_ing.style.width = '50px';
        ext_settings_chat_buffer_agree_ing.style.width = '50px';

        ext_settings_auto_book_case_agree_opt.appendChild(ext_settings_auto_book_agree_ing);
        ext_settings_auto_cook_case_agree_opt.appendChild(ext_settings_auto_cook_agree_ing);
        ext_settings_server_info_case_agree_opt.appendChild(ext_settings_server_info_agree_ing);
        ext_settings_auto_attack_case_agree_opt.appendChild(ext_settings_auto_attack_agree_ing);
        ext_settings_chat_buffer_case_agree_opt.appendChild(ext_settings_chat_buffer_agree_ing);

        ext_settings_auto_book_ing.appendChild(ext_settings_auto_book_case_agree_opt);
        ext_settings_auto_cook_ing.appendChild(ext_settings_auto_cook_case_agree_opt);
        ext_settings_server_info_ing.appendChild(ext_settings_server_info_case_agree_opt);
        ext_settings_auto_attack_ing.appendChild(ext_settings_auto_attack_case_agree_opt);
        ext_settings_chat_buffer_ing.appendChild(ext_settings_chat_buffer_case_agree_opt);

        document.getElementById('option_in_game').insertBefore(ext_settings_auto_book_ing, document.getElementById('quest_alert_ing'));
        document.getElementById('option_in_game').insertBefore(ext_settings_auto_cook_ing, document.getElementById('quest_alert_ing'));
        document.getElementById('option_in_game').insertBefore(ext_settings_server_info_ing, document.getElementById('quest_alert_ing'));
        document.getElementById('option_in_game').insertBefore(ext_settings_auto_attack_ing, document.getElementById('quit_opt'));
        document.getElementById('option_in_game').insertBefore(ext_settings_chat_buffer_ing, document.getElementById('quit_opt'));

        // Fix a few poorly positioned elements also
        document.getElementById('delete_alert_ing').style.marginTop = '110px';
        document.getElementById('cancel_delete_alert_ing').style.marginTop = '15px';
        document.getElementById('quest_alert_ing').style.marginTop = '15px';
        document.getElementById('case_agree_opt').style.top = '150px';
        document.getElementById('cancel_case_agree_opt').style.top = '200px';
        document.getElementById('quest_case_agree_opt').style.top = '250px';
    }
    ext_update_settings_menu();

    function alert_ext_auto_attack() {
        var msg = ' Auto Attack: ' + (user.auto_attack.enabled ? 'ON' : 'OFF');
        if (!user.alert.text) { user.alert.text = msg; }
        else if (user.alert.text.match(/Auto Attack:/)) { user.alert.text = msg; user.alert.timeout.v = 1; user.alert.label = null; }
        else { user.alert.list.push(msg); }
    }

    function draw_ext_auto_book() {
        if (user.auto_book.enabled) { ctx.drawImage(sprite[SPRITE.AUTO_BOOK], user.auto_book.translate.x, user.auto_book.translate.y); }
    }

    function draw_ext_auto_cook() {
        if (user.auto_cook.enabled) { ctx.drawImage(sprite[SPRITE.AUTO_COOK], user.auto_cook.translate.x, user.auto_cook.translate.y); }
    }

    function draw_ext_copy_craft() {
        if (user.copy_craft.enabled) { ctx.drawImage(sprite[SPRITE.COPY_CRAFT], user.copy_craft.translate.x, user.copy_craft.translate.y); }
    }

    function draw_ext_gps() {
        if (user.gps.enabled) {
            var gpsX = Math.round(world[fast_units][user.uid].x / 100);
            var gpsY = Math.round(world[fast_units][user.uid].y / 100);
            if (world[fast_units][user.uid].y <= SPRITE.WINTER_BIOME_Y) {
                if (!user.gps.label_winter || user.gps.coords !== gpsX + ',' + gpsY) {
                    user.gps.coords = gpsX + ',' + gpsY;
                    user.gps.label_winter = create_text(scale, user.gps.coords, 22, "#187484", '#000', 2, null, null, 100 * scale);
                }
                user.gps.label_active = user.gps.label_winter;
            }
            else {
                if (!user.gps.label || user.gps.coords !== gpsX + ',' + gpsY) {
                    user.gps.coords = gpsX + ',' + gpsY;
                    user.gps.label = create_text(scale, user.gps.coords, 22, "#FFF", "#000", 2, null, null, 100 * scale);
                }
                user.gps.label_active = user.gps.label;
            }
            if (world.day == SPRITE.NIGHT) ctx.globalAlpha = 0.5;
            ctx.save();
            ctx.translate(user.cam.x + world[fast_units][user.uid].x, user.cam.y + world[fast_units][user.uid].y);
            ctx.drawImage(
                user.gps.label_active,
                user.gps.label_active.width / -2,
                user.gps.label_active.height / -2 - 70 * scale - world[fast_units][user.uid].player.label.height
            );
            ctx.restore();
        }
    }

    function draw_ext_help() {
        if (user.ext_help.enabled) { ctx.drawImage(sprite[SPRITE.EXT_HELP], user.ext_help.translate.x, user.ext_help.translate.y); }
        if (user.ext_help_gui.enabled) { ctx.drawImage(sprite[SPRITE.EXT_HELP_GUI], user.ext_help_gui.translate.x, user.ext_help_gui.translate.y); }
    }

    function draw_ext_server_info() {
        if (user.server_info.enabled) {
            if (user.cam.y * -1 + window[canh2] < 9750) {
                if (!user.server_info.label_winter) {
                    user.server_info.label_winter = create_text(scale, user.server_info.server_name, 22, "#187484", '#000', 2, null, null, sprite[SPRITE.MINIMAP][0].width * scale);
                }
                user.server_info.label_active = user.server_info.label_winter;
            }
            else {
                if (!user.server_info.label) {
                    user.server_info.label = create_text(scale, user.server_info.server_name, 22, "#FFF", "#000", 2, null, null, sprite[SPRITE.MINIMAP][0].width * scale);
                }
                user.server_info.label_active = user.server_info.label;
            }
            if (world.day == SPRITE.NIGHT) ctx.globalAlpha = 0.5;
            if (user.server_info.label_active.width <= sprite[SPRITE.MINIMAP][0].width) {
                user.server_info.translate.x = canw - sprite[SPRITE.MINIMAP][0].width / 2 - user.server_info.label_active.width / 2;
            } else {
                user.server_info.translate.x = canw - user.server_info.label_active.width;
            }
            if (user.inv.can_select.length > 0) user.server_info.translate.y = game.minimap.translate.y - user.server_info.label_active.height - 110;
            else user.server_info.translate.y = game.minimap.translate.y - user.server_info.label_active.height - 40;
            ctx.drawImage(user.server_info.label_active, user.server_info.translate.x, user.server_info.translate.y);
            ctx.globalAlpha = 1;
        }
    }

    function get_ext_server_name() {
        if (typeof user.server_info.server_name === 'undefined') {
            user.server_info.server_url = window[client][socket].url;
            user.server_info.server_ip = user.server_info.server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[1];
            user.server_info.server_port = user.server_info.server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[2];

            for (var x = 0; x < window[client][server_list].length; x++) {
                if (window[client][server_list][x].i === user.server_info.server_ip && window[client][server_list][x].p === parseInt(user.server_info.server_port)) {
                    user.server_info.server_name = window[client][server_list][x].a;
                }
            }
        }
    }

    function checkDependencies() {
        if ((typeof deobauto === 'undefined' || deobauto !== true) &&
            (typeof deobcomplete === 'undefined' || deobcomplete !== true) &&
            (typeof deobmicro === 'undefined' || deobmicro !== true)) {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    }

    function main() {
        // All code depending on deobfuscated names may begin from here
        SPRITE.ACTIVE_FEED = find_unique_index();
        SPRITE.OLD_AUTO_FEED = SPRITE.AUTO_FEED;
        sprite[SPRITE.ACTIVE_FEED] = create_text(1, 'Active-Feed', 25, '#FFF', void 0, void 0, '#000', 5, 180);
        SPRITE.AUTO_BOOK = find_unique_index();
        sprite[SPRITE.AUTO_BOOK] = create_text(1, 'Auto-Book', 25, '#FFF', void 0, void 0, '#000', 5, 140);
        SPRITE.AUTO_COOK = find_unique_index();
        sprite[SPRITE.AUTO_COOK] = create_text(1, 'Auto-Cook', 25, '#FFF', void 0, void 0, '#000', 5, 140);
        SPRITE.COPY_CRAFT = find_unique_index();
        sprite[SPRITE.COPY_CRAFT] = create_text(1, 'Copy-Craft', 25, '#FFF', void 0, void 0, '#000', 5, 140);
        SPRITE.EXT_HELP = find_unique_index();
        sprite[SPRITE.EXT_HELP] = CTI(create_help('HELP MENU', [
         [ 'H', 'Open Help - open this help menu' ],
         [ '⇧H', 'Open GUI Help - open GUI help menu' ],
         [ 'Y', 'Open Map - open the larger map' ],
         [ 'R', 'Auto Feed - auto consume food/drink when low' ],
         [ 'T', 'Auto Book - auto equip book on craft' ],
         [ 'P', 'Show Spectators - only in hunger games' ],
         [ 'C', 'Auto Cook - auto cook meals when possible' ],
         [ 'M', 'Copy Craft - mimic crafting when possible' ],
         [ 'E', 'Auto Attack - auto attack' ],
         [ 'L', 'Show Server Info - shows server name' ],
         [ 'G', 'GPS  - shows your x,y coordinate position' ],
         [ '`', 'Chat Buffer - hide/show chat messages' ]
        ]));
        SPRITE.EXT_HELP_GUI = find_unique_index();
        sprite[SPRITE.EXT_HELP_GUI] = CTI(create_help('GUI HELP MENU', [
         [ '⇧H', 'Open Help - open this help menu' ],
         [ '⇧E', 'Environment - toggle world environment visibility' ],
         [ '⇧G', 'Ground - toggle ground visibility' ],
         [ '⇧O', 'Map Objects - toggle map object visibility' ],
         [ '⇧U', 'UI - toggle UI visibility' ],
        ]));
        SPRITE.SLOT_NUMBERS_MAPPED = find_unique_index();
        sprite[SPRITE.SLOT_NUMBERS_MAPPED] = {};
        sprite[SPRITE.SLOT_NUMBERS_MAPPED][9] = create_text(1, '0', 12, '#FFF');
        sprite[SPRITE.SLOT_NUMBERS_MAPPED][10] = create_text(1, 'P', 12, '#FFF');

        user.auto_book = {
            enabled: false,
            translate: {x: 0,y: 0},
            equip_book: function() {
                if (this.enabled) {
                    if (user.inv.n[INV.BOOK]) {
                        var thePlayer = world[fast_units][user.uid];
                        if (thePlayer.right != INV.BOOK) {
                            window[client][select_inv](INV.BOOK, user.inv.find_item(INV.BOOK));
                        }
                    }
                }
            }
        };
        user.active_feed = {
            enabled: false
        };
        user.auto_attack = {
            enabled: false,
            last_attack: 0
        };
        user.auto_cook = {
            enabled: false,
            translate: {x: 0,y: 0},
            cook: function() {
                if (this.enabled) {
                    if (user.craft.fire && user.inv.n[INV.PLANT] >= 2 && user.inv.n[INV.FLOUR] >= 5 && user.inv.n[INV.ICE] >= 2) {
                        // Cake recipe :: 2 berries, 5 flour, 2 ice
                        window[client][select_craft](find_recipe([[INV.PLANT, 2], [INV.FLOUR, 5], [INV.ICE, 2]]));
                    } else if (user.craft.fire && user.inv.n[INV.PLANT] >= 1 && user.inv.n[INV.FLOUR] >= 3) {
                        // Cookies recipe :: 1 berry, 3 flour
                        window[client][select_craft](find_recipe([[INV.PLANT, 1], [INV.FLOUR, 3]]));
                    } else if (user.craft.fire && user.inv.n[INV.FOODFISH] >= 1) {
                        // Cooked Fish recipe :: 1 fish
                        window[client][select_craft](find_recipe([[INV.FOODFISH, 1]]));
                    } else if (user.craft.fire && user.inv.n[INV.MEAT] >= 1) {
                        // Cooked Meat recipe :: 1 meat
                        window[client][select_craft](find_recipe([[INV.MEAT, 1]]));
                    } else if (user.craft.fire && user.inv.n[INV.FLOUR] >= 3) {
                        // Bread recipe :: 3 flour
                        window[client][select_craft](find_recipe([[INV.FLOUR, 3]]));
                    } else if (user.inv.n[INV.BREAD] >= 1 && user.inv.n[INV.COOKED_MEAT] >= 1) {
                        // Sandwich recipe :: 1 bread, 1 cooked meat
                        window[client][select_craft](find_recipe([[INV.BREAD, 1], [INV.COOKED_MEAT, 1]]));
                    }
                }
            }
        };
        user.copy_craft = {
            enabled: false,
            last_recipe: false,
            translate: { x: 0, y: 0 },
            craft: function() {
                if (this.enabled && this.last_recipe !== false) {
                }
            }
        };
        user.gps = {
            coords: '',
            enabled: false
        };
        user.server_info = {
            enabled: true,
            translate: { x: 0, y: 0 }
        };
        user.craft.do_craft = function(recipeID) {
            var recipe = RECIPES[recipeID];
            this.id = recipeID;
            this.crafting = true;
            if ((user.auto_book.enabled && user.inv.n[INV.BOOK]) || world[fast_units][user.uid].right == INV.BOOK) {
                this.timeout.max_speed = recipe.time * 3;
            } else {
                this.timeout.max_speed = recipe.time;
            }
            if (user.copy_craft.enabled) { user.copy_craft.last_recipe = recipeID; }
            this.id2 = recipe.id2;
            for (var counter = 0; counter < recipe.r.length; counter++) {
                var resource = recipe.r[counter];
                user.inv.decrease(resource[0], resource[1], user.inv.find_item(resource[0]));
            }
            game[update_inv_buttons]();
        };
        window.old_user_craft_update = user.craft.update;
        user.craft.update = function() {
            old_user_craft_update.apply(this);
            user.auto_cook.cook();
            user.copy_craft.craft();
        };
        user.ext_help = { enabled: false, translate: { x: 0, y: 0 } };
        user.ext_help_gui = { enabled: false, translate: { x: 0, y: 0 } };
        user.ext_gui = {
            environment: true,
            ground: true,
            map_objects: true,
            UI: true
        };
        user.gauges.labels = [];
        user.keycodes_to_mapped_keycodes = {}; // contains things like: { 68: 96 }

        if (!user.auto_book.enabled) document.getElementById('auto_book_agree_ing').style.display = 'none';
        if (!user.auto_cook.enabled) document.getElementById('auto_cook_agree_ing').style.display = 'none';
        if (!user.server_info.enabled) document.getElementById('server_info_agree_ing').style.display = 'none';
        if (!user.auto_attack.enabled) document.getElementById('auto_attack_agree_ing').style.display = 'none';
        if (document.getElementById('chat_log').style.display == 'none') document.getElementById('chat_buffer_agree_ing').style.display = 'none';

        window.old_game_draw_UI = game[draw_UI];
        game[draw_UI] = function() {
            if (user.ext_gui.UI) {
                old_game_draw_UI.apply(this, arguments);
                draw_ext_auto_book();
                draw_ext_auto_cook();
                draw_ext_copy_craft();
                draw_ext_gps();
                draw_ext_help();
                draw_ext_server_info();
            }
        };

        window.old_game_gauges_draw = game.gauges.draw;
        game.gauges.draw = function() {
            old_game_gauges_draw.apply(this);
            ctx.save();
            var gX = (canw - 950 * scale) / 2;
            var gY = 0 < user.inv.can_select.length ? -80 : -10;
            if (user.chest.open ||
                user.furnace.open && -1 != user.inv.find_item(INV.WOOD) ||
                user.windmill.open && -1 != user.inv.find_item(INV.WILD_WHEAT) ||
                user.well.open && -1 != user.inv.find_item(INV.BUCKET_FULL) ||
                user[breadoven].open && ( -1 != user.inv.find_item(INV.WOOD) || -1 != user.inv.find_item(INV.FLOUR))
            ) { gY -= 50 * scale; }

            ctx.translate(gX, gY);

            var gCold = Math.round(user.gauges.cold.x * 100);
            var gHunger = Math.round(user.gauges.hunger.x * 100);
            var gLife = Math.round(user.gauges.life.x * 100);
            var gThirst = Math.round(user.gauges[thirst].x * 100);

            if (!user.gauges.labels[gCold]) {
                user.gauges.labels[gCold] = create_text(scale, gCold + '%', 22, "#FFF", "#000", 2, null, null, 100 * scale);
            }
            if (!user.gauges.labels[gHunger]) {
                user.gauges.labels[gHunger] = create_text(scale, gHunger + '%', 22, "#FFF", "#000", 2, null, null, 100 * scale);
            }
            if (!user.gauges.labels[gLife]) {
                user.gauges.labels[gLife] = create_text(scale, gLife + '%', 22, "#FFF", "#000", 2, null, null, 100 * scale);
            }
            if (!user.gauges.labels[gThirst]) {
                user.gauges.labels[gThirst] = create_text(scale, gThirst + '%', 22, "#FFF", "#000", 2, null, null, 100 * scale);
            }

            ctx.drawImage(
                user.gauges.labels[gCold],
                this.translate.x + 517 * scale + 178 / 2 * scale - user.gauges.labels[gCold].width / 2,
                this.translate.y + 16 * scale + 18 / 2 * scale - user.gauges.labels[gCold].height / 2 + 1
            );
            ctx.drawImage(
                user.gauges.labels[gHunger],
                this.translate.x + 277 * scale + 178 / 2 * scale - user.gauges.labels[gHunger].width / 2,
                this.translate.y + 16 * scale + 18 / 2 * scale - user.gauges.labels[gHunger].height / 2 + 1
            );
            ctx.drawImage(
                user.gauges.labels[gLife],
                this.translate.x + 37 * scale + 178 / 2 * scale - user.gauges.labels[gLife].width / 2,
                this.translate.y + 16 * scale + 18 / 2 * scale - user.gauges.labels[gLife].height / 2 + 1
            );
            ctx.drawImage(
                user.gauges.labels[gThirst],
                this.translate.x + 757 * scale + 178 / 2 * scale - user.gauges.labels[gThirst].width / 2,
                this.translate.y + 16 * scale + 18 / 2 * scale - user.gauges.labels[gThirst].height / 2 + 1
            );

            ctx.restore();
        };

        window.old_game_update = game.update;
        game.update = function() {
            old_game_update.apply(this);
            user.auto_book.translate.x = user.auto_feed.translate.x;
            user.auto_book.translate.y = user[spectators].translate.y + sprite[SPRITE.SHOW_SPECTATORS].height + 5;
            user.auto_cook.translate.x = user.auto_feed.translate.x;
            user.auto_cook.translate.y = user.auto_book.translate.y + sprite[SPRITE.AUTO_BOOK].height + 5;
            user.copy_craft.translate.x = user.auto_feed.translate.x;
            user.copy_craft.translate.y = user.auto_cook.translate.y + sprite[SPRITE.AUTO_COOK].height + 5;
            user.ext_help.translate.x = can.width / 2 - sprite[SPRITE.EXT_HELP].width / 2;
            user.ext_help.translate.y = can.height / 2 - sprite[SPRITE.EXT_HELP].height / 2;
            user.ext_help_gui.translate.x = can.width / 2 - sprite[SPRITE.EXT_HELP_GUI].width / 2;
            user.ext_help_gui.translate.y = can.height / 2 - sprite[SPRITE.EXT_HELP_GUI].height / 2;
        };

        window.old_game_trigger_keyup = game[trigger_keyup];
        game[trigger_keyup] = function(c) {
            old_game_trigger_keyup.apply(this, arguments);
            if (!user.chat.open) {
                if (c.keyCode === 82) {
                    document.getElementById('auto_feed_ing').firstChild.nodeValue = 'Auto Feed';
                    if (!user.auto_feed.enabled && !user.active_feed.enabled) {
                        // Switch to active feed
                        user.auto_feed.invert();
                        user.active_feed.enabled = true;
                        SPRITE.AUTO_FEED = SPRITE.ACTIVE_FEED;
                        document.getElementById('auto_feed_ing').firstChild.nodeValue = 'Active Feed';
                    } else if (!user.auto_feed.enabled && user.active_feed.enabled) {
                        // Switch to default off
                        user.active_feed.enabled = false;
                        SPRITE.AUTO_FEED = SPRITE.OLD_AUTO_FEED;
                    }
                    user.auto_feed.translate.x = game.leaderboard.translate.x - sprite[SPRITE.AUTO_FEED].width - 85;
                }
            }
        };

        var my_trigger_key_up = function(c) {
            var keycode = c.keyCode;
            if (user.keycodes_to_mapped_keycodes[keycode]) {
                keycode = user.keycodes_to_mapped_keycodes[keycode];
            }

            if (!user.chat.open && document.activeElement.id !== 'nickname_input')  {
                if (!c.altKey && !c.ctrlKey && !c.shiftKey) {
                    if (keycode == 84) {
                        user.auto_book.enabled = !user.auto_book.enabled;
                        document.getElementById('auto_book_agree_ing').style.display = user.auto_book.enabled ? 'inline-block' : 'none';
                    } else if (keycode == 69) {
                        user.auto_attack.enabled = !user.auto_attack.enabled; alert_ext_auto_attack();
                        document.getElementById('auto_attack_agree_ing').style.display = user.auto_attack.enabled ? 'inline-block' : 'none';
                    } else if (keycode == 71) {
                        user.gps.enabled = !user.gps.enabled;
                    } else if (keycode == 72) {
                        user.ext_help.enabled = !user.ext_help.enabled;
                    } else if (keycode == 76) {
                        user.server_info.enabled = !user.server_info.enabled;
                        document.getElementById('server_info_agree_ing').style.display = user.server_info.enabled ? 'inline-block' : 'none';
                    } else if (keycode == 67) {
                        user.auto_cook.enabled = !user.auto_cook.enabled; user.auto_cook.cook();
                        document.getElementById('auto_cook_agree_ing').style.display = user.auto_cook.enabled ? 'inline-block' : 'none';
                    } else if (keycode == 77) {
                        user.copy_craft.enabled = !user.copy_craft.enabled;
                        if (!user.copy_craft.enabled) { user.copy_craft.last_recipe = false; }
                    } else if (keycode == 192) {
                        document.getElementById('chat_log').style.display = document.getElementById('chat_log').style.display == 'none' ? '' : 'none';
                        document.getElementById('chat_buffer_agree_ing').style.display = document.getElementById('chat_log').style.display == 'none' ? 'none' : 'inline-block';
                    }
                } else if (c.shiftKey) {
                    if (keycode == 69) { user.ext_gui.environment = !user.ext_gui.environment; }
                    else if (keycode == 71) { user.ext_gui.ground = !user.ext_gui.ground; }
                    else if (keycode == 72) { user.ext_help_gui.enabled = !user.ext_help_gui.enabled; }
                    else if (keycode == 79) { user.ext_gui.map_objects = !user.ext_gui.map_objects; }
                    else if (keycode == 85) { user.ext_gui.UI = !user.ext_gui.UI; }
                }
            }
        };

        document.getElementById('auto_book_case_agree_opt').addEventListener('mouseup', function() { my_trigger_key_up({keyCode: 84}); });
        document.getElementById('auto_cook_case_agree_opt').addEventListener('mouseup', function() { my_trigger_key_up({keyCode: 67}); });
        document.getElementById('server_info_case_agree_opt').addEventListener('mouseup', function() { my_trigger_key_up({keyCode: 76}); });
        document.getElementById('auto_attack_case_agree_opt').addEventListener('mouseup', function() { my_trigger_key_up({keyCode: 69}); });
        document.getElementById('chat_buffer_case_agree_opt').addEventListener('mouseup', function() { my_trigger_key_up({keyCode: 192}); });

        window.addEventListener('keyup', my_trigger_key_up, false);

        window.old_client_build_stop = window[client][build_stop];
        window[client][build_stop] = function(c) {
            old_client_build_stop.apply(this, arguments);
            if (user.copy_craft.enabled && user.copy_craft.last_recipe !== false) {
                window[client][select_craft](user.copy_craft.last_recipe);
            }
        };

        window.old_client_connect = window[client].connect;
        window[client].connect = function() {
            old_client_connect.apply(this);
            get_ext_server_name();
        };

        window.old_client_select_craft = window[client][select_craft];
        window[client][select_craft] = function(c) {
            if (user.weapon.timeout.v !== 0 && user.inv.n[INV.BOOK]) {
                var alertMsg = 'You can\'t equip your book right now.';
                if (user.alert.text) user.alert.list.push(alertMsg);
                else user.alert.text = alertMsg;
                return;
            }
            user.auto_book.equip_book();
            old_client_select_craft.apply(this, arguments);
        };

        window.old_draw_chat = window[draw_chat];
        window[draw_chat] = function() {
            old_draw_chat.apply(this);
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

        function draw_shop_timer() {
            ctx.save();
            var c = 800 * scale,
            g = (70 + game.shop.button.info.translate.y) * scale,
            f = window[canw2],
            d = window[canh2] - g / 2;
            if (user.shop.new_time != user.shop.time) {
                user.shop.new_time = user.shop.time;
                user.shop.time_label = create_text(scale, 60 - user.shop.time + 's', 40, '#FFF', null, null, null, null, null, '#000', 6);
            }
            ctx.drawImage(user.shop.time_label, f - user.shop.time_label.width / 2 * scale, g);
            ctx.restore();
        }

        window.old_user_shop_draw = user.shop.draw;
        user.shop.draw = function() {
            old_user_shop_draw.apply(this);
            if (!user.spectator && 60 > this.time && this.time > 0 && game.shop.id.style.display !== 'none') draw_shop_timer();
        };

        window.old_user_control_update = user.control.update;
        user.control.update = function() {
            old_user_control_update.apply(this);
            var elapsed_time = ((new Date()).getTime() - world.clock.init) / 1000;
            if (mouse.state !== 0 && elapsed_time >= user.auto_attack.last_attack + CLIENT[deoblist.o2d.ATTACK] * 2.5) {
                if (user.auto_attack.enabled) {
                    user.auto_attack.last_attack = elapsed_time;
                    this.attack = 1;
                    var c = world[fast_units][user.uid];
                    var g = Utils.get_std_angle(mouse.pos, c ? {x: user.cam.x + c.x, y: user.cam.y + c.y} : canm);
                    window[client][send_attack](g);
                } else if (this.attack !== 0) {
                    this.attack = 0;
                    window[client][stop_attack]();
                }
            }
        };

        window.old_user_auto_feed_update = user.auto_feed.update;
        user.auto_feed.update = function() {
            if (!user.active_feed.enabled) old_user_auto_feed_update.apply(this);
            else {
                this.delay += delta;
                if (2 >= this.delay) return;
                this.delay = 0;
                var eatPLANT = false, eatBREAD = false, eatMEAT = false, eatFISH = false, eatCOOKIE = false, eatSANDWICH = false, eatCAKE = false,
                drinkBOTTLE = false;
                if (user.gauges.h < 0.9) { eatPLANT = true; }
                if (user.gauges.h < 0.65) { eatBREAD = true; eatMEAT = true; eatFISH = true; }
                if (user.gauges.h < 0.5) { eatCOOKIE = true; }
                if (user.gauges.h < 0.04) { eatSANDWICH = true; eatCAKE = true; }

                if (user.inv.n[INV.PLANT] && eatPLANT) { user.gauges.h += 0.1; window[client][select_inv](INV.PLANT, user.inv.find_item(INV.PLANT)); }
                else if (user.inv.n[INV.BREAD] && eatBREAD) { user.gauges.h += 0.35; window[client][select_inv](INV.BREAD, user.inv.find_item(INV.BREAD)); }
                else if (user.inv.n[INV.COOKED_MEAT] && eatMEAT) { user.gauges.h += 0.35; window[client][select_inv](INV.COOKED_MEAT, user.inv.find_item(INV.COOKED_MEAT)); }
                else if (user.inv.n[INV.FOODFISH_COOKED] && eatFISH) { user.gauges.h += 0.35; window[client][select_inv](INV.FOODFISH_COOKED, user.inv.find_item(INV.FOODFISH_COOKED)); }
                else if (user.inv.n[INV.COOKIE] && eatCOOKIE) { user.gauges.h += 0.5; window[client][select_inv](INV.COOKIE, user.inv.find_item(INV.COOKIE)); }
                else if (user.inv.n[INV.SANDWICH] && eatSANDWICH) { user.gauges.h += 1; window[client][select_inv](INV.SANDWICH, user.inv.find_item(INV.SANDWICH)); }
                else if (user.inv.n[INV.CAKE] && eatCAKE) { user.gauges.h += 1; window[client][select_inv](INV.CAKE, user.inv.find_item(INV.CAKE)); }

                if (user.gauges.h > 1) user.gauges.h = 1;

                if (user.gauges.t < 0.5) { drinkBOTTLE = true; }

                if (user.inv.n[INV.BOTTLE_FULL] && drinkBOTTLE) { user.gauges.t += 0.5; window[client][select_inv](INV.BOTTLE_FULL, user.inv.find_item(INV.BOTTLE_FULL)); }
            }
        };

        window.old_draw_ground = window[draw_ground];
        window[draw_ground] = function() {
            if (user.ext_gui.ground) {
                old_draw_ground.apply(this);
            }
        };
        window.old_draw_world = window[draw_world];
        window[draw_world] = function() {
            if (user.ext_gui.environment) {
                old_draw_world.apply(this);
            }
        };
        window.old_draw_map_objects = window[draw_map_objects];
        window[draw_map_objects] = function() {
            if (user.ext_gui.map_objects) {
                old_draw_map_objects.apply(this, arguments);
            }
        };
    }

    checkDependencies();
})();
