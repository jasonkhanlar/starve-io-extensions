# Discord Webhooks

All scripts depend on and require the deobfuscate userscript to function

Scripts here are for proof of concept and working examples

## discord / starve.io-to-discord-all-scores-once.user.js

* Shares Starve.io server scores with a Discord server once immediately upon connection

## discord / starve.io-to-discord-share-chat.user.js

* Shares Starve.io chat with a Discord server including both your messages and messages from others

## discord / starve.io-to-discord-share-screenshot.user.js

* Share Starve.io screenshots with a Discord server by pushing P (Also PRINT SCREEN works even if in-game chat input is enabled)

## discord / starve.io-to-discord-top10-every-30mins.user.js

* Shares Starve.io server top10 scores with a Discord server once immediately upon connection and every 30 minutes after

TO USE / INSTALL
----------------
* Load the corresponding userscript with Greasemonkey, Tampermonkey, or similar userscript manager depending on web browser
* Create or obtain a Discord Server Webhook and provide the full Webhook URL when prompted upon loading http://starve.io
* Webhook URLs looks like "https://discordapp.com/api/webhooks/012345678901234567/A-aBbC0cDdE1eF-fGg2HhIi3JjKkL4lMm_N5nOoPp6Qq_Rr7SsTtU8uVv-W9wXxY_yZz"
