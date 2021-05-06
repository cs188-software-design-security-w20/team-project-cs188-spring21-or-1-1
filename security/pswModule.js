//1. commit : create a function same hash function as Peter does 
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require("../models/user.js").User


function hashGen(user, saltRounds){
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if(err){
			console.log(err);
			return res.status(422).json({err});
		}else{
			bcrypt.has(user.password, salt, function(err, hash){
				if(err){
					console.log(err);
	                return res.status(422).json({err});
				}else {
	                    user.password = hash;
	                    await user.save(function (err, user) {
	                        if (err) {
	                            console.log("Error inserting into database");
	                            res.status(422).json({err});
	                    }
                        console.log(user.username + " added to the database");
                        console.log(user.email + " email added to the database");
                        res.send("User successfully registered");
                        res.redirect('/login')
	            })
			}
		})
	   }
	})
}

//2. commit: psw verification 

function pswVerification(req, res, next){
	try{
		let user = await User.findOne({'username': req.body.username})
		if(!user){
			res.redirect('/login');
			console.log("no username found");
			return
		}
		//salt = user.salt;
		psw = req.body.password

		if((await bcrypt.compare(psw, user.password)))
			next()
		else {
			res.redirect('/login'); 
			console.log("incorrect password");
		}

	}catch(err){
		console.log(err)
		res.redirect('/login');
	}
}




