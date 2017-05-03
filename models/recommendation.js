/**
 * Created by omer on 2.05.2017.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecommendationsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    users: [],
    tweets: [],
    words: [{ type: String, required: false }],
    create_at: { type: Date, default: Date.now }
});

var Recommendation = mongoose.model('Recommendation', RecommendationsSchema);
module.exports = Recommendation;