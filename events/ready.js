const config = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        let commands = [];
        for (let command of client.commands.values()) {
            commands.push(command.data);
        }
        if (!config.dev)
            client.application.commands.set([], config.dev_server);
        await client.application.commands.set(commands, config.dev ? config.dev_server : undefined);

        console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};