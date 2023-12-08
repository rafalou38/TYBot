import { Client } from "discord.js";
import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

export const config = {
	prefix: "-",
	xpIncrement: 2,
	xpAddDelaySeconds: 10,
	xpRequiredIncrease: 5,
	maxLevel: 75,
	myID: "623790476713263124",
	tyGuildID: "655531439571599380",
	gmodServers: new Map([
		// [process.env.TY_GAME_TOKEN, "TEXT:tyteam.fr"],
		[process.env.AVPRP_TOKEN, "TEXT:En développement"],
		[process.env.METRORP_TOKEN, "TEXT:En Maintenance"],
		// [process.env.SCPRP_TOKEN, "GMOD:game1.loicmorel.fr:27017"],
		// [process.env.TEST_TOKEN, "TEXT: "],
	]),
	guilds: {
		// 'pour recup l'id: lv1<@&766021341949329459>    player: <@&678244426941988904>  (desole du ping)'
		// Ty serveur
		"655531439571599380": {
			userJoinChannelID: "655536203407556669",
			sondageChannelID: "656841905690116106",
			levelUpChannelID: "854967377745936384",
			logsChannelID: "655861612644925500",
			ticketCategoryID: "655538940459352065",
			staffRoleID: "663763852680364044",
			modRoleID: "1052705811090112552",
			communityRoleID: "769569316097622038",
			activeRoleID: "1133739969618399283",
			baseRoleID: "766021341949329459",
			waitingChannelID: "703664514821914674",
			waitingPingChannelID: "655861612644925500",
			xpRolesIDS: {
				1: "766021341949329459",
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
		"1105778402784456714": { // WW2 URSS VS REICH
			levelUpChannelID: "1180530073963606057",
			userJoinChannelID: "1180530048890056846",
			sondageChannelID: "1180530063653998683",
			logsChannelID: "1180530091634196480",
			ticketCategoryID: "1180530041218670612",
			waitingChannelID: "1180530069597327413",
			waitingPingChannelID: "1180530085833494679",

			staffRoleID: "1180529958309867521",
			modRoleID: "1180529951561240638",
			communityRoleID: "1180529952991498270",
			activeRoleID: "1180529988064268328",
			baseRoleID: "1180529989100257301",
			xpRolesIDS: {},
			membersRolesIds: [],
		},
		"1138401606480691301": { // TY session RP
			levelUpChannelID: "1180530406857130124",
			userJoinChannelID: "1180530380961484921",
			sondageChannelID: "1180530396828549241",
			logsChannelID: "1180530425114935436",
			ticketCategoryID: "1180530371532705813",
			waitingChannelID: "1180530403610722384",
			waitingPingChannelID: "1180530418676674610",

			staffRoleID: "1180619463394074716",
			modRoleID: "1180619456943247481",
			communityRoleID: "1180619458813902921",
			activeRoleID: "1180619495677640755",
			baseRoleID: "1180619496852037634",
			xpRolesIDS: {},
			membersRolesIds: [],
		},
		"1025066918509547541": { // last of us
			userJoinChannelID: "1180530077876879372",
			levelUpChannelID: "1180530104602988636",
			sondageChannelID: "1180530093102202880",
			logsChannelID: "1180530123594809405",
			ticketCategoryID: "1180530066791354408",
			waitingChannelID: "1180530101486616676",
			waitingPingChannelID: "1180530116003115069",

			staffRoleID: "1180529973094797384",
			modRoleID: "1180529968418128003",
			communityRoleID: "1180529970389454849",
			activeRoleID: "1180530006393368706",
			baseRoleID: "1180530007244804116",
			xpRolesIDS: {},
			membersRolesIds: [],
		}
	},
};

export const context = {
	client: {} as Client,
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
