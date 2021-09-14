import Discord from "discord.js";
import { config } from "../context.js";
import { Member } from "../database/schemas/Member.js";
import { getChanelById } from "../utils/channels.js";
import { getInvite } from "../utils/invites.js";
import { log } from "../utils/prettyLog.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function userJoin(member) {
	const channel = await getChanelById(config.userJoinChannelID);

	if (!channel || !channel.isText()) return;

	const invite = await getInvite(member);

	// CONFIG USER ACCOUNT
	const existed = await Member.findOneAndUpdate(
		{
			guildID: member.guild.id,
			userID: member.id,
		},
		{
			invitedBy: invite.inviter.id,
		}
	);
	if (!existed) {
		new Member({
			guildID: member.guild.id,
			userID: member.id,
			invitedBy: invite.inviter.id,
		}).save();
		log(member.user.tag, "joined, account created");
	} else {
		log(member.user.tag, "joined, old account used");
	}

	// ADD INVITE TO INVITER
	let DBInviter = await Member.findOneAndUpdate(
		{
			guildID: member.guild.id,
			userID: invite.inviter.id,
		},
		{ $inc: { invites: 1 } },
		{
			new: true,
		}
	);
	if (!DBInviter) {
		DBInviter = await new Member({
			guildID: member.guild.id,
			userID: invite.inviter.id,
		}).save();
		log(invite.inviter.tag, "new inviter account created");
	} else {
		log(invite.inviter.tag, "new invite added");
	}
	channel.send({
		embeds: [
			{
				title: `bienvenue ${member.user.tag}`,
				description: `<@${member.id}> nous a rejoints`,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				fields: [
					{
						name: "invited by:",
						value: `<@${invite.inviter.id}>`,
					},
					{
						name: "who now has:",
						value: `${DBInviter.invites} invites`,
					},
				],
			},
		],
	});
}
