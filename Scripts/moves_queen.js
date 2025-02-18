function CheckQueen(position1, position2) {
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
    
    // Check if position2 is occupied by a friendly piece
    if ((boardState[x2][y2] > 0 && piece > 0)
    ||  (boardState[x2][y2] < 0 && piece < 0)) {
        return "Illegal move: Cannot capture own piece";
    }

    // Check if the move is legal for a bishop or a rook
    var attemptBishopMove = CheckBishop(position1, position2);
    var attemptRookMove   = CheckRook(position1, position2);
    if (attemptBishopMove.length > 0 && attemptRookMove.length > 0) {
        var str = ("Illegal move: Queen can only move diagonally or horizontally/vertically. \n" +
                    (attemptBishopMove.length > 0 ? "Bishop failed (" + attemptBishopMove + ") \n": "") +
                    (attemptRookMove.length > 0   ? "Rook failed (" + attemptRookMove + ") \n": "") +
                    position1 + ", " + position2);
        return str;
    }
  return "";
}