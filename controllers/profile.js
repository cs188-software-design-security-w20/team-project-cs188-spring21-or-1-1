const mongoose = require('mongoose')
const User = require('../models/user.js').User

async function queryProfile(req, res) {
    try {
	let profile = await User.findOne({ 'username': req.params.username })
	res.send(profile)
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }    
}

exports.queryProfile = queryProfile
