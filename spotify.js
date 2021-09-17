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

  var userID = "xu75up5apc30lijbveflhr5fq"
  var clientID = "c0f873e96499462dab95ca2ec86cc9ea"
  var clientSecret = "35f220698fce424e84190844c8691ff3"
  var url = "https://accounts.spotify.com/api/token"

  // 'use strict';
  // let buff = new Buffer(client_id + ':' + client_secret);
  // document.writeln("Getting token<br>")
  var auth = "Basic " + btoa(clientID + ":" + clientSecret); // pretty sure this is correct
  // document.write(auth);
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
  return JSON.parse(xmlHttp.responseText);


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

function displaySongTable(ids, token){
  // ids is an array of spotify song ID
  var songsInfo = [];
  for(var i = 0; i < ids.length; i++){
    songsInfo[i] = getSongInfo(ids[i], token);
  }
  document.write("<table>");
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
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    document.write("<img src='" +
    songsInfo[i].album.images[0].url +
    "' width='20%' >");
    document.write("</td>");
  }
  document.write("</tr>");

  // title
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    // document.write("Title: ")
    document.write(songsInfo[i].name);
    document.write("</td>");
  }
  document.write("</tr>");

  // artist
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    // document.write("Artist(s): ")
    for(var j = 0; j < songsInfo[i].artists.length; j++){
      if(j > 0){
        document.write(", ");
      }
      document.write(songsInfo[i].artists[j].name);
    }
    document.write("</td>");
  }
  document.write("</tr>");

  // album
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    // document.write("Album: ")
    document.write(songsInfo[i].album.name);
    document.write("</td>");
  }
  document.write("</tr>");

  // audio preview
  var audio;
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    // document.write("Album: ")
    if(songsInfo[i].preview_url == null){
      audio = "No audio preview available"
    } else {
      audio = "<audio controls width='15%' height='100'>" +
      "<source src='" + songsInfo[i].preview_url +
      "'type='audio/mp3'>Your browser doesn't support html5 audio</audio>";
    }
    document.write(audio);
    document.write("</td>");
  }
  document.write("</tr>");

  // spotify link
  var spotify;
  document.write("<tr>");
  for(var i = 0; i < ids.length; i++){
    document.write("<td>");
    // document.write("Album: ")
    if(songsInfo[i].external_urls.spotify == null){
      spotify = "No Spotify link available"
    } else {
      spotify = "<a href='" + songsInfo[i].external_urls.spotify +
      "' target='_blank' rel='noopener noreferrer'>Listen on Spotify here</a>"
    }
    document.write(spotify);
    document.write("</td>");
  }
  document.write("</tr>");

  document.write("</table>");
}

function selectRandomIds(){
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

  
}


function parseCsv(data){
  window.alert("CSV read successfully")
}

function readGoogleSheet(){
  // var spreadsheetId = "1YOWX_9lH2Jw4JlwW4PmQLEYbXcQq6fj-SVvuCzp_gzY";
  // var apiKey = "AIzaSyDPq83Az7C2swdtGefeJrLIAw9tYwPDMJM"; // restricted to only google sheets api
  // var authCode = "4/0AX4XfWg1eDhfkbPt8HDuujnsHgENJIB6tzkAYHmgjYBR9blt0pRAKXZAa_m6KKB-yDIp9Q" // OAuth 2.0 authorization code
  // var range = "A2:A5000";
  // googleUrl = "https://sheets.googleapis.com/v4/spreadsheets/" +
  //   spreadsheetId + "/values/" + range;
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "GET", googleUrl, false ); // false for synchronous request
  // xmlHttp.setRequestHeader("key", apiKey);
  // xmlHttp.setRequestHeader("scope", "https://www.googleapis.com/auth/spreadsheets.readonly");
  // xmlHttp.send( null );
  // var data = xmlHttp.responseText;
  // return data;

}

function getGoogleToken(){
  var body = "grant_type='refresh_token'&refresh_token='1//04TnRNi60i9cQCgYIARAAGAQSNwF-L9IrYLPxtMNhocMRn8laFBAjD__vmpugy1nDIQNeE9ziUvvcHJLhYirTTh3yA1_rzmNjWpk'&client_id='407408718192.apps.googleusercontent.com'" // client_secret='************'&
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", "http://oauth2.googleapis.com", false ); // false for synchronous request
  xmlHttp.setRequestHeader("Content-length", '223');
  xmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xmlHttp.setRequestHeader("user-agent", "google-oauth-playground");
  xmlHttp.send( body );

}
