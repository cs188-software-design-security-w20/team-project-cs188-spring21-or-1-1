const Joi = require('joi');
const mongoose = require('mongoose');

const Session = mongoose.model('Session', new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    username: {
	type: String,
	required: true,
	unique: true
    },
    createdAt: {
	type: Date,
	expires: '1m',
	default: Date.now()
    }
}));

function validateSession(session) {
    const schema = Joi.object({
        token: Joi.string().required(),
        username: Joi.string().min(8).max(100).required(),
    }).unknown();

    return schema.validate(user);
}

exports.Session = Session
exports.validate = validateSession
