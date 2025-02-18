function CheckPawn(position1, position2) {
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
    const direction = Math.sign(piece);
  
    // If x-value changes, 
    if (x2 !== x1 ) {
        // check if legal en passant
        if (boardState[x2][y2] === 0                                //destination square is empty
            && lastMove                                             //there was a prior move
            && Math.abs(lastMove[0]) === 1                          //opponent's moved piece was a pawn
            && lastMove[2][1] === y1                                //opponent's pawn after move is on the same row
            && lastMove[2][0] === x2                                //desired move is on the same column
            && lastMove[2][1] === y2 - direction                    //desired move is one square past opponent's pawn
            ) {
            // Legal en passant capture - remove the other pawn
            boardState[lastMove[2][0]][lastMove[2][1]] = 0;
            return "";
        }
        // Check if legal regular capture
        if (direction == -Math.sign(boardState[x2][y2]) //capturing opponent's piece
            && y2 == y1 + direction                     //1 square forward
            && (x2 == x1 + 1 || x2 == x1 - 1)           //1 square to the side
            ) {
            // Legal non-passant capture
            return "";
        }
        // x-change without capture is illegal
        return 'Illegal move: capturing own piece, diagonal without capture, or illegal en passant';
    // x-value did not change
    } else {
        // Check if destination is occupied
        if (boardState[x2][y2] == 0) {
            // Check if move is 2 steps forward
            if (y2 == y1 + (direction * 2)) {
                // Check if jumping over a piece
                if (boardState[x1][y1 + direction] !== 0) {
                    return 'Illegal move: pawn cannot jump over a piece';
                }
                // Check if double step is on first move
                if ((direction == 1 && y1 != 1) || (direction == -1 && y1 != 6)) {
                    return 'Illegal move: pawn can only move two squares on first move';
                }
                // Legal double step. Update en passant variable for FEN string builder
                enPassantTarget = getCoordString(x1, y1 + direction);
                //console.log('En passant target: ' + enPassantTarget);
                return "";
            // Check if move is 1 step forward
            } else if (y2 == y1 + direction) {
                if (boardState[x2][y2] != 0) {
                    return 'Illegal move: cannot capture forward with pawn';
                }
                // Legal single step
                return "";
            } else {
                return 'Illegal move: not moving 1 or 2 squares forward';
            }
        } else {
            return 'Illegal move: pawn cannot capture moving forward';
        }
    }
    return 'Illegal move';
}

//takes a piece at _position_ and promotes it to desired _piece_
function Promote(position, piece) {
    let posX = position[0];
    let posY = position[1];
    let player = Math.sign(boardState[posX][posY]);
    
    //debug, assume Queen only until we code the selection GUI
    let promoteTo = 5 * player;
    
    //promote the piece
    boardState[posX][posY] = promoteTo;
    console.log(turn === 1 ? "White" : "Black" + " promotes");
}