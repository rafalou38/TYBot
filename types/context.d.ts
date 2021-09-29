import Discord from "discord.js";

export interface context {
	client: Discord.Client<true>;
	/** Map of user ids to ticket chanels id for unique ticket */
	tickets: Map<string, string>;
}

export interface IConfig {
	prefix: string;
	xpIncrement: number;
	xpAddDelaySeconds: number;
	xpRequiredIncrease: number;
	guilds: {
		[key: string]: {
			userJoinChannelID: string;
			suggestionsChannelID: string;
			anivChannelID: string;
			sondageChannelID: string;
			logsChannelID: string;
			ticketCategoryID: string;
			xpRolesIDS: {
				10: string;
				15: string;
				20: string;
				25: string;
				30: string;
				35: string;
				40: string;
				45: string;
				50: string;
			};
		};
	};
}
