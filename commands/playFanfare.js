const path = require('path');
const { getVoiceConnection, VoiceConnectionStatus } = require("@discordjs/voice");
const { joinCurrentChannel } = require('../voiceUtils.js');
const data = require('../data_management/JSONDataManager.js');
const { playMusicWithFalloff } = require("../voiceUtils.js")

const max_falloff = 10000;

module.exports = {
    data: {
        name: "playfanfare",
        description: "Play your fanfare",
        type: "CHAT_INPUT",
    },
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        const guildId = interaction.guildId;
        const userId = interaction.user.id;

        const userData = data.getUserData(guildId, userId);
        const duration = userData.duration * 1000;
        let falloff = Math.min(duration, max_falloff);
        let playtime = duration - falloff;


        let vc = getVoiceConnection(interaction.guildId);
        if (!vc || vc.state.status === VoiceConnectionStatus.Destroyed) {
            vc = joinCurrentChannel(interaction);
            if (!vc) {
                await interaction.editReply({
                    content: "You are not in a voice channel",
                });
                return;
            }
        }
        
        const userAudio = data.userAudioReadStream(interaction.guildId, interaction.user.id);
        playMusicWithFalloff(vc, userAudio, playtime, falloff);

        await interaction.editReply({
            content: "Success",
        });
    }
}