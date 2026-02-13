import { createSlice, current } from '@reduxjs/toolkit';
const generateCanvas = (rows, columns) => {
  let newBoard = Array.from({ length: rows }, () => Array(columns).fill(null));
  return newBoard;
};
const generateBoard = (grid, gameObjects) => {
  const board = generateCanvas(grid.rows, grid.columns);
console.log('rendering board again: ',grid,gameObjects,board);
  if (gameObjects !== undefined)
    gameObjects?.forEach(gameObject => {
      board[gameObject.piece.CurrentPosition.row-1][gameObject.piece.CurrentPosition.column-1] 
      = { ...gameObject, position: [gameObject.piece.CurrentPosition.row, gameObject.piece.CurrentPosition.column] }
    });

    console.log('rendering after board: ',board);
  return board;
}
const initialState = {
  canvas: { id: 'canvas1', width: 300, height: 300, backgroundImage: '' },
  loadCanvas: generateCanvas(3, 3),
  grid: { id: '3x3Grid', rows: 3, columns: 3, width: 100, height: 100, layer: 1 },
  objects: [
    { id: '1', name: 'PawnPlayer1', piece: { type: 'Pawn', color: 'black', symbol: 'P', size: { height: 80, width: 80 }, moves: ['up', 'down'], player: 1, position: { row: '0', column: '1' }, animation: { onClick: { size: 1.1, sound: 'somesound' }, onMove: { rotate: -35, sound: 'somesound' }, onCapturedSelf: { rotate: 35, sound: 'somesound' }, onCapturedOther: { rotate: 45, sound: 'somesound' } } }, layer: 1, position: [0, 1] },
    { id: '2', name: 'PawnPlayer2', piece: { type: 'Pawn', color: 'white', symbol: 'P', size: { height: 80, width: 80 }, moves: ['up', 'down'], player: 2, position: { row: '2', column: '2' }, animation: { onClick: { size: 1.1, sound: 'somesound' }, onMove: { rotate: -35, sound: 'somesound' }, onCapturedSelf: { rotate: 35, sound: 'somesound' }, onCapturedOther: { rotate: 45, sound: 'somesound' } } }, layer: 3, position: [2, 2] }
  ],
  loadBoard: generateBoard({ rows: '3', columns: '3' }, undefined),
  UiList: [],
  // startUi:{id:'startUi',name:'start',justify:'top',size:{width:300,height:50},text:{content:'Start the game!',position:'150ox, 25px'}},
  // turnUi:{id:'turnUi',name:'turn',justify:'top',size:{width:300,height:50},text:{content:'Player\'s turn!',position:'150ox, 25px'}},
  // endUi:{id:'endUi',name:'end',justify:'top',size:{width:300,height:50},text:{content:'Game Over!',position:'150ox, 25px'}},
  // winUi:{id:'winUi',name:'end',justify:'top',size:{width:300,height:50},text:{content:'Congratulation, you won!!',position:'150ox, 25px'}},
  selectedPiece: null,
  currentPlayer: 'player1', // initial setup for player 1 player 2 logic,
  playerTurn: '', // 2 player turn logic from socket
  currentUi: {},
  turnTime: 0,// default 0, no time bound, if >0 time bound events, then need to move the turn within this time frame.(in seconds)
  gameTime: 0,//default 0, no time bound game, if >0 game is valid for game time after joining the player. (in seconds),
  players: [],
  possibleMoves:{},//{objectId:...,possible_moves:[....]}
  gameState: 'waiting',// 'playing', 'over',win,
  capturedObjects: [],
  winState: { winner: '', points: 0, gameOver: false, imageUrl: '', winSound: '', sound: '' }
}

const playGameSlice = createSlice({
  name: 'playgame',
  initialState: initialState,
  reducers: {
    toggleTurn: (state) => {
      state.currentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1'
    },
    // TBD need to remove it, now setInitialTurn
    toggleTurnForPlayer: (state, action) => {
      if (state.players.length > 1) {
        const name = state.players.filter((player) => player.name !== action.payload)?.[0]?.name;
        state.playerTurn = name;
      } else state.playerTurn = action.payload; // ser username of player;
      // state.playerTurn=action.payload; // ser username of player;
      // state.currentUi.id =state.turnUi.id ;
    },
    setInitialTurn: (state, action) => {
      state.playerTurn = action.payload; // ser username of player;
      state.currentUi = state.UiList[1];
    },
    movePiece: (state, action) => {
      //     const { startX, startY, endX, endY } = action.payload;
      //     state.board[endY][endX] = state.board[startY][startX];
      //     state.board[startY][startX] = null;
      //   state.selectedPiece = null;
      const { from, to } = action.payload;
      console.log('{ from, to } : ',{ from, to } );
      // console.log('state.loadBoard[from.y][from.x] before error: ',current(state.loadBoard[from.y][from.x]));
      // state.loadBoard[from.Row][from.Column].CurrentPosition = [to.Row, to.Column];//= state.board[from.y][from.x];
      console.log(' state.loadBoard[from.Row][from.Column] before error: ',current(state.loadBoard));
     // state.loadBoard[to.Row][to.Column] = state.loadBoard[from.Row][from.Column];//{...state.loadBoard[from.Row][from.Column],CurrentPosition: [to.Row, to.Column]};

      // state.loadBoard[to.Row][to.Column].CurrentPosition = [to.Row, to.Column];//= state.board[from.y][from.x];
     // state.loadBoard[from.Row][from.Column] = null;
// need to change the current Objects CurrentPosition as well :)
console.log('current objects: ',current(state.objects));
      const objectToChange=state.objects.find(obj=>obj.ObjectID===from.piece.ObjectID);
      const objeToMoveCaptureObjects=state.objects.find(obj=>obj?.piece?.CurrentPosition?.column===to.Column && obj?.piece?.CurrentPosition?.row===to.Row);
      if(objeToMoveCaptureObjects!==undefined){
        console.log(' objectToChange : objeToMoveCaptureObjects!==undefined > ',current(objeToMoveCaptureObjects));
       // objeToMoveCaptureObjects=null;
       state.capturedObjects=[...state.capturedObjects,objeToMoveCaptureObjects];
       state.objects=state.objects.filter(objectToRemove=>objectToRemove.ObjectID!==objeToMoveCaptureObjects.ObjectID);
      //  console.log(' state.objects : ', current(state.objects));
      }
      // console.log(' objectToChange : ', objectToChange);
      // console.log('current objects objectToChange: ',current(objectToChange));
      if(objectToChange?.ObjectID!==undefined){
        console.log(' objectToChange : >objectToChange?.ObjectID!==undefined > ', current(objectToChange));
        objectToChange.piece.CurrentPosition.row= to.Row ;
        objectToChange.piece.CurrentPosition.column= to.Column ;
        objectToChange.CurrentPosition=[to.Row,to.Column];
      }
     
      //Working with x and Y>>> given below
      //   state.loadBoard[to.y][to.x] = state.loadBoard[from.y][from.x];
      //  state.loadBoard[to.y][to.x].position = [to.y, to.x];//= state.board[from.y][from.x];
      //   state.loadBoard[from.y][from.x] = null;
      // end working for x and y
    },
    selectPiece: (state, action) => {
      state.selectedPiece = action.payload;
    },
    clearSelectedPiece: (state) => {
      state.selectedPiece = null;
    },
    possibleMoves: (state, action) => {
      state.possibleMoves = action.payload;
    },
    clearPossibleMoves: (state) => {
      state.possibleMoves = {};
    },
    setCaptauredObjects:(state,action)=>{
      if(state.capturedObjects?.find(object=>object?.ObjectID===action.payload?.captured_object_item?.ObjectID)===undefined){
        state.capturedObjects=[...state.capturedObjects,action.payload.captured_object_item];
      }
        
      // state.capturedObjects=action.payload.captured_objects;
    },
    togglePlayer: (state) => {
      state.currentPlayer = state.currentPlayer === 'player1' ? 'player2' : 'player1';
    },
    setPlayers: (state, action) => {
      state.players = [...JSON.parse(action.payload)];
    },
    changeGameState: (state, action) => {
      console.log('change game state action : ', action.payload);
      state.canvas = action.payload.canvas;
      state.objects = action.payload.objects;
      state.grid = action.payload.grid;
      state.UiList = [...action.payload.uiList];
      state.loadBoard = generateBoard(action.payload.grid, action.payload.objects);
    },
    refreshBoard: (state) => {
      console.log('change game state action : ');
      const renderedBoard=generateBoard(current(state.grid),current(state.objects));
      console.log('refresh board: > ',renderedBoard);
      state.loadBoard = renderedBoard;
    },
    setCurrentUi: (state, action) => {
      state.currentUi = state.UiList[action.payload];
    },

    setGameCurrentGameState: (state, action) => {
      state.gameState = action.payload;
    },
    setWinState: (state, action) => {
      console.log('winner state: ', action.payload);
      state.winState = { ...state.gameState, ...action.payload }
    }
  }
});

export const { move, toggleTurn, toggleTurnForPlayer, setInitialTurn,
  changeGameState, movePiece, selectPiece,
  clearSelectedPiece, togglePlayer, setCurrentUi,
  setGameCurrentGameState, setWinState, setPlayers,
  updateWinUi, updateEndUi,possibleMoves,clearPossibleMoves,refreshBoard,setCaptauredObjects
} = playGameSlice.actions;
export default playGameSlice.reducer;
