const mongoose = require('mongoose')
const User = require('../models/user').User
const Plan = require('../models/workout_plan').Workout_Plan
const Workout = require('../models/workout').Workout

module.exports = async function run() {
    await mongoose.connection.dropDatabase();
  
    await User.create({ username: 'Hunter', password: 'password123', email: 'hunter123@ymail.com' });
    await User.create({ username: 'Blake', password: 'password123', email: 'b@kr.ru' });
  
    await Plan.create({ username: 'Blake', planId: '12345', name: 'back workout plan' });
    await Plan.create({ username: 'Hunter', planId: '123456', name: 'chest workout plan' });

    await Workout.create({ username: 'Crimson', planId: '12345', name: 'workout 1', privacy: '1'})
  }


