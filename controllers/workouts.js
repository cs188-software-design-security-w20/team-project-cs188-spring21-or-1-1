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
        //check to see if user is authorized to read the workout plan that this workout is in
        let plan = await Workout_Plan.findById(workout.planId)
        if (!plan) {
		    console.log("Workout plan not found")
		    return res.status(401).send("Workout plan not found")
	    } else {
            let valid = await validateReadPrivelege(username, plan)
            if (!valid) {return res.status(401).send("Not authorized to be viewing workoutPlan")}
            
        }

        //check if user is authorized to read said workout object
        let valid = await validateReadPrivelege(username, workout)
        if (!valid) {
            console.log("Not allowed to view")
            res.status(401)
            return res.send("Not authorized") 
        }
        //user authorized, okay to send workout object
        let action = req.query.action
	    if (action == "edit") {
            return res.status(200).render('editWorkout', {workout: workout})
        } else {
            return res.status(200).render('viewWorkout', {workout: workout})
        }
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
        let plan = await Workout_Plan.findById(req.params.planId)
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        //set planId to the planId parameter [so they dont set thier own planId]
        workout.planId = req.params.planId
        workout.username = username
        if (username != plan.username) {
            return res.status(401).send("ERROR: Attempted to edit another user's workout plan")
        }
        // Check if input matches schema
        const {error, value} = validate(workout);
        if (error) {
            return res.status(422).json({error});
        }
        //Good to go
        let created_workout = await Workout.create(workout)
        Workout_Plan.findByIdAndUpdate(req.params.planId, {$addToSet: {"workouts":created_workout._id}}, (err, plan) => {
            if (err) {
                res.status(400) //bad request
                return res.send({message: err.toString()});
            }
        })
        return res.status(201).redirect("/plans/" + workout.planId)

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
        let plan = await Workout_Plan.findById(req.params.planId)
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        //set planId to the planId parameter [so they dont set thier own planId]
        updated_workout.planId = req.params.planId
        if (username != plan.username) {
            res.status(401)
            return res.send("ERROR: Attempted to edit another user's workout plan")
        }
        // Check if input matches schema
        const {error, value} = validate(updated_workout);
        if (error) {
            return res.status(422).json({error});
        }
        //Good to go
        Workout.findByIdAndUpdate(req.params.workoutId, updated_workout, (err, workout) => {
            if (err) {
                res.status(400) 
                return res.send({message: err.toString()});
            }

            res.status(200).redirect("/workouts/" + req.params.planId + "/" + req.params.workoutId)
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
        let plan = await Workout_Plan.findById(req.params.planId)
        if (!plan) { 
            console.log("Plan does not exist")
            return res.status(400).send("ERROR: Plan does not exist")
        }
        if (username != plan.username) {
            res.status(401)
            return res.send("ERROR: Attempted to edit another user's workout plan")
        }

        Workout_Plan.findByIdAndUpdate(req.params.planId, {$pull : {"workouts":req.params.workoutId}}, (err, plan) => {
            if (err) {
                res.status(400) //bad request
                return res.send({message: err.toString()});
            }
        })

        Workout.findByIdAndRemove(req.params.workoutId, (err) => {
            if (err) {
                res.status(400) 
                return res.send({message: err.toString()});
            } 
        })
        return res.status(202).redirect("/plans/" + req.params.planId)

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
            return subscribed
            break
        default:
            return false
    }
}

async function isSubscribedTo(username, creator) {
    let user = await User.findOne({'username':username})
    if(!user){
        return false
    }
    console.log(user) 
    let index = user.subscribedTo.indexOf(creator)
    return (index > -1) || username == creator
}

 module.exports = {
    getWorkout,
    createWorkout,
    editWorkout,
    deleteWorkout
 };
