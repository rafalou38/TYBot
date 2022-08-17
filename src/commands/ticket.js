import Discord from "discord.js";
import { config, context } from "../context.js";

/** @type {Map<Snowflake, Date>} */
const timeouts = new Map();

/**
 *
 * @param {Discord.ButtonInteraction} interaction
 */
export default async function ticket(interaction) {
	const lastTicket = timeouts.get(interaction.user.id);
	// If the user has already created a ticket in the last 5 minutes, don't allow another one
	if (lastTicket && new Date().getTime() - lastTicket.getTime() < 5 * 60 * 1000) {
		interaction.reply({
			embeds: [
				{
					title: "Erreur",
					description: "Attends un peu avant de créer un nouveau ticket.",
					color: "RED",
				},
			],
			ephemeral: true,
		});
		return "SPAM";
	}

	interaction.deferReply({ ephemeral: true });

	const channel = await interaction.guild.channels.create(
		`Ticket de ${interaction.user.username}`,
		{
			parent: config.guilds[interaction.guildId].ticketCategoryID,
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
				{
					id: config.guilds[interaction.guildId].staffRoleID,
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

	interaction.editReply({
		content: `:white_check_mark:  Ton ticket a été crée: <#${channel.id}>`,
		ephemeral: true,
	});

	timeouts.set(interaction.user.id, new Date());

	return "OK";
}
