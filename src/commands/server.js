import Discord from "discord.js";
import { description } from "../context.js";

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
				type: "ACTION_ROW",
				components: [
					{
						style: "LINK",
						label: "Twitter",
						url: "https://twitter.com/tyteamoff/status/1332001166188752901?s=21",
						type: "BUTTON",
					},
					{
						style: "LINK",
						label: "YouTube",
						url: "https://www.youtube.com/channel/UCy6cCoqCoRiUbIgHQcuk33g",
						type: "BUTTON",
					},
					{
						style: "LINK",
						label: "TikTok",
						url: "https://vm.tiktok.com/ZMeVMfcFq/",
						type: "BUTTON",
					},
					{
						style: "LINK",
						label: "Instagram",
						url: "https://www.instagram.com/ty_team_off/?hl=fr",
						type: "BUTTON",
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
