var serverName;

function submitForm(winner, loser, outcome){
  // outcome is false if user abstained
  const data = {
    winId: winner,
    loseId: loser,
    outcome: outcome,
    // time: new Date(),
    server: serverName
  };
  fetch("/poll", {
        method: "post",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    })
}
