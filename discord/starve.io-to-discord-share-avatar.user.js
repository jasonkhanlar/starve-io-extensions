// ==UserScript==
// @name         Starve.io to Discord : Share avatar
// @namespace    https://github.com/jasonkhanlar/starve-io-extensions
// @version      0.16.0
// @description  Shares Starve.io avatar with a Discord server
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

    var required_deobfuscate_version = '0.16.0';

    var webhook;

    var avatar_can = document.createElement('canvas');
    avatar_can.id = 'avatar_canvas';
    avatar_can.height = 128;
    avatar_can.width = 128;
    avatar_can.style.display = 'none';
    document.body.appendChild(avatar_can);
    var avatar_ctx = avatar_can.getContext('2d');

    window.avatar_url='';

    function post(url, data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        data = JSON.stringify(data);
        xhr.send(data);
    }

    // https://stackoverflow.com/a/9250818
    if (!('sendAsBinary' in XMLHttpRequest.prototype)) {
        XMLHttpRequest.prototype.sendAsBinary = function(string) {
            var bytes = Array.prototype.map.call(string, function(c) { return c.charCodeAt(0) & 0xff; });
            this.send(new Uint8Array(bytes).buffer);
        };
    }
    function post_mp(url, data, payload_json) {
        var boundary = 'Starve.io is excellent!',
        xhr_mp = new XMLHttpRequest();
        xhr_mp.onreadystatechange = function() {
            if (xhr_mp.readyState === 4) {
                var json = JSON.parse(xhr_mp.response);
                avatar_url = json.attachments[0].url;
            }
        };
        xhr_mp.open('POST', url, true);
        xhr_mp.setRequestHeader('Content-type', 'multipart/form-data; boundary=' + boundary + '; filename="canvas.png"');
        var post_data = [
            '--' + boundary,
            'Content-Disposition: form-data; name="file"; filename="canvas.png"',
            'Content-Type: image/png',
            '',
            data.file
        ];
        if (typeof payload_json !== 'undefined') {
            post_data.push(
                '--' + boundary,
                'Content-Disposition: form-data; name="payload_json"',
                'Content-Type: application/json',
                '',
                JSON.stringify(payload_json),
            );
        }
        post_data.push('--' + boundary + '--');
        xhr_mp.sendAsBinary(post_data.join('\r\n'));
    }

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

    function get_avatar_dimensions() {
        var height = 128, width = 128, transx = 64, transy = 64;

        var c = world[fast_units][user.uid].right;
        if (0 <= c) switch (img = sprite[c][world.time], c) {
            case SPRITE.PICK:
            case SPRITE.PICK_GOLD:
            case SPRITE.PICK_DIAMOND:
            case SPRITE.PICK_WOOD:
            case SPRITE.PICK_AMETHYST:
                height += 30;
                width += 30;
                transx += 30;
                break;
            case SPRITE.SWORD:
            case SPRITE.SWORD_GOLD:
            case SPRITE.SWORD_DIAMOND:
            case SPRITE.SWORD_AMETHYST:
                height += 38;
                width += 6;
                transx += 6;
                break;
            case SPRITE.DRAGON_SWORD:
                height += 32;
                width += 6;
                transx += 6;
                break;
            case SPRITE.BOOK:
                height += 27;
                width += 27;
                transx += 27;
                break;
            case SPRITE.SPEAR:
            case SPRITE.GOLD_SPEAR:
            case SPRITE.DIAMOND_SPEAR:
            case SPRITE.AMETHYST_SPEAR:
                height += 114;
                break;
            case SPRITE.HAMMER:
            case SPRITE.HAMMER_GOLD:
            case SPRITE.HAMMER_DIAMOND:
            case SPRITE.HAMMER_AMETHYST:
                height += 32;
                width += 10;
                transx += 10;
                break;
            case SPRITE.SUPER_HAMMER:
                height += 36;
                width += 16;
                transx += 16;
                break;
            case SPRITE.SHOVEL:
            case SPRITE.SHOVEL_GOLD:
            case SPRITE.SHOVEL_DIAMOND:
            case SPRITE.SHOVEL_AMETHYST:
                height += 32;
                break;
            case SPRITE.WATERING_CAN_FULL:
                height += 44;
                width += 12;
                transx += 12;
                break;
            case SPRITE.SPANNER:
                height += 22;
                width += 10;
                transx += 10;
        }

        return {height: height, width: width, transx: transx, transy: transy};
    }

    function generate_avatar() {
        var avatar_dim = get_avatar_dimensions();
        avatar_can.height = avatar_dim.height;
        avatar_can.width = avatar_dim.width;
        avatar_ctx.clearRect(0, 0, avatar_can.width, avatar_can.height)
        avatar_ctx.save();
        avatar_ctx.translate(avatar_dim.transx, avatar_dim.transy);
        if (world[fast_units][user.uid].clothe === SPRITE.WINTER_HOOD) {
            var hand = sprite[SPRITE.GLOVES_HOOD][world.time];
        } else {
            var hand = sprite[SPRITE.HAND][world[fast_units][user.uid].skin][world.time];
        }
        var hand_shadow = sprite[SPRITE.HAND_SHADOW][world.time];
        avatar_ctx.drawImage(hand_shadow, hand_shadow.width / -2 - scale * (49 + world[fast_units][user.uid].idle.v), hand_shadow.height / -2 + (15 + world[fast_units][user.uid].walk.v) * scale),
        generate_avatar_right_stuff(world[fast_units][user.uid].right, world[fast_units][user.uid].idle.v, world[fast_units][user.uid].walk.v),
        avatar_ctx.drawImage(hand, hand.width / -2 - scale * (49 + world[fast_units][user.uid].idle.v), hand.height / -2 + (11 + world[fast_units][user.uid].walk.v) * scale),
        avatar_ctx.drawImage(hand_shadow, hand_shadow.width / -2 + scale * (49 + world[fast_units][user.uid].idle.v), hand_shadow.height / -2 + (15 + world[fast_units][user.uid].walk.v) * scale),
        avatar_ctx.drawImage(hand, hand.width / -2 + scale * (49 + world[fast_units][user.uid].idle.v), hand.height / -2 + (11 + world[fast_units][user.uid].walk.v) * scale);
        if (world[fast_units][user.uid].bag && 1 > world[fast_units][user.uid].clothe) {
            avatar_ctx.drawImage(sprite[SPRITE.BAG][world.time], sprite[SPRITE.BAG][world.time].width / -2, sprite[SPRITE.BAG][world.time].height / -2 - 39 * scale);
        }
        var skin = sprite[SPRITE.BODY][world[fast_units][user.uid].skin][world.time];
        avatar_ctx.drawImage(skin, skin.width / -2, skin.height / -2);
        generate_avatar_clothe(world[fast_units][user.uid].clothe);
        avatar_ctx.restore();
    };

    function generate_avatar_clothe(c) {
        if (0 < c) {
            var g = sprite[c][world.time];
            switch (c) {
                case SPRITE.EARMUFFS:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 18 * scale);
                    break;
                case SPRITE.COAT:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 10 * scale);
                    break;
                case SPRITE.EXPLORER_HAT:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 19 * scale);
                    break;
                case SPRITE.STONE_HELMET:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 21 * scale);
                    break;
                case SPRITE.GOLD_HELMET:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 5 * scale);
                    break;
                case SPRITE.DIAMOND_HELMET:
                case SPRITE.CAP_SCARF:
                case SPRITE.WINTER_HOOD:
                case SPRITE.DIVING_MASK:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 2 * scale);
                    break;
                case SPRITE.AMETHYST_HELMET:
                    avatar_ctx.drawImage(g, - g.width / 2 + 1.5 * scale, - g.height / 2 + 1 * scale);
                    break;
                case SPRITE.SUPER_DIVING_SUIT:
                    avatar_ctx.drawImage(g, - g.width / 2 + 2 * scale, - g.height / 2);
                    break;
                case SPRITE.DRAGON_HELMET:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 - 11 * scale);
                    break;
                case SPRITE.CROWN_GREEN:
                case SPRITE.CROWN_ORANGE:
                case SPRITE.CROWN_BLUE:
                    avatar_ctx.drawImage(g, - g.width / 2 - 1 * scale, - g.height / 2);
                    break;
                case SPRITE.HOOD:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 + 2 * scale);
                    break;
                case SPRITE.PEASANT:
                case SPRITE.WINTER_PEASANT:
                    avatar_ctx.drawImage(g, - g.width / 2, - g.height / 2 + 8 * scale);
            }
        }
    }

    function generate_avatar_right_stuff(c, g, f) {
        if (0 <= c) switch (img = sprite[c][world.time], c) {
            case SPRITE.PICK:
            case SPRITE.PICK_GOLD:
            case SPRITE.PICK_DIAMOND:
            case SPRITE.PICK_WOOD:
            case SPRITE.PICK_AMETHYST:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (45 + g), img.height / -2 + scale * (f + 22));
                break;
            case SPRITE.SWORD:
            case SPRITE.SWORD_GOLD:
            case SPRITE.SWORD_DIAMOND:
            case SPRITE.SWORD_AMETHYST:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (43 + g), img.height / -2 + scale * (f + 49));
                break;
            case SPRITE.DRAGON_SWORD:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (40 + g), img.height / -2 + scale * (f + 65));
                break;
            case SPRITE.BOOK:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (62 + g), img.height / -2 + scale * (f + 18));
                break;
            case SPRITE.SPEAR:
            case SPRITE.GOLD_SPEAR:
            case SPRITE.DIAMOND_SPEAR:
            case SPRITE.AMETHYST_SPEAR:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (39 + g), img.height / -2 + scale * (f + 70));
                break;
            case SPRITE.HAMMER:
            case SPRITE.HAMMER_GOLD:
            case SPRITE.HAMMER_DIAMOND:
            case SPRITE.HAMMER_AMETHYST:
            case SPRITE.SUPER_HAMMER:
            case SPRITE.SHOVEL:
            case SPRITE.SHOVEL_GOLD:
            case SPRITE.SHOVEL_DIAMOND:
            case SPRITE.SHOVEL_AMETHYST:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (46 + g), img.height / -2 + scale * (f + 35));
                break;
            case SPRITE.WATERING_CAN_FULL:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (47 + g), img.height / -2 + scale * (f + 54));
                break;
            case SPRITE.SPANNER:
                avatar_ctx.drawImage(img, img.width / -2 - scale * (47 + g), img.height / -2 + scale * (f + 20));
        }
    }

    function main() {
        var server_name = '', server_url = '', server_url_ip = '', server_url_port = 0,
        webhook = document.cookie.replace(/(?:(?:^|.*;\s*)dwhshav\s*\=\s*([^;]*).*$)|^.*$/, '$1');

        if (webhook === '') {
            var webhook_prompt = 'Starve.io to Discord : Share avatar\n\nInput Discord Webhook URL here\n\nExample: "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"';
            webhook = prompt(webhook_prompt);
            if (webhook) {
                if (!webhook.match(/https:\/\/discordapp.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/)) {
                    var webhook_error = 'That is an invalid Webhook URL.\n\nSupport is available in #extension-support at Discord Server https://discord.gg/eRV8hfJ\n\nRefresh the page to try again.';
                    alert(webhook_error);
                } else {
                    // Expire every 24 hours
                    var date = new Date();
                    date.setTime(date.getTime()+(24*60*60*1000));
                    document.cookie = 'dwhshav='+webhook+'; expires='+date.toGMTString();
                }
            }
        }

        function screenshot() {
            if (window[client][socket]) {
                if (avatar_url === '' && world.time === 0) avatar_url = 'https://i.imgur.com/ALjc7Nu.png';
                else if (avatar_url === '') avatar_url = 'https://i.imgur.com/yjTuBuw.png';

                if (server_url === '') {
                    server_url = window[client][socket].url;
                    server_url_ip = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[1];
                    server_url_port = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[2];

                    for (var x = 0; x < window[client][server_list].length; x++) {
                        if (window[client][server_list][x].i === server_url_ip && window[client][server_list][x].p === parseInt(server_url_port)) {
                            server_name = window[client][server_list][x].a;
                        }
                    }
                }

                generate_avatar();
                var output = 'selfie on ' + server_name;
                if (world[fast_units][user.uid].clothe > 0) {
                    output += ' wearing a ' + INV_INFO[world[fast_units][user.uid].clothe].name.toLowerCase();
                }
                if (world[fast_units][user.uid].right > -1) {
                    output += ' holding a ' + INV_INFO[world[fast_units][user.uid].right].name.toLowerCase();
                }
                post_mp(
                    webhook,
                    {file: atob(CTI(avatar_can).src.split(',')[1])},
                    {avatar_url: avatar_url, content: output, username: world[fast_units][user.uid].player.nickname}
                );
            }
        }

        var my_trigger_key_up = function(c) {
            // Push Print Screen (can be used when chat dialog is opened) or I
            // (See http://keycode.info/)
            if (c.keyCode === 42 || (!user.chat.open && c.keyCode === 73)) { screenshot(); }
        };

        window.addEventListener('keyup', my_trigger_key_up, false);
    }

    checkDependencies();
})();