import Discord from "discord.js";
import { config, context } from "./context.js";
import { gmodServerInfo } from "./lib/gmodApi.js";
import { log } from "./utils/prettyLog.js";

function requestTimeout() {
	return (Math.random() / 3 + 0.75) * 1000 * 60 * 10;
}

async function update(client, ip) {
	/** @type {import("./lib/gmodApi.js").GmodServerInfo} */
	const data = await gmodServerInfo(ip);
	const { maxPlayers, name, players } = data.data[0].attributes;
	client.user.setActivity(`${players}/${maxPlayers} membres sur le serveur ${name}`);

	setTimeout(update.bind(null, client, ip), requestTimeout());

	log(`🔁 mise à jour des données du serveur ${name} 💽`);
}

for (const [TOKEN, IP] of config.gmodServers.entries()) {
	const client = new Discord.Client({
		intents: [],
	});

	client.once("ready", async () => {
		log(`🤖 bot ${client.user.tag} successfully started 🚀`);
	});

	client.login(TOKEN).then(() => {
		update(client, IP);
	});
}
