const mongoose = require('mongoose')
const { User, validate } = require('../models/user.js')
const bcrypt = require('bcrypt')
const saltRounds = 10;

exports.registerUser = async function (req, res) {
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
    let duplicate = await User.findOne({ username: req.body.username });
    if (duplicate != null) {
        return res.status(400).send("That username already taken!");
    }
    
    // Generate password salt
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if ( err ) {
            console.log(err);
            return res.status(422).json({err});
        }
        else {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    return res.status(422).json({err});
                }
                else {
                    user.password = hash;
                    user.save(function (err, user) {
                        if (err) {
                            console.log("Error inserting into database");
                            res.status(422).json({err});
                        }
                        console.log(user.username + " added to the database");
                        console.log(user.email + " email added to the database");
                        res.send("User successfully registered");
                    })
                }
            })
        }
    })

    
}