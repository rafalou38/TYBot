module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log("Discord.js ready.");
		client.guilds.cache.forEach((guild) => guild.members.fetch().catch(console.error));
	},
};
