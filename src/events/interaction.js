import chalk from "chalk";
import Discord from "discord.js";
import { context } from "../context.js";
import { log } from "../utils/prettyLog.js";
import ticket from "../commands/ticket.js";
/**
 *
 * @param {Discord.Interaction} interaction
 */
export async function handleInteraction(interaction) {
	if (interaction.isButton()) {
		if (interaction.customId.startsWith("ticket")) {
			try {
				await interaction.channel.delete();
				context.tickets.delete(interaction.customId);
				let user = interaction.guild.members.cache.get(interaction.customId);

				return log(
					chalk.green("suppression du ticket"),
					"de ",
					chalk.blue(user && user.user.tag),
					" par",
					chalk.blue(interaction.user.tag),
					"✔️"
				);
			} catch (error) {
				return log(
					chalk.green("suppression d'un ticket"),
					" par",
					chalk.blue(interaction.user.tag),
					"❌",
					error
				);
			}
		} else if (interaction.customId.startsWith("create-ticket")) {
			ticket(interaction);
		}
	}
}
