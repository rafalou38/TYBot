module.exports = {
	name: "guildCreate",
	execute(guild) {
		guild.members.fetch().catch(console.error);
	},
};
