let isGameActive = false;
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let discardDeck = [];
let playerCash = 1000;
let playerBet = 0;

function startGame() {
    loadExternalHTML('game', 'gamestart.html');
    playingDeck = createDeck();

}
function deal() {
    if (!isGameActive && playerCash > 0) {
        isGameActive = true;
        playerScore = 0;
        dealerScore = 0;
        playerCards = [];
        dealerCards = [];
        playerBet = 50;
        playerCash = playerCash - playerBet;

        if (playingDeck.length < 20) {
            //document.getElementById('debug4').innerHTML = "Deck is low, reshuffling...";
            // Correct reshuffling:
            for (let i = 0; i < discardDeck.length; i++) {
                playingDeck.push(discardDeck[i]);
            }
            discardDeck = []; // Clear the discard pile afterwards
        }


        // Initial deal
        playerCards.push(getRandomCard());
        dealerCards.push(getRandomCard());
        playerCards.push(getRandomCard());
        dealerCards.push(getRandomCard());


        updateScores();
        updatePlayerCards(playerCards);
        // Show the first card and a facedown for the second
        document.getElementById('dealerCards').innerHTML = 
            `<div class="card">${dealerCards[0].value} of ${dealerCards[0].suit}</div>` +
            `<div class="card">Card Back</div>`; // Placeholder for now
        document.getElementById('msgArea').innerHTML = "Cards left in the deck: " + playingDeck.length;
        document.getElementById('playerCash').innerText = `Cash: $${playerCash}`;
        document.getElementById('playerBet').innerText = `Bet: $${playerBet}`;
        document.getElementById('betYield').innerText = `Bet Yield: $${playerBet * 2}`;
        //document.getElementById('debug2').innerHTML = "Cards left in the deck after deal: " + playingDeck.length;
        //document.getElementById('debug').innerHTML = "Discard Deck: " + discardDeck.length;
        totalCards = playingDeck.length + 4 + discardDeck.length;
        //document.getElementById('debug3').innerHTML = "Total Cards: " + totalCards;
        

    }
    else {
        document.getElementById('msgArea').innerHTML = "Game already in progress. Please hit or stand.";
    }
}
function hit() {
    if (isGameActive) {
        playerCards.push(getRandomCard());
        updateScores();
        updatePlayerCards(playerCards);
        document.getElementById('msgArea').innerHTML = "Cards left in the deck: " + playingDeck.length;
        if (playerScore > 21) {
            document.getElementById('msgArea').innerHTML = "You busted! Dealer wins.";
            // Correct Discard:
            for (let i = 0; i < dealerCards.length; i++){
                discardDeck.push(dealerCards[i]);
            }
            for (let i = 0; i < playerCards.length; i++){
                discardDeck.push(playerCards[i]);
            }
            document.getElementById('betYield').innerText = `Bet Yield: $0`;
            isGameActive = false;
            if (playerCash <= 0) {
                document.getElementById('msgArea').innerHTML += " You are out of cash. Game over.";
            }
        }
    }
    else {
        document.getElementById('msgArea').innerHTML = "Please start a new game by clicking Deal.";
    }
    
}

function loadExternalHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            document.getElementById(elementId).innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
        });
}
function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    for (let suit of suits) {
        for (let value of values) {
            let cardValue;
            if (value === 'J' || value === 'Q' || value === 'K') {
                cardValue = 10;
            } else if (value === 'A') {
                cardValue = 11; // Ace can be 1 or 11, will handle this later
            } else {
                cardValue = parseInt(value, 10);
            }
            deck.push({
                suit: suit,
                value: value,
                cardValue: cardValue
            });
        }
    }

    return deck;
}
function getRandomCard() {
    const randomIndex = Math.floor(Math.random() * playingDeck.length);
    return playingDeck.splice(randomIndex, 1)[0];
}
function updateScores() {
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore(dealerCards);

    document.getElementById('playerScore').innerText = `Score: ${playerScore}`;
    document.getElementById('dealerScore').innerText = `Score: TBD`;

}
function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    for (let card of cards) {
        score += card.cardValue;
        // Count Aces for later adjustment
        if (card.value === 'A') {
            aces++;
        }
    }

    // Adjust for Aces
    while (score > 21 && aces > 0) {
        score -= 10; // Treat Ace as 1 instead of 11
        aces--;
    }

    return score;
}
function updatePlayerCards(Cards) {
    document.getElementById('playerCards').innerHTML = '';
    for (let card of Cards) {
        document.getElementById('playerCards').innerHTML += `<div class="card">${card.value} of ${card.suit}</div>`;

    }
}