const mongoose = require('mongoose')
const User = require('../models/user.js').User
const Plan = require('../models/workout_plan.js').Workout_Plan
const sessionModule = require('../security/session.js')

async function queryProfile(req, res) {
    try {
	let username = await sessionModule.getUserByToken(req.cookies.token)
	let profile = await User.findOne({ 'username': username })
	let plans = []
	try {
	    plans = await Plan.find({ 'username': username })
	} catch (err) {}
	console.log(profile, plans)
	res.render('profileTemplate', {
	    username: username,
	    email: profile.email,
	    plans: plans
	})
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }    
}

async function queryUser(req, res) {
    try {
	let username = req.params.username
	let profile = await User.findOne({ 'username': username })
	let plans = []
	try {
	    plans = await Plan.find({ 'username': username })
	} catch (err) {}
	console.log(profile)
	res.render('profileTemplate', {
	    username: username,
	    plans: plans
	})
	
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }
}

exports.queryProfile = queryProfile
exports.queryUser = queryUser
