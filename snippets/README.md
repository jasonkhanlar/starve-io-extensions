# starve-io-extensions
starve.io-discord-webhook-top10.user.js

* Initial proof of concept: Share Starve.io Top 10 scores to a Discord Server

TO USE / INSTALL
----------------
* Manage Webhooks permission on a Discord server is required to make use of this script
  * Create a Webhook on a Discord server and provide the full Webhook URL when prompted upon loading http://starve.io
  * Webhook URL looks like "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"
* Load starve.io-discord-webhook-top10.user.js with Greasemonkey, Tampermonkey, or similar userscript manager depending on web browser

(1) Display Top Scores to Discord Server
-------------------------
* At this time, top score information is sent to Discord server only once upon beginning of gameplay each refresh of http://starve.io
