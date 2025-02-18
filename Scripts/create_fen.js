function CreateFEN() {
    let fen = '';
    let emptyCount = 0;
  
    // Loop through the rows of the board from top to bottom
    for (let col = 7; col >= 0; col--) {
      // Loop through the columns of the board from left to right
      for (let row = 0; row < 8; row++) {
        const piece = boardState[row][col];
  
        // If the square is empty, increment the empty count
        if (piece === 0) {
          emptyCount++;
        } else {
          // If there are empty squares, add the count to the FEN string
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
  
          // Add the piece symbol to the FEN string
          fen += getPieceSymbol(piece);
        }
      }
  
      // If there are empty squares in the row, add the count to the FEN string
      if (emptyCount > 0) {
        fen += emptyCount;
        emptyCount = 0;
      }
  
      // Add a slash to separate the rows
      fen += '/';
    }
  
    // Remove the last slash from the FEN string
    fen = fen.slice(0, -1);
  
    // Add the active color to the FEN string (assume white starts)
    if (turn === 1)
        fen += ' w ';
    else if (turn === -1)
        fen += ' b ';
    else
        console.error('Invalid turn');
  
    // Add the castling rights to the FEN string (assume none for now)
    var castling = '';
    if (kingMoved[0] === false) {
        if (rookMoved[0][1] === false) {
            castling += 'K';
        }
        if (rookMoved[0][0] === false) {
            castling += 'Q';
        }
    }
    if (kingMoved[1] === false) {
        if (rookMoved[1][1] === false) {
            castling += 'k';
        }
        if (rookMoved[1][0] === false) {
            castling += 'q';
        }
    }
    fen += (castling.length > 0) ? castling : '-';
  
    // Add the en passant target square to the FEN string (assume none for now)
    if (enPassantTarget)
        fen += ' ' + enPassantTarget;
    else
        fen += ' -';
  
    // Add the halfmove clock to the FEN string (assume 0 for now)
    /*
    Informs how many moves both players have made since the last pawn advance or piece capture—known by chess programmers as the number of halfmoves.
    This field is useful to enforce the 50-move draw rule.
    When this counter reaches 100 (allowing each player to make 50 moves), the game ends in a draw.
    */
    fen += ' 0';
  
    // Add the fullmove number to the FEN string
    /*
    The number of completed turns in the game.
    This number is incremented by one every time Black moves.
    Chess programmers call this a fullmove.
    */
    fen += ' ' + blackMoves;
  
    return fen;
}
  
// Helper function to get the FEN symbol for a piece
function getPieceSymbol(piece) {
    switch (piece) {
        case -1: return 'p';
        case -2: return 'n';
        case -3: return 'b';
        case -4: return 'r';
        case -5: return 'q';
        case -6: return 'k';
        case 1: return 'P';
        case 2: return 'N';
        case 3: return 'B';
        case 4: return 'R';
        case 5: return 'Q';
        case 6: return 'K';
        default: throw new Error('Invalid piece value');
    }
}  