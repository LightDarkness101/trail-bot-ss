const { model, Schema } = require(`mongoose`);

let suggestionSchema = new Schema({
    message: String,
    token: Number,
    suggestion: String,
    user: String,
    guild: String,
    status: String,
});

module.exports = model('suggestions', suggestionSchema);