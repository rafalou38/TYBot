import Discord, { Colors } from "discord.js";
import { config } from "../../context";

/**
 *
 * @param {Discord.GuildMember} member
 * @param {Discord.Role} role
 */
export async function logRoleAdd(member, role) {
	/** @type {Discord.TextChannel} */
	const channel = await role.guild.channels.fetch(config.guilds[role.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: `Les roles de ${member.user.tag} ont changés.`,
				description: `Role ajouté: ${role}`,
				color: Colors.Green,
				thumbnail: {
					url: member.avatarURL(),
				},
				author: {
					iconURL: member.avatarURL(),
					name: member.user.tag,
				},
				footer: {
					text: `ID: ${member.id}`,
				},
				timestamp: new Date(),
			},
		],
	});
}
/**
 *
 * @param {Discord.GuildMember} member
 * @param {Discord.Role} role
 */
export async function logRoleRemove(member, role) {
	/** @type {Discord.TextChannel} */
	const channel = await role.guild.channels.fetch(config.guilds[role.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: `Les roles de ${member.user.tag} ont changés.`,
				description: `Role retiré: ${role}`,
				color: Colors.Red,
				thumbnail: {
					url: member.avatarURL(),
				},
				author: {
					iconURL: member.avatarURL(),
					name: member.user.tag,
				},
				footer: {
					text: `ID: ${member.id}`,
				},
				timestamp: new Date(),
			},
		],
	});
}

/**
 *
 * @param {Discord.Role} role
 */
export async function logRoleCreate(role) {
	/** @type {Discord.TextChannel} */
	const channel = await role.guild.channels.fetch(config.guilds[role.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: "Role crée",
				description: `Nouveau role: ${role}`,
				color: Colors.Red,
				timestamp: new Date(),
			},
		],
	});
}
/**
 *
 * @param {Discord.Role} role
 */
export async function logRoleDelete(role) {
	/** @type {Discord.TextChannel} */
	const channel = await role.guild.channels.fetch(config.guilds[role.guild.id].logsChannelID);

	channel.send({
		embeds: [
			{
				title: "Role crée",
				description: `Role supprimé: @${role.name}`,
				color: Colors.Red,
				timestamp: new Date(),
			},
		],
	});
}
