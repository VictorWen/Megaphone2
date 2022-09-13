module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        const client = interaction.client;

        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction);
            } catch (error) {
                const reply = await interaction.fetchReply();
                embed = {
                    color: 0xff0000,
                    title: "Error",
                    description: error.message
                };
                if (reply) await interaction.editReply({ embeds: [embed] });
                else await interaction.reply({ embeds: [embed], ephemeral: true });
                console.error(error);
            }
        }
	},
};