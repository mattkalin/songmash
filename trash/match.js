// based on Mat's Count.js
// https://github.com/mhsmathew/covid-headcount-tracker/blob/master/models/Count.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  winId: {
    type: String,
    required: true,
  },
  loseId: {
    type: String,
    required: true,
  },
  outcome: {
    /*
    let's use the following:
    true: winner beat loseer
    false: user abstained from this match
    */
    type: Boolean,
    required: true,
  },
  // oldRate0: {
  //   type: Number,
  //   required: false,
  // },
  // oldRate1: {
  //   type: Number,
  //   required: false,
  // },
  // newRate0: {
  //   type: Number,
  //   required: false,
  // },
  // newRate1: {
  //   type: Number,
  //   required: false,
  // },
  time : {
    type: Date,
    required: true,
  },
  server: {
    type: String,
    required: true,
    default: "test"
  },
  ratings {
    // json containing ids and ratings of songs in the system 
    type: String,
    required: false
  }

});

// create collection and add schema
const Match = mongoose.model("Match", MatchSchema);
module.exports = Match;
