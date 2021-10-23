import Discord from "discord.js";
import { config } from "../../context.js";

/**
 *
 * @param {Discord.GuildBan} ban
 * @param {Discord.GuildMember} by
 * @param {string} reason
 */
export async function logGuildBanAdd(ban, by, reason = "inconnue") {
	/** @type {Discord.TextChannel} */
	const channel = await ban.guild.channels.fetch(config.guilds[ban.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: `${ban.user.tag} à été ban.`,
				fields: [
					{
						name: "membre",
						value: ban.user.tag,
					},
					{
						name: "Raison",
						value: ban.reason || reason,
					},
					{
						name: "Banni par:",
						value: `${by || "inconnu"}`,
					},
				],
				color: "RED",
				thumbnail: {
					url: ban.user.avatarURL(),
				},
				author: {
					iconURL: ban.user.avatarURL(),
					name: ban.user.tag,
				},
				timestamp: new Date(),
			},
		],
	});
}

/**
 *
 * @param {Discord.GuildBan} ban
 */
export async function logGuildBanRemove(ban) {
	/** @type {Discord.TextChannel} */
	const channel = await ban.guild.channels.fetch(config.guilds[ban.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: `${ban.user.tag} à été dé-banni.`,
				fields: [
					{
						name: "membre",
						value: ban.user.tag,
					},
				],
				color: "RED",
				thumbnail: {
					url: ban.user.avatarURL(),
				},
				author: {
					iconURL: ban.user.avatarURL(),
					name: ban.user.tag,
				},
				timestamp: new Date(),
			},
		],
	});
}