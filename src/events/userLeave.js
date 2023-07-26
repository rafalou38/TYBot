/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable indent */
import Discord, { Colors, TextChannel } from "discord.js";
import { config, context } from "../context";
import { Member } from "../database/schemas/Member";
import { updateStatus } from "../tasks/updateStatus";
import { getChanelById } from "../utils/channels";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function userLeave(member) {
	const channel = await getChanelById(config.guilds[member.guild.id].userJoinChannelID);
	if (channel.type == TextChannel) return;

	/** @type {import("../../types/db/Member.js").IMember} */
	const DBMemberLeave = await Member.findOne({
		guildID: member.guild.id,
		userID: member.id,
	});
	/** @type {import("../../types/db/Member.js").IMember} */
	let DBMemberInviter;
	if (DBMemberLeave) {
		DBMemberInviter = await Member.findOneAndUpdate(
			{
				guildID: member.guild.id,
				userID: DBMemberLeave.invitedBy,
			},
			{ $inc: { invites: -1 } },
			{
				new: true,
			}
		);
		await DBMemberLeave.deleteOne();
	}

	channel.send({
		embeds: [
			{
				title: `Bye ${member.user.tag}`,
				description: `<@${member.id}> nous a quitté`,
				color: Colors.Red,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				fields: DBMemberInviter
					? [
							{
								name: "Il avait été invité par",
								value: `<@${DBMemberInviter.userID}>`,
							},
							{
								name: "Qui à désormais:",
								value: `${DBMemberInviter.invites} invites`,
							},
					  ]
					: [],
			},
		],
	});
	updateStatus(context.client);
}
