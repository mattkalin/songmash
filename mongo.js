// // var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// var url = "mongodb://127.0.0.1:27017/";

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mattkalin:B@s3-ball@songmash.xy9qe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

function updateRatings(winner, loser){
  // window.alert("This works");
}

/*
// The following code Update the document with the address "Valley 345" to
// name="Mickey" and address="Canyon 123":
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = { address: "Valley 345" };
  var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
  dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});
*/
