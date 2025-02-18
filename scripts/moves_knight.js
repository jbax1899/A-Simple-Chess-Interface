function CheckKnight(position1, position2) {
    const dx = Math.abs(position2[0] - position1[0]);
    const dy = Math.abs(position2[1] - position1[1]);
  
    if (dx + dy !== 3 || dx === 0 || dy === 0) {
      return "Illegal move: knights move three squares in an L-shape";
    }
  
    const piece = boardState[position1[0]][position1[1]];
    const targetPiece = boardState[position2[0]][position2[1]];
  
    if ((piece > 0 && targetPiece > 0) || (piece < 0 && targetPiece < 0)) {
      return "Illegal move: cannot capture own piece";
    }
  
    if (targetPiece !== 0 && Math.sign(piece) === Math.sign(targetPiece)) {
      return "Illegal move: cannot capture same color piece";
    }
  
    // If we made it this far, the move is legal
    return "";
  }
  