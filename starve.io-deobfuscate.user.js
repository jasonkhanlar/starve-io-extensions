// ==UserScript==
// @name         Starve.io Deobfuscated
// @namespace    http://tampermonkey.net/
// @version      0.15.01
// @description  Framework for deobfuscated code base
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
        window.OBFUSCATED_ARR = _0x1d4d;
        window.OBFUSCATOR_FN = _0xd1d4;
        window.OBFUSCATOR_FN_INV = function(n) { for (var x=0; x<OBFUSCATED_ARR.length; x++) { if (OBFUSCATOR_FN(x) === n) return '0x'+x.toString(16); } };

        // DEOBFUSCATION
        window.canh2 = 'O_O153300_0';
        window.canw2 = 'O_O153270_0';

        window.CLIENT = O_O153140_0;
        window./*CLIENT_*/ATTACK = 'O_O153230_0'; // '0x5a6'
        window./*CLIENT_*/CAM_DELAY = 'O_O153200_0'; // '0x679'
        window./*CLIENT_*/LAG_DISTANCE = 'O_O153240_0'; // '0x658'
        window./*CLIENT_*/MOVE_SPEED_MOD_ATTACK = 'O_O152030_0';
        window./*CLIENT_*/MUTE_DELAY = 'O_O153210_0';
        window./*CLIENT_*/ROTATE = 'O_O153220_0'; // '0x6c2'
        window./*CLIENT_*/TEAM_FULL = 'O_O154610_0'; // '0x863'
        window./*CLIENT_*/TEAM_JOIN = 'O_O154630_0'; // '0x53b'
        window./*CLIENT_*/TEAM_LEAVE = 'O_O154680_0'; // '0x53a'
        window./*CLIENT_*/TEAM_MANAGE = 'O_O154620_0'; // '0x53c'
        window./*CLIENT_*/TEAM_SHOW = 'O_O154640_0'; // '0x862'
        window./*CLIENT_*/TOKEN_LEN = 'O_O153250_0'; // '0x764'
        window./*CLIENT_*/VERSION_NUMBER = 'O_O153190_0'; // '0x6b5'
        window./*CLIENT_*/WAITING_FOR_SERVER = 'O_O153260_0';
        //window./*CLIENT_*/? = 'O_O151970_0'; // '0x7cd' // skin up/down related

        window.Client = 'O_O153740_0';

        window.client = 'O_O152960_0';
        window./*client_*/accept_build = 'O_O152530_0'; // '0x6b2'
        window./*client_*/build_ok = 'O_O152540_0'; // '0x625'
        window./*client_*/build_stop = ''; // '0x620'
        window./*client_*/cam_delay = 'O_O152560_0'; // '0x67a'
        window./*client_*/cancel_craft = 'O_O153310_0'; // '0x6b0'
        window./*client_*/cancel_crafting = 'O_O152570_0'; // '0x665'
        window./*client_*/change_ground = 'O_O152580_0'; // '0x88b'
        window./*client_*/check_pong = 'O_O152590_0'; // '0x697'
        window./*client_*/check_state = 'O_O152600_0';
        window./*client_*/connect_timeout = 'O_O152670_0'; // '0x614'
        window./*client_*/connect_timer = 'O_O152680_0'; // '0x60b'
        window./*client_*/decrease_item = 'O_O152690_0'; // '0x663'
        window./*client_*/delete_inv = 'O_O152700_0'; // '0x670'
        window./*client_*/dont_harvest = 'O_O152710_0'; // '0x660'
        window./*client_*/empty_res = 'O_O152720_0'; // '0x631'
        window./*client_*/fail_restore = 'O_O152730_0'; // '0x629'
        window./*client_*/gauge_hunger = 'O_O154330_0'; // '0x60f'
        window./*client_*/gauge_life = 'O_O154730_0'; // '0x63d'
        window./*client_*/gauge_thirst = 'O_O154370_0'; // '0x63e'
        window./*client_*/get_focus = 'O_O153350_0'; // '0x630'
        window./*client_*/get_time = 'O_O152750_0'; // '0x640'
        window./*client_*/give_breadoven = 'give_O_O152040_0'; // '0x64c'
        window./*client_*/give_item = 'O_O152770_0'; // '0x650'
        window./*client_*/give_wood = 'O_O152760_0'; // '0x64f'
        window./*client_*/handshake = 'O_O152740_0'; // '0x6af'
        window./*client_*/hitten_other = 'O_O152780_0'; // '0x6b1'
        window./*client_*/inv_full = 'O_O152800_0'; // '0x633'
        window./*client_*/join_team = 'O_O152320_0'; // '0x681'
        window./*client_*/joined_team = 'O_O154560_0'; // '0x683'
        window./*client_*/kill_player = 'O_O152810_0'; // '0x643'
        window./*client_*/last_cam = 'O_O152820_0'; // '0x678'
        window./*client_*/left_team = 'O_O154550_0'; // '0x688'
        window./*client_*/lock_chest = 'O_O152830_0'; // '0x653'
        window./*client_*/move_units = 'O_O152840_0'; // '0x675'
        window./*client_*/new_player = 'O_O152850_0'; // '0x62e'
        window./*client_*/old_version = 'O_O152870_0'; // '0x61d'
        window./*client_*/ping_delay = 'O_O152860_0'; // '0x67c'
        window./*client_*/quest_update = 'O_O152000_0'; // '0x63b'
        window./*client_*/recover_focus = 'O_O152880_0'; // '0x647'
        window./*client_*/resurrection2 = 'O_O154820_0'; // '0x64b'
        window./*client_*/select_craft = 'O_O152890_0'; // '0x65c'
        window./*client_*/select_inv = 'O_O152900_0'; // '0x667'
        window./*client_*/send_angle = 'O_O152910_0'; // '0x674'
        window./*client_*/send_attack = 'O_O152930_0'; // '0x673'
        window./*client_*/send_build = 'O_O152940_0'; // '0x666'
        window./*client_*/send_chat = 'O_O152950_0'; // '0x77c'
        window./*client_*/send_move = 'O_O152970_0'; // '0x76b'
        window./*client_*/send_survivalkit = 'O_O154580_0'; // '0x80d'
        window./*client_*/server_list = 'O_O154490_0'; // '0x5fa'
        window./*client_*/set_cam = 'O_O153360_0'; // '0x614'
        window./*client_*/socket = 'O_O152310_0'; // '0x5ef'
        window./*client_*/steal_token = 'O_O153080_0'; // '0x68b'
        window./*client_*/stop_attack = 'O_O153090_0'; // '0x672'
        window./*client_*/store_server_list = 'O_O152980_0'; // '0x5f9'
        window./*client_*/succeed_quest = 'O_O151990_0'; // '0x638'
        window./*client_*/survival_kit = 'O_O154540_0'; // '0x636'
        window./*client_*/take_chest = 'O_O153010_0'; // '0x652'
        window./*client_*/take_flour = 'O_O154830_0'; // '0x651'
        window./*client_*/team_destroyed = 'O_O154570_0'; // '0x685'
        window./*client_*/try_ping = 'O_O153020_0'; // '0x67b'
        window./*client_*/unlock_chest = 'unO_O152830_0';
        window./*client_*/update_cam = 'O_O153040_0';
        window./*client_*/update_server_list = 'O_O153000_0'; // '05fc'
        window./*client_*/_current_id = 'O_O153560_0'; // '0x5f0'
        //window./*client_*/? = 'O_O152350_0'; // '0x64d' // take_well? put_well?
        //window./*client_*/? = 'O_O152530_0'; // '0x6b2'

        window.COUNTER = 'O_O152050_0'; // '0x517'

        window.CRAFT.HOOD = CRAFT.O_O151980_0; // '0x318'
        window.CRAFT.SEED = CRAFT.O_O154810_0; // '0x5c0'
        window.CRAFT.WINTER_HOOD = CRAFT.O_O151950_0; // '0x31c'

        window.create_breadoven = 'create_O_O152040_0';
        window.create_breadoven_off = 'create_O_O152040_0_off';
        window.create_breadoven_ui = 'create_O_O152040_0_ui';
        window.create_gauges_mobile = 'create_gauges_O_O154670_0';
        window.create_leaderboard_mobile = 'create_leaderboard_O_O154670_0';
        window.create_old_gauges = 'create_O_O154720_0_gauges';

        window.ctx = O_O153600_0; // '0x55a'

        window.delta = 'O_O153650_0';

        window.draw_alert = 'O_O153860_0';
        window.draw_alert_ghost = 'O_O153830_0';
        window.draw_auto_feed = 'O_O153880_0';
        window.draw_bg_transition = 'O_O153900_0';
        window.draw_bigmap = 'O_O153910_0';
        window.draw_breadoven = 'draw_O_O152040_0';
        window.draw_breadoven_inventory = 'draw_O_O152040_0_inventory';
        window.draw_breadoven_smog = 'draw_O_O152040_0_smog';
        window.draw_breath = 'O_O153920_0';
        window.draw_chat = 'O_O153930_0';
        window.draw_chest = 'O_O153950_0';
        window.draw_chest_inventory = 'O_O153940_0';
        window.draw_door = 'O_O153960_0';
        window.draw_dragon = 'O_O153970_0';
        window.draw_fake_world = 'O_O153730_0';
        window.draw_fg_transition = 'O_O153980_0';
        window.draw_fire_ground = 'O_O153990_0';
        window.draw_fire_halo = 'O_O154000_0';
        window.draw_foot = 'O_O154010_0';
        window.draw_furnace = 'O_O154050_0';
        window.draw_furnace_ground = 'O_O154020_0';
        window.draw_furnace_halo = 'O_O154030_0';
        window.draw_furnace_inventory = 'O_O154040_0';
        window.draw_gauges = 'O_O154060_0';
        window.draw_ground = 'O_O154070_0';
        window.draw_image_transition = 'O_O154080_0';
        window.draw_imgs_transition = 'O_O154100_0';
        window.draw_leaderboard = 'O_O154110_0';
        window.draw_map_object = 'O_O154130_0';
        window.draw_map_objects = 'O_O153920_0_objects';
        window.draw_map_objects_breathless = 'O_O154120_0';
        window.draw_map_transition = 'O_O154140_0';
        window.draw_minimap = 'O_O154150_0';
        window.draw_plant = 'O_O154170_0';
        window.draw_player = 'O_O154200_0';
        window.draw_player_clothe = 'O_O154180_0';
        window.draw_player_effect = 'O_O154200_0_effect';
        window.draw_player_right_stuff = 'O_O154190_0';
        window.draw_reconnect = 'O_O154210_0';
        window.draw_resurrection = 'O_O152500_0';
        window.draw_resurrection_halo = 'O_O152180_0';
        window.draw_resurrection_inventory = 'O_O152220_0';
        window.draw_seed = 'O_O152230_0';
        window.draw_show_spectators = 'O_O152280_0';
        window.draw_shop_timer = ''; // deprecated
        window.draw_simple_item = 'O_O152300_0';
        window.draw_simple_mobs = 'O_O152330_0';
        window.draw_simple_mobs_2 = 'O_O152330_0_2';
        window.draw_team_delay = 'O_O154590_0';
        window.draw_transition = 'O_O152360_0';
        window.draw_ui_crafting = 'O_O152370_0';
        window.draw_ui_inventory = 'O_O152390_0';
        window.draw_ui_slot_item = 'O_O152340_0';
        window.draw_ui_slot_item_count = 'O_O153870_0';
        window.draw_weapon_switch_delay = 'O_O152400_0';
        window.draw_winter = 'O_O152490_0';
        window.draw_world = 'O_O153760_0';
        window.draw_world_with_effect = 'O_O153720_0';

        window.fake_world = 'O_O153750_0';

        window./*game_*/add_event_listener = 'O_O153610_0'; // '0x7e4'
        window./*game_*/ctx = O_O153600_0; // '0x55a'
        window./*game_*/breadoven_bread_button = 'O_O152040_0_bread_button'; // '0x528'
        window./*game_*/breadoven_flour_button = 'O_O152040_0_flour_button'; // '0x529'
        window./*game_*/breadoven_wood_button = 'O_O152040_0_wood_button'; // '0x88a'
        window./*game_*/draw_scene = 'O_O153630_0'; // '0x891'
        window./*game_*/draw_UI = 'O_O153620_0'; // '0x88e'
        window./*game_*/recipes = 'O_O152060_0'; // '0x82d'
        window./*game_*/remove_event_listener = 'O_O153590_0'; // '0x7d9'
        window./*game_*/safe_delete = 'O_O152010_0'; // '0x7ee'
        window./*game_*/team_id = 'O_O154660_0'; // '0x538'
        window./*game_*/text_alert_queue_is_empty = 'O_O151940_0'; // '0x779'
        window./*game_*/trigger_keydown = 'O_O153420_0'; // '0x893'
        window./*game_*/trigger_keyup = 'O_O153450_0'; // '0x89f'
        window./*game_*/trigger_mousedown = 'O_O153460_0'; // '0x7df'
        window./*game_*/trigger_mousemove = 'O_O153470_0'; // '0x7e2'
        window./*game_*/trigger_mouseup = 'O_O153480_0'; // '0x7e1'
        window./*game_*/update_breadoven_button = 'update_O_O152040_0_button'; // '0x774'
        window./*game_*/update_chest_buttons = 'O_O153490_0_buttons'; // '0x771'
        window./*game_*/update_connection = 'O_O153500_0'; // '0x892'
        window./*game_*/update_craft_buttons = 'O_O153520_0'; // '0x770'
        window./*game_*/update_furnace_button = 'O_O153530_0'; // '0x772'
        window./*game_*/update_inv_buttons = 'O_O153540_0'; // '0x621'
        window./*game_*/update_scene = 'O_O153570_0'; // '0x88f'

        window.get_mouse_pos = 'O_O154290_0';

        window.init_fake_world = 'O_O153710_0';

        window.INV.HOOD = INV.O_O151980_0; // '0x318'
        window.INV.SEED = INV.O_O154810_0; // '0x5c0'
        window.INV.WINTER_HOOD = INV.O_O151950_0; // '0x31c'

        window.INV_INFO = 'O_O152080_0';

        window.ITEMS = O_O152510_0; // '0x988'
        window.ITEMS.SEED = ITEMS.O_O154810_0; // '0x5c0'
        window.ITEMS.WHEAT_SEED = ITEMS.WHEAT_O_O154810_0; // '0x1e0'

        //window.? = 'O_O151960_0';

        window.keyboard.set_azerty = keyboard.O_O154410_0; // '0x58'
        window.keyboard.set_qwerty = keyboard.O_O154420_0; // '0x5c'
        window.keyboard.clear_directionnal = keyboard.O_O154450_0; // '0x6b'
        window.keyboard.ARROW_LEFT = keyboard.O_O154460_0; // '0x5f'
        window.keyboard.ARROW_RIGHT = keyboard.O_O154470_0; // '0x60'
        window.keyboard.ARROW_TOP = keyboard.O_O154480_0; // '0x66'

        window.loader.ctx = loader.O_O153600_0; // '0x55a'

        window.mobile = 'O_O154670_0';

        window.MOUSE_MOVE = 'O_O154280_0';
        window.MOUSE_DOWN = 'O_O154270_0';
        window.MOUSE_UP = 'O_O154230_0';

        window.old_timestamp = 'O_O153640_0';

        window.RANDOM_NUMS = O_O154760_0;

        window.RECIPE_CATEGORIES = O_O152090_0;
        window.RECIPE_CATEGORIES.CONSTRUCTION = RECIPE_CATEGORIES.O_O152130_0; // '0x75d'
        window.RECIPE_CATEGORIES.FOOD = RECIPE_CATEGORIES.O_O152110_0; // '0x75c'
        window.RECIPE_CATEGORIES.HAT = RECIPE_CATEGORIES.O_O152140_0; // '0x75e'
        window.RECIPE_CATEGORIES.PLACEABLE = RECIPE_CATEGORIES.O_O152170_0; // '0x758'
        window.RECIPE_CATEGORIES.TOOL = RECIPE_CATEGORIES.O_O152100_0; // '0x759'
        window.RECIPE_CATEGORIES.WEAPON = RECIPE_CATEGORIES.O_O152120_0; // '0x75b'

        window.RECIPES = O_O153110_0;

        window.scoreboard.ctx = scoreboard.O_O153600_0; // '0x55a'

        window.SPRITE = O_O153120_0;
        window.SPRITE.COUNTER = SPRITE.O_O152050_0; // '0x517'
        window.SPRITE.CHEST_HOOD = SPRITE.CHEST_O_O151980_0;
        window.SPRITE.CHEST_SEED = SPRITE.CHEST_O_O154810_0; // '0x4a9'
        window.SPRITE.CHEST_WHEAT_SEED = SPRITE.CHEST_WHEAT_O_O154810_0; // '0x4aa'
        window.SPRITE.CHEST_WINTER_HOOD = SPRITE.CHEST_O_O151950_0;
        window.SPRITE.COUNTER = SPRITE.O_O152050_0; // '0x517'
        window.SPRITE.CRAFT_HOOD = SPRITE.CRAFT_O_O151980_0; // '0x323'
        window.SPRITE.CRAFT_SEED = SPRITE.CRAFT_O_O154810_0; // '0x1bd'
        window.SPRITE.CRAFT_WHEAT_SEED = SPRITE.CRAFT_WHEAT_O_O154810_0; // '0x1b6'
        window.SPRITE.CRAFT_WINTER_HOOD = SPRITE.CRAFT_O_O151950_0; // '0x321'
        window.SPRITE.GAUGE = SPRITE.O_O154740_0; // '0x48a'
        window.SPRITE.GLOVES_HOOD = SPRITE.GLOVES_O_O151980_0; // '0x13f'
        window.SPRITE.HOOD = SPRITE.O_O151980_0; // '0x318'
        window.SPRITE.INV_HOOD = SPRITE.INV_O_O151980_0; // '0x322'
        window.SPRITE.INV_SEED = SPRITE.INV_O_O154810_0; // '0x1bb'
        window.SPRITE.INV_WHEAT_SEED = SPRITE.INV_WHEAT_O_O154810_0; // '0x1b5'
        window.SPRITE.INV_WINTER_HOOD = SPRITE.INV_O_O151950_0; // '0x320'
        window.SPRITE.KRAKEN_MIN_X = SPRITE.O_O154840_0; // '0x6cc'
        window.SPRITE.PLANT_SEED = SPRITE.PLANT_O_O154810_0; // '0x1dd'
        window.SPRITE.RESURRECTION_ROTATE = SPRITE.RESURRECTION_O_O153220_0; // '0x2eb'
        window.SPRITE.SEED = SPRITE.O_O154810_0; // '0x5c0'
        window.SPRITE.SPECIAL_ITEMS = SPRITE.SPECIAL_O_O152510_0;
        window.SPRITE.UNKNOWN_MINorMAX_XorY = SPRITE.O_O154850_0; // '0x6cb'
        window.SPRITE.UNKNOWN2_MINorMAX_XorY = SPRITE.O_O154960_0; // '0x6c9'
        window.SPRITE.WHEAT_SEED = SPRITE.WHEAT_O_O154810_0; // '0x1e0'
        window.SPRITE.WHEAT_SEED_DRIED = SPRITE.WHEAT_O_O154810_0_DRIED; // '0x1e2'
        window.SPRITE.WINDMILL_WHEAT_SEED = SPRITE.WINDMILL_WHEAT_O_O154810_0; // '0x866'
        window.SPRITE.WINTER_HOOD = SPRITE.O_O151950_0; // '0x31c'

        window.STATE = O_O153130_0;
        window.STATE.ATTACK = STATE.O_O153230_0; // '0x5a6'

        window.ui.add_event_listener = ui.O_O153610_0; // '0x7e4'
        window.ui.ctx = ui.O_O153600_0; // '0x55a'
        window.ui.remove_event_listener = ui.O_O153590_0; // '0x7d9'
        window.ui.server_list = ui.O_O154490_0; // '0x5fa'
        window.ui.set_azerty = ui.O_O154410_0; // '0x58'
        window.ui.set_qwerty = ui.O_O154420_0; // '0x5c'
        window.ui.trigger_mousedown = ui.O_O153460_0; // '0x7df'
        window.ui.trigger_mousemove = ui.O_O153470_0; // '0x7e2'
        window.ui.trigger_mouseup = ui.O_O153480_0; // '0x7e1'

        window.user.breadoven = user.O_O152040_0; // '0x51b'
        window.user.gauges.old = user.gauges.O_O154720_0; // '0x58b'
        window.user.gauges.thirst = user.gauges.O_O154710_0; // '0x588'
        window.user.gauges.warn_old = user.gauges.O_O154700_0; // '0x58d'
        window.user.gauges.warn_thirst = user.gauges.O_O154690_0; // '0x58a'
        window.user.spectators = user.O_O154300_0; // '0x558'

        window.Utils = O_O153660_0;
        window.Utils.cross_product= Utils.O_O154400_0; // '0x11'
        window.Utils.ease_out_quad = Utils.O_O153810_0; // '0x767'
        window.Utils.get_angle = Utils.O_O153690_0; // '0x12'
        window.Utils.get_std_angle = Utils.O_O153680_0; // '0x6c4'
        window.Utils.get_vector = Utils.O_O154380_0;
        window.Utils.LinearAnimation = Utils.O_O153670_0; // '0x69b'
        window.Utils.open_in_new_tab = Utils.O_O154220_0;
        window.Utils.rand_sign = Utils.O_O154390_0; // '0x16'
        window.Utils.rand_string = Utils.O_O153820_0;
        window.Utils.restore_number = Utils.O_O153790_0; // '0x69f'
        window.Utils.scalar_product = Utils.O_O154360_0; // '0xe'
        window.Utils.simplify_number = Utils.O_O153800_0; // '0x563'
        window.Utils.translate_vector = Utils.O_O153700_0;

        window.WORLD = O_O152520_0;
        //window./*WORLD_*/L? = 'LO_O154880_0'; // '0x789'
        //window./*WORLD_*/L? = 'LO_O154910_0'; // '0x5dc'
        //window./*WORLD_*/? = 'O_O152150_0'; // '0x48d'
        //window./*WORLD_*/? = 'O_O152160_0'; // '0x699'
        window./*WORLD_*/ROTATE = 'O_O153220_0'; // '0x6c2'
        //window./*WORLD_*/? = 'O_O154650_0'; // '0x537'
        //window./*WORLD_*/? = 'O_O154790_0'; // '0x77f'
        //window./*WORLD_*/? = 'O_O154800_0'; // '0x780'
        window./*WORLD_*/SEED = 'O_O154810_0'; // '0x5c0'
        //window./*WORLD_*/? = 'O_O154880_0'; // '0x78f'
        //window./*WORLD_*/? = 'O_O154900_0'; // '0x78a'
        //window./*WORLD_*/? = 'O_O154910_0'; // '0x790'
        //window./*WORLD_*/? = 'O_O154930_0'; // '0x753'
        //window./*WORLD_*/? = 'O_O154940_0'; // '0x74e'
        //window./*WORLD_*/? = 'O_O154950_0'; // '0x5bc'
        //window./*WORLD_*/? = 'O_O154970_0'; // '0x6d4'
        //window./*WORLD_*/? = 'O_O154980_0'; // '0x6d3'
        window./*WORLD_*/SPEED_ATTACK = 'SPEED_O_O153230_0'; // '0x6ce'

        window.world = O_O153770_0;
        window./*world_*/delete_all_units = 'O_O153370_0'; // '0x655'
        window./*world_*/delete_units = 'O_O153380_0'; // '0x657'
        window./*world_*/fast_units = 'O_O153390_0'; // '0x523'
        window./*world_*/max_units = 'O_O153400_0'; // '0x648'
        window./*world_*/move_units = 'O_O152840_0'; // '0x675'
        window./*world_*/players = 'O_O153410_0'; // '0x551'

        // END DEOBFUSCATION
        window.deobcomplete = true;
   }

    checkDependencies();
})();