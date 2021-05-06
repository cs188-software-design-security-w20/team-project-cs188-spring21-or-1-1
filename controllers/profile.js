const mongoose = require('mongoose')
const User = require('../models/user.js').User
const sessionModule = require('../security/session.js')

async function queryProfile(req, res) {
    try {
	let username = await sessionModule.getUserByToken(req.cookies.token)
	let profile = await User.findOne({ 'username': username })
	console.log(profile)
	res.send(profile)
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }    
}

exports.queryProfile = queryProfile
