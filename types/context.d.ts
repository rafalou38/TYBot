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
	myID: string;
	tyGuildID: string;
	gmodServers: Map<string, string>;
	guilds: {
		[key: string]: {
			userJoinChannelID: string;
			suggestionsChannelID: string;
			anivChannelID: string;
			sondageChannelID: string;
			logsChannelID: string;
			levelUpChannelID: string;
			ticketCategoryID: string;
			modRoleID: string;
			modPlusRoleID: string;
			staffRoleID: string;
			ancestorRoleID: string;
			ancestor2RoleID: string;
			birthdayRoleID: string;
			baseRoleID: string;
			waitingChannelID: string;
			waitingPingChannelID: string;
			xpRolesIDS: {
				1: string;
				5: string;
				10: string;
				15: string;
				20: string;
				25: string;
				30: string;
				35: string;
				40: string;
				45: string;
				50: string;
				55: string;
				60: string;
				65: string;
				70: string;
			};
			membersRolesIds: string[];
		};
	};
}
