
const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const queryProfile = require('./controllers/profile').queryProfile
const login = require('./controllers/login'); // for login 
const port = 4000
const plans = require('./controllers/plans')
const seeder = require('./config/seed')
var router = require("express").Router();

require("./config/dbConnection")();//open the mongo db 

seeder().catch(error => console.log(error.stack));

app.use(bodyParser.json())

const express = require('express')
const path = require('path')

app.use('/css',express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(__dirname + '/view/Frontend'));

app.get('/', (req, res) => {
    res.sendFile('signIn.html',{root:'view/Frontend'});
});

app.use("/",router);

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

// login controller wired, not done yet.
app.use("/login", login); 

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
