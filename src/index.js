import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import Discord from "discord.js";

import init from "./init.js";
import { commands } from "./commands/index.js";
import { initDB } from "./database/initialize.js";
import chalk from "chalk";

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = process.env.PREFIX;

client.once("ready", async () => {
	// const guilds = await client.guilds.fetch();
	// guilds.forEach(async (oldGuild) => {
	// 	const guild = await client.guilds.fetch(oldGuild.id);
	// 	init(guild);
	// });
	console.log(
		chalk.magenta(new Date(Date.now()).toLocaleString()),
		`🤖 bot ${client.user.username}#${client.user.tag} successfully started 🚀`
	);
});

client.on("messageCreate", async (message) => {
	if (!message.content.startsWith(process.env.PREFIX)) return;
	const commandName = message.content.replace(process.env.PREFIX, "").split(" ")[0];

	const command = commands[commandName];
	if (!command) return;

	command(client, message);
});

initDB().then(() => {
	client.login(process.env.BOT_TOKEN);
});
