import Discord from "discord.js";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { config } from "../context.js";


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

/**
 *
 * @param {Discord.VoiceState} oldState
 * @param {Discord.VoiceState} newState
 */
export async function handleVoiceStateUpdate(oldState, newState) {
	const { guild } = newState;
	const { waitingChannelID } = config.guilds[guild.id];

	if (newState.member.id === guild.client.user.id) return;

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
	} else if (oldState.channelId == waitingChannelID) {
		// Member left
		const remainingMembers = oldState.channel.members.filter(m => m.id != guild.client.user.id);
		if (remainingMembers.size == 0) {
			conn.destroy();
			conn = null;
			player.stop();
		}
	}
}