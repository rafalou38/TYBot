export const name = "ready";
export const once = true;
export function execute(client) {
	console.log("Discord.js ready.");
	client.guilds.cache.forEach((guild) => guild.members.fetch().catch(console.error));
}
