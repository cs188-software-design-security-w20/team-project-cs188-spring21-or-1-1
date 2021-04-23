const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // consider setting min length for username
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
    },
    salt: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    height: {
        type: Number,
        min: 0,
        max: 500
    },
    weight: {
        type: Number,
        min: 0,
        max: 1000
    },
    fitnessLevel: {
        type: String,
        minlength: 0,
        maxlength: 300
    },
    dob: {
        type: Date
    },
    subscribers: {
        type: Number,
        minlength: 0
    },
    subscribedTo:[ String ], 
    favorites: [ Number ]
}));

function validateUser(user) {
    const schema = {
        username: Joi.string().max(30).required(),
        password: Joi.string().min(8).max(100).required(),
        salt: Joi.number(),
        email: Joi.string().max(100).min(5).required().email(),
        height: Joi.number().min(0).max(500),
        weight: Joi.number().min(0).max(1000),
        fitnessLevel: Joi.string().min(0).max(300),
        dob: Joi.date(),
        subscribers: Joi.number().min(0),
        subscribedTo: Joi.array().items(Joi.string()),
        favorites: Joi.array().items(Joi.number())
    };
    return validateUser(user, schema);
}

exports.User = User;
exports.validate = validateUser;

