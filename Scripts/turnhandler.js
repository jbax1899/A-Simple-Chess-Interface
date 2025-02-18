function NextTurn() {
    // New turn
    isInCheck = false;
    // Check if the game is over
    if (CheckGameOver() == true) {
        setTimeout(() => {  
            window.alert("Game over!");
        }, 100); //small async delay to let board finish drawing after final move
    }
    // If AI is on, and is the AI's turn, have it make the suggested move
    else if (computerOn == true && ((turn == 1 && humanPlayer == 1) || (turn == -1 && humanPlayer == 0))) {
        console.log("AI's turn");
        // We gotta wait for bestMove to update, and it can't be null)
        // set interval
        var timerID = setInterval(CheckIfBestMoveUpdated, 500);
        function CheckIfBestMoveUpdated() {
            if (bestMove != bestMoveLast && bestMove != null
                // Make sure it's still the AI's turn
                && ((turn == 1 && humanPlayer == 1) || (turn == -1 && humanPlayer == 0))) {
                console.log(bestMove);
                Move(getNumericCoord(bestMove.substring(0,2)), getNumericCoord(bestMove.substring(2,4)));
            }
        }
    }
}

function Move(position1, position2) {
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
    // Check if a piece is selected
    if (piece != 0) {
        // Check if piece can be moved per turn counter
        if (Math.sign(piece) == turn) {
            // Based on piece type, check if move is legal
            var moveIsLegal = "";
            switch (Math.abs(piece)) {
                case 1: moveIsLegal = CheckPawn  (position1, position2); break;
                case 2: moveIsLegal = CheckKnight(position1, position2); break;
                case 3: moveIsLegal = CheckBishop(position1, position2); break;
                case 4: moveIsLegal = CheckRook  (position1, position2); break;
                case 5: moveIsLegal = CheckQueen (position1, position2); break;
                case 6: moveIsLegal = CheckKing  (position1, position2); break;
                default: console.error("Invalid piece type");
            }
            // Are we in check?
            if (isInCheck) {
                // If in check, see if desired move takes us OUT of check
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
                // Move the piece, update the board state
                boardState[x1][y1] = 0;
                boardState[x2][y2] = piece;
                // Record the move
                lastMove = [piece, [x1, y1], [x2, y2]];
                // Log the move
                console.log("%c" + (turn === 1 ? "White" : "Black") + " plays " + getCoordString(lastMove[1]) + " to " + getCoordString(lastMove[2]),
                            'background: #222; color: #bada55');
                // If move was not a pawn, or if pawn did not move 2 squares, reset enPassantTarget
                if (Math.abs(piece) !== 1 || Math.abs(y1 - y2) !== 2) {
                    enPassantTarget = null;
                }
                // If player is black, increment black move counter
                if (turn == -1)
                    blackMoves++;
                // Change player
                turn = -turn;
                // Analyse new position
                Analyse();
                // Redraw the board
                DrawBoard();
                // Next turn
                NextTurn();
            } else {
                console.error(moveIsLegal);
            }
        } else {
            //console.error("Invalid turn");
        }
    } else {
        //console.error("No piece selected");
    }
    // Deselect
    selectedTile = [-1, -1];
}