export const name = "guildCreate";
export function execute(guild) {
	guild.members.fetch().catch(console.error);
}
