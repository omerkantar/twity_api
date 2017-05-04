/**
 * Created by omer on 2.05.2017.
 */





var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    screen_name: { type: String,  index: { unique: true }},
    description: { type: String, required: false },
    analysis: {
        tweets: [],
        favorities: []
    },
    recommendations: [{ type: Schema.Types.ObjectId, ref: 'Recommendation', required: false  }],
    create_at: { type: Date, default: Date.now }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

