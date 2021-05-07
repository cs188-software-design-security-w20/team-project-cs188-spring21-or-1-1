const Joi = require('joi');
const mongoose = require('mongoose');

const Workout = mongoose.model('Workout', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 30
    },
    planId: {
        type: Number,
        required: true,
    },
    workoutId: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 5000
    },
    type: {
        type: String,
        minlength: 0,
        maxlength: 100
    },
    difficulty: {
        type: Number,
        min: 0,
        max: 10
    },
    bodyParts: {
        type: [ String ]
    },
    workouts: {
        type: [ Number ]
    },
    privacy: {
        type: Number,
        min: 0,
        max: 2
    }
}));

function validateWorkout(workout) {
    const schema = {
        username: Joi.string().required().max(30),
        planId: Joi.number().required(),
        workoutId: Joi.number().required(),
        description: Joi.string().min(0).max(5000),
        type: Joi.string().min(0).max(100),
        difficulty: Joi.number().min(0).max(10),
        bodyParts: Joi.array().items(Joi.string()),
        workouts: Joi.array().items(Joi.number()),
        privacy: Joi.number().min(0).max(2)
    };
    return validateWorkout(workout, schema);
}

exports.Workout = Workout;
exports.validate = validateWorkout;