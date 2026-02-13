import { createSlice } from '@reduxjs/toolkit';

const gameData = {
  board: {
    rows: 3,
    columns: 3
  },
  gameObjects: [
    {
      "id": "rook",
      "name": "Rook",
      "symbol": "R",
      //"movement": [...]
    },
    {
      "id": "knight",
      "name": "Knight",
      "symbol": "K",
      // "movement": [...]
    },
    {
      "id": "rook_2",
      "name": "Rook",
      "symbol": "R",
      //"movement": [...]
    },
    {
      "id": "knight_2",
      "name": "Knight",
      "symbol": "K",
      // "movement": [...]
    },
    // ... more game objects
  ],
  // rules: [ ... ],
  // winState: { ... },
  //gameLoop: { ... }
};

const generateBoard = (rows, columns, gameObjects) => {
  //   return Array(rows).fill(Array(columns).fill(null));
  console.log('gameObjects: ', gameObjects)
  let newBoard = Array.from({ length: rows }, () => Array(columns).fill(null));

  // Placing pieces for player1 on the first row
  newBoard[0][0] = { piece: { type: 'rook', color: 'black', moves: ['up', 'down'], player: 1 }, position: [0, 0] };
  newBoard[0][1] = { piece: { type: 'knight', color: 'black', moves: ['up', 'down'], player: 1 }, position: [0, 1] };
  newBoard[0][2] = { piece: { type: 'rook', color: 'black', moves: ['up', 'down'], player: 1 }, position: [0, 2] };
  //newBoard[1][6] = "knight";

  // Placing pieces for player2 on the last row
  newBoard[2][0] = { piece: { type: 'rook_2', color: 'White', moves: ['up', 'down'], player: 2 }, position: [2, 0] };
  newBoard[2][1] = { piece: { type: 'knight_2', color: 'White', moves: ['up', 'down'], player: 2 }, position: [2, 1] };
  newBoard[2][2] = { piece: { type: 'rook_2', color: 'White', moves: ['up', 'down', 'left', 'right'], player: 2 }, position: [2, 2] };
  // ifreturn gameObjects!==undefined?
  if (gameObjects !== undefined) GetBoard(newBoard, gameObjects);//newBoard;
  return newBoard;

};
const GetBoard = (board, gameObjects) => {
  gameObjects?.forEach(gameObject => {
    board[gameObject.position.row][gameObject.position.column] = { piece: { ...gameObject }, position: [gameObject.position.row, gameObject.position.column] }
    console.log('[x][y] : ', gameObject.position, board);
  });

}
const initialState = {
  board: generateBoard(gameData.board.rows, gameData.board.columns, this?.gameObjects),
  boardRXC: gameData.board,
  gameObjects: gameData.gameObjects,
  rules: gameData.rules,
  winState: gameData.winState,
  gameLoop: gameData.gameLoop,
  currentTurn: 'player1',
  turnCount: 0,
  selectedPiece: null,
  currentPlayer: 'player1',// gameData.gameLoop.startingPlayer,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    movePiece: (state, action) => {
      console.log('move piece action: ', action);
      //     const { startX, startY, endX, endY } = action.payload;
      //     state.board[endY][endX] = state.board[startY][startX];
      //     state.board[startY][startX] = null;
      //   state.selectedPiece = null;
      const { from, to } = action.payload;
      state.board[to.y][to.x] = state.board[from.y][from.x];
      state.board[to.y][to.x].position = [to.y, to.x];//= state.board[from.y][from.x];



      state.board[from.y][from.x] = null;
      // Implement logic for rules, game loop, win states, etc.
    },
    selectPiece: (state, action) => {
      state.selectedPiece = action.payload;
    },
    clearSelectedPiece: (state) => {
      state.selectedPiece = null;
    },
    togglePlayer: (state) => {
      state.currentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';
    },
    setGameState: (state, action) => {
      console.log('game objects update,', action.payload);
      state.gameObjects = action.payload;
      state.board = generateBoard(gameData.board.rows, gameData.board.columns, state.gameObjects);
    }
  }
});

export const { movePiece, selectPiece, clearSelectedPiece, togglePlayer, setGameState } = gameSlice.actions;
export default gameSlice.reducer;
