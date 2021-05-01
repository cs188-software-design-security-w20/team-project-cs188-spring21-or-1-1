const mongoose = require('mongoose')
const { User, validate } = require('../models/user.js')


// TODO(Peter): Create a function that will generate a salt upon user creation

exports.registerUser = function (req, res) {
    let user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    
    // Check if input matches schema
    const { error, value } = validate(user);
    console.log(value);
    if ( error ) {
        console.log(error);
        return res.status(422).json({error});
    }

    // Check if existing user is in the database
    let duplicate = User.findOne({ username: req.body.username });
    if (duplicate) {
        return res.status(400).send("That username already taken!");
    }

    user.save(function (err, user) {
        if (err) {
            console.log("Error inserting into database");
            res.status(422).json({err});
        }
        console.log(user.username + " added to the database");
        res.send("User successfully registered");
    })
}