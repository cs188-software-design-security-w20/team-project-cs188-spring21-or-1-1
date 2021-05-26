const mongoose = require('mongoose')
const User = require('../models/user.js').User
const sessionModule = require('../security/session.js')

async function subscribe(req, res) {
    try {
	    let username = await sessionModule.getUserByToken(req.cookies.token)
        let subscribeTo = req.params.username
        let user = await User.exists({'username':username})
        if (!user) {
        	return res.send("ERROR: User does not exist")
        }
        if (username == subscribeTo) {
            return res.send("ERROR: You cannot subscribe to yourself")
        }
        console.log(subscribeTo)
        let cur_user = await User.findOne({'username':username})
        let subscribe_list = cur_user.subscribedTo
        console.log(subscribe_list)
        // check if already subscribed
        const index = subscribe_list.indexOf(subscribeTo)
        if(index <= -1) {
            subscribe_list.push(subscribeTo)
            User.findOneAndUpdate({'username':username}, {'subscribedTo':subscribe_list}, (err, user) => {
                if(err) {
                    res.send({message:err.toString()})
                }
            })
        }        
        let subscribed_user = await User.findOne({'username':subscribeTo})
        let subscriber_list = subscribed_user.subscribers
        // check if already subscribed
        const index2 = subscriber_list.indexOf(username)
        if(index2 <= -1) {
            subscriber_list.push(username)
            User.findOneAndUpdate({'username':subscribeTo}, {'subscribers':subscriber_list}, (err, user) => {
                if(err) {
                    res.send({message:err.toString()})
                }
            })
        }        
        
        return res.status(201).send("Subscibed Successfully")
    } catch (err) {
	    console.log(err)
	    res.send("ERROR: User does not exist")
    }    
}

exports.subscribe = subscribe
