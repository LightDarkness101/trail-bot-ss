const {
	SlashCommandBuilder,
	ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
} = require("discord.js");
const config = require(`../config/config.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("suggest")
		.setDescription(`Leave a suggestion for Senior Studios.`),
	async execute(bot, interaction) {

        const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel(`What is your suggestion?`)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)

        const suggestionModal = new ModalBuilder()
            .setCustomId(`suggestion-add`)
            .setTitle(`Have a Suggestion for us?`)
            .addComponents(new ActionRowBuilder().addComponents(suggestionInput));
            
        await interaction.showModal(suggestionModal);

    },
};
