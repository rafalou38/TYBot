import { Client } from "discord.js";
import { config } from "../context";

/**
 * @param {Client} client
 */
export async function updateStatus(client) {
	const guild = await client.guilds.fetch(config.tyGuildID);
	const members = guild.memberCount;
	client.user.setActivity(`👪 ${members} membres sur le serveur`);
}
