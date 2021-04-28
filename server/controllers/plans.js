const mongoose = require('mongoose')
const Workout_Plan = require('../models/workout_plan').Workout_Plan
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