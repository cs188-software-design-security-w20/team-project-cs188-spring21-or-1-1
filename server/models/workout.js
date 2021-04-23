const Joi = require('joi');
const mongoose = require('mongoose');

const Workout = mongoose.model('Workout', new mongoose.Schema({
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
        min: 0
    }
}));

function validateWorkout(workout) {
    const schema = {
        planId: Joi.number().required(),
        workoutId: Joi.number().required(),
        description: Joi.string().min(0).max(5000),
        type: Joi.string().min(0).max(100),
        difficulty: Joi.number().min(0).max(10),
        bodyParts: Joi.array().items(Joi.string()),
        workouts: Joi.array().items(Joi.number()),
        privacy: Joi.number()
    };
    return validateUser(workout, schema);
}

exports.Workout = Workout;
exports.validate = validateWorkout;