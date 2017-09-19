// ==UserScript==
// @name         Starve.io to Discord : Share screenshot
// @namespace    http://tampermonkey.net/
// @version      0.15.20
// @description  Shares Starve.io screenshot with a Discord server
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

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
    function post_mp(url, data) {
        var boundary = 'Starve.io is excellent!',
        xhr_mp = new XMLHttpRequest();
        xhr_mp.open('POST', url, true);
        xhr_mp.setRequestHeader('Content-type', 'multipart/form-data; boundary=' + boundary + '; filename="canvas.png"');
        xhr_mp.sendAsBinary([
            '--' + boundary,
            'Content-Disposition: form-data; name="file"; filename="canvas.png"',
            'Content-Type: image/png',
            '',
            data.file,
            '--' + boundary + '--'
        ].join('\r\n'));
    }

    function checkDependencies() {
        if (typeof deobauto === 'undefined') {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    }

    function main() {
        var server_name = '', server_url = '', server_url_ip = '', server_url_port = 0,
        webhook = document.cookie.replace(/(?:(?:^|.*;\s*)dwhshsc\s*\=\s*([^;]*).*$)|^.*$/, '$1');

        if (webhook === '') {
            var webhook_prompt = 'Starve.io to Discord : Share screenshot\n\nInput Discord Webhook URL here\n\nExample: "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"';
            webhook = prompt(webhook_prompt);
            if (webhook) {
                if (!webhook.match(/https:\/\/discordapp.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/)) {
                    var webhook_error = 'That is an invalid Webhook URL.\n\nSupport is available in #extension-support at Discord Server https://discord.gg/eRV8hfJ\n\nRefresh the page to try again.';
                    alert(webhook_error);
                } else {
                    // Expire every 24 hours
                    var date = new Date();
                    date.setTime(date.getTime()+(24*60*60*1000));
                    document.cookie = 'dwhshsc='+webhook+'; expires='+date.toGMTString();
                }
            }
        }

        function screenshot() {
            if (window[client][socket]) {
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

                post_mp(webhook, {
                    'file': atob(can.toDataURL('image/png').split(',')[1]),
                    'username': world[fast_units][user.uid].player.nickname,
                });
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