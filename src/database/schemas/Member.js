import mongoose from "mongoose";
const { Schema } = mongoose;

/**@type {mongoose.Schema<IMember>} */
const memberSchema = new Schema({
	guildID: String,
	userID: String,
	invites: Number,
	invitedBy: String,
	xp: Number,
});

/**@type {mongoose.Model<IMember>} */
export const Member = mongoose.model("Members", memberSchema);
