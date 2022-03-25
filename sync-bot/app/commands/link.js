const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const request = require('request');
const SQ = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('link')
		.setDescription(
			'Link your Discord account to your account on our community.'
		),
	guildOnly: true,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		interaction.client.database.Guild.findOne({
			where: { guild_id: interaction.guild.id, url: { [SQ.Op.ne]: null } },
		}).then((guild) => {
			if (guild === null)
				return interaction.editReply('Sync token or URL not set.');

			request.get(
				{
					url: guild.url + 'api/discord/users/' + interaction.member.user.id,
					auth: { bearer: guild.sync_token },
				},
				(err, res, body) => {
					if (err) return console.error('Request failed', err);

					try {
						body = JSON.parse(body);
						if (body.status == 'success') {
							interaction.editReply('Your account is already linked.');
						} else {
							const jwtlib = require('jsonwebtoken');
							var jwt = jwtlib.sign(
								{
									discordid: interaction.member.id,
									username: interaction.member.user.username,
									avatarURL: interaction.member.user.displayAvatarURL(),
								},
								guild.sync_token
							);

							let authurl = guild.url + 'discord/link/' + jwt;

							let embed = new MessageEmbed()
								.setTitle('Link your accounts')
								.setURL(authurl)
								.setDescription(
									'Link your Discord account to your account on our community by clicking on the link above. You might be requested to sign in.'
								);

							interaction.editReply({ embeds: [embed] });
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
