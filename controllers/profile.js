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
	/*let subscribers = []
	try {
	    subscribers = await User.find({ 'subscribedTo' : { $in : [username] }})
	} catch (err) {}
	console.log(profile, plans)*/
	res.render('homeTemplate', {
	    username: username,
	    email: profile.email,
	    height: profile.height,
	    weight: profile.weight,
	    dob: profile.dob,
	    plans: plans,
	    subscribers: profile.subscribers,
	    subscribedTo: profile.subscribedTo
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
	let cur_username = await sessionModule.getUserByToken(req.cookies.token)
	let not_subscribed = true
    if (profile.subscribers.indexOf(cur_username) > -1) {
        not_subscribed = false
    }
	let plans = []
	try {
	    plans = await Plan.find({ 'username': username })
	} catch (err) {}
	console.log(profile)
	res.render('profileTemplate', {
	    username: username,
	    plans: plans,
            not_subscribed: not_subscribed
	})
	
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }
}

exports.queryProfile = queryProfile
exports.queryUser = queryUser
