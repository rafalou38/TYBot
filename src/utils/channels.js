import chalk from "chalk";
import Discord from "discord.js";
import { context } from "../context.js";
import { log } from "./prettyLog.js";

/**
 *
 * @param {string} id
 */
export async function getChanelById(id) {
	const channel = context.client.channels.cache.get(id);
	if (!channel) {
		context.client.channels.fetch(id);
	}
	if (!channel) {
		log("Failed to find channel:", id);
	}
	return channel;
}
