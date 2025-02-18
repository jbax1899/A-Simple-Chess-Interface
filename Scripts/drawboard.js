function DrawBoard() {
  // Get the context from the canvas element
  var ctx = canvas.getContext('2d');

  // Colors
  // https://www.color-hex.com/color-palette/8548
  const cBoard      = '#eeeed2';
  const cLightTile  = '#eeeed2';
  const cDarkTile   = '#769656';

  // Set the canvas background color
  ctx.fillStyle = cBoard;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the grid
  var flipper = true;
  for (let i = 0; i < gridSize; i++) {
      flipper = !flipper;
      for (let j = 0; j < gridSize; j++) {
          if (flipper) {
              ctx.fillStyle = cDarkTile;
          } else {
              ctx.fillStyle = cLightTile;
          }
          ctx.fillRect( i * tileSize + edgePadding, 
                        j * tileSize + edgePadding, 
                        tileSize, 
                        tileSize);
          flipper = !flipper;
      }
  }

  // Draw a border around the board
  ctx.strokeStyle = cDarkTile;
  ctx.lineWidth = 2;
  ctx.strokeRect( 0 + edgePadding, 
                  0 + edgePadding,
                  canvas.width - (2 * edgePadding),
                  canvas.height - (2 * edgePadding));

  // Draw legends
  const startNum = humanPlayer === 0 ? 1 : 8;
  const endNum   = humanPlayer === 0 ? 8 : 1;
  const increment= humanPlayer === 0 ? 1 : -1;
  for (let i = startNum; i != endNum + increment; i += increment) {
    ctx.fillStyle = cDarkTile;
    const fontSize = tileSize / 3;
    ctx.font = `${fontSize}px sans-serif`;
    //numbers 1-8 left side of the board (flipped for black)
    ctx.fillText( i, 
                  edgePadding / 3, 
                  humanPlayer === 0 ? 
                    canvas.height - (i * tileSize) + (edgePadding / 3)
                    : (i * tileSize) + (edgePadding / 3)
                );
    //letters A-H bottom of the board (flipped for black)
    ctx.fillText( String.fromCharCode(73 - i), 
                  humanPlayer === 0 ? 
                    canvas.width - (i * tileSize) - (edgePadding / 5)
                    : (i * tileSize) - (edgePadding / 5),
                  canvas.height - (edgePadding / 3)
                );
  }

  // Resize icon
  resizeIconSize = tileSize / 3;                // set the size of the icon
  resizeIconX = canvas.width - resizeIconSize;  // set the X position of the icon
  resizeIconY = canvas.height - resizeIconSize; // set the Y position of the icon
  ctx.drawImage(resizeIcon, resizeIconX, resizeIconY, resizeIconSize, resizeIconSize);

  // Highlight the prior move
  if (lastMove !== null) {
    const [piece, [priorX, priorY], [newX, newY]] = lastMove;
    const highlightSize = tileSize;

    // Highlight the prior tile
    const newPriorY = humanPlayer === 0 ? (gridSize - 1 - priorY) * tileSize + edgePadding
                                        : priorY * tileSize + edgePadding
    ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // yellow with 50% opacity
    ctx.fillRect(
      priorX * tileSize + edgePadding,
      newPriorY,
      highlightSize,
      highlightSize
    );

    // Highlight the destination tile
    const newNewY = humanPlayer === 0? (gridSize - 1 - newY) * tileSize + edgePadding
                                        : newY * tileSize + edgePadding
    ctx.fillStyle = `rgba(200, 252, 0, 0.5)`; // Lime green with 50% opacity
    ctx.fillRect(
      newX * tileSize + edgePadding,
      newNewY,
      highlightSize,
      highlightSize
    );
  }

  /*
  // Copy absolute board to temp board variable
  var board = [];
  for (var i = 0; i < boardState.length; i++)
    board[i] = boardState[i].slice();
  // If black, flip the board
  if (humanPlayer === 1) {
    // Traverse each row of arr
    for (i = 0; i < board.length; i++) {
      // Initialise start and end index
      var start = 0;
      var end   = board.length - 1;
      // Till start < end, swap the element
      // at start and end index
      while (start < end) {
          // Swap the element
          var temp = board[i][start];
          board[i][start] = board[i][end];
          board[i][end] = temp;
          // Increment start and decrement
          // end for next pair of swapping
          start++;
          end--;
      }
    }
  }
  */
  
  // Draw the pieces on the board
  // We will be using text characters in the interim to represent pieces
  //Loop through each square, and if a piece occupies that square, draw it
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      let pieceValue = boardState[i][j];
      if (pieceValue != 0) {
        if (textMode) {
          //draw letters to represent pieces instead of images
          let pieceName = getPieceName(Math.abs(pieceValue));
          if (pieceValue > 0)
            ctx.fillStyle = 'pink';
          else
            ctx.fillStyle = "black";
          ctx.font = 'bold 40px sans-serif';
          var x = humanPlayer === 0 ? i : 8 - (i * 2); // Flipped board X
          var y = humanPlayer === 0 ? j : 8 - (j * 2); // Flipped board Y
          // White's perspective
          ctx.fillText(pieceName,
                      (edgePadding + (tileSize / 4)) + (x * tileSize),
                      (y * tileSize)
                      );
        } else {
          //draw piece icons
          const imgX = (i * tileSize) + edgePadding;
          const imgY = (gridSize * tileSize) - (j * tileSize) - edgePadding;
          ctx.drawImage(pieceImages[GetPieceImageFilename(pieceValue)],
                        imgX, 
                        imgY,
                        tileSize,
                        tileSize);
        }
      }
    }
  }

  // If a tile is selected, and is on the grid, highlight it
  var selTile = [...selectedTile]; //shallow copy
  if (humanPlayer === 1)           //if black, reverse Y
    selTile[1] = 7 - selTile[1];
  if (   selTile[0] > -1 
      && selTile[0] < gridSize 
      && selTile[1] > -1 
      && selTile[1] < gridSize) {
    var topLeftX = (selTile[0] * tileSize) + edgePadding;
    var topLeftY = (gridSize * tileSize) - (selTile[1] * tileSize) - edgePadding;
    var highlightPadding = 1;
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "yellow";
    ctx.rect(topLeftX + highlightPadding, topLeftY + highlightPadding, tileSize - highlightPadding, tileSize - highlightPadding);
    ctx.stroke();
  }
}