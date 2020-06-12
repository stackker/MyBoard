const express = require('express')
const setupV2Routes = require('./setupV2Routes')
// const database = require('../database/inMemory')
const database = require('../database/inMongo')

const Router = express.Router

const setupV1Routes = (apiRouter) => {

  // Controller Functions
  function findAllPosts(request, response) {
    database.findAllPosts()
      .then((posts) => response.send(posts))
      .catch((error) => response.send(error))
  }

  function addNewPost(request, response) {
    database.addPost(request.body)
    .then(() => response.sendStatus(200))
    .catch((error) => response.send(error))
  }

  function addNewReply(request, response) {
    console.log("addNewReply:",request.body)
    database.processReply(request.body)
    .then(() => response.sendStatus(200))
    .catch((error) => response.send(error))
  }


//----not working-----maybe not needed >>>
  function getAllID4Message(request,response) {
    console.log("BODY:",request.body)
    database.getAllID4Message(request.body.id) // <<needs work here
    .then(() => response.sendStatus(200))
    .catch((error) => response.send(error))
  }
//----not working-----maybe not needed <<<


  //----------
  function addNewUser(request, response) {
    database.addUser(request.body)
    .then(() => response.sendStatus(200))
    .catch((error) => response.send(error))
  }

  async function basicAuth(request, response, next) {
    // check for basic auth header
    const noAuth = !request.headers.authorization
    if (noAuth || request.headers.authorization.indexOf('Basic ') === -1) {
        return response.status(401).json({ message: 'Missing Authorization Header' });
    }

    // decode username and password
    const base64Credentials = request.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [uname, pword] = credentials.split(':');
    

    // check username and password against database
    let user = await database.checkUserNameAndPassword(uname, pword)
    if (user) {
      request.user = user
      // console.log(`${Date.now()}:User ${user._id} ${user.lname} Validated`)
      return (
      response
      
      // .cookie('access_token',  user, {
      //   expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
      // })
        // .redirect("../../fe/index.html")
       .send("../../fe/index.html" )
      )
      // return next()  <<--activate for JWT
      // return user
      } else {
        return response.status(401).json({ message: 'Basic Authentication failed: Invalid username or password.' });
    }
}

  //----------

  // Routing
  const v1Router = Router()
  v1Router.get('/posts', findAllPosts)
  v1Router.post('/addPost', addNewPost)
  v1Router.post('/addUser', addNewUser)
  v1Router.post('/getIDs', getAllID4Message) //Sunil
  v1Router.post('/postReply', addNewReply)  //Sunil
  v1Router.post('/login', basicAuth)  //Sunil


  apiRouter.use('/v1', v1Router)
};

const apiRouter = Router()
setupV1Routes(apiRouter)
setupV2Routes(apiRouter)

module.exports = apiRouter
