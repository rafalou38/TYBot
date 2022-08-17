import { config } from "../../context.js";

/**
 *
 * @param {Discord.GuildBan} ban
 * @param {Discord.GuildMember} by
 * @param {string} reason
 */
export async function logGuildBanAdd(ban) {
	const auditBan = await ban.guild
		.fetchAuditLogs({
			type: "MEMBER_BAN_ADD",
		})
		.then((auditLogs) => auditLogs.entries.first());

	/** @type {Discord.MessageOptions} */
	const msg = {
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
						value: auditBan.reason || "Aucune raison",
					},
					{
						name: "Ban par",
						value: auditBan.executor.tag,
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
	};

	/** @type {Discord.TextChannel} */
	let channel = await ban.guild.channels.fetch(config.guilds[ban.guild.id].logsChannelID);

	channel.send(msg);

	channel = await ban.guild.channels.fetch(config.guilds[ban.guild.id].userJoinChannelID);

	channel.send(msg);

	ban.user.send(msg);
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

	ban.user.send("Vous avez été dé-banni de TY-TEAM.");
}
