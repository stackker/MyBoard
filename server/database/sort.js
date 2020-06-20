/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
const MongoClient = require('mongodb').MongoClient;

const agg = [
    {
      '$sort': {
        'messageDate': 1, 
        'threadID': 1, 
        'parentID': 1, 
        '_id': 1
      }
    }, {}
  ];
  
 MongoClient.connect(
    'process.env.MONGO_CONNECTION_STRING',
    { useNewUrlParser: true, useUnifiedTopology: true },
    function(connectErr, client) {
      // assert.equal(null, connectErr);
      const coll = client.db('messagesDB').collection('messages');
      coll.aggregate(agg, (cmdErr, result) => {
        // assert.equal(null, cmdErr);
      });
      client.close();
   });
    
