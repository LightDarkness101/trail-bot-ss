const { EmbedBuilder } = require("discord.js");
let config = require("../../config/config.json");

module.exports = {
	async execute(bot, interaction) {
		let Schema = require(`../schemas/suggestion.js`),
			CSchema = require(`../schemas/count.js`),
			currentCount;

		let countData = await CSchema.findOne({
			guild: interaction.guild.id,
		});

		if (!countData) {
			new CSchema({
				guild: interaction.guild.id,
				count: 0,
			}).save();
			currentCount = 0;
		} else {
			currentCount = countData.count;
		}

		let channel = interaction.guild.channels.cache.get(
			config.suggestionChannel
		);

		let suggestionEmbed = new EmbedBuilder()
			.setTitle(`New Suggestion`)
			.setColor(config.colors.pending)
			.setDescription(
				`<@${
					interaction.user.id
				}> submitted a new suggestion.\n\n\`\`\`${interaction.fields.getTextInputValue(
					`suggestion`
				)}\`\`\``
			)
			.setTimestamp()
			.setFooter({
				text: `Suggestion ID: ${currentCount}`,
				iconURL: bot.user.displayAvatarURL(),
			});

		let m = await channel.send({ embeds: [suggestionEmbed] });

		await interaction.reply({
			content: `Your suggestion has been posted: https://discord.com/channels/${interaction.guild.id}/${channel.id}/${m.id}`,
			ephemeral: true,
		});

		new Schema({
			message: m.id,
			token: currentCount,
			suggestion: interaction.fields.getTextInputValue(`suggestion`),
			user: interaction.user.id,
			guild: interaction.guild.id,
			status: "pending",
		}).save();

		let newCurrent = currentCount + 1;

		let doc = await CSchema.findOneAndUpdate({ guild: interaction.guild.id }, { count: newCurrent });
	},
};
