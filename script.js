var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const boxes = document.querySelectorAll('.box');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].innerText = '';
		boxes[i].style.removeProperty('background-color');
		boxes[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square){
    const id = square.target.id;
    if (typeof origBoard[id] == 'number') {
		turn(id, huPlayer)
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;

    let gameWon = checkWin(origBoard, player)

    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "Congrats, You Won!" : "You Lost.");
}

function declareWinner(winner) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = winner;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].style.backgroundColor = "green";
			boxes[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("DRAW!")
		return true;
	}
	return false;
}
