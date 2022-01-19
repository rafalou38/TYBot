import axios from "axios";

const options = (ip) => ({
	method: "GET",
	url: "https://api.battlemetrics.com/servers",
	params: {
		"fields[server]": "name,players,maxPlayers",
		"filter[game]": "gmod",
		"filter[search]": `"${ip}"`,
		"relations[server]": "",
	},
});

/**
 *
 * @param {string} ip
 * @returns {import("./gmodApi").GmodServerInfo}
 */
export async function gmodServerInfo(ip) {
	const response = await axios.request(options(ip));
	return response.data;
}
