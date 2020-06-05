const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_CONNECTION_STRING

if (uri === undefined) throw new Error('Missing required environment variable MONGO_CONNECTION_STRING')

let connectPromise
let client

// Promise of Database
function connect() {
  if (!connectPromise) {
    client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    connectPromise = new Promise((resolve, reject) => {
      client.connect(err => {
        if (err) return reject(err)
        resolve(client.db("messagesDb"))
      })  
    })
  }
  return connectPromise
}

function clear() {
  return connect()
    .then((db) => db.collection('messages').drop())
    .then((shouldBeTrue) => Promise.resolve())
    .catch((couldBeError) => Promise.resolve())
}

function addPost(post) {
  return connect()
    .then((db) => {
      let messages = db.collection('messages')
      return messages.insertOne(post)
        .then((insertResult) => messages.findOne({_id: insertResult.insertedId}))
        .then((readMessage) => {
          console.log("messageID:",readMessage)
          let threadParentID ={ _id:readMessage._id,"threadID":readMessage._id,
         "parentID":readMessage._id}
          updateID_OnMessage(threadParentID)  // added Sunil
         })

    })
}

function updateID_OnMessage(idDict) {
  console.log("idDict:", idDict)
  return connect()
    .then((db) => db.collection('messages').updateOne(
      { _id: idDict._id },
      {$set:
        {"threadID": idDict.threadID,
         "parentID": idDict.parentID}
      },
      
      { returnOriginal: false }
    ))
    .then((findAndModifyResult) => {findAndModifyResult.value
    // console.log("findAndModifyResult:",findAndModifyResult.result.nModified)
   
    })
}

function updatePost(messageWithNewContent) {
  return connect()
    .then((db) => db.collection('messages').findOneAndReplace(
      { _id: messageWithNewContent._id },
      messageWithNewContent,
      { returnOriginal: false }
    ))
    .then((findAndModifyResult) => findAndModifyResult.value)
}


function findAllPosts() {
  return connect()
    .then((db) => db.collection('messages').find({}).toArray())
}

function close() {
  return connect().then((db) => {
    connectPromise = undefined
    return client.close()
  })
}

function getAllID4Message(messageID){
  return connect()
          .then((db)=>{
            let messages = db.collection(messages)
            return messages.findOne({_id:messageID})
                   .then((row)=>{
                     const {_id, threadID, parentID}= row;
                     return {_id:_id, "threadID":threadID, "parentID":parentID}
                   })
                   .catch(err=>{console.log(err);
                                return err})

          })
}

//_______________

function addUser(user) {
  return connect()
    .then((db) => {
      let messages = db.collection('users')
      return messages.insertOne(user)
        .then((insertResult) => messages.findOne({_id: insertResult.insertedId}))
    })
}


//_______________
module.exports = {
  clear,
  addPost,
  findAllPosts,
  updatePost,
  close,
  addUser,
  getAllID4Message
}
