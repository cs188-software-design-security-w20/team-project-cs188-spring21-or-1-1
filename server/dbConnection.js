const mongoose = require('mongoose');

const localDBurl = "" //database url 



const MongoServer = async() =>{
	try{
		await mongoose.connect(url, {useNewUrlParser: true});
		const db = mongoose.connection
		db.once('open', _ => {
			console.log("MongoDB initiated");
		});

		db.on('error', err =>{
			console.log("MongoDB initiation failed");
		});		
	} catch(e){
		console.log(e);
		throw e;
	}
};


module.exports = MongoServer;