const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

const REQUIRE_PREVIEW = false;
// true if a song must have a preview_url to be in the database

// create data schema
const matchSchema = {
  winner: String,
  loser: String,
  abstain: Boolean,
  sentTime: Date,
  received: Date,
  headers: String,
}

const Match = mongoose.model("Match", matchSchema, 'matches');

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
    matches: Array,
    title: String,
    artist: String,
    album: String,
    preview_url: String,

    /*
    array listing all matches
    includes abstain matches
    does not include initial rating
    */
}

const Ratings = mongoose.model("Ratings", ratingsSchema, 'ratings');

app.use(express.static(__dirname)); // access other files in this directory

const MATCHUP_PAGE = "./songmash";

app.get(MATCHUP_PAGE, function(req, res){
  // console.log("Directory: " + __dirname);
  res.sendFile(__dirname + "./songmash.html");
})

app.get("./", function(req, res){
  res.redirect(MATCHUP_PAGE);
})

const STANDINGS_PAGE = "./standings";
const RATINGS_DATA_URL = "./ratings";

app.get(STANDINGS_PAGE, function(req, res){
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "POST", RATINGS_DATA_URL, false ); // false for synchronous request
  // xmlHttp.setRequestHeader("Content-Type", "application/json");
  // xmlHttp.send( JSON.stringify(ratings) );

  // fetch(RATINGS_DATA_URL, {
  //   method: "post",
  //   body: JSON.stringify(ratings),
  //   headers: new Headers({
  //       "Content-Type": "application/json",
  //     }),
  // });

  res.sendFile(__dirname + "./standings.html");
})

app.get(RATINGS_DATA_URL, function(req, res){
  // let ratings = await Ratings.find().exec();
  // res.json(ratings);
  console.log("Attempting to load ratings from mongodb"); 
  if(REQUIRE_PREVIEW){
    Ratings.find({
      "preview_url": {"$exists": true},
      "$expr": {"$gt" : [{"$strLenCP": "$preview_url"}, 1]}
    }).then((ratings) => res.json(ratings));
  } else {
    Ratings.find().then((ratings) => res.json(ratings));
  }

})

app.get("./ids", function(req, res){
  // let ratings = await Ratings.find().exec();
  // res.json(ratings);
  Ratings.find({}, "_id").then((ratings) => res.json(ratings));


})

// app.get("/songmash.html", function(req, res)){
//
// }

app.post("./match", function(req, res){
  console.log("POST request received")
  // console.log(JSON.stringify(req.headers.origin));
  try {
    // console.log(req.sjdkls.djksl); // force an error to ensure catch works
    receiveMatch(req.body, req.headers);
    res.status(200).send("Match Received");
  } catch (error){
    res.status(500).send(error);
  }

});

function receiveMatch(body, headers){
  // json is the request body
  let newMatch = new Match({
    winner: body.winner,
    loser: body.loser,
    abstain: body.abstain,
    sentTime: body.time,
    received: Date.now(),
    headers: JSON.stringify(headers),
  });
  newMatch.save();//.then((match) => {
    updateRatings(newMatch); // Promise
  // }).catch((err) => console.log("Error when saving new match: " + err));
  // if(!req.body.abstain){

  // }
}

// async function receiveMatch(req, res){
//
//     // the "/..." doesn't really matter, just has to match the one in spotify.js
//     // console.log("POST request received successfully with data: " + JSON.stringify(req.body));
//     /*
//     POST header:
//     {"host":"localhost:8000","content-type":"application/json",
//     "origin":"http://localhost:8000","accept-encoding":"gzip, deflate",
//     "cookie":"_ga=GA1.1.1953034411.1632319817; _gid=GA1.1.1217338670.1632319817",
//     "connection":"keep-alive","accept":"star/star","user-agent":"Mozilla/5.0
//     (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)
//     Version/14.0 Safari/605.1.15","referer":"http://localhost:8000/",
//     "content-length":"89","accept-language":"en-us"}
//     "content-type":"X-www-form-urlencoded"
//     */
//     // const data = JSON.parse(req.body);
//     let newMatch = new Match({
//       winner: req.body.winner,
//       loser: req.body.loser,
//       abstain: req.body.abstain,
//       sentTime: req.body.time,
//       received: Date.now()
//     });
//     newMatch.save();
//     // UNCOMMENT THE PREVIOUS LINE TO SEND DATA TO MONGODB
//     // res.redirect("/");
//
//     if(!req.body.abstain){
//       // this runs if the match was not an abstention
//       let newRatings = new Ratings ({
//         ratings: [],
//         updated: Date.now()
//       });
//       console.log("Ratings update initiated");
//       await updateRatings(req.body.winner, req.body.loser, newRatings); // async
//       // console.log("Ratings length: " + newRatings.ratings.length);
//       console.log("Ratings update in progress");
//       if(newRatings.ratings.length >= 0){
//         newRatings.save();
//       }
//       console.log("Ratings updated successfully");
//     }
//
// }

// async function updateRatings(winner, loser, newRatings){
//   let ratingsData = (await Ratings.find({'ratings.0':{'$exists': true}}
//     ).sort({_id: -1}).limit(1))[0]; // get old ratings from mongodb
//   // let str = JSON.stringify(ratingsData);
//   // console.log(str);
//   // ratingsData = JSON.parse(str);
//   // console.log("Ratings data: " + ratingsData);
//   // console.log("Old ratings[0]: " + oldRatings[0]);
//   // console.log("Old ratings updated: " + ratingsData.updated);
//   // console.log("Type of ratings: " + typeof(ratingsData.ratings));
//   // console.log("Old ratings id: " + ratingsData._id);
//   // console.log("Old ratings type: " + typeof(oldRatings));
//   // ratingsData.ratings = eloMath(winner, loser, ratingsData.ratings);
//   // console.log(ratingsData.ratings);
//   // console.log(JSON.stringify(ratingsData.ratings.filter(d => d.rating != 0)));
//   // ratingsData.updated = Date.now();
//   // return ratingsData;
//   // console.log("Ratings length: " + ratingsData.ratings.length);
//   newRatings.ratings = eloMath(winner, loser, ratingsData.ratings);
// }

function updateRatings(match){
  let winner = match.winner;
  let loser = match.loser;
  let abstain = match.abstain;
  getRatings(winner, loser).then((oldRatings) => {
    // console.log("Old ratings: " + JSON.stringify(oldRatings));
    if(!abstain){
      if(oldRatings.winner.rating === undefined){
        oldRatings.winner.rating = 0;
      }
      if(oldRatings.loser.rating === undefined){
        oldRatings.loser.rating = 0;
      }

      let newRatings = eloMath(oldRatings.winner.rating, oldRatings.loser.rating);
      updateRating(oldRatings.winner, match, newRatings.winner);
      updateRating(oldRatings.loser, match, newRatings.loser);
    } else {
      updateAbstain(oldRatings.winner, match);
      updateAbstain(oldRatings.loser, match);
    }
  }); // promise
}

function updateAbstain(rating, match){
  if(rating.win === undefined){
    rating.win = 0;
  }
  if(rating.loss === undefined){
    rating.loss = 0;
  }
  if(rating.abstain === undefined){
    rating.abstain = 0;
  }

  rating.abstain += 1;
  rating.matches.push(match);
  return rating.save().catch((err) => {
    console.log("Error when saving abstain rating " + err);
  }); // Promise
}

function updateRating(rating, match, newRate){
  // 'rating' here is a Rating object

  // let rating = await Ratings.findOne({id: id});
  rating.rating = newRate;
  try {
    if(rating.histRate === undefined){
      rating.histRate = [0, newRate];
    } else {
      rating.histRate.push(newRate);
    }

  } catch (error) {
    console.log(error);
    console.log("Rating object: " + JSON.stringify(rating));
  }
  if(rating.matches === undefined){
    rating.matches = [match];
  } else {
    rating.matches.push(match);
  }

  if(rating.win === undefined){
    rating.win = 0;
  }
  if(rating.loss === undefined){
    rating.loss = 0;
  }
  if(rating.abstain === undefined){
    rating.abstain = 0;
  }

  if(rating._id === match.winner){
    rating.win += 1;
  } else {
    rating.loss += 1;
  }
  return rating.save().catch((err) => {
    console.log("Error when saving rating " + err);
  }); // Promise
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
  let winRate = await Ratings.findOne({_id: winner}).exec(); // Promise?
  let loseRate = await Ratings.findOne({_id: loser}).exec();
  return {
    winner: winRate,
    loser: loseRate
  };
}

// function getRating(id, ratings){
//   // console.log(typeof(ratings));
//   // console.log("Type of ratings: " + typeof(ratings));
//   // console.log("Filter: " + JSON.stringify(ratings.filter(d => d.id == id)));
//   let obj = (ratings.filter(d => d._id === id)[0]);
//   if(typeof(obj) === 'undefined'){
//     console.log("Unable to find record for ID " + id);
//   }
//   return obj.rating;
// }
// RewriteRule (.*) http://localhost:3000/$1 [P,L]
// function setRating(id, rate, ratings){
//   (ratings.filter(d => d._id === id)[0]).rating = rate;
// }

const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
  console.log("server is running on port " + PORT);
  // console.log(app);
  // console.log("secret value is " + process.env.SECRET);
})
