const data = require('../data_management/JSONDataManager.js');

module.exports = {
    data: {
        name: "disable",
        description: "disable your fanfare",
        type: "CHAT_INPUT",
    },
    async execute(interaction) {
        const guildId = interaction.guildId;
        const userId = interaction.user.id;
        data.setUserData(guildId, userId, {enabled: false});

        const replyEmbed = {
            color: 0x00ff00,
            description: `**Disabled** Fanfare for <@${ userId }>`
        };
        await interaction.reply({
            embeds: [replyEmbed]
        });
    }
}