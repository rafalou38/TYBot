import Discord from "discord.js";
import { config, context } from "./context";
import { mcServerInfo } from "./lib/queryApi";
import { gmodServerInfo } from "./lib/queryApi";
import { log } from "./utils/prettyLog";

function requestTimeout() {
	return 1000 * 60;
}

/**
 * @param {Discord.Client} client
 * @param {string} action
 */
async function update(client, action) {
	setTimeout(update.bind(null, client, action), requestTimeout());

	if (action.startsWith("TEXT")) {
		action = action.substring(5);
		client.user.setActivity(action);
		return;
	}
	/** @type {import("./lib/queryApi.js").queryServerInfo} */
	let data;
	if (action.startsWith("GMOD")) {
		action = action.substring(5);
		data = await gmodServerInfo(action);
	} else if (action.startsWith("MC")) {
		action = action.substring(3);
		data = await mcServerInfo(action);
		/** @type {import("./lib/gmodApi.js").GmodServerInfo} */
	}
	if (data) {
		const { maxPlayers, name, players } = data;
		client.user.setActivity(`${players}/${maxPlayers} membres sur le serveur ${name}`);

		log(`🔁 mise à jour des données du serveur ${name}: ${players}/${maxPlayers} 💽`);
	} else {
		client.user.setActivity("🔴 Offline");
		log(`🔁 mise à jour des données du serveur ${action}: 🔴 Offline`);
	}
}

for (const [TOKEN, action] of config.gmodServers.entries()) {
	const client = new Discord.Client({
		intents: [],
	});

	client.once("ready", async () => {
		log(`🤖 bot ${client.user.tag} successfully started 🚀`);
	});

	client.login(TOKEN).then(() => {
		update(client, action);
	});
}
