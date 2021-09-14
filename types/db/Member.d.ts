import { Document } from "mongoose";

declare interface IMember extends Document {
	guildID: string;
	invites: number;
	invitedBy: string;
	userID: string;
	xp: number;
	level: Number;
}
