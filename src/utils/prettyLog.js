import chalk from "chalk";

chalk.supportsColor = true;
chalk.level = 3;

export async function log() {
	console.log(chalk.magenta(new Date(Date.now()).toLocaleString()), ...arguments);
}
