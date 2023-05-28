import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import "./sentry.js";

import Discord, { GatewayIntentBits } from "discord.js";

import { commands } from "./commands/index.js";
import { initDB } from "./database/initialize.js";
import { userJoin } from "./events/userJoin.js";
import { userLeave } from "./events/userLeave.js";
import { config, context } from "./context.js";
import { log } from "./utils/prettyLog.js";
import { setup as setupInvites } from "./utils/invites.js";
import { countXP } from "./events/message.js";
import { handleInteraction } from "./events/interaction.js";
import { checkBirthday } from "./tasks/birthday.js";
import { logJoin } from "./events/log/join.js";
import { logLeave } from "./events/log/leave.js";
import { logRoleCreate, logRoleDelete } from "./events/log/role.js";
import { logChannelCreate, logChannelDelete } from "./events/log/chanel.js";
import { logGuildBanAdd, logGuildBanRemove } from "./events/log/ban.js";
import { updateStatus } from "./tasks/updateStatus.js";
import { checkAncestor } from "./tasks/ancestors.js";
import "./queryServers.js";
import { handleRaw } from "./events/raw.js";
import { handleVoiceStateUpdate } from "./events/voiceStateUpdate.js";

/** @type {Discord.IntentsString[]} */
const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildVoiceStates,
];
const client = new Discord.Client({
	intents: intents,
	ws: { intents: intents },
});

client.once("ready", async () => {
	const guilds = await client.guilds.fetch();
	guilds.forEach(async (oldGuild) => {
		const guild = await client.guilds.fetch(oldGuild.id);
		checkBirthday(guild);
		checkAncestor(guild);
	});
	updateStatus(client);
	setInterval(updateStatus.bind(null, client), 1000 * 60 * 60);
	log(`🤖 bot ${client.user.username}#${client.user.tag} successfully started 🚀`);
});

client.on("messageCreate", async (message) => {
	// if (!message.content.startsWith(config.prefix)) return countXP(message);
	const commandName = message.content.replace(config.prefix, "").split(" ")[0];

	const command = commands[commandName];
	if (!command) return;

	command(client, message);
});

client.on("interactionCreate", handleInteraction);
client.on("guildMemberAdd", userJoin);
client.on("guildMemberRemove", userLeave);

// client.on("messageDelete", logDelete);
// client.on("messageUpdate", logEdit);
client.on("guildMemberAdd", logJoin);
client.on("guildMemberRemove", logLeave);
client.on("roleCreate", logRoleCreate);
client.on("roleDelete", logRoleDelete);
client.on("channelCreate", logChannelCreate);
client.on("channelDelete", logChannelDelete);
client.on("guildBanAdd", logGuildBanAdd);
client.on("guildBanRemove", logGuildBanRemove);

client.on("voiceStateUpdate", handleVoiceStateUpdate);

client.on("raw", handleRaw);

setInterval(async () => {
	const guilds = await client.guilds.fetch();
	guilds.forEach(async (oldGuild) => {
		const guild = await client.guilds.fetch(oldGuild.id);
		checkBirthday(guild);
		checkAncestor(guild);
	});
}, 1000 * 60 * 60); // every hour

initDB().then(async () => {
	await client.login(process.env.BOT_TOKEN);
	context.client = client;
	setupInvites(client);
});
