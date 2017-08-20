# snippets

All scripts depend on and require starve.io-deobfuscate.user.js to function and should be compatible with one another, but results may vary

Scripts here are for proof of concept and working examples

## snippets / starve.io-discord-webhook-scores.user.js

* Initial proof of concept: Share Starve.io Scores to a Discord Server

TO USE / INSTALL
----------------
* Either Manage Webhooks permission on a Discord server is required (or an appropriate Webhook URL must be shared with you) to make use of this script
  * Create or obtain a Webhook on a Discord server and provide the full Webhook URL when prompted upon loading http://starve.io
  * Webhook URL looks like "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"
* Load starve.io-discord-webhook-scores.user.js with Greasemonkey, Tampermonkey, or similar userscript manager depending on web browser

(1) Display Starve.io Scores to Discord Server
-------------------------
* At this time, top score information is sent to Discord server only once upon beginning of gameplay
