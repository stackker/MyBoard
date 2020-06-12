// require ("dotenv").config()

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

function processReply(post) {
    return connect()
      .then((db) => {
      let messages = db.collection('messages')
      findOnePostsWith(post.parentID)
     
        // .then((post) => messages.findOne({ _id: post.parentID }))
        .then((readMessage) => {
          let upDatedPost = {
            "threadID": readMessage.threadID,
            "parentID": readMessage.parentID,
            ...readMessage   // << needs correction
          }
          // return addReply(upDatedPost)
        })
    
      })
  .catch((err)=>{console.log(err)})
}

function addReply(post) {
  return connect()
    .then((db) => {
      let messages = db.collection('messages')
      return messages.insertOne(post)
        .then((insertResult) => messages.findOne({_id: insertResult.insertedId}))
    })
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

//Sunil
function findOnePostsWith(id, table) {
  return connect()
  // .then((db) => db.collection(table).find({ _id: id }).toArray())
  .then((db) => db.collection(table).findOne({ _id: id }))
    .catch((err)=>console.log(err))
}


function getAllID4Message(messageID) {
  console.log("MessageID:",messageID)
  return connect()
          .then((db)=>{
            let messages = db.collection("messages")
            return messages.findOne({_id:messageID.id})
                   .then((row)=>{
                     const {_id, threadID, parentID}= row;
                     let output = {_id:_id, "threadID":threadID, "parentID":parentID}
                     return output;
                   })
                   .then((output)=>{ 
                     console.log("IDs:",output);
                       output})
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


async function checkUserNameAndPassword(username, password) {
  // find the user
  // const user = users.find(u => u.username === username);
  const userRecord = await getuserInfoFromDB(username);
  try {
    if (userRecord) {
      // const { userInfo_base64, ...restofUserRecord } = userRecord
      let  userInfo_base64 = userRecord.userInfo_base64
  
      const credentials = Buffer.from(userInfo_base64, 'base64').toString('ascii');
      const [uname, pword] = credentials.split(':');

      //add bck passwordinto User info for least disruption in avlb code
      let user = { "password": pword, userRecord }

  
      // check if the password is good
      let passwordIsCorrect = user && user.password === password;
      if (passwordIsCorrect) {
        const { password, ...userWithoutPassword } = user; // Rest operator - Takes the rest of the user object besides password.
        return userWithoutPassword;
      }
    }
  } catch{(err) => console.log(err) }
}
    
function getuserInfoFromDB(username) {
  return findOnePostsWith(username, "users")
}



//_______________
module.exports = {
  clear,
  addPost,
  findAllPosts,
  updatePost,
  close,
  addUser,
  getAllID4Message,
  processReply,
  checkUserNameAndPassword
}
