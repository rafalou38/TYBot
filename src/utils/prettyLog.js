import chalk from "chalk";

export async function log() {
	console.log(chalk.magenta(new Date(Date.now()).toLocaleString()), ...arguments);
}
