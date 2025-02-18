// Detect mouse clicks on the canvas
canvas.addEventListener('click', (event) => {
    // Get the x and y coordinates of the click relative to the canvas
    var rect = canvas.getBoundingClientRect();
    const offsetX = edgePadding;
    const offsetY = edgePadding;
    rect.left += offsetX;
    rect.top += offsetY;
    rect.right -= offsetX;
    rect.bottom -= offsetY;
    const x = event.clientX - rect.left - edgePadding;
    const y = event.clientY - rect.top - edgePadding;
  
    // Calculate the board coordinates of the clicked tile
    var row = Math.max(0, Math.min(7, Math.abs(Math.floor(x / tileSize))));
    var col = Math.max(0, Math.min(7, Math.abs(7 - Math.floor(y / tileSize))));
    // If black, flip the coordinates
    if (humanPlayer === 1) {
        row = 7 - row;
        col = 7 - col;
    }
    // Store the previous selected tile and update the selected tile
    lastSelected = selectedTile;
    selectedTile = [row, col];
  
    // If lastSelected has a value, and selected is on the grid, attempt to move the selected piece
    if (lastSelected[0] != -1 
        && selectedTile[0] > -1 && selectedTile[0] < gridSize && selectedTile[1] > -1 && selectedTile[1] < gridSize 
    ) {
        //Move the piece
        Move(lastSelected, selectedTile);
    }

    // Redraw the board
    DrawBoard(); 
});
  
// Detect right-clicks on the canvas
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    lastSelected = selectedTile;
    selectedTile = [-1, -1];
    DrawBoard();
});

////////////////////////////////////////////////////////////////
// Resize canvas button
let resizing    = false;
let initialSize = null;
let initialX    = null;
let initialY    = null;

// Button icon
const resizeIcon  = new Image();
resizeIcon.src    = 'resources/resize.ico';

document.addEventListener('mousedown', function(event) {
    const buttonWidth = resizeIconSize;
    const buttonHeight = resizeIconSize;
    const canvasRect = canvas.getBoundingClientRect();
    const buttonRect = {
        left: canvasRect.left + canvas.width - buttonWidth,
        top: canvasRect.top + canvas.height - buttonHeight,
        right: canvasRect.left + canvas.width,
        bottom: canvasRect.top + canvas.height,
    };
    if (event.clientX >= buttonRect.left && event.clientX < buttonRect.right &&
        event.clientY >= buttonRect.top && event.clientY < buttonRect.bottom) {
        resizing = true;
        initialSize = tileSize;
        initialX = event.clientX;
        initialY = event.clientY;
    }
});

document.addEventListener('mousemove', function(event) {
    if (resizing) {
        const dx = event.clientX - initialX;
        const dy = event.clientY - initialY;
        const multiplier = 0.1; //slows the drag speed
        const minTileSize = 16;
        const maxTileSize = minTileSize * 6;
        const delta = Math.max(dx, dy) * multiplier;
        const snap = 2; //canvas snaps to a multiple of:
        tileSize = Math.ceil(Math.max(minTileSize, Math.min(maxTileSize, initialSize + delta) / snap)) * snap; //keep canvas within bounds, snap
        edgePadding = tileSize / 2;
        canvas.width = (tileSize * gridSize) + (edgePadding * 2);
        canvas.height = (tileSize * gridSize) + (edgePadding * 2);
        DrawBoard();
    }
});

document.addEventListener('mouseup', function(event) {
    resizing = false;
});
////////////////////////////////////////////////////////////////
//Side menu
document.addEventListener('input', function(event) {
    console.log('An input was changed: ' + event.target.name + ", " + event.target.value);
    switch (event.target.name) {
        case "player":
            if (confirm("Start a new game?")) {
                humanPlayer = event.target.value === "white" ? 0 : 1;
                StartGame();
            }
            break;
        case "difficulty": difficulty = parseInt(event.target.value); break;
        case "autoPromote": 
            autoPromote = event.target.checked;
            break;
        case "onlyAI":     
            onlyAI = event.target.checked;
            break;
        case "updateSpeed":
            setTimeout(CheckIfBestMoveUpdated, parseInt(event.target.value));
            break;
        default:
            console.error("Unknown input: " + event.target.name);
            break;
    }
});  