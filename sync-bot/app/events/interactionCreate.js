const { Permissions } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		if (command.guildOnly && !interaction.guild)
			return interaction.reply({
				content: "This command cannot be run in direct messages.",
				ephemeral: true,
			});

		if (command.adminOnly && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
			return interaction.reply({
				content: "Only administrators can run that command.",
				ephemeral: true,
			});

		interaction.client.statistics.commandsPerInterval++;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error trying to execute that command.",
				ephemeral: true,
			});
		}
	},
};
