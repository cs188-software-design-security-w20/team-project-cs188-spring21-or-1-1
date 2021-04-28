<<<<<<< HEAD
const app = require('express')();
const bodyParser = require('body-parser');
const queryProfile = require('./controllers/profile').queryProfile;
const login = require('./controllers/login'); // for login 
const port = 4000;
=======
const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const queryProfile = require('./controllers/profile').queryProfile
const port = 8080
const plans = require('./controllers/plans')
const seeder = require('./config/seed')
>>>>>>> 6faf0d81e76689f9eddccf50108b7ba07239a846


<<<<<<< HEAD

require("./config/dbConnection")();//open the mongo db 

app.use(bodyParser.json());
=======
seeder().catch(error => console.log(error.stack));

app.use(bodyParser.json())
>>>>>>> 6faf0d81e76689f9eddccf50108b7ba07239a846

app.get('/', (req, res) => {
    res.send(
  `
  HELLO! Server Up & Running :)<br/>
  Try this command to test POST requests work too:<br/>
  curl --header "Content-Type: application/json"   --request POST   --data '{"username":"xyz","password":"xyz"}'   http://localhost:8080
  `
<<<<<<< HEAD
  ) 
=======
  )

>>>>>>> 6faf0d81e76689f9eddccf50108b7ba07239a846
});

app.post('/', (req, res) => {
    res.send(JSON.stringify(req.body, null, 2))
})

// Need to build around session tokens later, but rn just returns schema of user
app.get('/profile/:username', (req, res) => {
    let profile = queryProfile(req.params.username)
    if (profile) {
	res.send(profile)
	return
    }
    res.send("ERROR: Profile does not exist")
})

<<<<<<< HEAD
// login controller wired, not done yet.
app.use("/login", login); 
=======

app.get('/plans/:planId', plans.getPlan)
app.post('/plans', plans.createPlan)

>>>>>>> 6faf0d81e76689f9eddccf50108b7ba07239a846

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})

/* Steps to install:
   1. All you need installed for now is node and npm (node package manager)
   2. In this directory (./server) run 'npm install'.
      Now you should have a directory called 'node_modules' which contains 
      all the required packages above. 
   3. Run 'node index.js' and the server should say it's running on port 8080,
      you can run a GET request of localhost:8080 to check it's working properly
*/
