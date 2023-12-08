import { Guild } from "discord.js";
import { Member } from "../database/schemas/Member";
import { config } from "../context";
import { log } from "../utils/prettyLog";

export async function checkActivity(guild: Guild) {
	const limit = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
	const results = await Member.find({
		lastActive: {
			$lte: limit
		}
	});

	for (const user of results) {
		try {
			const member = await guild.members.fetch(user.userID);
			log(member.user.tag + " not active anymore");

			member.roles.remove(config.guilds["655531439571599380"].activeRoleID);
		} catch (error) {
		}
		user.lastActive = null;
		await user.save();
	}
}