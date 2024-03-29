// const mongo = require("../mongo");

function getSongInfo(id, token) {
  // this works

  var url = "https://api.spotify.com/v1/tracks/" + id;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.setRequestHeader("Authorization", "Bearer " + token.access_token);
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);


}

function getSpotifyToken(){
  // appears to be working!

  console.log("Getting Spotify token")

  var userID = "xu75up5apc30lijbveflhr5fq"
  var clientID = "c0f873e96499462dab95ca2ec86cc9ea"
  var clientSecret = "35f220698fce424e84190844c8691ff3"
  var url = "https://accounts.spotify.com/api/token"

  // 'use strict';
  // let buff = new Buffer(client_id + ':' + client_secret);
  // document.writeln("Getting token<br>")
  var auth = "Basic " + btoa(clientID + ":" + clientSecret); // pretty sure this is correct
  // songTable.innerHTML += auth);
  // clientID + ":" + clientSecret; // not sure about the colon :
  var body = "grant_type=client_credentials";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", url, false ); // false for synchronous request
  // document.writeln("Authorization: " + auth + "<br>")
  xmlHttp.setRequestHeader("Authorization", auth); //  error is here
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // document.writeln("Got token")
  xmlHttp.send( body );
  // document.write(xmlHttp.responseText + "<br>")
  var token = JSON.parse(xmlHttp.responseText);
  token.created_at = new Date();
  return token;


  // var request = require('request'); // "Request" library

  // var client_id = 'c0f873e96499462dab95ca2ec86cc9ea'; // Your client id
  // var client_secret = '35f220698fce424e84190844c8691ff3'; // Your secret
  //
  // // your application requests authorization
  // var authOptions = {
  //   url: 'https://accounts.spotify.com/api/token',
  //   headers: {
  //     'Authorization': 'Basic ' + btoa(clientID + ":" + clientSecret)
  //   },
  //   form: {
  //     grant_type: 'client_credentials'
  //   },
  //   json: true
  // };

  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "POST", url, false ); // false for synchronous request
  // xmlHttp.setRequestHeader("Content-Type", "application/json");
  // xmlHttp.onreadystatechange = function () {
  //   if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
  //       var json = JSON.parse(xmlHttp.responseText);
  //       // console.log(authOptions.email + ", " + json.password);
  //   }
  // };
  // var body = JSON.stringify(authOptions);
  // xmlHttp.send( body );
  // return xmlHttp.responseText;


  // request.post(authOptions, function(error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //
  //     // use the access token to access the Spotify Web API
  //     var token = body.access_token;
  //     var options = {
  //       url: 'https://api.spotify.com/v1/users/jmperezperez',
  //       headers: {
  //         'Authorization': 'Bearer ' + token
  //       },
  //       json: true
  //     };
  //     request.get(options, function(error, response, body) {
  //       console.log(body);
  //     });
  //   }
  // });

  // var clientID = "c0f873e96499462dab95ca2ec86cc9ea"
  // var clientSecret = "35f220698fce424e84190844c8691ff3"
  //
  //
  // // async authorize(){
  // let myHeaders = new Headers();
  // var auth = "Basic " + btoa(clientID + ":" + clientSecret); // pretty sure this is correct
  // myHeaders.append("Authorization", auth);
  // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  //
  // var urlencoded = new URLSearchParams();
  // urlencoded.append("grant_type", "client_credentials");
  //
  // const requestOptions = {
  //   method: 'POST',
  //   headers: myHeaders,
  //   body: urlencoded,
  //   redirect: 'follow'
  // }
  //
  // let res = await fetch("https://accounts.spotify.com/api/token", requestOptions);
  // var res2 = await res.json();
  // return res2.access_token;
  //   // }
}

function updateToken(token){
  /*
  check if token is expired
  if yes, return new token
  else, return old token
  */
  var now = new Date();
  if(now - token.created_at >= token.expires_in * 1000){
    return getSpotifyToken();
  } else {
    return token;
  }
}

function displaySongTable(ids, token){
  token = updateToken(token); // get new token if expired
  // ids is an array of spotify song ID
  var songsInfo = [];
  for(var i = 0; i < ids.length; i++){
    songsInfo[i] = getSongInfo(ids[i], token);
    // songsInfo[i] = ratings[i];
  }
  songTable = document.getElementById("songTable");
  tableStr = "";
  // document.write("<table>");
  tableStr += "<table>";
  /*
  rows
  album art
  vote
  preview
  title
  artist
  album
  */
  // album art
  tableStr += "<tr>";
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    tableStr += "<img class='album' src='" +
    songsInfo[i].album.images[0].url +
    "' width='50%' id='albumCover" + (i) + "' >";
    tableStr += "</td>";
  }
  tableStr += "</tr>";
  // albumCover.onclick = processVote;

  // title
  tableStr += "<tr>";
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    // document.write("Title: ")
    tableStr += songsInfo[i].name;
    tableStr += "</td>";
  }
  tableStr += "</tr>";

  // artist
  tableStr += "<tr>";
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    // document.write("Artist(s): ")
    for(var j = 0; j < songsInfo[i].artists.length; j++){
      if(j > 0){
        tableStr += ", ";
      }
      tableStr += songsInfo[i].artists[j].name;
    }
    tableStr += "</td>";
  }
  tableStr += "</tr>";

  // album
  tableStr += "<tr>";
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    // document.write("Album: ")
    tableStr += songsInfo[i].album.name;
    tableStr += "</td>";
  }
  tableStr += "</tr>";

  // spotify link
  var spotify;
  tableStr += '<tr>';
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    // document.write("Album: ")
    if(songsInfo[i].external_urls.spotify === null){
      spotify = "No Spotify link available"
    } else {
      spotify = "<a href='" + songsInfo[i].external_urls.spotify +
      "' target='_blank' rel='noopener noreferrer'>Listen on Spotify</a>"
    }
    tableStr += spotify;
    tableStr += "</td>";
  }
  tableStr += "</tr>";
  // tableStr += '<div class="mobile-display"><br><br><br><br></div>';
  // for(var i = 0; i < 5; i++){
  //   tableStr += '<br class="mobile-display">';
  // }

  // audio preview
  var audio;
  tableStr += "<tr>";
  for(var i = 0; i < ids.length; i++){
    tableStr += "<td>";
    // document.write("Album: ")
    if(songsInfo[i].preview_url === null){
      audio = "No audio preview available"
    } else {
      audio = "<audio controls >" + // width='15%' height='100'
      "<source src='" + songsInfo[i].preview_url +
      "'type='audio/mp3'>Your browser doesn't support html5 audio</audio>";
    }
    tableStr += audio;
    tableStr += "</td>";
  }
  tableStr += "</tr>";

  // document.write("<tr>");
  // for(var i = 0; i < ids.length; i++){
  //   document.write("<td>");
  //   // document.write("Album: ")
  //   document.write("<b onclick='processVote(" + ids[i] + ", [" + ids +
  //     "])'>Vote</b>");
  //   document.write("</td>");
  // }
  // document.write("</tr>");
  //
  tableStr += "</table>";
  songTable.innerHTML = tableStr;
  for(var i = 0; i < ids.length; i++){
    document.getElementById("albumCover" + (i)).onclick = function(){
      // document.write("Element id: " + this.id + "<br>");
      i = Number(this.id[this.id.length - 1]);
      // document.write(ids + "<br>");
      // document.write("i: " + i + "<br>");
      // document.write(ids[i] + "<br>");
      // document.write(ids[(i + 1) % 2] + "<br>");
      processVote(ids[i], ids[(i + 1) % 2]);
    };
  }
  document.addEventListener('play', pauseOtherAudio, true);
  // document.addEventListener('keydown', onKeyDown, false);
}

function pauseOtherAudio(e){
  var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
        }
    }
}

/*
removing this because it is unnecessary for mobile optimization
*/

// function onKeyDown(e){
//   switch (event.keyCode){
//     case 32: // space bar
//       pauseAllAudio(e);
//     break;
//   }
//   return false;
// }
//
// function pauseAllAudio(e){
//   var audios = document.getElementsByTagName('audio');
//     for(var i = 0, len = audios.length; i < len;i++){
//           audios[i].pause();
//     }
// }




// var ELO_WEIGHT = 50;
//
// function updateRatings(winner, loser){
//   ratingsJson = getRatingsData(); // might have changed
//   var winRate = getRating(winner);
//   var loseRate = getRating(loser);
//
//   var expWpct = 1/(Math.pow(10, (loseRate - winRate)/400) + 1);
//
//   var winNew = winRate + (1 - expWpct) * ELO_WEIGHT;
//   var loseNew = loseRate - (1 - expWpct) * ELO_WEIGHT;
//
//   document.write(winner + "<br>");
//   document.write(loser + "<br>");
//   document.write(ratingsJson.find(id => winner).rating + "<br>");
//   document.write(ratingsJson.find(id => loser).rating + "<br>");
//   updateRating(winner, winNew);
//   document.write(ratingsJson.find(id => winner).rating + "<br>");
//   document.write(ratingsJson.find(id => loser).rating + "<br>");
//   updateRating(loser, loseNew);
//   document.write(ratingsJson.find(id => winner).rating + "<br>");
//   document.write(ratingsJson.find(id => loser).rating + "<br>");
//
//   // write using RATINGS_URL
//
//
// }

function refreshTable(){
  ids = selectRandomIds(songList);
  displaySongTable(ids, token);
}

function selectRandomIds(data){
  // var driveUrl;
  // driveUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcz95gzMl5NYljq7f3SWnt3G8-LbknG8fSGe-MlK5-n5aeVO1TQezwJBFFMSUQPoLOaR9aG0t7s1A3/pub?gid=0&single=true&output=csv";
  // driveUrl = "https://doc-0g-3o-sheets.googleusercontent.com/pub/70cmver1f290kjsnpar5ku2h9g/mmqosm31297rd99bf5gepkn7u0/1631890710000/107443550707787196845/*/e@2PACX-1vTcz95gzMl5NYljq7f3SWnt3G8-LbknG8fSGe-MlK5-n5aeVO1TQezwJBFFMSUQPoLOaR9aG0t7s1A3?gid=0&single=true&output=csv"
  // numSongs = 2;
  // $.ajax({
  //   url: driveUrl,
  //   dataType: 'text',
  // }).done(parseCsv);
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "GET", driveUrl, false ); // false for synchronous request
  // xmlHttp.onreadystatechange = function() {
  //   // do nothing
  // }
  // xmlHttp.send( null );
  // var data = xmlHttp.responseText;
  // return parseCsv(data);

  // https://docs.google.com/spreadsheets/d/1YOWX_9lH2Jw4JlwW4PmQLEYbXcQq6fj-SVvuCzp_gzY/edit#gid=0
//   gapi.client.sheets.spreadsheets.values.get({
//     spreadsheetId: "1YOWX_9lH2Jw4JlwW4PmQLEYbXcQq6fj-SVvuCzp_gzY",
//     range: "A2:A5000"
//   }).then((response) => {
//     var result = response.result;
//     var numRows = result.values ? result.values.length : 0;
//     console.log(`${numRows} rows retrieved.`);
//     window.alert(`${numRows} rows retrieved.`);
//   });

  // return parseCsv(readGoogleSheet(googleToken));

  // just doing this with two
  var rand1 = data[Math.floor(Math.random() * data.length)]._id;
  rand2 = rand1;
  while(rand2 === rand1){
    rand2 = data[Math.floor(Math.random() * data.length)]._id;
  }
  return [rand1, rand2];
}

function getIdData(){
  // var url = "https://raw.githubusercontent.com/mattkalin/songmash/main/song%20ids.csv";
  // var data = readCsv(url).split("\r\n");
  // if(data[0] === "id"){
  //   data.shift();
  // }

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "./ids", false ); // false for synchronous request
  xmlHttp.send( null );
  var data = JSON.parse(xmlHttp.responseText);
  return data;
}

function readCsv(url){
  // jQuery.ajax({
  //     url: url,
  //     type: 'get',
  //     dataType: 'json',
  //     success: function(data) {
  //         console.log(data);
  //     },
  //     error: function(jqXHR, textStatus, errorThrow){
  //         alert("Error: " + jqXHR['responseText']);
  //     }
  // });

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send( null );
  return xmlHttp.responseText;
}


// function parseCsv(data){
//   window.alert("CSV read successfully")
// }

// function readGoogleSheet(){
//   // var spreadsheetId = "1YOWX_9lH2Jw4JlwW4PmQLEYbXcQq6fj-SVvuCzp_gzY";
//   // var apiKey = "AIzaSyDPq83Az7C2swdtGefeJrLIAw9tYwPDMJM"; // restricted to only google sheets api
//   // var authCode = "4/0AX4XfWg1eDhfkbPt8HDuujnsHgENJIB6tzkAYHmgjYBR9blt0pRAKXZAa_m6KKB-yDIp9Q" // OAuth 2.0 authorization code
//   // var range = "A2:A5000";
//   // googleUrl = "https://sheets.googleapis.com/v4/spreadsheets/" +
//   //   spreadsheetId + "/values/" + range;
//   // var xmlHttp = new XMLHttpRequest();
//   // xmlHttp.open( "GET", googleUrl, false ); // false for synchronous request
//   // xmlHttp.setRequestHeader("key", apiKey);
//   // xmlHttp.setRequestHeader("scope", "https://www.googleapis.com/auth/spreadsheets.readonly");
//   // xmlHttp.send( null );
//   // var data = xmlHttp.responseText;
//   // return data;
//
// }
//
// function getGoogleToken(){
//   var body = "grant_type='refresh_token'&refresh_token='1//04TnRNi60i9cQCgYIARAAGAQSNwF-L9IrYLPxtMNhocMRn8laFBAjD__vmpugy1nDIQNeE9ziUvvcHJLhYirTTh3yA1_rzmNjWpk'&client_id='407408718192.apps.googleusercontent.com'" // client_secret='************'&
//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open( "POST", "http://oauth2.googleapis.com", false ); // false for synchronous request
//   xmlHttp.setRequestHeader("Content-length", '223');
//   xmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
//   xmlHttp.setRequestHeader("user-agent", "google-oauth-playground");
//   xmlHttp.send( body );
//
// }

// var RATINGS_URL = "https://raw.githubusercontent.com/mattkalin/songmash/main/ratings.json";
// // var RATINGS_URL = "./ratings.json";
//
// function getRatingsData(){
//   var url = RATINGS_URL;
//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open("GET", url, false);
//   xmlHttp.send( null );
//   return JSON.parse(xmlHttp.responseText);
// }
//
// function updateRating(songId, newRating){
//   // document.write(ratingsJson.find(id => songId).rating + "<br>");
//   ratingsJson.find(id => songId).rating = newRating;
//   // document.write(ratingsJson.find(id => songId).rating + "<br>");
// }
//
// function getRating(songId){
//   // document.write(songId);
//   return ratingsJson.find(id == songId).rating;
// }
