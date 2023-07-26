import mongoose from "mongoose";
const { Schema } = mongoose;


declare interface IMember extends Document {
	guildID: string;
	invites: number;
	invitedBy: string;
	userID: string;
	birthday: string;
	xp: number;
	level: number;
	lastActive: Date;
}


const memberSchema = new Schema<IMember>({
	guildID: String,
	userID: String,
	invitedBy: String,
	birthday: { type: String, required: false },
	invites: { type: Number, default: 0 },
	xp: { type: Number, default: 0 },
	level: { type: Number, default: 0 },
	lastActive: Date,
});

export const Member = mongoose.model<IMember>("Members", memberSchema);
