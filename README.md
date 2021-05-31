# team-project-cs188-spring21-or-1-1
**Web App**: Work.I.O

## Project Description
Work.I.O: A website that helps you create and share your workout plans with the world, as well view other people’s workout plans. A workout plan is a text description of what exercises/movements a workout will contain, for how long, with what equipment, etc. There will be two distinct ways in which users will interact with the website. Workout creators will use our workout editor to create specialized workout plans and share them with the world. Workout consumers will use our search feature to find workout plans that best match their capabilities (difficulty, equipment constraints,etc.) and view them. Users will only be able to edit/delete workout plans that they created. Further, users can subscribe to workout creators they like to gain access to special content, if they are willing to pay a small fee.

This app is for individuals at any stage in their fitness journey. Possible users include:
Someone who is a beginner, and looking for a solid, tried and tested routine to get them started.
Someone who is bored of their current routine, and looking to push to the next level of difficulty.

Individual features
Users will be able to create an account on the website. They will also be able to login to this account using a password of their choice.
Users will be able to view their profile and make changes to their health bio-data (private information like weight, height, etc.)
Users will be able to access the workout plan creation page, create workout plans, and publish them.
Users will be able to search for public workout plans using the search bar and view them. 
Users will be able to subscribe to other users in order to access exclusive subscriber content (meal plans for instance).

## Walkthrough
Work.IO is currently deployed and can be accessed at https://workioucla.com. Alteratively, you can run the application locally by installing the following dependencies:
- **[Mongo DB Community Edition](https://docs.mongodb.com/manual/installation/)**
- **[Node](https://nodejs.org/en/)**

After you have installed these two dependencies, you can run `npm install` and then uncomment the following lines in `index.js` and use the command `node index.js`, which will run the app on http://localhost:8080.

    const port = 8080
    app.listen(port, () => {
    console.log(`Listening at port ${port}`)})
