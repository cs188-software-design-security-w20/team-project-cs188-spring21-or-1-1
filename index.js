

/* Get environment variables */
require('dotenv').config()

/* Core modules */
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const https = require('https')
const fs = require('fs')

/* Controller modules */

const profileController = require('./controllers/profile')
// const loginController = require('./controllers/login'); // for login 
const planController = require('./controllers/plans')
const workoutController = require('./controllers/workouts')
const registrationController = require('./controllers/register')

/* Security modules */
const sessionModule = require('./security/session.js')
const pwModule = require('./security/pswModule.js')



/* DB Configuration */
const seeder = require('./config/seed')

require("./config/dbConnection")();//open the mongo db 
seeder().catch(error => console.log(error.stack));




/* Express Middleware */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.set('view engine', 'ejs') // Necessary for rendering ejs
app.set('views', path.join(__dirname, 'view'))

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

app.post('/login',pwModule.pswVerification, sessionModule.createSession); 
//verify password within createSession 
//put the password ver

// login controller wired, not done yet.
//app.use("/login", login); 

app.get('/', sessionModule.authenticateSession, profileController.queryProfile)
app.get('/profile', sessionModule.authenticateSession, profileController.queryProfile)
app.get('/profile/:username', sessionModule.authenticateSession, profileController.queryUser)

// NOTE: Please check out controllers/profile.js for how to get your
//       code to work line-by-line, it has to do with async/await
//       and its worth the investment trying to figure out why profile.js
//       works so you can write your own controllers in a way that works for Node
app.get('/register', (req, res)=>{
	console.log("getting the signUp");
	res.sendFile('signUp.html', {root: 'view/Frontend'});
});
// May refactor this later, handling responses should probably be here and not in the controller
app.post('/register', registrationController.registerUser)

//app.use('/plans', sessionModule.authenticateSession)
app.get('/plans/:planId', planController.getPlan)
app.post('/plans', planController.createPlan)
app.put('/plans/:planId', planController.editPlan)
app.delete('/plans/:planId',planController.deletePlan)

//This is getting messy. Will deal with clean up later.
app.get('/plans/:planId/:workoutId', workoutController.getWorkout)
app.post('/plans/:planId', workoutController.createWorkout)
app.put('/plans/:planId/:workoutId', workoutController.editWorkout)
app.delete('/plans/:planId/:workoutId', workoutController.deleteWorkout)



/* Server Start Up */
const port = 443 // HTTPS Only
https.createServer({
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH)
}, app).listen(port, () => {
    console.log(`Listening at port ${port}`)
})

/* Uncomment this for old, unsecure server */
/*const port = 8080
app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})*/
