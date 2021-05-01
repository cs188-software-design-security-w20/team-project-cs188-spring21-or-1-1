const mongoose = require('mongoose')
const User = require('../models/user.js').User

function queryProfile(username) {
    User.findOne({ 'username': username }, (err, user) => {
	if (err || !user)
	    return false
	return user
    })
}

exports.queryProfile = queryProfile
