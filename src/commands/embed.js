import Discord, { ButtonStyle, ComponentType } from "discord.js";
import { config } from "../context.js";
import evalSafe from "safe-eval";

/**
 *
 * @param {Discord.Message} baseMessage
 * @param {string} question
 */
async function waitText(baseMessage, question) {
	const sent = await baseMessage.channel.send(question);
	return baseMessage.channel
		.awaitMessages({
			max: 1,
			time: 1000 * 60 * 60 * 5,
			filter: (msg) => msg.author.id == baseMessage.author.id,
		})
		.then((msg) => {
			sent.delete();
			msg.first().delete();
			return msg.first().content;
		});
}
/**
 *
 * @param {Discord.Message} baseMessage
 * @param {string} question
 */
async function waitAttachement(baseMessage, question) {
	const sent = await baseMessage.channel.send(question);
	return baseMessage.channel
		.awaitMessages({
			max: 1,
			time: 1000 * 60 * 60 * 5,
			filter: (msg) =>
				msg.author.id == baseMessage.author.id &&
				((msg.attachments && msg.attachments.size > 0) || msg.content.match(/https?:\/\//)),
		})
		.then((msg) => {
			sent.delete();
			msg.first().delete();
			if (msg.first().attachments && msg.first().attachments.size > 0)
				return msg.first().attachments.first().url;
			else return msg.first().content;
		});
}
/**
 *
 * @param {Discord.Message} baseMessage
 * @param {string} question
 */
async function ask(baseMessage, question) {
	const sent = await baseMessage.channel.send({
		content: question,
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: "OUI",
						emoji: "👍",
						style: ButtonStyle.Success,
						customId: "yes",
					},
					{
						type: ComponentType.Button,
						label: "NON",
						emoji: "👎",
						style: ButtonStyle.Danger,
						customId: "no",
					},
				],
			},
		],
	});

	return baseMessage.channel
		.awaitMessageComponent({
			max: 1,
			time: 1000 * 60 * 60 * 5,
			filter: (inter) => inter.user.id == baseMessage.author.id && inter.customId.match(/yes|no/),
		})
		.then((inter) => {
			sent.delete();
			return inter.customId == "yes";
		});
}

const embeds = new Map();

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	let code = message.content.match(/(?<=#)[\w\d]+/)?.[0];
	if (code) {
		message.delete();
		const embed = embeds.get(code);
		return message.channel.send({
			embeds: [embed],
		});
	}

	code = Math.round(Math.random() * 10000).toString(32);

	const title = await waitText(message, "Titre?");
	const desc = await waitText(message, "Description?");

	if (await ask(message, "Footer?")) {
		var footer_text = await waitText(message, "Texte du footer?");
		var footer_image = await waitAttachement(message, "Image du footer?");
	}

	if (await ask(message, "Couleur?")) {
		var color = await waitText(message, "Couleur? (ex: #00bfff)");
	}
	if (await ask(message, "Thumbnail?")) {
		var thumbnail = await waitAttachement(message, "Image de la Thumbnail?");
	}
	if (await ask(message, "Image?")) {
		var image = await waitAttachement(message, "Image?");
	}
	if (await ask(message, "Lien?")) {
		var link = await waitText(message, "Lien?");
	}
	const embed = {
		title,
		description: desc,
		footer: {
			icon_url: footer_image,
			text: footer_text,
		},
		color: color,
		thumbnail: {
			url: thumbnail,
		},
		image,
		url: link,
	};
	embeds.set(code, embed);

	message.channel.send({
		content: `
Embed réalisé, pour envoyer:
\`\`\`
-embed #${code}
\`\`\`
		`.trim(),
		embeds: [embed],
	});
}
