function CheckGameOver() {
  let result = "";
  // Check if halfmove clock has elapsed, assuming maxMoves is not disabled (0)
  if (halfMoves >= maxMoves && maxMoves != 0) {
    result = "Draw due to halfmove limit";
  }
  // Check if current player's king is in check.
  if (IsKingInCheck()) {
    isInCheck = true;
    console.log(turn === 1 ? "White" : "Black" + " is in check");
    // If in check, see if any move can get king out of check.
    if (CanGetOutOfCheck() == false) {
      result = (turn === 1 ? "White" : "Black" + " is in checkmate");
    }
  }
  if (result != "") {
    setTimeout(() => {  
      window.alert("Game over! " + result);
    }, 100); //small async delay to let board finish drawing after final move
    onlyAI = false;
    return true;
  } else {
    return false;
  }
}

function IsKingInCheck() {
  // Where is t he current player's king?
  const kingPos = FindKing();
  // Check if any opposing piece can capture the current player's king
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (CanCapture([x, y], kingPos))
        return true;
    }
  }
  return false;
}

function FindKing() {
  // Find the position of the player's king
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (boardState[x][y] === turn * 6) {
        return [x, y];
      }
    }
  }
}

function CanCapture(position1, position2) {
  // Check if a particular piece (1) can capture target piece (2)
  var moveError   = '';
  var movingPiece = boardState[position1[0]][position1[1]];
  var targetPiece = boardState[position2[0]][position2[1]];
  // Check if the target piece belongs to the opponent (can't capture own piece)
  if (Math.sign(movingPiece) === -1 * Math.sign(targetPiece)) {
    // What is the type of moving piece?
    switch (Math.abs(movingPiece)) {
      // Check if the move is legal
      case 1:
        moveError = CheckPawn(position1, position2);
        break;
      case 2:
        moveError = CheckKnight(position1, position2);
        break;
      case 3:
        moveError = CheckBishop(position1, position2);
        break;
      case 4:
        moveError = CheckRook(position1, position2);
        break;
      case 5:
        moveError = CheckQueen(position1, position2);
        break;
      case 6:
        moveError = CheckKing(position1, position2);
        break;
    }
    if (moveError == '') {
      return true;
    }
  }
  return false;
}

function CanGetOutOfCheck() {
  // *SLOW* way to check if any move can get king out of check.
  // Loop through each of current player's pieces,
  //      Loop through each tile,
  //          Check if piece can legally move to tile,
  //              If piece can move there, check if king is still in check. If not, return true.
  // Return false as we have checked all legal moves and none bring king out of check.

  // Loop through each tile
  for (var x1 = 0; x1 < 8; x1++) {
    for (var y1 = 0; y1 < 8; y1++) {
      piece = boardState[x1][y1];
      // If piece belongs to player,
      if (piece != 0 && Math.sign(piece) === turn) {
        // Loop through each tile AGAIN and see if the move is legal
        for (var x2 = 0; x2 < 8; x2++) {
          for (var y2 = 0; y2 < 8; y2++) {
            var moveIsLegal = "";
            const position1 = [x1, y1];
            const position2 = [x2, y2];
            switch (Math.abs(piece)) {
                case 0: break;
                case 1: moveIsLegal = CheckPawn  (position1, position2); break;
                case 2: moveIsLegal = CheckKnight(position1, position2); break;
                case 3: moveIsLegal = CheckBishop(position1, position2); break;
                case 4: moveIsLegal = CheckRook  (position1, position2); break;
                case 5: moveIsLegal = CheckQueen (position1, position2); break;
                case 6: moveIsLegal = CheckKing  (position1, position2); break;
                default: console.error("Invalid piece type");
            }
            if (moveIsLegal == "") {
              // Move is legal. Check if king is still in check.
              // We're going to change the board temporarily by recording what is at position2, moving the piece there, seeing if still in check, and reverting.
              const squarePrior = boardState[x2][y2];
              boardState[x2][y2] = piece;
              boardState[x1][y1] = 0;
              if (IsKingInCheck()) {
                  // We are still in check, so move is illegal
                  moveIsLegal = "Illegal move: does not take king out of check";
              }
              boardState[x2][y2] = squarePrior;
              boardState[x1][y1] = piece;
            }
            if (moveIsLegal == "") {
              // Move gets us out of check, so return true
              return true;
            }
          }
        }
      }
    }
  }
  // We did not find a legal move that gets the king out of check, so return false
  console.log("Cannot get out of check");
  return false;
}