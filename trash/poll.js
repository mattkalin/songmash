const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
// also import other schemas
const Match = requrie("./Match");


router.get("/", (req, res) => {
  window.alert("GET request received successfully");

})

// new match added
router.post("/poll", (req, res) => {
  window.alert("Data received successfully");
  Match.findOne({ server: req.session.server, status: "open"}).sort({ time: -1}).then(latest => {
    // update ratings


    const newMatch = {
      winId: req.body.winId,
      loseId: req.body.loseId,
      outcome: req.body.loseId,
      time: Date.now(),
      server: req.body.server,
      ratings: newRatings // this is created/updated above
    };

    new Match(newMatch).save().then((match) => {
      pusher.trigger("ratings-" + match.server, "ratings-vote", {
        winId: match.winId,
        loseId: match.loseId,
        outcome: match.outcome,
        time: match.time,
        ratings: match.ratings
      });
      return res.json({
        success: true,
        message: "Match processed successfully"
      });
    });
  });
});
