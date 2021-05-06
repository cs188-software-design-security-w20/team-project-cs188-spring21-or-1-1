const crypto = require('crypto')
const mongoose = require('mongoose')
const Session = require('../models/sessions.js').Session

async function authenticateSession(req, res, next) {
    try {
	let result = await Session.findOne({ 'token': req.cookies.token })
	if (!result) {
	    res.redirect('/login')
	    return
	}
	next()
    } catch (err) {
	console.log(err)
	res.redirect('/login')
    }
}

/*async function generateToken () {
    for (i = 0; i < 999; i++) {
	let token = crypto.randomBytes(64).toString('hex')
	if (await !Session.exists({ 'token': token }))
	    return token
    }
    return false
}*/

async function createSession(req, res) {
    try {
	let sessionID = crypto.randomBytes(64).toString('hex')//await generateToken()
	await Session.create({ token: sessionID, username: req.body.username })
	res.set({
	    "Set-Cookie": "token="+sessionID+"; HttpOnly",
	    "Access-Control-Allow-Credentials": "true"
	})
	res.redirect('/profile')
    } catch (err) {
	console.log(err)
	res.send(err)
    }
}

async function getUserByToken (id) {
    try {
	let doc = await Session.findOne({ token: id })
	console.log(doc)
	return doc.username
    } catch (err) {
	return false
    }
}

exports.authenticateSession = authenticateSession
exports.createSession = createSession
exports.getUserByToken = getUserByToken
