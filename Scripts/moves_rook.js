function CheckRook(position1, position2) {
    const x1 = position1[0];
    const y1 = position1[1];
    const x2 = position2[0];
    const y2 = position2[1];
    var piece;
    if (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8 && 
        x2 >= 0 && x2 < 8 && y2 >= 0 && y2 < 8) {
        piece = boardState[x1][y1];
    } else {
        return "Illegal move: Invalid position";
    }
    const currentPlayer = Math.sign(piece);
    
    // Check if the destination square is not occupied by a piece of the same color
    if (boardState[x1][y1] * boardState[x2][y2] > 0) {
      return "Illegal move: Destination square is already occupied by a piece of the same color";
    }
    
    // Check if the move is horizontal or vertical
    if (x1 !== x2 && y1 !== y2) {
      return "Illegal move: Rooks can only move horizontally or vertically";
    }
    
    // Check if there are any pieces blocking the way to the destination square
    if (x1 === x2) {
      // Horizontal move
      var min = Math.min(y1, y2);
      var max = Math.max(y1, y2);
      for (var i = min + 1; i < max; i++) {
        if (boardState[x1][i] !== 0) {
          return "Illegal move: There is a piece blocking the way to the destination square";
        }
      }
    } else {
      // Vertical move
      var min = Math.min(x1, x2);
      var max = Math.max(x1, x2);
      for (var i = min + 1; i < max; i++) {
        if (boardState[i][y1] !== 0) {
          return "Illegal move: There is a piece blocking the way to the destination square";
        }
      }
    }
    
    // Move is legal
    // If the prior position is the starting square, flag that rook as having moved (relevant in castling)
    rookMoved[currentPlayer === 1 ? 0 : 1][x1 === 0 ? 0 : x1 === 7 ? 1 : null] = true;
    return "";
}  