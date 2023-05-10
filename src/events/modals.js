const { Events, InteractionType } = require('discord.js');
const suggestionModal = require('./modals/suggestionModal.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(bot, interaction) {
        //Check that it is a modal that is being submitted.
        if (!interaction.guild || !interaction.channel || !InteractionType.ModalSubmit) {
            return;
        }
        if (interaction.customId === 'suggestion-add') {
                suggestionModal.execute(bot, interaction);
        }
    },
};
