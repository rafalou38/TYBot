import Discord, { ButtonStyle, ComponentType } from "discord.js";
import { description } from "../context";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	message.reply({
		content: "** **",
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						style: ButtonStyle.Link,
						label: "Twitter",
						url: "https://twitter.com/tyteamoff/status/1332001166188752901?s=21",
						type: ComponentType.Button,
					},
					{
						style: ButtonStyle.Link,
						label: "YouTube",
						url: "https://www.youtube.com/channel/UCPFJSJaidomQyLuvjFWFD_g",
						type: ComponentType.Button,
					},
					{
						style: ButtonStyle.Link,
						label: "TikTok",
						url: "https://vm.tiktok.com/ZMeVMfcFq/",
						type: ComponentType.Button,
					},
					{
						style: ButtonStyle.Link,
						label: "Instagram",
						url: "https://www.instagram.com/ty_team_off/?hl=fr",
						type: ComponentType.Button,
					},
				],
			},
		],
		embeds: [
			{
				title: "[TY-TEAM]",
				description: "Communauté Européenne Multigaming",
				color: 0x00ffa6,
				fields: [
					{
						name: "Projet",
						value:
							"Nous aimerions créer notre propre jeux vidéo ! ce qui est actuellement en cour ! ",
					},
				],
				image: {
					url: "https://cdn.discordapp.com/attachments/884681984587214870/892759913070198854/logo.png",
				},
			},
		],
	});
}
