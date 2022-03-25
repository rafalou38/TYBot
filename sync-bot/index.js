const { name, version } = require("./package.json");

let { discord_bot_token, gms_extra, api_port, sequelize, sentry } = require("./config.json");
if (process.env.API_PORT) api_port = process.env.API_PORT;
if (process.env.DISCORD_API_BOT_TOKEN) discord_bot_token = process.env.DISCORD_API_BOT_TOKEN;
if (process.env.GMS_EXTRA) gms_extra = process.env.GMS_EXTRA;
if (process.env.SENTRY_DSN) sentry = { dsn: process.env.SENTRY_DSN };

console.log(`Starting ${name} ${version}.\n`);
if (sentry != null) {
	require("./app/sentry.js")(sentry);
}
var SQ = require("./app/sequelize.js")(sequelize);
var client = require("./app/discord.js")(SQ, discord_bot_token);
require("./app/express.js")(SQ, gms_extra || null, client, api_port);
