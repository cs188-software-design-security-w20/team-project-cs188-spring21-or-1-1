const mongoose = require('mongoose')
const Workout_Plan = require('../models/workout_plan').Workout_Plan
const User = require('../models/user').User
//TODO: All functions in this module require token authentication

exports.getPlan = function (req, res) {
    Workout_Plan.findOne({ 'planId': req.params.planId }, (err, plan) => {
        if (err) {
            res.send("Error retreiving workout plan")
            return false
        }
        if (plan) {
            res.send(plan)
            return
        }
        res.send("ERROR: Workout Plan does not exist")
    })    
}

exports.getPlansByDifficulty = function(difficulty) {
    Workout_Plan.find({ 'difficulty': difficulty }, (err, plans) => {
        if (err || !plans) {
            return false
        }
        return plans
    })    
}

exports.getPlansByName = function(name) {
    Workout_Plan.find({ 'name': name }, (err, plans) => {
        if (err || !plans) {
            return false
        }
        return plans
    })    
}

exports.createPlan = function (req, res, next) {
    let planInfo = req.body
    //set planId to unique number id here.
    Workout_Plan.create(planInfo, (err, plan) => {
        if (err) {
            res.status(400) //bad request
            return res.send({message: err.toString()});
        }
        res.status(201)
        res.send("Workout Plan Created")
    })
    //redirect to home page?
}


async function editPlan (req, res, next) {
    let planInfo = req.body
    let planId = req.params.planId
    let username = req.body.username // to be changed: get uername from session info

    //add username to planInfo	
    planInfo.planId = planId 
    
	if (!validateWorkoutPlan(planInfo)) {
		res.status(400)
		return res.send("Invalid Workout Plan!")
	}

	let valid = await validateUserPrivilege(planId, username, 'w')
	console.log(valid)
	if (!valid){
		res.status(400)
		return res.send("Not authorized")
	}
	
	Workout_Plan.updateOne({'planId': planId}, planInfo, (err, plan) => {
        if (err) {
            res.status(400) //bad request
            return res.send({message: err.toString()});
        }
        res.status(201)
        res.send("Workout Plan Edited")
    })
}

async function deletePlan(req, res, next) {
    let planId = req.params.planId
    let username = req.body.username // to be changed: get uername from session info
	let valid = await validateUserPrivilege(planId, username, 'w')
	console.log(valid)
	if (!valid){
		res.status(400)
		return res.send("Not authorized")
	}
	Workout_Plan.deleteOne({'planId':planId, 'username':username}, (err) => {
        if (err) {
            res.status(400) //bad request
            return res.send({message: err.toString()});
        }
        res.status(201)
        res.send("Workout Plan Deleted")
	})

}

async function validateUserPrivilege (planId, username, privilege) {
	let user = await User.exists({'username':username})
	if (!user) {
		return false
	}
	let plan = await Workout_Plan.findOne({'username':username,'planId':planId})
	if (!plan) {
		return false
	}
	return true
}

function validateWorkoutPlan (planInfo) {
    const {error, value} = Workout_Plan.validate(planInfo)
    if (error) {
		console.log(error)
    	return false
	} 
	return true
}

exports.editPlan = editPlan
exports.deletePlan = deletePlan
