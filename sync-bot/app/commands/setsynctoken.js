const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	adminOnly: true,
	data: new SlashCommandBuilder()
		.setName('setsynctoken')
		.setDescription('Assign a sync token to this Discord guild.')
		.addStringOption((option) =>
			option
				.setName('token')
				.setDescription(
					"The token specified in the module's `config.php` file."
				)
				.setRequired(true)
		),
	guildOnly: true,
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		let syncToken = interaction.options.getString('token');

		interaction.client.database.Customer.findOne({
			where: { sync_token: syncToken },
		}).then(async (customer) => {
			if (customer == null) {
				// The sync token is not associated with a customer record - require a valid sync token if customers exist.
				if ((await interaction.client.database.Customer.count()) > 0)
					return interaction.editReply('Invalid sync token.');
			}

			interaction.client.database.Guild.findOne({
				where: { sync_token: syncToken },
			}).then((guild) => {
				if (guild === null) {
					// No guild is associated with the sync token.
					interaction.client.database.Guild.findOne({
						where: { guild_id: interaction.guild.id },
					}).then((guild) => {
						if (guild === null) {
							// A record for this guild doesn't exist in the database.
							interaction.client.database.Guild.create({
								sync_token: syncToken,
								guild_id: interaction.guild.id,
							}).then(() => interaction.editReply('Sync token set.'));
						} else {
							// A record for this guild already exists in the database - update the associated sync token.
							guild
								.update({
									sync_token: syncToken,
								})
								.then(() => interaction.editReply('Sync token updated.'));
						}
					});
				} else {
					// There's an existing guild record in the database associated with the sync token.
					if (guild.guild_id !== interaction.guild.id) {
						// Said guild doesn't refer to this one - update the record's guild ID.
						guild
							.update({
								guild_id: interaction.guild.id,
							})
							.then(() =>
								interaction.editReply('Sync token assigned to this guild.')
							);
					} else {
						interaction.editReply(
							'That sync token is already assigned to this guild.'
						);
					}
				}
			});
		});
	},
};
