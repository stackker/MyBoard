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

  function getAllID4Message(request,response) {
    console.log("BODY:",request.body)
    database.getAllID4Message(request.body.id) // <<needs work here
  }

  //----------
  function addNewUser(request, response) {
    database.addUser(request.body)
    .then(() => response.sendStatus(200))
    .catch((error) => response.send(error))
  }

  //----------

  // Routing
  const v1Router = Router()
  v1Router.get('/posts', findAllPosts)
  v1Router.post('/addPost', addNewPost)
  v1Router.post('/addUser', addNewUser)

  apiRouter.use('/v1', v1Router)
};

const apiRouter = Router()
setupV1Routes(apiRouter)
setupV2Routes(apiRouter)

module.exports = apiRouter
