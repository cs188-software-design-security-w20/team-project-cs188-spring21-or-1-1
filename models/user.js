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
    subscribers: [ String ],
    subscribedTo:[ String ], 
    favorites: [ Number ]
}));

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().max(30).required(),
        password: Joi.string().min(8).max(30).required()
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]){10,}"))
            .error(new Error("A password must be at least 10 characters, 1 lowercase letter, contain at least 1 special character, and at least 1 number")),
        salt: Joi.number().optional(),
        email: Joi.string().max(100).min(5).required().email(),
        height: Joi.number().min(0).max(500).required().error(new Error("height must contain only numbers in cm")),
        weight: Joi.number().min(0).max(1000).required().error(new Error("weight must contain only numbers in kg")),
        fitnessLevel: Joi.string().min(0).max(300).optional(),
        dob: Joi.date().optional().required(),
        subscribers: Joi.array().items(Joi.string().optional()).optional().sparse(),
        subscribedTo: Joi.array().items(Joi.string().optional()).optional().sparse(),
        favorites: Joi.array().items(Joi.number().optional()).optional().sparse()
    }).unknown();

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
