// ==UserScript==
// @name         Starve.io to Discord : Share chat
// @namespace    http://tampermonkey.net/
// @version      0.15.02
// @description  Shares Starve.io chat with a Discord server
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

    function checkDependencies() {
        if ((typeof deobcomplete === 'undefined' || deobcomplete !== true) &&
            (typeof deobmicro === 'undefined' || deobmicro !== true)) {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    }

    function main() {
        var webhook = document.cookie.replace(/(?:(?:^|.*;\s*)dwhsc\s*\=\s*([^;]*).*$)|^.*$/, '$1');

        if (webhook === '') {
            var webhook_prompt = 'Starve.io to Discord : Share chat\n\nInput Discord Webhook URL here\n\nExample: "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"';
            webhook = prompt(webhook_prompt);
            if (webhook) {
                if (!webhook.match(/https:\/\/discordapp.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/)) {
                    var webhook_error = 'That is an invalid Webhook URL.\n\nSupport is available in #extension-support at Discord Server https://discord.gg/eRV8hfJ\n\nRefresh the page to try again.';
                    alert(webhook_error);
                } else {
                    // Expire every 24 hours
                    var date = new Date();
                    date.setTime(date.getTime()+(24*60*60*1000));
                    webhook += '/slack';
                    document.cookie = 'dwhsc='+webhook+'; expires='+date.toGMTString();
                }
            }
        }

        var server_name = '', server_url = '', server_url_ip = '', server_url_port = 0;

        function chat(u, m) {
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
            var output = '[' + server_name + '] **' + u + '**: ' + m;
            post(webhook, { "username": world[fast_units][user.uid].player.nickname, "text": output });
        }

        // Received messages
        window.old_client_chat = window[client].chat;
        window[client].chat = function(c) {
            old_client_chat.apply(this, arguments);
            chat(world[players][c[1]].nickname,c[2]);
        };

        // Sent messages
        window.old_client_send_chat = window[client][send_chat];
        window[client][send_chat] = function(c) {
            old_client_send_chat.apply(this, arguments);
            chat(world[players][user.id].nickname,c);
        };
    }

    checkDependencies();
})();