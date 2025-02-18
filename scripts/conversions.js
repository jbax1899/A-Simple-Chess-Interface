// Returns a string of the coordinate, like "a1"
function getCoordString(move) {
    const row = move[1];
    const col = move[0];
    const columnLetter = String.fromCharCode('a'.charCodeAt(0) + col);
    const rowNumber = row + 1;
    return columnLetter + rowNumber;
}
  
// Returns a coordinate (int array) from a string like "a1"

function getNumericCoord(str) {
  const x = str.charCodeAt(0) - 97;  // subtracting ASCII value of 'a' for index 0
  const y = parseInt(str[1]) - 1;    // subtracting 1 as chess board starts at 0 index
  return [x, y];
}

// Helper function to get the name of a piece based on its integer value
function getPieceName(pieceValue) {
  switch (pieceValue) {
    case 1:
      return 'P'; // pawn
    case 2:
      return 'N'; // knight
    case 3:
      return 'B'; // bishop
    case 4:
      return 'R'; // queen
    case 5:
      return 'Q'; // rook
    case 6:
      return 'K'; // king
    default:
      return '';
  }
}

// Helper function to get the image filename to a piece based on its integer value
function GetPieceImageFilename(pieceValue) {
  const absValue = Math.abs(pieceValue); // get absolute value of pieceValue
  
  // determine color and piece type based on the sign and absolute value of pieceValue
  const color = pieceValue > 0 ? 'w' : 'b'; // 'w' for white pieces, 'b' for black pieces
  let type = '';
  switch (absValue) {
    case 1:
      type = 'pawn';
      break;
    case 2:
      type = 'knight';
      break;
    case 3:
      type = 'bishop';
      break;
    case 4:
      type = 'rook';
      break;
    case 5:
      type = 'queen';
      break;
    case 6:
      type = 'king';
      break;
    default:
      return ''; // return empty string if pieceValue is not valid
  }
  var filename = color + '_' + type; // return the filename based on color and piece type
  return filename;
}