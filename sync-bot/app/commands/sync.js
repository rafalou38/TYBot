const { SlashCommandBuilder } = require('@discordjs/builders');
const request = require('request');
const SQ = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sync')
		.setDescription(
			'Synchronize your roles between our Discord server and our community.'
		),
	guildOnly: true,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		interaction.client.database.Guild.findOne({
			where: { guild_id: interaction.guild.id, url: { [SQ.Op.ne]: null } },
		}).then((guild) => {
			if (guild === null)
				return interaction.editReply('Sync token or URL not set.');

			request.post(
				{
					url: `${guild.url}api/discord/users/${interaction.member.id}/sync`,
					auth: { bearer: guild.sync_token },
				},
				(err, res, body) => {
					if (err) return console.error('Request failed', err);

					try {
						body = JSON.parse(body);
					} catch (error) {
						console.error(error);
					}

					if (body.status != 'success' && body.message == 'user_not_found')
						return interaction.editReply(
							'Seems like your account is not linked. Use the `/link` command to link your accounts and synchronize your roles.'
						);

					interaction.editReply('Roles synchronized.');
				}
			);
		});
	},
};
