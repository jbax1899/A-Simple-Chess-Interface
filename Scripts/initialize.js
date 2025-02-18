// Global variables
// Game settings
let computerOn = true;                            //are we playing against the computer?
let humanPlayer = 1;                              //0=white, 1=black
let difficulty = 1;                               //1 (easy) to 10 (hard)
let textMode = true;                              //letters replaced with images when images load if textModeOnly is false
let textModeOnly = false;                         //draw letters to represent pieces instead of images?
let depth = 10;                                   //AI search depth (strength of AI)
// Game state
let boardState;                                   //2d grid, 0=no piece, 1=white pawn, -1=black pawn, ect
let selectedTile = [-1, -1];
let lastSelectedTile = selectedTile;
let lastMove = null;                              //[piece, [priorX, priorY], [newX, newY]]
let enPassantTarget = null;                       //for tracking en passant, used by FEN string builder
let turn = 1;                                     //1 for white, -1 for black (starts as black as we run NextTurn() on game start)
let isInCheck = false;                            //is the current player in check?
let blackMoves = 0;                               //number of moves black has made. Starts at 1
let kingMoved = [false, false];                   //[white, black]
let rookMoved = [[false, false], [false, false]]; //[white[left, right], black[left, right]]
let bestMove = null;
let bestMoveLast = null;
// Drawing variables
let canvas = document.getElementById('canvas');
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
  // Fill the board with the starting position
  // Initialize the board state with an 8x8 array of 0s
  boardState = Array.from({length: 8}, () => Array(8).fill(0));
  // Set the starting positions for the pieces
  // White's home row
  boardState[0][0] = 4;
  boardState[1][0] = 2;
  boardState[2][0] = 3;
  boardState[3][0] = 5;
  boardState[4][0] = 6;
  boardState[5][0] = 3;
  boardState[6][0] = 2;
  boardState[7][0] = 4;
  // White's pawns
  boardState[0][1] = 1;
  boardState[1][1] = 1;
  boardState[2][1] = 1;
  boardState[3][1] = 1;
  boardState[4][1] = 1;
  boardState[5][1] = 1;
  boardState[6][1] = 1;
  boardState[7][1] = 1;
  // Black's home row
  boardState[0][7] = -4;
  boardState[1][7] = -2;
  boardState[2][7] = -3;
  boardState[3][7] = -5;
  boardState[4][7] = -6;
  boardState[5][7] = -3;
  boardState[6][7] = -2;
  boardState[7][7] = -4;
  // Black's pawns
  boardState[0][6] = -1;
  boardState[1][6] = -1;
  boardState[2][6] = -1;
  boardState[3][6] = -1;
  boardState[4][6] = -1;
  boardState[5][6] = -1;
  boardState[6][6] = -1;
  boardState[7][6] = -1;

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

  // Start the game
  NextTurn();
  Analyse();
  DrawBoard();
});