import { GuildMember, Message } from "discord.js";
import { context } from "../context";
import { log } from "../utils/prettyLog";

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

/**
 *
 * @param {Message} message
 * @param {GuildMember} member
 * @param {string} emoji
 * @returns
 */
export async function handleReactionAdd(message, member, emoji) {
	if (message.author.id !== context.client.user.id || message.embeds.length === 0) return;

	const msgContent = message.embeds[0].description || "";
	const roles = extractFromEmbed(msgContent);
	const role = roles.find((r) => r.emoji === emoji);
	if (!role) {
		console.log("Error: No role found for emoji", emoji, "in", msgContent);
		return;
	}

	if (member.roles.resolve(role.id)) {
		await member.roles.remove(role.id);

		try {
			const DM = await member.createDM();
			await DM.send(`Le role **${role.name}** t'as été retiré`);
		} catch (error) {}
	} else {
		await member.roles.add(role.id);

		try {
			const DM = await member.createDM();
			await DM.send(`Le role **${role.name}** t'as été ajouté`);
		} catch (error) {}
	}

	const react = message.reactions.resolve(emoji);
	if (react) {
		react.users.remove(member.id);
	}

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
