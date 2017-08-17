// ==UserScript==
// @name         Discord Webhook for Starve.io Top 10 Leaderboard
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Pushes real-time top 10 scores on connected server to a Discord server
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var webhook = document.cookie.replace(/(?:(?:^|.*;\s*)discord_webhook_top10\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    if (webhook === '') {
        var webhook_prompt = 'DISCORD WEBHOOK URL\n\nPaste the full URL here\n\nLooks like "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"\n\nYou must either have the Manage Webhooks permission on your Discord server to know what this is or the corresponding Webhook URL must be shared with you to input it in this prompt\n\nReminder: If you wish to change this later, first delete the cookie.\n\nBy filling this out, you consent to cookies, but cookies may or may not consent to you. See https://www.cookielaw.org/the-cookie-law/';
        webhook = prompt(webhook_prompt);
        if (!webhook.match(/https:\/\/discordapp.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/)) {
            var webhook_error = 'That is an invalid Webhook URL.\n\nSupport is available in #extension-support at Discord Server https://discord.gg/eRV8hfJ\n\nRefresh the page to try again.';
            alert(webhook_error);
        } else {
            webhook += '/slack';
            document.cookie = 'discord_webhook_top10='+webhook;
        }
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
        window.CLIENT_SERVER_LIST_VAR_NAME = 'Lapa3432Mauve'; // '0x5cf'
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
        window.WORLD_PLAYER_LIST_VAR_NAME = 'Lapa3324Mauve'; // '0x531'
        // END DEOBFUSCATION

        function post(url, data) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            var data = JSON.stringify(data);
            xhr.send(data);
        }

        var server_list = client[CLIENT_SERVER_LIST_VAR_NAME], server_name = '', server_url = '', server_url_ip = '', server_url_port = 0;

        var check_scores = function() {
            if (world[WORLD_PLAYER_LIST_VAR_NAME].length > 0) {
                server_url = client[CLIENT_SOCKET_VAR_NAME].url;
                server_url_ip = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[1];
                server_url_port = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[2];

                for (var x = 0; x < server_list.length; x++) {
                    if (server_list[x].i === server_url_ip && server_list[x].p === parseInt(server_url_port)) {
                        server_name = server_list[x].a;
                    }
                }

                var output = '', scores=[], scores_pos=1, scores_text='';
                for (var x = 0; x < world[WORLD_PLAYER_LIST_VAR_NAME].length; x++) {
                    if (world[WORLD_PLAYER_LIST_VAR_NAME][x].alive && world[WORLD_PLAYER_LIST_VAR_NAME][x].score > 0) {
                        scores[world[WORLD_PLAYER_LIST_VAR_NAME][x].score]=world[WORLD_PLAYER_LIST_VAR_NAME][x].nickname;
                    }
                }
                for (var x = scores.length - 1; x>=0; x--) {
                    if (typeof scores[x] !== 'undefined') {
                        scores_text += ('  ' + scores_pos++).slice(-3) + ') ' + ('          ' + x).slice(-7) + ' ' + scores[x] + '\n';
                    }
                }
                output = '**Top Scores @ ' + server_name + '**\n```\n' + scores_text.trimRight() + '```';

        post(
            webhook,
            {
                "username": world[WORLD_FAST_UNITS_ARR_NAME][user.uid].player.nickname,
                "text": output
            }
        );

                /*
                 * For now, as a proof of concept, do not run this every 5 minutes
                 * Note: First instance only, this shows all scores, not only top 10
                 * Consecutive calls to this function only shows top 10 scores
                 * client.Lapa3268Mauve // '0x602'
                *     I think this is the function that sets client side all scores to 0 if not in top 10
                */
            
                //setTimeout(check_scores, 300000);
            } else {
                setTimeout(check_scores, 1000);
            }
        };
        
        setTimeout(check_scores, 1000);
    };

    checkLoaded();
})();
