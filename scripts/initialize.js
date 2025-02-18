// Global variables
// Game settings
let gameStarted = false;
let computerOn = true;
let humanPlayer = 0;
let onlyAI = false;
let difficulty = 10;
let textMode = true;
let textModeOnly = false;
let depth = difficulty;
let autoPromote = false;
let updateSpeed = 100;
var updateTimer;
let maxMoves = 0;
// Game state
let boardState;
let selectedTile = [-1, -1];
let lastSelectedTile = selectedTile;
let lastMove = null;
let enPassantTarget = null;
let turn = 1;
let turnLast = -turn;
let isInCheck = false;
let moves = [];
let blackMoves = 0;
let halfMoves = 0;
let kingMoved = [false, false];
let rookMoved = [[false, false], [false, false]];
let bestMove = null;
let bestMoveLast = null;
// Drawing variables
var canvas;
var resizeIcon;
let tileSize = 60;
let gridSize = 8;
let edgePadding = tileSize / 2;
let resizeIconSize = 20, resizeIconX, resizeIconY;
// Define the chess piece image paths
const chessPieces = [
  "w_pawn",
  "b_pawn",
  "w_knight",
  "b_knight",
  "w_bishop",
  "b_bishop",
  "w_rook",
  "b_rook",
  "w_queen",
  "b_queen",
  "w_king",
  "b_king"
];
var pieceImages = {};
var imageSize;

// Initial layout of the chess board
const INITIAL_LAYOUT = [
  [4, 1, 0, 0, 0, 0, -1, -4],
  [2, 1, 0, 0, 0, 0, -1, -2],
  [3, 1, 0, 0, 0, 0, -1, -3],
  [5, 1, 0, 0, 0, 0, -1, -5],
  [6, 1, 0, 0, 0, 0, -1, -6],
  [3, 1, 0, 0, 0, 0, -1, -3],
  [2, 1, 0, 0, 0, 0, -1, -2],
  [4, 1, 0, 0, 0, 0, -1, -4]
];

// Run this code once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas');
  canvas.width = (tileSize * gridSize) + (edgePadding * 2);
  canvas.height = (tileSize * gridSize) + (edgePadding * 2);
  
  // Global timer variable, every x-ms check if engine has determined best move for current player
  updateTimer = setInterval(CheckIfBestMoveUpdated, updateSpeed);
  
  // Load the chess piece images to memory asynchronously
  let loadedImagesCount = 0;
  for (let i = 0; i < chessPieces.length; i++) {
    const piece = chessPieces[i];
    const img = new Image();
    img.onload = function() {
      pieceImages[piece] = img;
      loadedImagesCount++;
      if (loadedImagesCount === chessPieces.length) {
        // All images have finished loading
        imageSize = img.width;
        if (!textModeOnly) {
          // Redraw the board with images instead of letters
          textMode = false;
          DrawBoard();
        }
      }
    };
    img.onerror = function() {
      // Fallback to PNG if SVG fails to load
      img.src = `resources/min/${piece}.png`;
    };
    img.src = `resources/svg/${piece}.svg`;
  }

  // Interface
  document.getElementById("autoQueen").checked = true;
  document.getElementById("autoQueen").disabled = true; // TODO: implement choosing other promotion pieces

  AddEventListeners();
  StartGame();
});

function StartGame() {
  // Options menu
  setPlayerOptions();
  setDifficultyOptions();
  setUpdateSpeedOptions();

  // Initialize game state
  resetGameState();

  // Start the game
  gameStarted = true;
  NextTurn();
  Analyse();
  DrawBoard();
}

function setPlayerOptions() {
  const radioButtonName = "player";
  const valueToSet = humanPlayer === 0 ? "white" : "black";
  const radioButtons = document.getElementsByName(radioButtonName);
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].value === valueToSet) {
      radioButtons[i].checked = true;
      break;
    }
  }
}

function setDifficultyOptions() {
  document.getElementById("difficulty").defaultValue = difficulty;
}

function setUpdateSpeedOptions() {
  document.getElementById("updateSpeed").defaultValue = updateSpeed;
}

function resetGameState() {
  selectedTile = [-1, -1];
  lastSelectedTile = selectedTile;

  // Fill the board with the starting position
  boardState = Array.from({ length: 8 }, () => Array(8).fill(0));
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      boardState[col][row] = INITIAL_LAYOUT[col][row];
    }
  }

  // Fill moves array
  const rows = 999;
  for (let i = 0; i < rows; i++) {
    moves[i] = ["", ""];
  }
}

function ResetGame() {
  console.log("TODO: reset game (refresh page)");
}