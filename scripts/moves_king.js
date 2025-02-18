function CheckKing(position1, position2) {
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
    const opponent      = -currentPlayer;

    // Check if the ending square is not occupied by a piece of the current player
    if (boardState[x2][y2] * piece > 0) {
        return "Illegal move: destination square occupied by own piece";
    }

    // Check if the ending square is not more than two squares away from the starting square
    if (Math.abs(x2 - x1) > 2 || Math.abs(y2 - y1) > 1) {
        return "Illegal move: king can move at most one square in any direction, or two squares in castling";
    }

    // Check if destination would put king in check
    // We're going to change the board temporarily by recording what is at position2, moving the king there, seeing if now in check, and reverting.
    const squarePrior = boardState[x2][y2];
    boardState[x2][y2] = piece;
    boardState[x1][y1] = 0;
    var error = "";
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
        if (CanCapture([x, y], [x2, y2]))
            error = "Illegal move: king cannot move into check";
        }
    }
    boardState[x2][y2] = squarePrior;
    boardState[x1][y1] = piece;
    if (error.length > 0) {
        return error;
    }

    // Check if the king is castling
    if (Math.abs(x2 - x1) === 2) {
        // Check if the king has not moved yet
        if (kingMoved[currentPlayer == 1 ? 0 : 1]) {
            return "Illegal move: king has already moved";
        }
        // Check if the rook is in the right position for castling
        const rookX = x2 > x1 ? 7 : 0;              //if the king is moving right then rook's x=7, else x=0
        const rookY = currentPlayer === 1 ? 0 : 7;  //if white then rook should be on home row at y=0 else black is y=7
        if (boardState[rookX][rookY] !== currentPlayer * 4) {
            return "Illegal move: rook not in position for castling";
        }
        // Check if the squares between the king and the rook are empty
        const dir = x2 > x1 ? 1 : -1;   //checking left or right of king?
        const fromX = x1 + dir;         //check from king, not including the king
        const toX = rookX - dir;        //check to rook, not including the rook
        for (let x = fromX; x !== toX; x += dir) {
            if (boardState[x][rookY] !== 0) {
                return "Illegal move: squares between king and rook not empty";
            }
            // Check if the square is under attack by an enemy piece
            else {
                for (var xx = 0; xx < 8; xx++) {
                    for (var yy = 0; yy < 8; yy++) {
                        // Select each opponent's piece,
                        if (Math.sign(boardState[xx][yy]) === opponent) {
                            // Can it capture the square inbetween castling moves?
                            if (CanCapture([xx, yy], [x, rookY])) {
                                return "Illegal move: king cannot move into check";
                            }   
                        }
                    }
                }
                
            }
        }
        // Check if the rook has moved yet
        if (rookMoved[currentPlayer == 1 ? 0 : 1][dir == 1 ? 1 : 0] == true) {
            return "Illegal move: rook has already moved";
        }
        // Castling is legal
        // Create a new rook on the opposite side of the king, delete the old rook
        const rookNewX = x2 > x1 ? x2 - 1 : x2 + 1;
        boardState[rookNewX][rookY] = boardState[rookX][rookY];
        boardState[rookX][rookY] = 0;
        rookMoved[currentPlayer == 1 ? 0 : 1][dir == 1 ? 1 : 0] = true;
    }

    // The move is legal - move the king
    kingMoved[currentPlayer == 1 ? 0 : 1] = true;
    return "";
}