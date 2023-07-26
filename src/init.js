import Discord from "discord.js";
import { log } from "./utils/prettyLog";

/**
 *
 * @param {Discord.Guild} guild
 */
export default async function (guild) {
	/**@type {import("../types/customRole").customRole[]} */
	const roles = [
		{ name: "level 5" },
		{ name: "level 10" },
		{ name: "level 15" },
		{ name: "level 20" },
		{ name: "level 25" },
		{ name: "level 35" },
		{ name: "level 40" },
	];

	for (const roleTemplate of roles) {
		/**
		 * @type {Discord.Role}
		 */
		let role = await guild.roles.cache.find((role) => role.name === roleTemplate.name);
		// CREATE ROLES
		if (!role) {
			role = await guild.roles.create(roleTemplate);
			log(`Create role ${role.name}`);
		}

		if (roleTemplate.permisions) {
			// SET CHANELS PERMISIONS
			const chanels = await guild.channels.fetch();
			chanels.forEach(async (chanel) => {
				// const perms = chanel.permissionOverwrites

				try {
					await chanel.permissionOverwrites.create(role, roleTemplate.permisions);
					log(`	✔ Setup permision on chanel ${chanel.name} for role ${role.name}`);
				} catch (error) {
					log(`	❌ fail Setup permision on chanel ${chanel.name} for role ${role.name}`);
				}
			});
		}
	}
}
