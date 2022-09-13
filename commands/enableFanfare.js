const data = require('../data_management/JSONDataManager.js');

module.exports = {
    data: {
        name: "enable",
        description: "enable your fanfare",
        type: "CHAT_INPUT",
    },
    async execute(interaction) {
        const guildId = interaction.guildId;
        const userId = interaction.user.id;
        data.setUserData(guildId, userId, {enabled: true});

        const replyEmbed = {
            color: 0x00ff00,
            description: `**Enabled** Fanfare for <@${ userId }>`
        };
        await interaction.reply({
            embeds: [replyEmbed]
        });
    }
}