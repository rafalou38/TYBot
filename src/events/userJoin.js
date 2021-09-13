import Discord from "discord.js";
import { config } from "../context.js";
import { getChanelById } from "../utils/channels.js";

/**
 *
 * @param {Discord.GuildMember} member
 */
export async function userJoin(member) {
	const channel = await getChanelById(config.userJoinChannelID);
	console.log(channel);
	if (!channel || !channel.isText()) return;

	channel.send({
		embeds: [
			{
				title: `bienvenue ${member.user.tag}`,
				description: `<@${member.id}> nous a rejoints`,
				thumbnail: {
					url: member.user.avatarURL(),
				},
			},
		],
	});
}
