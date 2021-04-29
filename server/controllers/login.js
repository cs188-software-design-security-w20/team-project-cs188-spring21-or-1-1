const User = require("../models/user").User;
const mongoose = require('mongoose');
const jstoken = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();


//Login section 
/*
method - Post 
login 
*/

//find user with mongoose medium
async function getUser(User, email){
	let user = await User.findOne({email});
	return user;
}

function hasUser(user){
	if(!user){
		return res.status(400).json({message: "we dont have this user"});
	}
}

//uses password hash function for password verification 
async function isMatch(password, user){
	if((await bcrypt.compare(password, user.password)))
		return true;
	else 
		return false; 
}

function hasError(req){
	if(!verification(req).isEmpty()){
		return true;
	}

	return false;
}

router.post(
	"../../Prject/Work.I.O-Frontend/signIn",
	[

	],

	//error checker
	async (req, res) => {
		if(hasError(req))
			return res.status(400).json({err: err.array()});

		const {email, password} = req.body;
		try{
			user = getUser(User, email);
			hasUser(user);
			//cyption verification done 
			if(!isMatch()){
				res.status(400).json({message: "Invalid password"});
			}

			// token tbc



		}catch(err){
			console.error(err);
			//Internal server error 
			res.status(500).json({message: "server is having some difficulties"});
		}		
	}
);

module.exports = router;		
