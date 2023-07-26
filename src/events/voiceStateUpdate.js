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
import { userActive } from "../database/utils/activity.js";

function joinResource() {
	return createAudioResource("medias/waiting_sound.mp3");
}
function randomSong() {
	const options = [
		"Depeche_Mode_-_Corrupt_Lyrics.mp3",
		"Depeche_Mode_-_Never_Let_Me_Down_Again_-_Lyrics.mp3",
		"Metallica_-_Enter_Sandman_lyrics.mp3",
		"Paint_It_Black.mp3",
		"Personal_Jesus.mp3",
		"Arctic_Monkeys_-_Do_I_Wanna_Know_Official_Video.mp3",
		"DiRT_4_Official_Soundtrack__Out_Of_My_System__Youngr.mp3",
	];
	const choice = Math.min(Math.round(Math.random() * options.length), options.length - 1);

	return createAudioResource("medias/musiques/" + options[choice]);
}

/**  @type { VoiceConnection | null }*/
let conn;
const player = createAudioPlayer();

player.on(AudioPlayerStatus.Idle, (old, n) => {
	if (conn) {
		player.play(randomSong());
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
	const { waitingChannelID, waitingPingChannelID, staffRoleID } = config.guilds[guild.id];

	userActive(newState.member);

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
		player.play(joinResource());

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
				log("User stayed in waiting room, pinging");
				const channel = await guild.channels.fetch(waitingPingChannelID);
				if (channel.type == TextChannel) throw new Error("wrong waitingPingChannelID");
				await channel.send({
					content: `<@&${staffRoleID}>`,
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
