const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require(`../config/config.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("suggestion")
		.setDescription(`Approve / Deny / Implement mentioned suggestion.`)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("accept")
				.setDescription(`Accept the suggestion!`)
				.addIntegerOption((option) =>
					option
						.setName("id")
						.setDescription(`What is the Suggestion ID?`)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("deny")
				.setDescription(`Deny the suggestion!`)
				.addIntegerOption((option) =>
					option
						.setName("id")
						.setDescription(`What is the Suggestion ID?`)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("implement")
				.setDescription(`Implement the suggestion!`)
				.addIntegerOption((option) =>
					option
						.setName("id")
						.setDescription(`What is the Suggestion ID?`)
						.setRequired(true)
				)
		),

	async execute(bot, interaction) {
		let CSchema = require(`../events/schemas/count.js`),
			Schema = require(`../events/schemas/suggestion.js`),
			currentCount,
			channel = interaction.guild.channels.cache.get(
				config.suggestionChannel
			);

		let countData = await CSchema.findOne({
			guild: interaction.guild.id,
		});

		if (!countData) {
			return interaction.reply({
				content: `There are no suggestions yet on this server!`,
				ephemeral: true,
			});
		} else {
			currentCount = countData.count;
		}

		let sugID = interaction.options.getInteger("id");

		if (sugID < 0 || sugID >= currentCount)
			return interaction.reply({
				content: `You did not list an ID for a proper Suggestion.`,
				ephemeral: true,
			});

		if (interaction.options.getSubcommand() === "accept") {
			if (
				!interaction.member.roles.cache.some((role) =>
					config.permissions.approveSuggestions.includes(role.id)
				) &&
				!config.permissions.approveSuggestions.includes(
					interaction.member.id
				)
			)
				return interaction.reply({
					content: `You do not have permission to accept suggestions!`,
					ephemeral: true,
				});

			let suggestionInfo = await Schema.findOne({
				token: sugID,
				guild: interaction.guild.id,
			});

			if (!suggestionInfo) return;

			let message = suggestionInfo.message;
			let user = bot.users.cache.get(suggestionInfo.user);
			let suggestion = suggestionInfo.suggestion;
			let status = suggestionInfo.status;

			if (!status === "pending")
				return interaction.reply({
					content: `This suggestion has already been accepted/denied.`,
					ephemeral: true,
				});

			let embed = new EmbedBuilder()
				.setTitle(`New Suggestion`)
				.setColor(config.colors.approved)
				.setFooter({
					text: `Suggestion ID: ${sugID} | Approved by ${interaction.member.user.tag}`,
					iconURL: bot.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setDescription(
					`<@${user.id}> submitted a new suggestion.\n\n\`\`\`${suggestion}\`\`\``
				);

			await channel.messages.fetch(message).then(async (m) => {
				await m.edit({ embeds: [embed] });
			});

			let doc = await Schema.findOneAndUpdate(
				{ token: sugID, guild: interaction.guild.id },
				{ status: "approved" }
			);

			return interaction.reply({
				content: `Suggestion has been approved! https://discord.com/channels/${interaction.guild.id}/${channel.id}/${message}`,
				ephemeral: true,
			});
		} else if (interaction.options.getSubcommand() === "deny") {
			if (
				!interaction.member.roles.cache.some((role) =>
					config.permissions.denySuggestions.includes(role.id)
				) &&
				!config.permissions.denySuggestions.includes(
					interaction.member.id
				)
			)
				return interaction.reply({
					content: `You do not have permission to deny suggestions!`,
					ephemeral: true,
				});

			let suggestionInfo = await Schema.findOne({
				token: sugID,
				guild: interaction.guild.id,
			});

			if (!suggestionInfo) return;

			let message = suggestionInfo.message;
			let user = bot.users.cache.get(suggestionInfo.user);
			let suggestion = suggestionInfo.suggestion;
			let status = suggestionInfo.status;

			if (!status === "pending")
				return interaction.reply({
					content: `The suggestion must be pending to be denied.`,
					ephemeral: true,
				});

			let embed = new EmbedBuilder()
				.setTitle(`New Suggestion`)
				.setColor(config.colors.denied)
				.setFooter({
					text: `Suggestion ID: ${sugID} | Denied by ${interaction.member.user.tag}`,
					iconURL: bot.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setDescription(
					`<@${user.id}> submitted a new suggestion.\n\n\`\`\`${suggestion}\`\`\``
				);

			await channel.messages.fetch(message).then(async (m) => {
				await m.edit({ embeds: [embed] });
			});

			let doc = await Schema.findOneAndUpdate(
				{ token: sugID, guild: interaction.guild.id },
				{ status: "denied" }
			);

			return interaction.reply({
				content: `Suggestion has been denied! https://discord.com/channels/${interaction.guild.id}/${channel.id}/${message}`,
				ephemeral: true,
			});
		} else if (interaction.options.getSubcommand() === "implement") {
			if (
				!interaction.member.roles.cache.some((role) =>
					config.permissions.implementSuggestions.includes(role.id)
				) &&
				!config.permissions.implementSuggestions.includes(
					interaction.member.id
				)
			)
				return interaction.reply({
					content: `You do not have permission to implement suggestions!`,
					ephemeral: true,
				});

			let suggestionInfo = await Schema.findOne({
				token: sugID,
				guild: interaction.guild.id,
			});

			if (!suggestionInfo) return;

			let message = suggestionInfo.message;
			let user = bot.users.cache.get(suggestionInfo.user);
			let suggestion = suggestionInfo.suggestion;
			let status = suggestionInfo.status;

			if (status !== "approved")
				return interaction.reply({
					content: `The suggestion must be approved to be implemented.`,
					ephemeral: true,
				});

			let embed = new EmbedBuilder()
				.setTitle(`New Suggestion`)
				.setColor(config.colors.implemented)
				.setFooter({
					text: `Suggestion ID: ${sugID} | Implemented`,
					iconURL: bot.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setDescription(
					`<@${user.id}> submitted a new suggestion.\n\n\`\`\`${suggestion}\`\`\``
				);

			await channel.messages.fetch(message).then(async (m) => {
				await m.edit({ embeds: [embed] });
			});

			let doc = await Schema.findOneAndUpdate(
				{ token: sugID, guild: interaction.guild.id },
				{ status: "implemented" }
			);

			return interaction.reply({
				content: `Suggestion has been implemented! https://discord.com/channels/${interaction.guild.id}/${channel.id}/${message}`,
				ephemeral: true,
			});
		} else return;
	},
};
