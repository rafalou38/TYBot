import mongoose from "mongoose";
const { Schema } = mongoose;

/**@type {mongoose.Schema<IMember>} */
const memberSchema = new Schema({
	guildID: String,
	invites: Number,
	invitedBy: String,
	xp: Number,
});

/**@type {mongoose.Model<IMember>} */
export const Members = mongoose.model("Members", memberSchema);
