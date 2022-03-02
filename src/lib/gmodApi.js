import Gamedig from "gamedig";


/**
 *
 * @param {string} ip
 * @returns {import("./gmodApi").GmodServerInfo}
 */
export async function gmodServerInfo(ip) {
	const options = {
		requestRules: false,
		type: "garrysmod",
		host: ip.split(":").at(0),
		port: ip.split(":").at(1),
	};

	try{
		const gamedig = new Gamedig(options);
		const status = await gamedig.query(options);

		return {
			name: status.name,
			maxPlayers: status.maxplayers,
			players: status.players.length
		};
	} catch{
		return {
			name: "ERROR",
			maxPlayers: 0,
			players: 1
		};
	}
}
