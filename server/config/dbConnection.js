const mongoose = require('mongoose');

const localDBurl = "mongodb://127.0.0.1:27017/workout-users" //database url 


const MongoServer = async() =>{	
	try{
		await mongoose.connect(localDBurl, {useNewUrlParser: true, useUnifiedTopology: true });

		const db = mongoose.connection
		db.once('open', _ => {
			console.log("MongoDB initiated");
		});

		db.on('error', err =>{
			console.log("MongoDB initiation failed");
		});		
	} catch(e){
		//console.log(e);
		throw e;
	}

};

module.exports = MongoServer;
