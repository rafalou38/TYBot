import mongoose from "mongoose";
const { Schema } = mongoose;

const absenceSchema = new Schema({
	messageID: String,
	channelID: String,
	guildID: String,
	userID: String,
	thumbnail: String,
	reason: String,
	dateStart: Date,
	dateEnd: Date,
});

export const Absence = mongoose.model("absence", absenceSchema);
