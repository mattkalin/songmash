const RATINGS_DATA_URL = "./ratings";

function getRatings(){
  var xmlHttp = new XMLHttpRequest();
  console.log("Ratings url: " + RATINGS_DATA_URL);
  xmlHttp.open("GET", RATINGS_DATA_URL, false);
  xmlHttp.send( null );
  // document.write(xmlHttp.responseText);
  console.log("Ratings response text: " + xmlHttp.responseText); 
  return JSON.parse(xmlHttp.responseText);
}

// let LEADERBOARD_NUM = 200;

function displayStandings(){
  ratings.sort(function(a, b){
    return b.rating - a.rating;
  })
  // document.write(JSON.stringify(ratings));
  let str = "<table>" +
  "<tr>" +
  "<th>Rank</th>" +
  "<th>Title</th>" +
  "<th>Artist</th>" +
  "<th>Win</th>" + // comment this out?
  "<th>Loss</th>" + // comment this out?
  "<th>Abstain</th>" + // comment this out?
  "<th>Rating</th>" + // comment this out?
  "</tr>";
  for(var i = 0; i < ratings.length; i++){
    str += processRow(i, ratings);
  }
  str += "</table>"
  document.getElementById("standingsTable").innerHTML = str;
}

function processRow(i, ratings){
  let str = "<tr>";
  str += "<td>" + (i + 1) + "</td>"; // rank
  // let song = getSongInfo(ratings[i]._id, token);
  str += "<td>" + ratings[i].title + "</td>"; // title
  // artist(s)
  str += "<td>";
  // for(var j = 0; j < song.artists.length; j++){
  //   if(j > 0){
  //     str += ", ";
  //   }
  //   str += song.artists[j].name;
  // }
  str += ratings[i].artist;
  str += "</td>";

  if(ratings[i].win === undefined){
    ratings[i].win = 0;
  }
  if(ratings[i].loss === undefined){
    ratings[i].loss = 0;
  }
  if(ratings[i].abstain === undefined){
    ratings[i].abstain = 0;
  }
  if(ratings[i].rating === undefined){
    ratings[i].rating = 0;
  }

  str += "<td>" + ratings[i].win + "</td>"; // win
  str += "<td>" + ratings[i].loss + "</td>"; // loss
  str += "<td>" + ratings[i].abstain + "</td>"; // abstain
  str += "<td>" + round(ratings[i].rating, 2) + "</td>"; // rating

  str += "</tr>"
  return str;
}

/*
x is the number you want to round
d is the number of decimals (default 0)
*/
function round(x, d){
  if(d === undefined){
    d = 0;
  }
  let ten = Math.pow(10, d);
  return Math.round(x * ten) / ten;
}
