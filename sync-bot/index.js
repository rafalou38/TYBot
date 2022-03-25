import config from "./config.js";
import InitializeSentry from "./app/sentry.js";
import InitializeSequelize from "./app/sequelize.js";
import InitializeDiscord from "./app/discord.js";
import InitializeExpress from "./app/express.js";

let { discord_bot_token, gms_extra, api_port, sequelize, sentry } = config;
if (process.env.API_PORT) api_port = process.env.API_PORT;
if (process.env.DISCORD_API_BOT_TOKEN) discord_bot_token = process.env.DISCORD_API_BOT_TOKEN;
if (process.env.GMS_EXTRA) gms_extra = process.env.GMS_EXTRA;
if (process.env.SENTRY_DSN) sentry = { dsn: process.env.SENTRY_DSN };

console.log("Starting Sync bot.\n");
if (sentry != null) {
	InitializeSentry(sentry);
}
var SQ = InitializeSequelize(sequelize);
var client = InitializeDiscord(SQ, discord_bot_token);
InitializeExpress(SQ, gms_extra || null, client, api_port);
