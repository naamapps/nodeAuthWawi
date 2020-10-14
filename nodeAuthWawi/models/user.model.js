const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    roles: [String],
    tempCredentials: {
        code: { type: String },
        validUntil: { type: Date }
    }
});

module.exports = mongoose.model('User', UserSchema);

