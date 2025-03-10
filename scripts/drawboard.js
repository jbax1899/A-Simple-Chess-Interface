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

  if (gameStarted) {
    // Highlight the prior move
    if (lastMove !== null) {
      const [piece, [priorX, priorY], [newX, newY]] = lastMove;
      const highlightSize = tileSize;

      // Highlight the prior tile
      const newPriorX = humanPlayer === 0 ? priorX * tileSize + edgePadding
                                          : (gridSize - 1 - priorX) * tileSize + edgePadding
      const newPriorY = humanPlayer === 0 ? (gridSize - 1 - priorY) * tileSize + edgePadding
                                          : priorY * tileSize + edgePadding
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Yellow with 50% opacity
      ctx.fillRect(newPriorX, newPriorY, highlightSize, highlightSize);

      // Highlight the destination tile
      const newNewX = humanPlayer === 0 ? newX * tileSize + edgePadding
                                        : (gridSize - 1 - newX) * tileSize + edgePadding
      const newNewY = humanPlayer === 0 ? (gridSize - 1 - newY) * tileSize + edgePadding
                                        : newY * tileSize + edgePadding
      ctx.fillStyle = `rgba(200, 252, 0, 0.5)`; // Lime green with 50% opacity
      ctx.fillRect(newNewX, newNewY, highlightSize, highlightSize);
    }

    // Draw the pieces on the board
    // We will be using text characters in the interim to represent pieces
    //Loop through each square, and if a piece occupies that square, draw it
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        const x = humanPlayer === 0 ? i : 7 - i; // Flipped board X
        const y = humanPlayer === 0 ? j : 7 - j; // Flipped board Y
        var pieceValue = boardState[x][y];
        if (pieceValue != 0) {
          if (textMode) {
            //draw letters to represent pieces instead of images
            let pieceName = getPieceName(Math.abs(pieceValue));
            if (pieceValue > 0)
              ctx.fillStyle = 'pink';
            else
              ctx.fillStyle = "black";
            ctx.font = 'bold 40px sans-serif';
            ctx.fillText(pieceName,
                        (x * tileSize) + edgePadding + (tileSize / 4),
                        (gridSize * tileSize) - ((j - 1) * tileSize) - (edgePadding * 1.5));
          } else {
            //draw piece icons
            const imgX = (i * tileSize) + edgePadding;
            const imgY = (gridSize * tileSize) - (j * tileSize) - edgePadding;
            const pieceImage = pieceImages[GetPieceImageFilename(pieceValue)];
            if (pieceImage) {
              ctx.drawImage(pieceImage, imgX, imgY, tileSize, tileSize);
            }
          }
        }
      }
    }

    // If a tile is selected, and is on the grid, highlight it
    var selTile = [...selectedTile]; //shallow copy
    if (humanPlayer === 1) {         //if black, reverse
      selTile[0] = 7 - selTile[0]; 
      selTile[1] = 7 - selTile[1];
    }
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
}