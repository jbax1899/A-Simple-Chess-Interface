function CheckBishop(position1, position2) {
    const x1 = position1[0];
    const y1 = position1[1];
    const x2 = position2[0];
    const y2 = position2[1];
    const dx = position2[0] - position1[0];
    const dy = position2[1] - position1[1];
  
    // Check if the move is diagonal
    if (Math.abs(dx) !== Math.abs(dy)) {
      return "Illegal move: Bishop can only move diagonally.";
    }
  
    // Check if there are any pieces in the way
    const xDir = dx > 0 ? 1 : -1;
    const yDir = dy > 0 ? 1 : -1;
    let x = x1 + xDir;
    let y = x2 + yDir;
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      while (x !== position2[0] && y !== position2[1]) {
        if (boardState[x][y] !== 0) {
          return "Illegal move: Bishop cannot jump over other pieces.";
        }
        x += xDir;
        y += yDir;
      }
    } else {
      return "Out of bounds";
    }
  
    // Check if the destination square is occupied by a friendly piece
    if ((boardState[x2][y2] > 0 && boardState[x1][y1] > 0) 
     || (boardState[x2][y2] < 0 && boardState[x1][y1] < 0)) {
      return "Illegal move: Bishop cannot capture friendly pieces.";
    }
  
    return "";
}