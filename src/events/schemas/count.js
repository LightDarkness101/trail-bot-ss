const { model, Schema } = require(`mongoose`);

let guildSchema = new Schema({
    count: Number,
    guild: String,
});

module.exports = model('guild', guildSchema);