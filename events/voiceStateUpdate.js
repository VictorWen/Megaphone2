const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus} = require('@discordjs/voice');
const data = require('../data_management/JSONDataManager.js');
const { playMusicWithFalloff } = require("../voiceUtils.js")

const MAX_FALLOFF = 10 * 1000;

module.exports = {
    name: "voiceStateUpdate",
    async execute(oldState, newState) {
        const changedChannel = newState.channelId != undefined && oldState.channelId !== newState.channelId;
        const isBot = newState.member.user.bot;

        const guildId = newState.guild.id;
        const userId = newState.member.id;
        const channelId = newState.channelId;

        const userData = data.getUserData(guildId, userId);

        if (changedChannel && !isBot && userData.enabled) {
            joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: newState.guild.voiceAdapterCreator,
            });
            
            const duration = userData.duration * 1000;
            let falloff = Math.min(duration, MAX_FALLOFF);
            let playtime = duration - falloff;

            let vc = getVoiceConnection(guildId);
            if (!vc || vc.state.status === VoiceConnectionStatus.Destroyed)
                return;

            const audioStream = data.userAudioReadStream(guildId, userId);

            playMusicWithFalloff(vc, audioStream, playtime, falloff);
        }
    }
};