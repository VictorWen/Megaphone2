const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require('@discordjs/voice');

function joinCurrentChannel(interaction) {
    if (interaction.member.voice.channel) {
        return joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
    }
    else {
        return undefined;
    }
}

function playMusicWithFalloff(vc, audioStream, playtime, falloff) {
    const volume = 0.050
    const player = createAudioPlayer();
    const resource = createAudioResource(audioStream, {
        inputType: StreamType.OggOpus,
        inlineVolume: true,
        silencePaddingFrames: 20
    });
    resource.volume.setVolume(volume);

    player.play(resource);
    vc.subscribe(player);

    player.once(AudioPlayerStatus.Playing, async () => {
        let interval;

        setTimeout(() => {
            let start = Date.now();
            interval = setInterval(() => {
                let elapsed = Date.now() - start;
                let new_vol = Math.max(volume * (falloff - elapsed) / falloff, 0);
                resource.volume.setVolume(new_vol);
                
                if (new_vol <= 0) clearInterval(interval);
            }, 100);
        }, playtime);

        setTimeout(() => {
            if (player.state.status === AudioPlayerStatus.Playing)
                player.stop();
        }, playtime + falloff + 250);

        player.once(AudioPlayerStatus.Idle, 
            () => setTimeout(() => {
                clearInterval(interval);
                vc.destroy();
            }, 1000)
        );
    });
}

module.exports = {
    joinCurrentChannel,
    playMusicWithFalloff
};