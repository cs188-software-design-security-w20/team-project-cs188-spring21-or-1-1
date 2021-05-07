const mongoose = require('mongoose')
const Workout = require('../models/workout').Workout
const User = require('../models/user').User
const sessionModule = require('../security/session')

exports.getWorkout = async function(req, res) {
    try {
        let username = await sessionModule.getUserByToken(req.cookies.token)
        let workout = await Workout.findOne({'workoutId' : req.params.workoutId})
        //authorize user:
        //if public (0), skip authorization
        //if private (1), compare username with username of workout
        //if subscribers only (2), get user object (username) and check if 
        //workout owner exists in list SubscribedTo
        let valid = await validateReadPrivelege(username, workout)
        if (!valid) {
            res.status(401)
            return res.send("Not authorized") //create ejs for error page.
        }
        //user authorized, okay to send workout object
        res.send(workout)
    } catch (err) {
        console.log(err)
        res.send({message: err.toString()})
    }
}

exports.createWorkout = async function(req, res) {
    try {
        let workoutInfo = req.body
        let username = await sessionModule.getUserByToken(req.cookies.token)
        let plan = await Workout.findOne({'planId' : req.params.planId})
        if (!plan) { 
            res.status(400)
            return res.send("ERROR: Plan does not exist")
        }
        if (username != plan.username) {
            res.status(401)
            res.send("Not authorized")
        }


    } catch (err) {
        console.log(err)
        res.send({message: err.toString()})
        
    }
}

//username is the username of the session owner.
async function validateReadPrivelege (username, object) {
    let privacy = object.privacy
    switch(privacy) {
        case 0:
            return true
            break
        case 1: //private
            if (username != object.username) {
                return false
            } else {
                return true
            }
            break
        case 2: //subscribers only
            if (username == object.username) { //check if user is the owner
                return true
            }
            let subscribed = await isSubscribedTo(username, object.username)
            if (!subscribed) {
                return false
            }
            break
        default:
            return false
    }
}



async function isSubscribedTo(username, creator) {
    return false
}