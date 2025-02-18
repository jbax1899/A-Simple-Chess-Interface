function fitBoardToWidth() {
    const boardWrapper = document.getElementById('boardWrapper');
    const availableWidth = boardWrapper.clientWidth;
    const availableHeight = window.innerHeight * 0.7; // 70% of the window height
    const maxDimension = Math.min(availableWidth, availableHeight);
    const newWidth = Math.max(320, Math.min(1280, maxDimension));
    const originalTileSize = newWidth / gridSize;
    tileSize = Math.floor(originalTileSize / 10) * 10; // Round down to nearest multiple of 10
    const adjustmentFactor = tileSize / originalTileSize;
    edgePadding = tileSize / 2;
    const adjustedWidth = tileSize * gridSize;
    canvas.style.width = `${adjustedWidth}px`;
    canvas.style.height = `${adjustedWidth}px`;
    canvas.width = adjustedWidth + (2 * edgePadding);
    canvas.height = adjustedWidth + (2 * edgePadding);
    DrawBoard(adjustmentFactor);
}

// Resize board when the window is resized
window.addEventListener('resize', fitBoardToWidth);
window.addEventListener('load', fitBoardToWidth);

function AddEventListeners() {
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
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
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
}