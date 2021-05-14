var ObjectId = require('mongodb').ObjectId
const mongoose = require('mongoose')
const Workout_Plan = require('../models/workout_plan').Workout_Plan
const Workout = require('../models/workout').Workout
const User = require('../models/user').User
const sessionModule = require('../security/session')


async function getPlan (req, res) {
    let plan = await Workout_Plan.findById(req.params.planId)
    if (!plan) {
		console.log("Workout plan not found")
		return res.status(401).send("Workout plan not found")
	}
	let username = await sessionModule.getUserByToken(req.cookies.token)
    if (!username) {
        console.log("getUserByToken failed")
        return res.status(401).send("Not logged in");
    }
	let valid = await validateUserPrivilege(req.params.planId, username, 'r')
	if(!valid) {
		console.log("Not allowed to view")
		return res.status(401).send("Not authorzed")
	}
	let action = req.query.action
	if (action == "edit") {
		res.status(200).render('editPlan', {plan: plan})
	} else if (action == "create") {
		res.status(200).render('createWorkout', {planId: plan._id})
	} else {
		res.status(200).render('viewPlan', {plan: plan})
	}
}

async function queryPlans(req, res) {

    let name_value = req.body.name
    let difficulty_value = parseInt(req.body.difficulty)

	console.log("(search) Name, Difficulty: ")
	console.log(name_value)
	console.log(difficulty_value)

    let plans = []
    query = {}

    if (name_value != "") {
        if (difficulty_value != 0) {
            query = { 'difficulty': difficulty_value, 'name': name_value }
        } else {
            query = { 'name': name_value }
        }
    } else {
        if (difficulty_value != 0) {
            query = { 'difficulty': difficulty_value}
        }
    }

    try {
        plans = await Workout_Plan.find(query)
    } catch (err) {console.log("ERROR: No workouts found for this difficulty")}

    console.log(plans)
    res.render('searchTemplate', {
        name: name_value,
        difficulty: difficulty_value,
        plans: plans
    })
}

async function createPlan(req, res, next) {
    let planInfo = req.body
	planInfo.username = await sessionModule.getUserByToken(req.cookies.token)
    if (!planInfo.username) {
        console.log("getUserByToken failed")
        return res.status(401).send("Not logged in");
    }
	planInfo.workouts = []
	
	if(!validateWorkoutPlan(planInfo)){
		return res.status(401).send("Invalid Workout Plan")
	}
    //set planId to unique number id here.
    Workout_Plan.create(planInfo, (err, plan) => {
        if (err) {
            res.status(400) //bad request
            return res.send({message: err.toString()});
        }
        res.status(201).redirect("/")
    })
}


async function editPlan (req, res, next) {
    let planInfo = req.body
    let planId = req.params.planId
	let username = await sessionModule.getUserByToken(req.cookies.token)
    if (!username) {
        console.log("getUserByToken failed")
        return res.status(401).send("Not logged in");
    }
    planInfo.username = username // to be changed: get uername from session info

	if (!validateWorkoutPlan(planInfo)) {
		res.status(400)
		return res.send("Invalid Workout Plan!")
	}

    delete planInfo.workouts //prohibit modifying workouts
	let valid = await validateUserPrivilege(planId, username, 'w')
	console.log(valid)
	if (!valid){
		res.status(400)
		return res.send("Not authorized")
	}
	Workout_Plan.findByIdAndUpdate(planId, planInfo, (err, plan) => {
        if (err) {
            res.status(400) //bad request
            return res.send({message: err.toString()});
        }
        res.status(201).redirect("/plans/" + planId)
    })
}

//TODO:delete everthing in one transaction
async function deletePlan(req, res, next) {
    let planId = req.params.planId
    let username = await sessionModule.getUserByToken(req.cookies.token)
    if (!username) {
        console.log("getUserByToken failed")
        return res.status(401).send("Not logged in");
    }
	let valid = await validateUserPrivilege(planId, username, 'w')
	console.log(valid)
	if (!valid){
		res.status(400)
		return res.send("Not authorized")
	}
	let plan = await Workout_Plan.findOne({'_id':ObjectId(planId)})
	if (!plan) {
		res.status(400)
		return res.send("Workout plan not found!")
	}
	workouts = plan.workouts
	console.log(workouts)
	workouts.forEach(workout => {
		console.log(workout)
		Workout.findByIdAndRemove(workout, (err) => {
        	if (err) {
            	res.status(400) //bad request
            	return res.send({message: err.toString()});
        	}
		})
	})
	Workout_Plan.findByIdAndRemove(planId, (err) => {
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

	let plan = await Workout_Plan.findOne({'_id':ObjectId(planId)})
	if (!plan) {
		return false
	}
	if(privilege == 'r'){
		if(plan.privacy == 0) {
			return true
		} else if (plan.privacy == 1) {
			return plan.username == username
		}
	} else if (privilege == 'w'){
		return plan.username == username
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

exports.getPlan = getPlan
exports.createPlan = createPlan
exports.editPlan = editPlan
exports.deletePlan = deletePlan

exports.queryPlans = queryPlans