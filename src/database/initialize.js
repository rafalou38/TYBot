import chalk from "chalk";
import mongoose from "mongoose";

export async function initDB() {
	return new Promise((resolve, reject) => {
		mongoose.connect(process.env.MONGO_URI, (err) => {
			if (err) {
				console.log(
					chalk.magenta(new Date(Date.now()).toLocaleString()),
					"failed to connect to mongoDB ❌"
				);
				reject(err);
			} else {
				console.log(
					chalk.magenta(new Date(Date.now()).toLocaleString()),
					"successfully connected to mongoDB ✅"
				);
				resolve(err);
			}
		});
	});
}
