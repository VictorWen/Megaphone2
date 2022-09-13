const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const data = require('../data_management/JSONDataManager.js');

const MAX_DURATION = 20

function hmsToSeconds(str) {
    if (str === undefined) return undefined;
    var split = str.split(':');
    let seconds = parseFloat(split.pop(), 10);
    let multiplier = 60;

    while (split.length > 0) {
        seconds += multiplier * parseInt(split.pop(), 10);
        multiplier *= 60;
    }

    return seconds;
}

module.exports = {
    data: {
        name: "fanfare",
        description: "Set fanfare options",
        type: "CHAT_INPUT",
        options: [
            {
                name: "youtube-url",
                description: "Youtube URL to get fanfare audio from",
                type: 3,
            },
            {
                name: "start",
                description: "Place to start the music from (HH:MM:SS)",
                type: 3,
            },
            {
                name: "duration",
                description: "How long to play the music for (in seconds)",
                type: 10,
            }
        ]
    },
    async execute(interaction) {
        await interaction.deferReply({ephemeral: false});

        const guildId = interaction.guildId;
        const userId = interaction.user.id;
        const userData = data.getUserData(guildId, userId);

        const options = interaction.options;
        let url = options.get('youtube-url')?.value;
        let start = hmsToSeconds(options.get('start')?.value);
        let duration = options.get('duration')?.value;

        url = url ? url : userData.url;
        if (start === undefined) start = url ? 0 : userData.start;
        if (duration === undefined) duration = url ? MAX_DURATION : userData.duration;

        const info = await ytdl.getInfo(url);
        const length = info.videoDetails.lengthSeconds;
        const title = info.videoDetails.title;
        const thumbnail = info.videoDetails.thumbnails[0];

        duration = Math.min(length, duration, MAX_DURATION);
        start = Math.min(length - duration, start);

        const format = ytdl.chooseFormat(info.formats, {
            quality: "highestaudio",
        });

        const yt_stream = ytdl(url, {format: format});

        const converter = new ffmpeg(yt_stream)
            .seekInput(start ? start : 0)
            .duration(duration ? duration + 1 : MAX_DURATION + 1)
            .noVideo();
        converter.output(data.userAudioWriteStream(guildId, userId));
        converter.format('ogg');
        converter.audioBitrate(48);
        converter.audioCodec('libopus');

        converter.run();

        const replyEmbed = {
            color: 0x00ff00,
            description: `**New Fanfare for <@${ userId }>** \n\n` + 
                `**${ title }**\n` +
                `(${url}) \n` + 
                `*${ new Date(start * 1000).toISOString().slice(11, 19) } - ${ new Date((start + duration) * 1000).toISOString().slice(11, 19) }*`,
            thumbnail: {
                url: thumbnail.url,
            },
        };

        converter.once('end',
            async () => {
                data.setUserData(guildId, userId, {
                    url: url,
                    start: start,
                    duration: duration
                });
                
                await interaction.editReply({
                    embeds: [replyEmbed]
                });
            }
        );
    }
}