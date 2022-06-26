import Discord from "discord.js";
import { config } from "../context.js";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	if (
		!message.member.permissions.has("ADMINISTRATOR") &&
		message.author.id !== config.myID &&
		!message.member.roles.cache.has(config.guilds[message.guildId].communityRoleID)
	) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					color: "RED",
					description: "Tu n'as pas le permission d'utiliser cette commande",
				},
			],
		});
	}

	// eslint-disable-next-line quotes
	const example = `
-embed 
title:"Titre embed"
content:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta ex praesentium iste alias impedit soluta in, a at quibusdam eveniet veniam adipisci tenetur quae ea. Exercitationem reprehenderit ipsa quis atque."
color:YELLOW
author:@Rafalou38
link:https://www.google.com/
thumbnail:https://picsum.photos/200
image:https://picsum.photos/200
footer_text:"[TY - RANGERS]"
footer_icon:https://picsum.photos/200
`;

	const title = message.content.match(/title:"(.+?)"/im)?.[1];
	const content = message.content.match(/content:"([^"]+?)"/im)?.[1];
	const footer_text = message.content.match(/footer_text:"(.+?)"/im)?.[1];
	const color = message.content.match(/color:(\S+?)( |$)/im)?.[1];
	const thumbnail = message.content.match(/thumbnail:(\S+?)( |$)/im)?.[1];
	const image = message.content.match(/image:(\S+?)( |$)/im)?.[1];
	const footer_icon = message.content.match(/footer_icon:(\S+?)( |$)/im)?.[1];
	const link = message.content.match(/link:(\S+?)( |$)/im)?.[1];
	const author = message.mentions.members.first();

	if (!title || !content) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					color: "RED",
					description:
						"title et content sont obligatoires\n**exemple:**\n```\n" + example + "\n```",
				},
			],
		});
	}

	message.delete();
	message.channel.send({
		embeds: [
			{
				title: title,
				description: content,
				color: color || "BLURPLE",
				author: {
					name: author?.nickname || "",
					icon_url: author?.user.avatarURL() || "",
				},
				image: {
					url: image || "",
				},
				footer: {
					text: footer_text || "",
					icon_url: footer_icon || "",
				},
				url: link || "",
				thumbnail: {
					url: thumbnail || "",
				},
			},
		],
	});
}
