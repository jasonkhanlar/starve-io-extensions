// ==UserScript==
// @name         Starve.io Army
// @namespace    http://tampermonkey.net/
// @version      0.16.0
// @description  Spawn a Starve.io army to protect you!
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

    var required_deobfuscate_version = '0.16.0';

    function checkDependencies() {
        if (typeof deobauto === 'undefined') {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else if (deobauto === true || deobauto < required_deobfuscate_version) {
            alert('deobfuscate userscript v' + required_deobfuscate_version + ' or higher is required.');
        } else {
            // Dependency satisfied
            main();
        }
    }

    function generate_army() {
        var army_id = 1234,
        equips = [
            'AMETHYST_HELMET',
            'CAP_SCARF',
            'COAT',
            'CROWN_BLUE',
            'CROWN_GREEN',
            'CROWN_ORANGE',
            'DIAMOND_HELMET',
            'DIVING_MASK',
            'DRAGON_HELMET',
            'EARMUFFS',
            'EXPLORER_HAT',
            'GOLD_HELMET',
            'HOOD',
            'PEASANT',
            'STONE_HELMET',
            'SUPER_DIVING_SUIT',
            'WINTER_HOOD',
            'WINTER_PEASANT'
        ],
        weapons = [
            'AMETHYST_SPEAR',
            'BOOK',
            'DIAMOND_SPEAR',
            'DRAGON_SWORD',
            'GOLD_SPEAR',
            'HAMMER',
            'HAMMER_AMETHYST',
            'HAMMER_DIAMOND',
            'HAMMER_GOLD',
            'PICK',
            'PICK_AMETHYST',
            'PICK_DIAMOND',
            'PICK_GOLD',
            'PICK_WOOD',
            'SHOVEL',
            'SHOVEL_AMETHYST',
            'SHOVEL_DIAMOND',
            'SHOVEL_GOLD',
            'SPANNER',
            'SPEAR',
            'SUPER_HAMMER',
            'SWORD',
            'SWORD_AMETHYST',
            'SWORD_DIAMOND',
            'SWORD_GOLD',
            'WATERING_CAN_FULL'
        ];
        for (var x = 0; x < equips.length; x++) {
            for (var y = 0; y < weapons.length; y++) {
                if (typeof world[fast_units][user.uid] !== 'undefined') {
                    var t = army_id++ * 100;
                    var v = 0;
                    var n = 0;
                    var r = 0;
                    var u;
                    var z;
                    if (typeof world[fast_units][t] === 'undefined' || army_follow) {
                        u = world[fast_units][user.uid].x + (Math.random() * canw - canw / 2);
                        z = world[fast_units][user.uid].y + (Math.random() * canh - canh / 2);
                    } else {
                        u = world[fast_units][t].x;
                        z = world[fast_units][t].y;
                    }
                    var m = world[fast_units][user.uid].angle;
                    if (typeof world[fast_units][t] !== 'undefined') {
                        if (army_follow) m = Math.atan2(world[fast_units][user.uid].y - world[fast_units][t].y, world[fast_units][user.uid].x - world[fast_units][t].x)
                        else m = Math.atan2(world[fast_units][t].y - world[fast_units][user.uid].y, world[fast_units][t].x - world[fast_units][user.uid].x)
                    }
                    var q = 0;
                    var p = INV[weapons[y]] + INV[equips[x]] * 128 + 16384;
                    //var p = WEAPON + EQUIP * 128 + 16384 for backpack;
                    if (world[fast_units][t]) {
                        t = world[fast_units][t];
                        t.r.x = u;
                        t.r.y = z;
                        0 != n && Utils.dist(t, t.r) > CLIENT.ceilio4298 && (t.x = u, t.y = z);
                        t.id != user.id && (t.nangle = m);
                        t.action |= q;
                        t.info = p;
                        t.update && t.update(q);
                    } else {
                        n = new Item(v, n, r, u, z, m, q, p);
                        world[fast_units][t] = n;
                        world.units[v].push(n);
                    }
                }
            }
        }
    }

    function main() {
        window.army_follow = false;
        window.army_timer = undefined;
        window.hook_client_units_army = window[client].units;
        window[client].units = function(c,f,e) {
            for (var x = 0; x < (f.length  - 2) / 12; x++) if (f[2 + 12 * x] === user.id) {
                army_follow = true;
                if (typeof army_timer !== 'undefined') clearTimeout(army_timer);
                army_timer = setTimeout(function() { army_follow = false; }, 2000);
            }
            generate_army();
            hook_client_units_army.apply(this, arguments);
        };
    }

    checkDependencies();
})();