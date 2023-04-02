import Discord, { TextChannel } from "discord.js";
import {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	VoiceConnection,
} from "@discordjs/voice";
import { config } from "../context.js";
import { log } from "../utils/prettyLog.js";

function resource() {
	return createAudioResource("medias/waiting_sound.mp3");
}

/**  @type { VoiceConnection \ null }*/
let conn;
const player = createAudioPlayer();
player.on(AudioPlayerStatus.Idle, (old, n) => {
	if (conn) {
		// Still connected
		player.play(resource());
	}
});

/** @type {Map<string, NodeJS.Timeout}*/
const timeouts = new Map();

/**
 *
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
export async function handleVoiceStateUpdate(oldState, newState) {
	const { guild, member } = newState;
	const {
		waitingChannelID,
		waitingPingChannelID,
		modRoleID,
		modPlusRoleID,
		adminRoleID,
		staffRoleID,
	} = config.guilds[guild.id];

	if (member.id === guild.client.user.id) return;

	if (newState.channelId === waitingChannelID) {
		if (!conn) {
			conn = joinVoiceChannel({
				channelId: newState.channelId,
				guildId: guild.id,
				adapterCreator: guild.voiceAdapterCreator,
			});
			conn.subscribe(player);
		}
		player.play(resource());

		log("User joined waiting room");
		if (timeouts.has(member.id)) {
			clearTimeout(timeouts.get(member.id));
			timeouts.delete(member.id);
		}

		const timeout = setTimeout(async () => {
			// Check if member is still connected
			timeouts.delete(member.id);
			if (!newState.channel) {
				log("User not in waiting room anymore");
				return;
			}

			/** @type {Discord.VoiceChannel} */
			const newChannel = await newState.channel.fetch(true);
			if (newChannel.members.has(member.id)) {
				// Send ping to staff
				log("User stayed in waiting room, pinging");
				const channel = await guild.channels.fetch(waitingPingChannelID);
				if (channel.type == TextChannel) throw new Error("wrong waitingPingChannelID");
				channel.send({
					content: `<@&${modRoleID}> <@&${modPlusRoleID}> <@&${adminRoleID}> <@&${staffRoleID}>`,
					embeds: [
						{
							title: "Utilisateur en attente de support",
							description: `${member} est en attente dans le salon ${newChannel}`,
							color: 0x50f450,
							timestamp: new Date(),
						},
					],
				});
			} else {
				log("User not in waiting room anymore");
			}
		}, 1000 * 60);

		timeouts.set(member.id, timeout);
	} else if (oldState.channelId == waitingChannelID) {
		// Member left
		log("Member left support channel, clearing");
		clearTimeout(timeouts.get(member.id));
		timeouts.delete(member.id);
		const remainingMembers = oldState.channel.members.filter((m) => m.id != guild.client.user.id);
		if (remainingMembers.size == 0) {
			conn.destroy();
			conn = null;
			player.stop();
		}
	}
}
