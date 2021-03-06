

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
const subscribeController = require('./controllers/subscribe')
const userController = require('./controllers/users')

/* Security modules */
const sessionModule = require('./security/session.js')
const pwModule = require('./security/pswModule.js')
const helmet = require('helmet')
const csrf = require('csurf')

// Setup middleware
var csrfProtection = csrf({ cookie: true })

/* DB Configuration */
//const seeder = require('./config/seed')

require("./config/dbConnection")();//open the mongo db 
//seeder().catch(error => console.log(error.stack));




/* Express Middleware */

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.set('view engine', 'ejs') // Necessary for rendering ejs
app.set('views', path.join(__dirname, 'view'))

app.use('/css',express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
//app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use(express.static(__dirname + '/view/Frontend'));

//app.use('/static', express.static(path.join(__dirname, 'static')))


/* Route Handlers */

app.get('/login', csrfProtection, (req, res) => {
    console.log("getting the login ");
    res.render('Frontend/signIn',{root:'view/Frontend', csrfToken: req.csrfToken()});
});

app.post('/login', csrfProtection, pwModule.pswVerification, sessionModule.createSession); 
//verify password within createSession 
//put the password ver

// login controller wired, not done yet.
//app.use("/login", login); 

app.get('/', sessionModule.authenticateSession, profileController.queryProfile)

app.get('/logout',(req, res, next) => {
	console.log("logging out");
	next();
	res.redirect('/login');
	
},pwModule.logout );

app.get('/profile/:username', sessionModule.authenticateSession, profileController.queryUser)

// Added this for getting to see all registered users
app.get('/users', sessionModule.authenticateSession, userController.queryUsers)

// NOTE: Please check out controllers/profile.js for how to get your
//       code to work line-by-line, it has to do with async/await
//       and its worth the investment trying to figure out why profile.js
//       works so you can write your own controllers in a way that works for Node
app.get('/register', csrfProtection, (req, res)=>{
	console.log("getting the signUp");
	res.render('Frontend/signUp', {root: 'view/Frontend', csrfToken: req.csrfToken()});
});
// May refactor this later, handling responses should probably be here and not in the controller
app.post('/register', csrfProtection, registrationController.registerUser)

//app.use('/plans', sessionModule.authenticateSession)
app.get('/plans/:planId/:action?', sessionModule.authenticateSession, planController.getPlan)
app.get('/plans/:action?', sessionModule.authenticateSession, (req, res) => { if (req.query.action == "create") {res.status(200).render('createPlan')}})
app.post('/plans', sessionModule.authenticateSession, planController.createPlan)
app.post('/plans/:planId', sessionModule.authenticateSession, planController.editPlan)
//delete workaround
app.post('/delete/:planId',sessionModule.authenticateSession, planController.deletePlan)

app.get('/workouts/:planId/:workoutId/:action?', sessionModule.authenticateSession, workoutController.getWorkout)
app.get('/workouts/:planId/:action?', sessionModule.authenticateSession, (req, res) => {
    if (req.query.action == "create") {return res.status(200).render('createWorkout', {planId: req.params.planId})}})
app.post('/workouts/:planId', sessionModule.authenticateSession, workoutController.createWorkout)
app.post('/workouts/:planId/:workoutId', sessionModule.authenticateSession, workoutController.editWorkout)
//delete workaround
app.post('/delete/:planId/:workoutId', sessionModule.authenticateSession, workoutController.deleteWorkout)

// subscribe routes
app.post('/subscribe/:username', sessionModule.authenticateSession, subscribeController.subscribe)

// unsubscribe routes
app.post('/unsubscribe/:username', sessionModule.authenticateSession, subscribeController.unsubscribe)

// search get request
app.get('/search', csrfProtection, (req, res) => {
    console.log("getting search page")
    res.render('Frotnend/search', {root: 'view/Frontend', csrfToken: req.csrfToken()})
})
app.post('/search', csrfProtection, sessionModule.authenticateSession, planController.queryPlans)

/* Server Start Up */
const port = 443 // HTTPS Only
https.createServer({
   key: fs.readFileSync(process.env.KEY_PATH),
   cert: fs.readFileSync(process.env.CERT_PATH)
}, app).listen(port, () => {
   console.log(`Listening at port ${port}`)
})

/* Uncomment this for old, unsecure server */
// const port = 8080
// app.listen(port, () => {
//     console.log(`Listening at port ${port}`)
// })