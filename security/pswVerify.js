//1. commit : create a function same hash function as Peter does 
const bcrypt = require('bcrypt')

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


//2. commit: psw verification 




