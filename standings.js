const RATINGS_DATA_URL = "/ratings";

function getRatings(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", RATINGS_DATA_URL, false);
  xmlHttp.send( null );
  // document.write(xmlHttp.responseText);
  return JSON.parse(xmlHttp.responseText);
}

function displayRatings(){
  ratings.sort(function(a, b){
    return b.rating - a.rating;
  })
  document.write(JSON.stringify(ratings));
}

function processRow(json){
  // json is one entry

}
