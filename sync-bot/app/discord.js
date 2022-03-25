import { Client, Collection, Intents } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (SQ, discord_bot_token) {
	const client = new Client({
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
	});

	client.database = SQ;

	client.statistics = {
		commandsPerInterval: 0,
		requestsPerInterval: 0,
	};

	client.commands = new Collection();

	readdirSync(`${__dirname}/commands`)
		.filter((file) => file.endsWith(".js"))
		.forEach(async (file) => {
			const command = await import(`./commands/${file}`);
			// console.log(`Loaded command ${command.data.name}`);
			client.commands.set(command.data.name, command);
		});

	readdirSync(`${__dirname}/events`)
		.filter((file) => file.endsWith(".js"))
		.forEach(async (file) => {
			const event = await import(`./events/${file}`);
			// console.log(`Loaded event ${event.name}`);
			client[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args, client));
		});

	function writeStatus() {
		console.log(
			`Connected to ${client.guilds.cache.size} guild(s). Executed ${
				client.statistics.commandsPerInterval
			} command(s) and sent ${
				client.statistics.requestsPerInterval
			} request(s) last minute. Up for ${Math.round(client.uptime / 60000)} minute(s).`
		);

		client.statistics.commandsPerInterval = 0;
		client.statistics.requestsPerInterval = 0;
	}

	client.login(discord_bot_token).then(async () => {
		const rest = new REST({ version: "9" }).setToken(discord_bot_token);

		await rest
			.put(Routes.applicationCommands(client.application.id), {
				body: client.commands.map((command) => command.data.toJSON()),
			})
			.then(() => console.log("Application commands updated.\n"))
			.catch(console.error);

		writeStatus();
		setInterval(writeStatus, 60000);
	});

	return client;
}
