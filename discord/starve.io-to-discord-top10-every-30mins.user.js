// ==UserScript==
// @name         Starve.io to Discord : Top 10 every 30 minutes
// @namespace    http://tampermonkey.net/
// @version      0.15.02
// @description  Shares Starve.io server scores with a Discord server
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
        var webhook = document.cookie.replace(/(?:(?:^|.*;\s*)dwht10e30m\s*\=\s*([^;]*).*$)|^.*$/, '$1'),
        webhook_lastused=0;

        if (webhook === '') {
            var webhook_prompt = 'Starve.io to Discord : Top 10 scores every 30 minutes\n\nInput Discord Webhook URL here\n\nExample: "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"';
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
                    document.cookie = 'dwht10e30m='+webhook+'; expires='+date.toGMTString();
                }
            }
        }

        var server_name = '', server_url = '', server_url_ip = '', server_url_port = 0;

        window.old_user_ldb_init = user.ldb.init;
        user.ldb.init = function (c) {
            old_user_ldb_init.apply(this, arguments);
            if ((new Date().getTime() / 1000 - 60 * 30) > webhook_lastused) {
                webhook_lastused = new Date().getTime() / 1000;
                check_scores();
            }
        };

        var check_scores = function() {
            if (world[players].length > 0) {
                server_url = window[client][socket].url;
                server_url_ip = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[1];
                server_url_port = server_url.match(/ws:\/\/([^:]*):([^/]*)\//)[2];

                for (var x = 0; x < window[client][server_list].length; x++) {
                    if (window[client][server_list][x].i === server_url_ip && window[client][server_list][x].p === parseInt(server_url_port)) {
                        server_name = window[client][server_list][x].a;
                    }
                }

                var output = '', scores=[], scores_text='';
                for (x = 0; x < world[players].length; x++) {
                    if (world[players][x].alive && world[players][x].score > 0) {
                        scores.push([world[players][x].nickname, world[players][x].score]);
                    }
                }

                // Sort: Top scores first, alphabetical order if same scores
                scores.sort(function(a, b) {return a[1] > b[1] ? -1 : (a[1] < b[1] ? 1 : (a[0] > b[0] ? 1 : -1)); });

                for (x = 0; x < scores.length; x++) {
                    scores_text += ('  ' + (x + 1)).slice(-3) + ') ' + ('          ' + scores[x][1]).slice(-7) + ' ' + scores[x][0] + '\n';
                }
                output = '**Top 10 Scores @ ' + server_name + '**\n```\n' + scores_text.trimRight() + '```';

                post(webhook, { 'username': world[fast_units][user.uid].player.nickname, 'text': output });
            }
        };
    }

    checkDependencies();
})();