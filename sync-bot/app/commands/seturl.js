const { SlashCommandBuilder } = require('@discordjs/builders');
const request = require('request');

module.exports = {
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName('seturl')
		.setDescription(
			'Set the URL of the Ember instance to link this Discord guild with.'
		)
		.addStringOption((option) =>
			option
				.setName('url')
				.setDescription('http(s)://example.com')
				.setRequired(true)
		),
	guildOnly: true,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		let newUrl;
		try {
			newUrl = new URL(interaction.options.getString('url'));
		} catch (error) {
			return interaction.editReply('Failed to parse the specified URL.');
		}

		interaction.client.database.Guild.findOne({
			where: { guild_id: interaction.guild.id },
		}).then((guild) => {
			if (guild === null)
				return interaction.editReply('Assign the sync token first.');

			request.get(
				{
					url: newUrl + 'api/discord/connectioncheck',
					auth: { bearer: guild.sync_token },
				},
				(err, res, body) => {
					if (err) {
						console.error(err);
						return interaction.editReply('Error requesting the specified URL.');
					}

					try {
						body = JSON.parse(body);
						if (body.status == 'success') {
							guild
								.update({
									url: newUrl.toString(),
								})
								.then(() => {
									interaction.editReply('Guild URL updated.');
								});
						} else if (body.status == 'bot_unreachable') {
							interaction.editReply(
								'Two-way connection check failed. Verify that the module is configured properly.'
							);
						} else {
							interaction.editReply(
								'The specified URL is not valid or the sync token does not match.'
							);
						}
					} catch (error) {
						if (error instanceof SyntaxError)
							return interaction.editReply(
								`The specified URL sent an unexpected response. Status: \`${
									res.statusCode
								}\`. Body: \`\`\`${body.substring(0, 1900)}\`\`\``
							);

						console.error(error);
					}
				}
			);
		});
	},
};
