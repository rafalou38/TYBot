import mongoose from "mongoose";
const { Schema } = mongoose;

/**@type {mongoose.Schema<IMember>} */
const memberSchema = new Schema({
	guildID: String,
	userID: String,
	invitedBy: String,
	birthday: { type: String, required: false },
	invites: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
	level: { type: Number, default: 0 },
});

/**@type {mongoose.Model<IMember>} */
export const Member = mongoose.model("Members", memberSchema);
