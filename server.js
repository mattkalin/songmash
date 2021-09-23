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
  abstain: Boolean,
  sentTime: Date,
  received: Date
}

const Match = mongoose.model("Match", matchSchema, 'matches2');

const ratingsSchema = {
  // ratings: Array,
  // updated: Date,
  // latest: Boolean

    _id: String, // the song's spotify id
    rating: Number, // current rating
    win: Number, // number of wins
    loss: Number, // number of losses
    abstain: Number, // number of abstains
    histRate: Array, // array listing all ratings for this song
    matches: Array
    /*
    array listing all matches
    includes abstain matches
    does not include initial rating
    */
}

const Ratings = mongoose.model("Ratings", ratingsSchema, 'ratings');

app.use(express.static(__dirname)); // access other files in this directory

app.get("/", function(req, res){
  // console.log("Directory: " + __dirname);
  res.sendFile(__dirname + "/songmash.html");
})

// app.get("/songmash.html", function(req, res)){
//
// }

app.post("/match", function(req, res){
  console.log("POST request received")
  receiveMatch2(req, res);
});

function receiveMatch2(req, res){
  let newMatch = new Match({
    winner: req.body.winner,
    loser: req.body.loser,
    abstain: req.body.abstain,
    sentTime: req.body.time,
    received: Date.now()
  });
  newMatch.save();
  // if(!req.body.abstain){
    updateRatings2(req.body.winner, req.body.loser, newMatch, req.body.abstain);
  // }
}

async function receiveMatch(req, res){

    // the "/..." doesn't really matter, just has to match the one in spotify.js
    // console.log("POST request received successfully with data: " + JSON.stringify(req.body));
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
      abstain: req.body.abstain,
      sentTime: req.body.time,
      received: Date.now()
    });
    newMatch.save();
    // UNCOMMENT THE PREVIOUS LINE TO SEND DATA TO MONGODB
    // res.redirect("/");

    if(!req.body.abstain){
      // this runs if the match was not an abstention
      let newRatings = new Ratings ({
        ratings: [],
        updated: Date.now()
      });
      console.log("Ratings update initiated");
      await updateRatings(req.body.winner, req.body.loser, newRatings); // async
      // console.log("Ratings length: " + newRatings.ratings.length);
      console.log("Ratings update in progress");
      if(newRatings.ratings.length >= 0){
        newRatings.save();
      }
      console.log("Ratings updated successfully");
    }

}

async function updateRatings(winner, loser, newRatings){
  let ratingsData = (await Ratings.find({'ratings.0':{'$exists': true}}
    ).sort({_id: -1}).limit(1))[0]; // get old ratings from mongodb
  // let str = JSON.stringify(ratingsData);
  // console.log(str);
  // ratingsData = JSON.parse(str);
  // console.log("Ratings data: " + ratingsData);
  // console.log("Old ratings[0]: " + oldRatings[0]);
  // console.log("Old ratings updated: " + ratingsData.updated);
  // console.log("Type of ratings: " + typeof(ratingsData.ratings));
  // console.log("Old ratings id: " + ratingsData._id);
  // console.log("Old ratings type: " + typeof(oldRatings));
  // ratingsData.ratings = eloMath(winner, loser, ratingsData.ratings);
  // console.log(ratingsData.ratings);
  // console.log(JSON.stringify(ratingsData.ratings.filter(d => d.rating != 0)));
  // ratingsData.updated = Date.now();
  // return ratingsData;
  // console.log("Ratings length: " + ratingsData.ratings.length);
  newRatings.ratings = eloMath(winner, loser, ratingsData.ratings);
}

async function updateRatings2(winner, loser, match, abstain){
  let oldRatings = await getRatings(winner, loser);
  if(!abstain){
    let newRatings = eloMath(oldRatings.winner.rating, oldRatings.loser.rating);
    await updateRating(oldRatings.winner, match, newRatings.winner);
    await updateRating(oldRatings.loser, match, newRatings.loser);
  } else {
    await updateAbstain(oldRatings.winner, match);
    await updateAbstain(oldRatings.loser, match);
  }

}

async function updateAbstain(rating, match){
  rating.abstain += 1;
  rating.matches.push(match);
  await rating.save();
}

async function updateRating(rating, match, newRate){
  // 'rating' here is a Rating object

  // let rating = await Ratings.findOne({id: id});
  rating.rating = newRate;
  rating.histRate.push(newRate);
  rating.matches.push(match);
  if(rating._id === match.winner){
    rating.win += 1;
  } else {
    rating.loss += 1;
  }
  await rating.save();
}

var ELO_WEIGHT = 50;

function eloMath(winRate, loseRate){
  // var winRate = getRating(winner, ratings);
  // var loseRate = getRating(loser, ratings);

  // console.log("Loser rating: " + loseRate);

  var expWpct = 1/(Math.pow(10, (loseRate - winRate)/400) + 1);

  var winNew = winRate + (1 - expWpct) * ELO_WEIGHT;
  var loseNew = loseRate - (1 - expWpct) * ELO_WEIGHT;

  // setRating(winner, winNew, ratings);
  // setRating(loser, loseNew, ratings);
  //
  // // console.log("Loser new rating: " + getRating(loser, ratings));
  //
  // return ratings;
  return {
    winner: winNew,
    loser: loseNew
  };
}

async function getRatings(winner, loser){
  let winRate = await Ratings.findOne({_id: winner}).exec();
  let loseRate = await Ratings.findOne({_id: loser}).exec();
  return {
    winner: winRate,
    loser: loseRate
  };
}

function getRating(id, ratings){
  // console.log(typeof(ratings));
  // console.log("Type of ratings: " + typeof(ratings));
  // console.log("Filter: " + JSON.stringify(ratings.filter(d => d.id == id)));
  let obj = (ratings.filter(d => d._id === id)[0]);
  if(typeof(obj) === 'undefined'){
    console.log("Unable to find record for ID " + id);
  }
  return obj.rating;
}

function setRating(id, rate, ratings){
  (ratings.filter(d => d._id === id)[0]).rating = rate;
}

app.listen(8000, function() {
  console.log("server is running on port 8000");
})
