import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { addXP, calcRequiredXPForLevel } from "../database/utils/xp.js";
import { parseInput, getMemberFromText } from "../utils/commands.js";
import ShowRank from "./xp.js";

/**@type {Discord.EmbedField[] | Discord.EmbedFieldData[]} */
const syntax = [
	{
		name: "syntaxe:",
		value: "```-giveaway <temps (secondes)> <prix>```",
	},
];

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const admin = message.member.permissions.has("ADMINISTRATOR");
	if (!admin)
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Tu n'est pas administrateur",
					color: "RED",
					fields: syntax,
				},
			],
		});

	const [temps, ...prix] = parseInput(message.content);

	if (!(temps && parseInt(temps))) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Veuillez entrer une duré valide",
					color: "RED",
					fields: syntax,
				},
			],
		});
	}
	if (!prix.join(" ")) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Veuillez entrer prix valide",
					color: "RED",
					fields: syntax,
				},
			],
		});
	}

	/** @type {Discord.MessageEmbedOptions} */
	const giveawayEmbed = {
		title: "Giveaway 🎁",
		description: `🎉 Nouveau Giveaway offert par <@${message.author.id}> 🎊`,
		fields: [
			{
				name: "Prix:",
				value: "```" + prix.join(" ") + "```",
			},
			{
				name: "Temps restant:",
				value: "**" + temps + "**s",
			},
		],
		footer: {
			iconURL: message.author.avatarURL(),
			text: message.author.tag,
		},
	};

	/** @type {Discord.Message} */
	const sentMessage = await message.channel.send({
		embeds: [giveawayEmbed],
	});
	await sentMessage.react("🎁");
	const start = Date.now();
	let interval;
	async function updateTime() {
		const now = Date.now();
		const diff = now - start;
		const remaining = temps - Math.round(diff / 1000);
		if (remaining > 0) {
			giveawayEmbed.fields[1].value = "**" + remaining + "**s";
		} else {
			clearInterval(interval);
			giveawayEmbed.fields[1].name = "Gagnant";

			const reaction = sentMessage.reactions.cache.get("🎁");

			let participants = await reaction.users.fetch();
			participants = participants.filter((p) => !p.bot);

			const winnerIndex = Math.floor(Math.random() * participants.size);
			const winner = [...participants.values()][winnerIndex];
			giveawayEmbed.fields[1].value = `<@${winner.id}>`;
		}
		await sentMessage.edit({ embeds: [giveawayEmbed] });
	}
	interval = setInterval(updateTime, 1000);
}