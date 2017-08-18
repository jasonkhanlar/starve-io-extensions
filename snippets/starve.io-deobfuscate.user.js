// ==UserScript==
// @name         Starve.io Deobfuscated
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Framework for deobfuscated code base
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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
        window.DRAW_TOP_SCORES = Lapa3394Mauve;
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
    };

    checkLoaded();
})();