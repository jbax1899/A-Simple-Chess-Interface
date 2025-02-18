var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
console.log('wasmSupported: ' + wasmSupported);

let stockfish = new Worker(wasmSupported ? './scripts/stockfish/stockfish.wasm.js' : './scripts/stockfish/stockfish.js');

stockfish.addEventListener('message', function (e) {
  console.log(e.data);
  
  var bestMoveStated = e.data.indexOf('bestmove');
  if (bestMoveStated !== -1) {
    bestMoveLast = bestMove;
    bestMove = e.data.substring(9, 13);
  }
});

stockfish.postMessage('uci');

function Analyse() {
  //AI
  var fen = CreateFEN(boardState);
  console.log('FEN: ' + fen);
  console.log(boardState)
  stockfish.postMessage('position fen ' + fen);
  stockfish.postMessage('go depth ' + depth);
}