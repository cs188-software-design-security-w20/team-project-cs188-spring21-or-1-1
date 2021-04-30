const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const queryProfile = require('./controllers/profile').queryProfile
const port = 8080
const plans = require('./controllers/plans')
const registration = require('./controllers/register')
const seeder = require('./config/seed')

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true})

seeder().catch(error => console.log(error.stack));

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send(
  `
  HELLO! Server Up & Running :)<br/>
  Try this command to test POST requests work too:<br/>
  curl --header "Content-Type: application/json"   --request POST   --data '{"username":"xyz","password":"xyz"}'   http://localhost:8080
  `
  )

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

// May refactor this later, handling responses should probably be here and not in the controller
app.post('/register', registration.registerUser)

app.get('/plans/:planId', plans.getPlan)
app.post('/plans', plans.createPlan)


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
