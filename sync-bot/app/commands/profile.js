import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import request from "request";
import { Op } from "sequelize";

export const data = new SlashCommandBuilder()
	.setName("profile")
	.setDescription("Query for a member's linked profile.")
	.addUserOption((option) =>
		option.setName("user").setDescription("Target user.").setRequired(true)
	);
export const guildOnly = true;
export async function execute(interaction) {
	await interaction.deferReply();

	interaction.client.database.Guild.findOne({
		where: { guild_id: interaction.guild.id, url: { [Op.ne]: null } },
	}).then((guild) => {
		if (guild === null) return interaction.editReply("Sync token or URL not set.");

		const targetUser = interaction.options.getUser("user");

		request.get(
			{
				url: `${guild.url}api/discord/users/${targetUser.id}`,
				auth: { bearer: guild.sync_token },
			},
			(err, res, body) => {
				if (err) return console.error("Request failed", err);

				try {
					body = JSON.parse(body);
					if (body.status == "success") {
						if (body.user != null) {
							var profileInfo = `**Discord tag:** ${targetUser.tag}\n`;
							profileInfo += `**User ID:** ${body.user.id}\n`;
							const embed = new MessageEmbed()
								.setColor(2236962)
								.setAuthor(
									targetUser.username,
									targetUser.displayAvatarURL({ size: 32 }),
									`${guild.url}users/${body.user.id}`
								)
								.setDescription(profileInfo);
							return interaction.editReply({ embeds: [embed] });
						}
					} else {
						interaction.editReply("Profile not found.");
					}
				} catch (error) {
					console.error(error);
					interaction.editReply("Failed to parse response.");
				}
			}
		);
	});
}
