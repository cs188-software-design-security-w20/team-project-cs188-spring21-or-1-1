const mongoose = require('mongoose')
const User = require('../models/user').User
const Plan = require('../models/workout_plan').Workout_Plan

module.exports = async function run() {
    await mongoose.connection.dropDatabase();
  
    await User.create({ username: 'Hunter', password: 'password123', email: 'hunter123@ymail.com' });
    await User.create({ username: 'Blake', password: 'password123', email: 'b@kr.ru' });
  
    await Plan.create({ username: 'Blake', planId: '12345', name: 'back workout' });
    await Plan.create({ username: 'Hunter', planId: '123456', name: 'chest workout' });
  }


