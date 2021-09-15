import chalk from "chalk";
import Discord from "discord.js";
import { config, context } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { addXP } from "../database/utils/xp.js";
import { getChanelById } from "../utils/channels.js";
import { getInvite } from "../utils/invites.js";
import { log } from "../utils/prettyLog.js";

/**
 *
 * @param {Discord.Interaction} interaction
 */
export async function handleInteraction(interaction) {
	if (interaction.isButton()) {
		try {
			await interaction.channel.delete();
			context.tickets.delete(interaction.customId);
			let user = interaction.guild.members.cache.get(interaction.customId);

			return log(
				chalk.green("suppresion du ticket"),
				"de ",
				chalk.blue(user && user.user.tag),
				" par",
				chalk.blue(interaction.user.tag),
				"✔️"
			);
		} catch (error) {
			return log(
				chalk.green("suppresion d'un ticket"),
				" par",
				chalk.blue(interaction.user.tag),
				"❌",
				error
			);
		}
	}
}
