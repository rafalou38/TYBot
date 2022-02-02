import Discord from "discord.js";
import { config, context } from "./context.js";
import { gmodServerInfo } from "./lib/gmodApi.js";
import { log } from "./utils/prettyLog.js";

function requestTimeout() {
	return (Math.random() / 3 + 0.75) * 1000 * 60 * 10;
}

/**
 * @param {Discord.Client} client
 * @param {string} action
 */
async function update(client, action) {
	if (action.startsWith("GMOD")) {
		setTimeout(update.bind(null, client, action), requestTimeout());

		action = action.substring(5);
		/** @type {import("./lib/gmodApi.js").GmodServerInfo} */
		const data = await gmodServerInfo(action);
		const { maxPlayers, name, players } = data.data[0].attributes;
		client.user.setActivity(`${players}/${maxPlayers} membres sur le serveur ${name}`);

		log(`🔁 mise à jour des données du serveur ${name} 💽`);
	} else if (action.startsWith("TEXT")) {
		action = action.substring(5);
		client.user.setActivity(action);
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
