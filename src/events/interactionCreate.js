const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(bot, interaction) {
        //Check that it is a slash command being run
        if (!interaction.isChatInputCommand()) {
            return;
        }

        //Get the slash command being run
        const command = interaction.client.commands.get(interaction.commandName);

        //If it doesn't exist, send an error to console
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(bot, interaction);
        } catch (err) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(err);
        }
    },
};
