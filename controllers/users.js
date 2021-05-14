const mongoose = require('mongoose')
const User = require('../models/user.js').User
const sessionModule = require('../security/session.js')

async function queryUsers(req, res) {
    try {
	let users = await User.find({})
	console.log('GOT USERS: ', users)
	res.render('usersTemplate', {
	    users: users
	})
    } catch (err) {
	console.log(err)
	res.send("ERROR: User does not exist")
    }    
}

exports.queryUsers = queryUsers
