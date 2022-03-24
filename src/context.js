import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

/** @type {import("../types/context").IConfig} */
export const config = {
	prefix: "-",
	xpIncrement: 2,
	xpAddDelaySeconds: 10,
	xpRequiredIncrease: 5,
	maxLevel: 75,
	myID: "623790476713263124",
	tyGuildID: "655531439571599380",
	gmodServers: new Map([
		[process.env.SCPRP_TOKEN, "TEXT:🛠️ En développement"],
		[process.env.TY_GAME_TOKEN, "TEXT:🛠️ En développement"],
		// [process.env.DARKRP_TOKEN, "GMOD:54.37.165.231:27021"], // WW2RP
		[process.env.DARKRP_TOKEN, "TEXT:🛠️ En développement"], // WW2RP
		[process.env.MC_TOKEN, "MC:ty-team.servegame.com:17777"],
	]),
	guilds: {
		// Ty serveur
		"655531439571599380": {
			userJoinChannelID: "655536203407556669",
			suggestionsChannelID: "656841905690116106",
			anivChannelID: "784012586521591809",
			sondageChannelID: "656841905690116106",
			levelUpChannelID: "792830986253369364",
			logsChannelID: "655861612644925500",
			ticketCategoryID: "655538940459352065",
			staffRoleID: "663763852680364044",
			ancestorRoleID: "733111531704811542",
			ancestor2RoleID: "899625427461615626",
			birthdayRoleID: "884409241983664158",
			xpRolesIDS: {
				5: "766021353522200608",
				10: "812286357157314570",
				15: "766021359641559070",
				20: "812286802924142612",
				25: "766021364044791829",
				30: "812287139467362345",
				35: "766021368721571852",
				40: "766021367413604382",
				45: "812287356446441472",
				50: "766021375201771520",
				55: "921334444420395050",
				60: "921335088787116063",
				65: "927818550083715083",
				70: "927818870029443114",
			},
			membersRolesIds: [],
		},
	},
};

/**@type {import("../types/context").context} */
export const context = {
	tickets: new Map(),
};

export const description = `
Aujourd'hui je te présente la TY-TEAM ! 

- Nous sommes une communauté basé sur le gaming ! :796901608390524980: 
 
- Nous disposons de serveurs de jeux sur GMOD :771497293747978286: / Minecraft :JackSparroWhat: et plus encore prochainement ! 

- Nous sommes entrain de terminer notre bot Discord qui sera rien qu'à nous c'est pas génial ! :clanToC: 

- Nous sommes entrain aussi de terminer notre site web car il y a du lourd qui arrive ! :DoggoSweat: 

- Nous sommes aussi entrain de réaliser notre grand projet : Créer notre propre jeux vidéo! Alors plutôt chaud :804839584574734427:  ? Tu veux en savoir plus :709865156766728314:  ? Rejoins  notre discord ! :655824799435849738: 

:cloche:  Et en plus tu sais quoi ! On recrute du staff et des développeurs de toutes sortent à fond ! :540612902126878760: 

https://discord.gg/2J7KzUhaNB
`;
