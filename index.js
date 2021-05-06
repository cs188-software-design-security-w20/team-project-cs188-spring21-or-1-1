

/* Core modules */

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

/* Controller modules */

const profileController = require('./controllers/profile')
// const loginController = require('./controllers/login'); // for login 
const planController = require('./controllers/plans')
const registrationController = require('./controllers/register')

/* Security modules */

// Issues for these are still out




/* Configuration */
const port = 8080
const seeder = require('./config/seed')

require("./config/dbConnection")();//open the mongo db 
seeder().catch(error => console.log(error.stack));




/* Express Middleware */

app.use(bodyParser.json())

app.use('/css',express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(__dirname + '/view/Frontend'));




/* Route Handlers */

app.get('/login', (req, res) => {
    res.sendFile('signIn.html',{root:'view/Frontend'});
});

// login controller wired, not done yet.
//app.use("/login", login); 

// Need to build around session tokens later, but rn just returns schema of user
app.get('/profile/:username', profileController.queryProfile)

// NOTE: Please check out controllers/profile.js for how to get your
//       code to work line-by-line, it has to do with async/await
//       and its worth the investment trying to figure out why profile.js
//       works so you can write your own controllers in a way that works for Node

// May refactor this later, handling responses should probably be here and not in the controller
app.post('/register', registrationController.registerUser)


app.get('/plans/:planId', planController.getPlan)
app.post('/plans', planController.createPlan)
app.post('/plans/:planId', planController.editPlan)
app.delete('/plans/:planId',planController.deletePlan)

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})
