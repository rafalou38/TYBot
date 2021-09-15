import Discord from "discord.js";

export interface context {
	client: Discord.Client<true>;
	/** Map of user ids to ticket chanels id for unique ticket */
	tickets: Map<string, string>;
}
