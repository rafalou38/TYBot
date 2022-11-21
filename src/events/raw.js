import { TextChannel } from "discord.js";
import { context } from "../context.js";
import { log } from "../utils/prettyLog.js";
import { handleReactionAdd, handleReactionRemove } from "./reactions.js";

export async function handleRaw(event) {
	const type = event.t;
	const data = event.d;

	if (type !== "MESSAGE_REACTION_ADD" && type !== "MESSAGE_REACTION_REMOVE") return;

	const guild = context.client.guilds.cache.get(data.guild_id);
	const channel = guild?.channels.cache.get(data.channel_id);

	try {
		var message = await channel?.messages.fetch(data.message_id);
		var user = await guild?.members.fetch(data.user_id);
	} catch (error) { }

	const emoji = data.emoji.name;

	if (!message || !user) {
		log("REACT: Message or user not found");
		return;
	}

	if (type === "MESSAGE_REACTION_ADD") {
		handleReactionAdd(message, user, emoji);
	}
	//  else if (type === "MESSAGE_REACTION_REMOVE") {
	// 	handleReactionRemove(message, user, emoji);
	// }
}
