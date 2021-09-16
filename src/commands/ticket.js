import Discord from "discord.js";
import { config, context } from "../context.js";

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
export default async function ticket(interaction) {
	const old_ticket = context.tickets.get(interaction.user.id);
	if (old_ticket && !interaction.member.permissions.has("ADMINISTRATOR")) {
		interaction.reply({ content: `❌ tu as déjà un ticket: <#${old_ticket}>`, ephemeral: true });
		return "NO_DUPLICATE_TICKETS";
	}

	interaction.deferReply({ ephemeral: true });

	const channel = await interaction.guild.channels.create(
		`Ticket de ${interaction.user.username}`,
		{
			parent: config.ticketCategoryID,
			type: "GUILD_TEXT",
			permissionOverwrites: [
				{
					id: interaction.guild.id, // shortcut for @everyone role ID
					deny: "VIEW_CHANNEL",
				},
				{
					id: interaction.user.id,
					allow: "VIEW_CHANNEL",
				},
			],
		}
	);

	await channel.send({
		content: `Ticket de ${interaction.user.username}`,
		components: [
			{
				type: "ACTION_ROW",
				components: [
					{
						type: "BUTTON",
						style: "DANGER",
						label: "SUPPRIMER CE TICKET 🗑️",
						customId: "ticket-" + interaction.user.id,
					},
				],
			},
		],
	});

	context.tickets.set(interaction.user.id, channel.id);
	interaction.editReply({
		content: `:white_check_mark:  Ton ticket a été crée: <#${channel.id}>`,
		ephemeral: true,
	});

	return "OK";
}
