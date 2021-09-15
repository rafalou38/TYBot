import Discord from "discord.js";
import { config, context } from "../context.js";

/**
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function ticket(client, message) {
	const old_ticket = context.tickets.get(message.author.id);
	if (old_ticket && !message.member.permissions.has("ADMINISTRATOR")) {
		message.reply({ content: `❌ tu as déjà un ticket: <#${old_ticket}>` });
		return "NO_DUPLICATE_TICKETS";
	}

	const channel = await message.guild.channels.create(`Ticket de ${message.author.username}`, {
		parent: config.ticketCategoryID,
		type: "GUILD_TEXT",
		permissionOverwrites: [
			{
				id: message.guild.id, // shortcut for @everyone role ID
				deny: "VIEW_CHANNEL",
			},
			{
				id: message.author.id,
				allow: "VIEW_CHANNEL",
			},
		],
	});

	await channel.send({
		content: `Ticket de ${message.author.username}`,
		components: [
			{
				type: "ACTION_ROW",
				components: [
					{
						type: "BUTTON",
						style: "DANGER",
						label: "SUPRIMER CE TICKET 🗑️",
						customId: message.author.id,
					},
				],
			},
		],
	});

	context.tickets.set(message.author.id, channel.id);
	message.reply({
		content: `:white_check_mark:  Ton ticket a été crée: <#${channel.id}>`,
		ephemeral: true,
	});

	return "OK";
}
