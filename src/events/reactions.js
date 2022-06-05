import { context } from "../context.js";
import { log } from "../utils/prettyLog.js";

function extractFromEmbed(content) {
	const regex = /^(.+) = (.+) \(<@&(\d+)>\)$/gm;

	const roles = [];
	let match;
	while ((match = regex.exec(content)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (match.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		// The result can be accessed through the `m`-variable.
		roles.push({
			emoji: match[1],
			name: match[2],
			id: match[3],
		});
	}

	return roles;
}

export async function handleReactionAdd(message, member, emoji) {
	if (message.author.id !== context.client.user.id) return;

	const msgContent = message.embeds[0].description || "";
	const roles = extractFromEmbed(msgContent);
	const role = roles.find((r) => r.emoji === emoji);
	if (!role) {
		console.log("Error: No role found for emoji", emoji, "in", msgContent);
		return;
	}

	await member.roles.add(role.id);

	log(`Ajout du role ${role.name} sur ${member.user.tag}`);
}

export async function handleReactionRemove(message, member, emoji) {
	if (message.author.id !== context.client.user.id) return;

	const msgContent = message.embeds[0].description || "";
	const roles = extractFromEmbed(msgContent);
	const role = roles.find((r) => r.emoji === emoji);
	if (!role) {
		console.log("Error: No role found for emoji", emoji, "in", msgContent);
		return;
	}

	await member.roles.remove(role.id);
	log(`Suppression du role ${role.name} sur ${member.user.tag}`);
}
