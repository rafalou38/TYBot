import Discord from "discord.js";
import { config } from "../context.js";
import evalSafe from "safe-eval";

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

	let src = message.content.match(/(?<=create\(){[\w\W]+}/)?.[0];
	if (!src) {
		return message.reply({
			embeds: [
				{
					title: "Erreur",
					color: "RED",
					description: "Merci de fournir le code de l'embed",
				},
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							style: "LINK",
							label: "Obtenir le code",
							url: "https://autocode.com/tools/discord/embed-builder/",
						},
					],
				},
			],
		});
	}

	src = src.replace(/\s+"channel_id": .+/, "");

	try {
		const data = evalSafe(src, {}, {});
		await message.channel.send(data);
	} catch (error) {
		await message.reply({
			embeds: [
				{
					title: "Erreur",
					color: "RED",
					description: error.message || "Code embed invalide",
				},
			],
		});
	}

	await message.delete();
}
