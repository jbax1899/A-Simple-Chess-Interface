

function CheckIfBestMoveUpdated() {
    // If bestMove has changed,
    if (    bestMove != null
        &&  bestMove != bestMoveLast
        && ( 
            // And if the AI's turn,
                (turn == 1 && humanPlayer == 1) 
            ||  (turn == -1 && humanPlayer == 0) 
            ||  onlyAI == true
            )
        ) 
    {
        // Make AI move
        Move(getNumericCoord(bestMove.substring(0,2)), getNumericCoord(bestMove.substring(2,4)));
        bestMove = null; // to prevent infinite loop
    }
}

function NextTurn() {
    // New turn
    isInCheck = false;
    // Is the game over?
    if (CheckGameOver()) {
        ResetGame();
    }
}

function Move(position1, position2) {
    let x1 = position1[0];
    let y1 = position1[1];
    let x2 = position2[0];
    let y2 = position2[1];
    var piece;
    if (x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8 && 
        x2 >= 0 && x2 < 8 && y2 >= 0 && y2 < 8) {
        piece = boardState[x1][y1];
    } else {
        return "Illegal move: Invalid position";
    }
    // Check if a piece is selected
    if (piece != 0) {
        // Check if piece can be moved per turn, and make sure the turn has ticked over to the piece's player
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
                let piecePrior = boardState[x2][y2];
                boardState[x2][y2] = piece;
                boardState[x1][y1] = 0;
                if (IsKingInCheck()) {
                    // We are still in check, so move is illegal
                    moveIsLegal = "Illegal move: does not take king out of check";
                }
                boardState[x2][y2] = piecePrior;
                boardState[x1][y1] = piece;
            }
            if (moveIsLegal == "") {
                // Move the piece, update the board state
                boardState[x1][y1] = 0;
                boardState[x2][y2] = piece;
                // If pawn, check if it is on a promotion square and needs promoted
                if (Math.abs(piece) == 1 && (y2 == 0 || y2 == 7)) {
                    //Debug, need to update this to specify desired promotion piece (assuming Queen for now)
                    Promote(position2, null);
                }
                // Record the move
                lastMove = [piece, [x1, y1], [x2, y2]];
                moves[blackMoves][turn === 1 ? 0 : 1] = getCoordString(lastMove[1]) + getCoordString(lastMove[2]);
                // Update move history in side menu
                let ul = document.getElementById("move-history");
                ul.innerHTML = "";
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i][0] != "") {
                        let li = document.createElement('li');
                        li.innerText = `${i + 1}. ${moves[i][0]} - ${moves[i][1]}`;
                        ul.appendChild(li);
                    }
                }
                ul.scrollTop = ul.scrollHeight; // scroll to bottom
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
                // Always increment halfMoves
                halfMoves++;
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
            console.error("Invalid turn");
        }
    } else {
        //console.error("No piece selected");
    }
    // Deselect
    selectedTile = [-1, -1];
}