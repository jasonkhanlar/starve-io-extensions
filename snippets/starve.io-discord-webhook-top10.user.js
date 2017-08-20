// ==UserScript==
// @name         Discord Webhook for Starve.io Top 10 Leaderboard
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Pushes real-time top 10 scores on connected server to a Discord server
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires 'Starve.io Deobfuscated' script as a dependency

(function() {
    'use strict';

    var webhook = document.cookie.replace(/(?:(?:^|.*;\s*)discord_webhook_top10\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    if (webhook === '') {
        var webhook_prompt = 'DISCORD WEBHOOK URL\n\nPaste the full URL here\n\nLooks like "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"\n\nYou must have the Manage Webhooks permission on your Discord server to create or have access to this\n\nReminder: If you wish to change this later, first delete the cookie.\n\nBy filling this out, you consent to cookies, but cookies may or may not consent to you. See https://www.cookielaw.org/the-cookie-law/';
        webhook = prompt(webhook_prompt);
        if (!webhook.match(/https:\/\/discordapp.com\/api\/webhooks\/[0-9]+\/[A-Za-z0-9_-]+/)) {
            var webhook_error = 'That is an invalid Webhook URL.\n\nSupport is available in #extension-support at Discord Server https://discord.gg/eRV8hfJ\n\nRefresh the page to try again.';
            alert(webhook_error);
        } else {
            webhook += '/slack';
            document.cookie = 'discord_webhook_top10='+webhook;
        }
    }

    function post(url, data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        var data = JSON.stringify(data);
        xhr.send(data);
    }

    window.checkDependencies = function() {
        if (typeof deobcomplete === 'undefined' || deobcomplete !== true) {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    };

    function main() {
        var server_name = '', server_url = '', server_url_ip = '', server_url_port = 0;

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

                loggeddata.push(world.players);
                for (var xx=0; xx< world[players].length; xx++) {
                    /*
                    console.log([
                        xx,
                        world[players][xx].nickname,
                        world[players][xx].alive,
                        world[players][xx].label,
                        world[players][xx].label_winter,
                        world[players][xx].ldb_label,
                        world[players][xx].score
                    ]);
                    */
                }
                var output = '', scores=[], scores_text='';
                for (var x = 0; x < world[players].length; x++) {
                    if (world[players][x].alive && world[players][x].score > 0) {
                        scores.push([world[players][x].nickname, world[players][x].score]);
                    }
                }

                // Sort: Top scores first, alphabetical order if same scores
                scores.sort(function(a, b) {return a[1] > b[1] ? -1 : (a[1] < b[1] ? 1 : (a[0] > b[0] ? 1 : -1)); })

                for (var x = 0; x < scores.length; x++) {
                    scores_text += ('  ' + (x + 1)).slice(-3) + ') ' + ('          ' + scores[x][1]).slice(-7) + ' ' + scores[x][0] + '\n';
                }
                output = '**Top Scores @ ' + server_name + '**\n```\n' + scores_text.trimRight() + '```';

                post(
                    webhook,
                    {
                        "username": world[fast_units][user.uid].player.nickname,
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
                if (loggeddata.length < 2) {
                    setTimeout(check_scores, 6000);
                }
            } else {
                    setTimeout(check_scores, 1000);
                }
        }

        setTimeout(check_scores, 1000);
    }

    window.loggeddata=[];

    checkDependencies();
})();