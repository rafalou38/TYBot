import Discord, { Colors, TextChannel } from "discord.js";
import { config, context } from "../context";
import { Member } from "../database/schemas/Member";
import { updateStatus } from "../tasks/updateStatus";
import { getChanelById } from "../utils/channels";
import { getInvite } from "../utils/invites";
import { log } from "../utils/prettyLog";

/**
 *
 * @param {} member
 */
export async function userJoin(member) {
	const channel = await getChanelById(config.guilds[member.guild.id].userJoinChannelID);
	if (channel.type == TextChannel) return;

	let invite = await getInvite(member);
	if (!invite) {
		invite = { inviter: context.client.user };
	}

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
		await new Member({
			guildID: member.guild.id,
			userID: member.id,
			invitedBy: invite.inviter.id,
		}).save();
		log(member.user.tag, "joined, account created");
	} else {
		log(member.user.tag, "joined, old account used");
	}

	// await member.roles.add(config.guilds[member.guild.id].xpRolesIDS[1]);
	// await member.roles.add(config.guilds[member.guild.id].baseRoleID);
	if (config.guilds[member.guild.id].baseRoles) {
		try {
			await member?.roles?.add(config.guilds[member.guild.id].baseRoles);
		} catch (error) {
			log("Could not add base role to user.", error);
		}
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
			invites: 1,
		}).save();
		log(invite.inviter.tag, "new inviter account created");
	} else {
		log(invite.inviter.tag, "new invite added");
	}
	channel.send({
		embeds: [
			{
				title: `Bienvenue ${member.user.tag}`,
				description: `<@${member.id}> nous a rejoint`,
				color: Colors.Green,
				thumbnail: {
					url: member.user.avatarURL(),
				},
				fields: [
					{
						name: "Invité par:",
						value: `<@${invite.inviter.id}>`,
					},
					{
						name: "Qui à désormais:",
						value: `${DBInviter.invites} invites`,
					},
				],
			},
		],
	});
	updateStatus(context.client);
}
