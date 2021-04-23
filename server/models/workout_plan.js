const Joi = require('joi');
const mongoose = require('mongoose');

const Workout_Plan = mongoose.model('Workout_Model', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        // consider setting min length for username
        maxlength: 30
    },
    planId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        minlength: 0,
        maxlength: 300,
        required: true
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

function validateWorkoutPlan(workout) {
    const schema = {
        username: Joi.string().required().max(30),
        planId: Joi.number().required(),
        name: Joi.string().min(0).max(300).required(),
        description: Joi.string().min(0).max(5000),
        type: Joi.string().min(0).max(100),
        difficulty: Joi.number().min(0).max(10),
        bodyParts: Joi.array().items(Joi.string()),
        workouts: Joi.array().items(Joi.number()),
        privacy: Joi.number()
    };
    return validateWorkoutPlan(workout, schema);
}

exports.Workout_Plan = Workout_Plan;
exports.validate = validateWorkoutPlan;