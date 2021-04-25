const app = require('express')()
const bodyParser = require('body-parser')
const port = 8080

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
