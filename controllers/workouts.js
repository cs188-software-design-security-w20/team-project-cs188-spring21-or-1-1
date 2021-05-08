var ObjectID = require('mongodb').ObjectID
const mongoose = require('mongoose')
const { Workout, validate } = require('../models/workout')
const Workout_Plan = require('../models/workout_plan').Workout_Plan
const User = require('../models/user').User
const sessionModule = require('../security/session')

getWorkout = async function(req, res) {
    try {
        //find user from session token
        let username = await sessionModule.getUserByToken(req.cookies.token)
        if (!username) {
            console.log("getUserByToken failed")
            return res.status(401).send("Not logged in");
        }
        //query workout object
        let workout = await Workout.findById(req.params.workoutId)
        if (!workout) { 
            console.log("find workout failed")
            return res.status(404).send("Not Found")
        }
        //check if user is authorized to read said workout object
        let valid = await validateReadPrivelege(username, workout)
        if (!valid) {
            console.log("Not allowed to view")
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

createWorkout = async function(req, res) {
    try {
        let workout = req.body
        let username = await sessionModule.getUserByToken(req.cookies.token)
        if (!username) {
            console.log("getUserByToken failed")
            return res.status(401).send("Not logged in");
        }
        let plan = await Workout_Plan.findOne({'planId' : parseInt(req.params.planId)})
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        //set planId to the planId parameter [so they dont set thier own planId]
        workout.planId = req.params.planId
        if (username != plan.username) {
            res.status(401)
            res.send("ERROR: Attempted to edit another user's workout plan")
        }
        // Check if input matches schema
        const {error, value} = validate(workout);
        if (error) {
            return res.status(422).json({error});
        }
        //Good to go
        Workout.create(workout, (err, workout) => {
            if (err) {
                res.status(400) 
                return res.send({message: err.toString()});
            }
            //TODO: add workout id to workout_plan object's workouts array
            res.status(201).send(workout)
        })

    } catch (err) {
        console.log(err)
        res.send({message: err.toString()})
        
    }
}

editWorkout = async function(req, res) {
    try {
        let updated_workout = req.body
        let username = await sessionModule.getUserByToken(req.cookies.token)
        if (!username) {
            console.log("getUserByToken failed")
            return res.status(401).send("Not logged in");
        }
        let plan = await Workout_Plan.findOne({'planId' : parseInt(req.params.planId)})
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        //set planId to the planId parameter [so they dont set thier own planId]
        updated_workout.planId = req.params.planId
        if (username != plan.username) {
            res.status(401)
            res.send("ERROR: Attempted to edit another user's workout plan")
        }
        // Check if input matches schema
        const {error, value} = validate(updated_workout);
        if (error) {
            return res.status(422).json({error});
        }
        //Good to go
        Workout.updateOne({"_id" : ObjectID(req.params.workoutId)}, { $set: updated_workout }, (err, workout) => {
            if (err) {
                res.status(400) 
                return res.send({message: err.toString()});
            }

            res.status(200).send(workout)
        })

    } catch (err) {
        console.log(err)
        res.send({message: err.toString()})
        
    }
}

deleteWorkout = async function(req, res) {
    try {
        let username = await sessionModule.getUserByToken(req.cookies.token)
        if (!username) {
            console.log("getUserByToken failed")
            return res.status(401).send("Not logged in");
        }
        let plan = await Workout_Plan.findOne({'planId' : parseInt(req.params.planId)})
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        if (username != plan.username) {
            res.status(401)
            res.send("ERROR: Attempted to edit another user's workout plan")
        }
        //TODO: Remove workout _id from Workout Plan's workout array
        Workout.deleteOne({"_id" : ObjectID(req.params.workoutId)}, (err) => {
            if (err) {
                res.status(400) 
                return res.send({message: err.toString()});
            }
            res.status(200).send("Workout Deleted")
        })

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

function isSubscribedTo(username, creator) {
    return false
}

 module.exports = {
    getWorkout,
    createWorkout,
    editWorkout,
    deleteWorkout
 };