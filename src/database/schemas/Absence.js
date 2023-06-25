import mongoose from "mongoose";
const { Schema } = mongoose;

const absenceSchema = new Schema({
	messageID: String,
	channelID: String,
	guildID: String,
	date: Date
});

export const Absence = mongoose.model("absence", absenceSchema);
