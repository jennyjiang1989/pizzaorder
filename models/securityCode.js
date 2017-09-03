var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SecurityCodeSchema = new Schema({
    phone: {type: String, index: {unique: true, dropDups: true }},
    code: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SecurityCode', SecurityCodeSchema);
