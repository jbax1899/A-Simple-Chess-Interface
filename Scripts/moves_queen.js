function CheckQueen(position1, position2) {
    // Get the piece at position1
    var piece;
    if (position1[0] >= 0 && position1[0] < 8 && position1[1] >= 0 && position1[1] < 8 &&
        position2[0] >= 0 && position2[0] < 8 && position2[1] >= 0 && position2[1] < 8) {
        piece = boardState[position1[0]][position1[1]];
    } else {
        return "Illegal move: Invalid position";
    }
    
    // Check if position2 is occupied by a friendly piece
    if ((boardState[position2[0]][position2[1]] > 0 && piece > 0)
    ||  (boardState[position2[0]][position2[1]] < 0 && piece < 0)) {
        return "Illegal move: Cannot capture own piece";
    }

    // Check if the move is legal for a bishop or a rook
    if (CheckBishop(position1, position2) != "" && CheckRook(position1, position2) != "") {
        return "Illegal move: Queen can only move diagonally or horizontally/vertically";
    }

  return "";
}