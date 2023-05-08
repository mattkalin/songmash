function processVote(winner, loser){
  // updateRatings(winner, loser);
  // window.alert("Test");
  // document.write("Test");

  const data = {
    winner: winner,
    loser: loser,
    abstain: false,
    time: Date.now()
  };
  // console.log("Sending POST request with data " + JSON.stringify(data));
  sendDataAndRefresh(data);
}

function abstain(){
  const data = {
    winner: ids[0],
    loser: ids[1],
    abstain: true,
    time: Date.now()
  };
  sendDataAndRefresh(data);
}

function sendDataAndRefresh(data){
  // console.log("Sending post request");
  fetch("./match", {
    // the "/..." doesn't really matter, just has to match the one in server.js
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
        "Content-Type": "application/json",
        // "Content-Type": "X-www-form-urlencoded",
    }),
  })
  // .then((res) => console.log(res))
  // .catch((err) => console.log("error with POST request"))
  ;

  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "POST", "/match", false ); // false for synchronous request
  // xmlHttp.setRequestHeader("Content-Type", "application/json");
  // xmlHttp.send( JSON.stringify(data) );
  // console.log(xmlHttp.responseText);


  refreshTable();
}
