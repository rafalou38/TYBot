const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const request = require('request');
const SQ = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription("Query for a member's linked profile.")
		.addUserOption((option) =>
			option.setName('user').setDescription('Target user.').setRequired(true)
		),
	guildOnly: true,
	async execute(interaction) {
		await interaction.deferReply();

		interaction.client.database.Guild.findOne({
			where: { guild_id: interaction.guild.id, url: { [SQ.Op.ne]: null } },
		}).then((guild) => {
			if (guild === null)
				return interaction.editReply('Sync token or URL not set.');

			const targetUser = interaction.options.getUser('user');

			request.get(
				{
					url: `${guild.url}api/discord/users/${targetUser.id}`,
					auth: { bearer: guild.sync_token },
				},
				(err, res, body) => {
					if (err) return console.error('Request failed', err);

					try {
						body = JSON.parse(body);
						if (body.status == 'success') {
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
							interaction.editReply('Profile not found.');
						}
					} catch (error) {
						console.error(error);
						interaction.editReply('Failed to parse response.');
					}
				}
			);
		});
	},
};
