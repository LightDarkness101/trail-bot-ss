const { Events } = require("discord.js");
const mongoose = require("mongoose");
const mongodbURL = process.env.DATABASETOKEN;

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(bot) {
		console.log(`Bot ready and logged in as ${bot.user.tag}`);
		if (!mongodbURL) return;
		
		await mongoose.connect(mongodbURL || '', {
			keepAlive: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		if (mongoose.connect) {
			console.log(`The database is running.`)
		}
	},
}; //263456445566025728
