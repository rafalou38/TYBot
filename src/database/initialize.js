import chalk from "chalk";
import mongoose from "mongoose";
import { log } from "../utils/prettyLog.js";

export async function initDB() {
	return new Promise((resolve, reject) => {
		mongoose.connect(process.env.MONGO_URI, (err) => {
			if (err) {
				log("failed to connect to mongoDB ❌");
				reject(err);
			} else {
				log("successfully connected to mongoDB ✅");
				resolve(err);
			}
		});
	});
}
