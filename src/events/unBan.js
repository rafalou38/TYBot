import Discord from "discord.js";

/**
 *
 * @param {Discord.GuildBan} ban
 */
export async function handleUnBan(ban, by, reason) {
	const dm = await ban.user?.createDM();
	if (dm) {
		dm.send(
			`
Vous avez été unban du Discord : discord.gg/tyteamoff
    `.trim()
		);
	}
}
