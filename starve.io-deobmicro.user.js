// ==UserScript==
// @name         Starve.io Deobfuscated Micro
// @namespace    http://tampermonkey.net/
// @version      0.15.02
// @description  Micro deobfuscation includes bare minimum for scripts to function normally
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// Compatible with version 15 of Starve.io client

(function() {
    'use strict';

    function checkDependencies() {
        if (typeof game !== 'undefined' && typeof ui !== 'undefined' && typeof user !== 'undefined') {
            deobfuscate();
        } else {
            setTimeout(checkDependencies, 50);
        }
    }

    function deobfuscate() {
        window.OBFUSCATED_ARR = _0xc610;
        window.OBFUSCATOR_FN = _0x0c61;
        window.OBFUSCATOR_FN_INV = function(n) { for (var x=0; x<OBFUSCATED_ARR.length; x++) { if (OBFUSCATOR_FN(x) === n) return '0x'+x.toString(16); } };

        // DEOBFUSCATION
        window.canh2 = 'O_O116940_0';
        window.canw2 = 'O_O116910_0';

        window.client = 'O_O116600_0';
        window./*client_*/select_craft = 'O_O116530_0'; // '0x89a'
        window./*client_*/select_inv = 'O_O116540_0'; // '0x660'
        window./*client_*/send_chat = 'O_O116590_0'; // '0x66d'
        window./*client_*/server_list = 'O_O118130_0'; // '0x5e8'
        window./*client_*/socket = 'O_O115950_0'; // '0x5e6'

        window.ctx = O_O117240_0; // '0x54e'

        window.draw_chat = 'O_O117570_0';

        window./*game_*/draw_UI = 'O_O117260_0'; // '0x88d'
        window./*game_*/update_inv_buttons = 'O_O117130_0_buttons'; // '0x77b'

        window.RECIPES = O_O116750_0;

        window.SPRITE = O_O116760_0;

        window.user.spectators = user.O_O117940_0; // '0x54a'

        window.world = O_O117410_0;
        window./*world_*/fast_units = 'O_O117030_0'; // '0x509'
        window./*world_*/players = 'O_O117050_0'; // '0x543'

        // END DEOBFUSCATION
        window.deobmicro = true;
   }

    checkDependencies();
})();