const mongoose = require('mongoose')
const User = require('../models/user').User
const Plan = require('../models/workout_plan').Workout_Plan
const Workout = require('../models/workout').Workout

module.exports = async function run() {
    //await mongoose.connection.dropDatabase();
  
    await User.create({ username: 'Hunter', password: 'password123', email: 'hunter123@ymail.com' });
    await User.create({ username: 'Blake', password: 'password123', email: 'b@kr.ru' });
    await User.create({ username: 'Crimson', password: '$2b$10$OlseAEX2SeOEBB61oedYruaA50j9ArSejqFfQLtj9QyNbLLPJxHwS', email: 'e@gmail.com',
      height: "100", weight: "1000"})
  
    await Plan.create({ username: 'Blake', name: 'back workout plan' });
    await Plan.create({ username: 'Hunter', name: 'chest workout plan' });
    await Plan.create({ username: 'Crimson', name: 'leg workout plan', description: "A workout plan designed for beginners", type:"cardio", privacy: "1"});

    await Workout.create({ username: 'Crimson', planId: '12345', name: 'workout 1', privacy: '1'})
  }


