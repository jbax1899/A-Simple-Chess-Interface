// Global variables
// Game settings
let computerOn = true;                            //are we playing against the computer?
let humanPlayer = 0;                              //0=white, 1=black
let onlyAI = false;                               //no human player, AI vs. AI
let difficulty = 10;                              //1 (easy) to 10 (hard)
let textMode = true;                              //letters replaced with images when images load if textModeOnly is false
let textModeOnly = false;                         //draw letters to represent pieces instead of images?
let depth = difficulty;                           //AI search depth (strength of AI)
let autoPromote = false;                          //auto promote pieces to Queen? (instead of asking for a piece)
let updateSpeed = 100;                            //update speed (ms)
let maxMoves = 0;                                 //max *half* moves. So 100 = 50 turns each. 0 to disable.
// Game state
let boardState;                                   //2d grid, 0=no piece, 1=white pawn, -1=black pawn, ect
let selectedTile = [-1, -1];
let lastSelectedTile = selectedTile;
let lastMove = null;                              //[piece, [priorX, priorY], [newX, newY]]
let enPassantTarget = null;                       //for tracking en passant, used by FEN string builder
let turn = 1;                                     //1 for white, -1 for black
let turnLast = -turn;                             //Always the opposite of "turn" BUT this is for making sure the AI doesn't move too fast                  
let isInCheck = false;                            //is the current player in check?
let moves = [];                                   //will hold the moves for both players, e.g. 1. e4, e5 is [0][0] e4, [0][1] e5
let blackMoves = 0;                               //number of moves black has made. Starts at 1
let halfMoves = 0;                                //increments every time ANY move is made
let kingMoved = [false, false];                   //[white, black]
let rookMoved = [[false, false], [false, false]]; //[white[left, right], black[left, right]]
let bestMove = null;
let bestMoveLast = null;
// Drawing variables
let canvas = document.getElementById('board');
let tileSize = 60;
let gridSize = 8;
let edgePadding = tileSize / 2;
canvas.width = (tileSize * gridSize) + (edgePadding * 2);
canvas.height = (tileSize * gridSize) + (edgePadding * 2);
let resizeIconSize = 20, resizeIconX, resizeIconY;
// Define the chess piece image paths
const chessPieces = [
  "w_pawn.png",
  "b_pawn.png",
  "w_knight.png",
  "b_knight.png",
  "w_bishop.png",
  "b_bishop.png",
  "w_rook.png",
  "b_rook.png",
  "w_queen.png",
  "b_queen.png",
  "w_king.png",
  "b_king.png"
];
var pieceImages = {};
var imageSize;

// Run this code as soon as the page is loaded
window.addEventListener('load', () => {
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
      img.src = `Resources/${piece}`;
    }

  //DEBUG
  document.getElementById("autoQueen").checked = true;
  document.getElementById("autoQueen").disabled=true;

  StartGame();
});

function StartGame() {
  ///Options menu//////////////////
  // Set player
  const radioButtonName = "player";
  const valueToSet = humanPlayer === 0 ? "white" : "black";
  const radioButtons = document.getElementsByName(radioButtonName);
  // loop through each radio button and check if its value matches the one we want to set
  for(let i = 0; i < radioButtons.length; i++) {
    if(radioButtons[i].value === valueToSet) {
      radioButtons[i].checked = true;
      break;
    }
  }
  // Set difficulty
  document.getElementById("difficulty").defaultValue = difficulty;
  // Set update speed
  document.getElementById("updateSpeed").defaultValue = updateSpeed;
  ////////////////////////////////

  //
  selectedTile = [-1, -1];
  lastSelectedTile = selectedTile;

  // Fill the board with the starting position
  // Initialize the board state with an 8x8 array of 0s
  boardState = Array.from({length: 8}, () => Array(8).fill(0));
  // Set the starting positions for the pieces
  const layout = [
    [4, 1, 0, 0, 0, 0, -1, -4],
    [2, 1, 0, 0, 0, 0, -1, -2],
    [3, 1, 0, 0, 0, 0, -1, -3],
    [5, 1, 0, 0, 0, 0, -1, -5],
    [6, 1, 0, 0, 0, 0, -1, -6],
    [3, 1, 0, 0, 0, 0, -1, -3],
    [2, 1, 0, 0, 0, 0, -1, -2],
    [4, 1, 0, 0, 0, 0, -1, -4]
  ];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      boardState[col][row] = layout[col][row];
    }
  }

  //fill moves array
  var rows = 999; // technically the max possible number of moves is 5949, but this should be fine...
  for (let i = 0; i < rows; i++) {
    moves[i] = ["",""];
  }

  // Start the game
  NextTurn();
  Analyse();
  DrawBoard();
}

function ResetGame() {
  console.log("reset game");
}