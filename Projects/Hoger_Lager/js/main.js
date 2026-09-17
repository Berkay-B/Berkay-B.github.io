console.log('Main loaded'); 

let creditsPlayer = 0; 
let creditsComputer = 0;
let maxNumber = 6;
let computerRandomNumber;

// elementen
const centerBox2 = document.querySelector('.center-box2');
const left = document.querySelector('.left');
const right = document.querySelector('.right');

// buttons
const buttonRoll = document.querySelector('.center-box2-rollthedice');
const buttonHigher = document.querySelector('.center-box2-higher');
const buttonLower = document.querySelector('.center-box2-lower');
const buttonRestart = document.querySelector('.center-box2-restart');
const buttonRestartL = document.querySelector('.center-box2-restart-large');

// dices
const playerDiceIMG = document.querySelector('.player-dice-img');
const computerDiceIMG = document.querySelector('.computer-dice-img');

// effects
const playerEffect = document.querySelector('.player-winner-effect');
const computerEffect = document.querySelector('.computer-winner-effect');

// dice numbers
const computerNumber = document.querySelector('.computer-rolls-label');
const playerNumber = document.querySelector('.player-rolls-label');

// credits
const playerCredits = document.querySelector('.player-points-label');
const computerCredits = document.querySelector('.computer-points-label');

// result
const result = document.querySelector('.center-box-result');

// higher and lower buttons are invisible at the start
buttonHigher.remove();
buttonLower.remove();
buttonRestartL.remove();

// winning effects are invisible at the start
playerEffect.remove();
computerEffect.remove();

// dice images  are invisible at the start
computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;
playerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;

//////////////////////////////////////////////////////////////

// random number function
function getRandomNumber() {
    return Math.floor(Math.random() * maxNumber) + 1;
}

// roll dice function
function rollDice() {
    computerRandomNumber = getRandomNumber();
    computerNumber.innerHTML = 'Computer Rolled: ' + computerRandomNumber;
    playerNumber.innerHTML = 'Player Rolled: -';
    result.innerText = `Computer Rolled "${computerRandomNumber}"`;

    computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/dice${computerRandomNumber}.png`;

    centerBox2.appendChild(buttonHigher);
    centerBox2.appendChild(buttonLower);
    buttonRoll.remove();
    playerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;
}

function showPlayerDice(playerRandomNumber) {
    playerDiceIMG.src = `/Projects/Hoger-Lager/html/images/dice${playerRandomNumber}.png`;
}

// if higher get clicked
function higher() {
    let playerRandomNumber = getRandomNumber();
    playerNumber.innerHTML = 'Player Rolled: ' + playerRandomNumber;

    let resultMessage = '';
    showPlayerDice(playerRandomNumber);

    if (playerRandomNumber > computerRandomNumber) {
        creditsPlayer++;
        resultMessage = `Congratulations! You Rolled "${playerRandomNumber}"`;
    } else if (playerRandomNumber === computerRandomNumber){
        resultMessage = `Tie! You Rolled "${playerRandomNumber}"`;
    } else {
        creditsComputer++;
        resultMessage = `You guessed wrong! You Rolled "${playerRandomNumber}"`;
    }

    computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;

    updateScores(resultMessage);
}

// if lower get clicked
function lower() {
    let playerRandomNumber = getRandomNumber();
    playerNumber.innerHTML = 'Player Rolled: ' + playerRandomNumber;

    let resultMessage = '';
    showPlayerDice(playerRandomNumber);

    if (playerRandomNumber < computerRandomNumber) {
        creditsPlayer++;
        resultMessage = `Congratulations! You Rolled "${playerRandomNumber}"`;
    } else if (playerRandomNumber === computerRandomNumber){
        resultMessage = `Tie! You Rolled "${playerRandomNumber}"`;
    } else {
        creditsComputer++;
        resultMessage = `You guessed wrong! You Rolled "${playerRandomNumber}"`;
    }

    computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;

    updateScores(resultMessage);
}

// update scores function
function updateScores(resultMessage) {
    playerCredits.innerText = 'Total Score: ' + creditsPlayer;
    computerCredits.innerText = 'Total Score: ' + creditsComputer;
    result.innerText = resultMessage;
    computerNumber.innerHTML = 'Computer Rolled: -';

    buttonHigher.remove();
    buttonLower.remove();   
    centerBox2.appendChild(buttonRoll);

    winOrLoseGame();
}

// win or lose function
function winOrLoseGame() {
    if (creditsPlayer >= 10) {
        result.innerText = "You win the game! Click Restart to play again.";
        buttonHigher.remove();
        buttonLower.remove();  
        buttonRoll.remove();
        buttonRestart.remove();
        centerBox2.appendChild(buttonRestartL);
        left.appendChild(playerEffect);
    } else if (creditsComputer >= 10) {
        result.innerText = "Computer wins the game! Click Restart to play again.";
        buttonHigher.remove();
        buttonLower.remove();  
        buttonRoll.remove();
        buttonRestart.remove();
        centerBox2.appendChild(buttonRestartL);
        right.appendChild(computerEffect);
    }
}

// restart game function
function restartGame() {
    creditsComputer = 0;
    creditsPlayer = 0;
    playerCredits.innerText = 'Total Score: ' + creditsPlayer;
    computerCredits.innerText = 'Total Score: ' + creditsComputer;
    result.innerText = 'The game has been restarted';
    computerNumber.innerHTML = 'Computer Rolled: -';
    playerNumber.innerHTML = 'Player Rolled: -';

    centerBox2.appendChild(buttonRoll);
    buttonHigher.remove();
    buttonLower.remove();

    computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;
    playerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;

    computerEffect.remove();
    playerEffect.remove();
}

function restartGameL() {
    creditsComputer = 0;
    creditsPlayer = 0;
    playerCredits.innerText = 'Total Score: ' + creditsPlayer;
    computerCredits.innerText = 'Total Score: ' + creditsComputer;
    result.innerText = 'The game has been restarted';
    computerNumber.innerHTML = 'Computer Rolled: -';
    playerNumber.innerHTML = 'Player Rolled: -';

    centerBox2.appendChild(buttonRoll);
    buttonHigher.remove();
    buttonLower.remove();
    centerBox2.appendChild(buttonRestart);
    buttonRestartL.remove();

    playerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;
    computerDiceIMG.src = `/Projects/Hoger-Lager/html/images/Empty.png`;;

    computerEffect.remove();
    playerEffect.remove();
}

// event listeners
buttonRestart.addEventListener('click', restartGame); 
buttonRestartL.addEventListener('click', restartGameL);
buttonRoll.addEventListener('click', rollDice);
buttonHigher.addEventListener('click', higher);
buttonLower.addEventListener('click', lower);
