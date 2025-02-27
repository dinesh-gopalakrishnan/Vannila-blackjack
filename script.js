function startGame() {
    document.getElementById("game").innerHTML = "<h2>Game Started!</h2><h4>Use buttons below to play</h4>";
    document.getElementById("buttons").innerHTML = '<button id="deal" onclick="">Deal</button><button id="hit" onclick="">Hit</button><button id="stand" onclick="">Stand</button><button id="cashOut" onclick="">Cash Out</button>';    
}