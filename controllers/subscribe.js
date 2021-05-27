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
        if(!subscribed_user) {
            return res.send("ERROR: User does not exist!")
        }
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

async function unsubscribe(req, res) {
    try {
	    let cur_username = await sessionModule.getUserByToken(req.cookies.token)
        let unsubscribed_username = req.params.username
        let cur_user = await User.findOne({'username':cur_username})
        if(!cur_user) {
            return res.send("ERROR: User does not exist!")
        }
        let unsubscribed_user = await User.findOne({'username':unsubscribed_username})
        if(!unsubscribed_user){
            return res.send("ERROR: User does not exist!")
        }
        let subscribedTo_list = cur_user.subscribedTo
        const index = subscribedTo_list.indexOf(unsubscribed_username)
        if (index > -1) {
            subscribedTo_list.splice(index, 1)
            console.log(subscribedTo_list)
        } else {
            return res.send("ERROR: not subscribed to this user!")
        }
        let subscribers_list = unsubscribed_user.subscribers
        const index2 = subscribers_list.indexOf(cur_username)
        if (index2 > -1) {
            subscribers_list.splice(index2, 1)
        } else {
            return res.send("ERROR: Incoherent data, please contatct the admin")   
        }
        User.findOneAndUpdate({'username':unsubscribed_username}, {'subscribers':subscribers_list}, (err, user) => {
            if(err) {
                res.send({message:err.toString()})
            }
        })
        User.findOneAndUpdate({'username':cur_username}, {'subscribedTo':subscribedTo_list}, (err, user) => {
            if(err) {
                res.send({message:err.toString()})
            }
        })

        return res.status(201).send("Unsubscibed Successfully")

    } catch (err) {
        console.log(err)
        res.send("ERROR")
    }
}

exports.unsubscribe = unsubscribe
exports.subscribe = subscribe
