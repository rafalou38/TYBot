import Discord from "discord.js";

/**@type {Record<string, Discord.Invite>} */
const invites = {};
/**
 *
 * @param {Discord.Client} client
 */
export async function setup(client) {
	client.guilds.cache.each((guild) => {
		guild.invites.fetch().then((guildInvites) => {
			guildInvites.each((guildInvite) => {
				invites[guildInvite.code] = guildInvite.uses;
			});
		});
	});
	client.on("inviteCreate", (invite) => {
		invites[invite.code] = invite.uses;
	});
}

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function getInvite(member) {
	const newInvites = await member.guild.invites.fetch();

	return newInvites.find((invite) => {
		if (invite.uses != invites[invite.code]) {
			invites[invite.code] = invite.uses;
			return invite.inviter;
		}
	});
}
