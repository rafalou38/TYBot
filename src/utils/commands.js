import Discord from "discord.js";

/**
 *
 * @param {Discord.Guild} guild
 * @param {Discord.Client} client
 * @param {string} text
 */
export async function getMemberFromText(guild, text) {
	let target;
	try {
		let targetID = text.match(/^<@\D?(\d{18})>$/);
		if (targetID && targetID[1]) {
			target = await guild.members.fetch(targetID[1]);
		} else {
			const members = await guild.members.fetch();
			target = members.find(
				(member) => (member.nickname || member.user.username) === text.match(/@?(.+)/)[0]
			);
		}
	} catch {}
	return target;
}

/**
 *
 * @param {string} content
 */
export function parseInput(content) {
	return content
		.split(" ")
		.slice(1)
		.filter((e) => e);
}
