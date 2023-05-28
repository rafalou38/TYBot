import Discord, { ButtonStyle, Colors, ComponentType } from "discord.js";

import { Member } from "../database/schemas/Member.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import { formatDate, timeDiff } from "../utils/time.js";
/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	if (!message.member.permissions.has("BAN_MEMBERS")) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Tu n'as pas la permission d'utiliser cette commande.",
					thumbnail: {
						url: "https://media.discordapp.net/attachments/938828014861574166/1034387400337653830/attention-303861.png?width=783&height=700",
					},
					timestamp: new Date(),
					author: {
						name: message.author.username,
						icon_url: message.author.displayAvatarURL(),
					},
					color: Colors.Red,
				},
			],
		});
	}

	let [targetMention, ...reasons] = parseInput(message.content);
	const target = message.mentions.members.first();

	if (!target)
		return message.reply({
			content: "Merci de preciser la personne a bannir.",
		});

	const reason = reasons.join(" ");

	if (!reason)
		return message.reply({
			content: "Merci de preciser la raison du ban.",
		});

	const dm = await target.createDM();
	if (dm) {
		const timestamp = Math.round(Date.now() / 1000);

		await dm.send({
			embeds: [
				{
					title: "Ban",
					description: "Tu as été banni du serveur de la TY-TEAM",
					color: Colors.Red,
					fields: [
						{
							name: "Date du ban",
							value: `<t:${timestamp}:F> (<t:${timestamp}:R>)`,
						},
						{
							name: "Modérateur",
							value: `${message.author.tag} (${message.author.id})`,
						},
						{
							name: "Raison du ban",
							value: "```\n" + reason + "\n```",
						},
					],
				},
			],
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							style: ButtonStyle.Link,
							url: "https://docs.google.com/forms/d/e/1FAIpQLScv2FWIjBmb-iqPYyDvoegKUeH0if2fhRsO_F3JQ_920__qaQ/viewform?usp=sf_link",
							label: "Demande de unban",
						},
					],
				},
			],
		});
	}

	await target.ban({
		reason,
	});

	await message.reply(`${target.tag} a été ban.`);
}
