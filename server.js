const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

const uri = "mongodb+srv://mattkalin:B%40s3-ball@songmash.xy9qe.mongodb.net/SongMash?retryWrites=true&w=majority";
// you need %40 instead of @

mongoose.connect(uri);

// create data schema
const matchSchema = {
  winner: String,
  loser: String,
  sentTime: Date,
  received: Date
}

const Match = mongoose.model("Match", matchSchema, 'matches2');

app.use(express.static(__dirname)); // access other files in this directory

app.get("/", function(req, res){
  // console.log("Directory: " + __dirname);
  res.sendFile(__dirname + "/songmash.html");
})

// app.get("/songmash.html", function(req, res)){
//
// }

app.post("/match", function(req, res){
  // the "/..." doesn't really matter, just has to match the one in spotify.js
  console.log("POST request received successfully with data: " + JSON.stringify(req.body));
  /*
  POST header:
  {"host":"localhost:8000","content-type":"application/json",
  "origin":"http://localhost:8000","accept-encoding":"gzip, deflate",
  "cookie":"_ga=GA1.1.1953034411.1632319817; _gid=GA1.1.1217338670.1632319817",
  "connection":"keep-alive","accept":"star/star","user-agent":"Mozilla/5.0
  (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)
  Version/14.0 Safari/605.1.15","referer":"http://localhost:8000/",
  "content-length":"89","accept-language":"en-us"}
  "content-type":"X-www-form-urlencoded"
  */
  // const data = JSON.parse(req.body);
  let newMatch = new Match({
    winner: req.body.winner,
    loser: req.body.loser,
    sentTime: req.body.time,
    received: Date.now()
  });
  newMatch.save();
  // UNCOMMENT THE PREVIOUS LINE TO SEND DATA TO MONGODB
  res.redirect("/");
})

app.listen(8000, function() {
  console.log("server is running on port 8000");
})
