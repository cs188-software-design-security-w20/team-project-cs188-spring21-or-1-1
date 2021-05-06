

/* Core modules */

const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

/* Controller modules */

const profileController = require('./controllers/profile')
// const loginController = require('./controllers/login'); // for login 
const planController = require('./controllers/plans')
const registrationController = require('./controllers/register')

/* Security modules */
const sessionModule = require('./security/session.js')



/* Configuration */
const port = 8080
const seeder = require('./config/seed')

require("./config/dbConnection")();//open the mongo db 
seeder().catch(error => console.log(error.stack));




/* Express Middleware */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/css',express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(__dirname + '/view/Frontend'));

//app.use('/static', express.static(path.join(__dirname, 'static')))


/* Route Handlers */

app.get('/login', (req, res) => {
	console.log("getting the login ");
    res.sendFile('signIn.html',{root:'view/Frontend'});
});

app.post('/login', sessionModule.createSession); //verify password within createSession

// login controller wired, not done yet.
//app.use("/login", login); 

app.get('/profile', sessionModule.authenticateSession, profileController.queryProfile)

// NOTE: Please check out controllers/profile.js for how to get your
//       code to work line-by-line, it has to do with async/await
//       and its worth the investment trying to figure out why profile.js
//       works so you can write your own controllers in a way that works for Node

// May refactor this later, handling responses should probably be here and not in the controller
app.post('/register', registrationController.registerUser)

//app.use('/plans', sessionModule.authenticateSession)
app.get('/plans/:planId', planController.getPlan)
app.post('/plans', planController.createPlan)
app.post('/plans/:planId', planController.editPlan)
app.delete('/plans/:planId',planController.deletePlan)

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})
