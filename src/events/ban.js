import Discord from "discord.js";

/**
 *
 * @param {Discord.GuildBan} ban
 * @param {Discord.GuildMember} by
 * @param {string} reason
 */
export async function handleBan(ban, by, reason) {
	const dm = await ban.user.createDM();
	dm.send(
		`
Bonjour /Bonsoir
Vous avez été banni du discord "TY-TEAM"

Raison : ${reason || "non spécifiée"}

Banni par : ${by.user.tag}

Lien pour demandé un débanissement : https://tyteam.fr/forums/boards/10
    `.trim()
	);
}
