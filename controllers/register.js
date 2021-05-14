const mongoose = require('mongoose')
const { User, validate } = require('../models/user.js')
const pswMaker = require('../security/pswModule.js')
const bcrypt = require('bcrypt')
const saltRounds = 10;

exports.registerUser = async function (req, res) {
    console.log("calling the controller");
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        weight: req.body.weight,
        height: req.body.height,
        dob: req.body.dob
    })
    
    // Check if input matches schema
    const { error, value } = validate(user);
    console.log(value);
    if ( error ) {
        console.log(error);
        return res.status(422).send(error.message);
    }

    // Check if existing user is in the database
    let duplicate = await User.findOne({ username: req.body.username });
    if (duplicate != null) {
        return res.status(400).send("That username already taken!");
    }
    
    // Generate password salt for security I moved this to the security module
    if(pswMaker.hashGen(user,saltRounds))
        res.redirect('/login');

}