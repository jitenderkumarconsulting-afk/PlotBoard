import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import playGameStyle from "./play-game.module.css";
import { getPlayGameState } from "../../redux/actions/game-state";
import {
  changeGameState, togglePlayer, movePiece, setCurrentUi, clearSelectedPiece,
  setGameCurrentGameState, setWinState, setInitialTurn, setPlayers, clearPossibleMoves, refreshBoard
} from "../../redux/slices/play-game.slice";
import { socketService } from "../../api/socketGatewayService";
import { mainApp } from "../../api/urls";
import { appBaseUrl } from "../../utils/utils";

const PlayGameRoom = (props) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const auth = useSelector((state) => state.auth);
  const gameCanvas = useSelector((state) => state.playgame.canvas);
  const getGameState = useSelector((state) => state.playgame);
  const gameObjects = useSelector((state) => state.playgame.objects);
  const loadBoard = useSelector((state) => state.playgame.loadBoard);
  const playerTurnName = useSelector((state) => state.playgame.playerTurn);
  const capturedObjects = useSelector((state) => state.playgame.capturedObjects);

  const mainAppUrl = mainApp;
  const gameToken = params.token;
  let gameTimout = null;
  let clickTimeout = null;
  let toast;

  const currentPlayer =
    playerTurnName === '' || (playerTurnName === auth.user.name
      && getGameState?.players !== undefined &&
      getGameState?.players?.[0]?.name === auth.user.name)
      ? "player1"
      : "player2";

  const tileSize = getGameState.grid.height;

  const [gameState, setGameState] = useState({});
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState(getGameState.turnTime);
  const [gameTimeLeft, setGameTimeLeft] = useState(getGameState.gameTime);

  const handleCanvasClick = (event) => {
    if (!getGameState.winState.gameOver) {
      currentUi(1);
    } else {
      currentUi(3); // SET FOR WINNER AS WELL WINUI
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);

    // IF NOT playerTurnName IS EQUAL TO AUTH.USER.NAME
    console.log("clicked piece: ", selectedPiece, playerTurnName);
    if (playerTurnName !== auth.user.name) {
      toast.show({
        severity: "error",
        summary: "Invalid Move!",
        detail: "Oh... It is not your turn, It is " + playerTurnName.toUpperCase() + "'s Turn",
        life: 3000
      });
      return;
    }

    // Check if the clicked tile has a piece
    const clickedPiece = loadBoard[y][x];
    console.log('Clicked piece: ',clickedPiece,selectedPiece);

    //Logic to canCapture

    //Logic to canCapture end

var validonemoveForOject=getGameState.possibleMoves.ObjectID===selectedPiece?.piece?.piece?.ObjectID;
var canCaptureThisObject=false;
    if(validonemoveForOject===true){
      var checkForValid=getGameState?.possibleMoves?.possible_moves?.find(item=>item?.Row===clickedPiece.Row && item?.Column===clickedPiece.Column);
      console.log('IsValidMove>valid one move: ',checkForValid,checkForValid!==undefined?true:false);
      if(checkForValid!==undefined){canCaptureThisObject= true;}
    }

     //Logic to check Player Turn and click event
    const playerTurn = currentPlayer === "player1" ? 1 : 2;
    console.log("clicked piece: ", selectedPiece, playerTurn,clickedPiece,currentPlayer);
    if (clickedPiece &&
      playerTurn.toString() !== clickedPiece?.piece?.player?.toString()  && canCaptureThisObject
      ) {
      console.log("it's not your turn");
      toast.show({
        severity: "error",
        summary: "Invalid Move!",
        detail: "Oh... It is not your turn, It is " + playerTurnName.toUpperCase() + "'s Turn",
        life: 3000
      })

      //setSelectedPiece(null);
      return;
    }
    if(selectedPiece!==null &&  clickedPiece!==null 
      &&  playerTurn.toString() === clickedPiece?.piece?.player?.toString() && 
      selectedPiece?.piece?.piece?.player?.toString() === clickedPiece?.piece?.player?.toString()) {
        setSelectedPiece(null);
      dispatch(clearPossibleMoves());
    //socketService.sendPossibleMoves(JSON.stringify({ObjectID:clickedPiece.piece.ObjectID,from:{...clickedPiece.piece.CurrentPosition}}));
    socketService.sendPossibleMoves(
      JSON.stringify({
        data: {
          ObjectID: clickedPiece.ObjectID,
          from: {
            Column: clickedPiece.piece.CurrentPosition.column,
            Row: clickedPiece.piece.CurrentPosition.row,
          },
          
        },
        gameToken: gameToken,
        userId:auth.user.id
      })
    );
    return;
  }
    if (
      selectedPiece  &&
      playerTurn.toString() !== selectedPiece?.piece.piece?.player?.toString() 
    ) {
      console.log('oh, it is not your turn');

      toast.show({
        severity: "error",
        summary: "Invalid Move!",
        detail: "Oh... It is not your turn, It is " + playerTurnName.toUpperCase() + "'s Turn",
        life: 3000
      })

      setSelectedPiece(null);
      dispatch(clearPossibleMoves());
      return;
    }
    if(selectedPiece===null &&  clickedPiece!==null) {
        
      dispatch(clearPossibleMoves());
    //socketService.sendPossibleMoves(JSON.stringify({ObjectID:clickedPiece.piece.ObjectID,from:{...clickedPiece.piece.CurrentPosition}}));
    socketService.sendPossibleMoves(
      JSON.stringify({
        data: {
          ObjectID: clickedPiece.ObjectID,
          from: {
            Column: clickedPiece.piece.CurrentPosition.column,
            Row: clickedPiece.piece.CurrentPosition.row,
          }
        },userId:auth.user.id,
        gameToken: gameToken,
      })
    );
  
  }
  
    let movementMade = false; // Initialize the flag

    // logic to check for invalid move
    if (selectedPiece && !IsValidMove(selectedPiece, { Column: x+1, Row: y+1 })) {
      console.log("from and to :", selectedPiece, { Column: x+1, Row: y+1 });
      toast.show({
        severity: "error",
        summary: "Invalid Move!",
        detail: "This move is not valid!",
        life: 3000
      })
      setSelectedPiece(null);
      dispatch(clearPossibleMoves());
      return;
    }

    if (clickedPiece && (selectedPiece===null || selectedPiece===undefined)) {
      setSelectedPiece({ Column: x+1, Row: y+1, piece: clickedPiece });
    } else if (selectedPiece) {
      console.log('move event: ', { from: selectedPiece, to: { x, y } });
      socketService.sendMove(JSON.stringify({ data: { ObjectID: selectedPiece.piece.ObjectID, Player: selectedPiece.piece.piece.player, from: { Column: selectedPiece.Column, Row: selectedPiece.Row }, to: { Column: x+1, Row: y+1 }, data: selectedPiece }, gameToken: gameToken,userId:auth.user.id }));
      dispatch(movePiece({ from: selectedPiece, to: { Column: x+1, Row: y+1 } }));
      setSelectedPiece(null);
      movementMade = true; // Set the flag to true when a piece is moved
    }

    if (movementMade) {
      dispatch(togglePlayer());
      console.log('before loadBoard ', loadBoard)
      dispatch(refreshBoard())
      dispatch(clearPossibleMoves());
      console.log('after loadBoardor : ', loadBoard)
      socketService.sendMessage(JSON.stringify({ data: 'turn|' + auth.user.name, gameToken: gameToken,userId:auth.user.id }));
      if (getGameState.turnTime > 0) {
        console.log('turn time is enabled for : ', getGameState.turnTime + 's')
        turnTimeOver();
      }
    }
  };

  const IsValidMove = (from, to) => {
    let direction = currentPlayer === "player1" ? 1 : -1;
    const playerTurn = currentPlayer === "player1" ? 1 : 2;
    console.log("from, to: ", from, to);
console.log('IsValidMove getGameState.possibleMovesData : ',getGameState.possibleMoves);
    var validonemoveForOject=getGameState.possibleMoves.ObjectID===from.piece.ObjectID;
    if(validonemoveForOject===true){
      var checkForValid=getGameState.possibleMoves.possible_moves.find(item=>item.Row===to.Row && item.Column===to.Column);
      console.log('IsValidMove>valid one move: ',checkForValid,checkForValid!==undefined?true:false);
      if(checkForValid!==undefined){return true;}else{
        return false;
      }
     // return false;
    }else{
      dispatch(clearPossibleMoves());
      console.log('IsValidMove>not valid one move');
      return false;
    }

    console.log("from, to: ", from, to);
    // console.log("from, to: ",from?.piece?.piece?.moves?.find(item=>item?.find(it=>it?.Direction==="up")));
    // logic for player moving up
    if (from.Row > to.Row) { //to: { Column:x, Row:y }
      var step = "down";

      console.log(
        "Before whic is this? ?direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction,
        from.piece.piece.moves.includes("up")
      );

      // Playerx move up, values from, to
      direction = -1;
      if (playerTurn === 2) {
        step = "up";
        // check if move is up for player 2
        // direction=1;
      }
      var newDirectionObj=from.piece.piece.moves.find(item=>item.find(it=>it.Direction===step));
      var newdirection=newDirectionObj.find(it=>it.Direction===step);//.Squares[0];
      // direction=direction<1? newDirection* -1:newdirection;

      // console.log("from, to: newDirection > ",newDirection);
      // console.log("from, to: direction> ",direction);
      if (newdirection){//from.piece.piece?.moves?.includes(step)) {
        console.log(" you have permission for it, go and move one...");
      } else {
        return false;
      }

      //from.x===to.x && from.y+direction===to.y
      console.log(
        "After  whic is this? ?direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
    } else {

      console.log(
        "direction for current player : ",
        playerTurn,
        currentPlayer,
        direction
      );
    }
    if (from.Row < to.Row) {//to: { Column:x, Row:y }
      var step = "up";
      // var newDirection=from.piece.piece.moves.find(item=>item.find(it=>it.Direction===step));
      // direction=newDirection.find(it=>it.Direction===step).Squares[0];
      // console.log("from, to: newDirection > ",newDirection);
      // console.log("from, to: direction> ",direction);
      console.log(
        "Before direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );

      // Playerx move up, values from, to
      // direction=-1;
      if (playerTurn === 2) {
        step = "down";
        direction = 1;
      }
      var newDirectionObj=from.piece.piece.moves.find(item=>item?.find(it=>it.Direction===step));
      var newdirection=newDirectionObj?.find(it=>it.Direction===step);//.Squares[0];
      if (newdirection){//from.piece.piece?.moves?.includes(step)) {
        console.log(" you have permission for it, go and move one...");
      } else {
        return false;
      }

      //from.x===to.x && from.y+direction===to.y
      console.log(
        "After direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
    }

    // logic for player left turn
    if (from.Column > to.Column) {//to: { Column:x, Row:y }
      var step = "left";
      console.log(
        "Before left  direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
      // Playerx move up, values from, to
      direction = -1;
      if (playerTurn === 2) {
        //step = "right";
        // direction=1;
      }
      var newDirectionObj=from.piece.piece.moves.find(item=>item.find(it=>it.Direction===step));
      var newdirection=newDirectionObj.find(it=>it.Direction===step);//.Squares[0];
      if (newdirection){//if (from.piece.piece?.moves?.includes(step)) {
        console.log(" you have permission for it, go and move one...");
      } else {
        return false;
      }
      //
      //from.x===to.x && from.y+direction===to.y
      console.log(
        "After direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
    } else {
      console.log(
        "direction for current player : ",
        playerTurn,
        currentPlayer,
        direction
      );
    }
    // right turn
    if (from.Column < to.Column) {
      var step = "right";
      direction = 1;
      console.log(
        "Before  right turn direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
      if (playerTurn === 2) {
        //step = "left";
        // direction=1;
      }
      console.log(
        "after  right turn direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction
      );
      // var newDirectionObj=from.piece.piece.moves?.find(item=>item?.find(it=>it?.Direction===step));
      // var newdirection=newDirectionObj?.find(it=>it?.Direction===step);//.Squares[0];
      // if (newdirection){//if (from.piece.piece?.moves?.includes(step)) {
      //   console.log(" you have permission for it, go and move one...");
      // } else {
      //   return false;
      // }
      //
    }
    // console.log('direction for current player : ',playerTurn,currentPlayer,direction);
    if (from.Row + direction === to.Row) { //to: { Column:x, Row:y }
      console.log(
        playerTurn,
        currentPlayer,
        direction,
        " move up condition for player"
      );
    }
    if (from.Row === to.Row + direction) {
      console.log(" move down condition for player");
    }
    if (from.Column + direction === to.Column) {
      console.log(" move right condition for player");
    }
    if (from.Column === to.Column + direction) {
      console.log(" move left condition for player");
    }
    console.log(
      "IsValidMove check from.x+1===to.x:",
      from.Column === to.Column && from.Row + direction === to.Row
    );
    var newDirectionObj=from.piece.piece.moves.find(item=>item.find(it=>it.Direction===step));
    var newdirection=newDirectionObj.find(it=>it.Direction===step).Squares[0];
    direction=direction<1? newdirection* -1:newdirection;
    //up down logic
    if (from.Column === to.Column && from.Row + direction === to.Row) {
      console.log("up downlogic");
      // logic to check block empty to pending
      return true;
    }

    //left right logic
    if (from.Row === to.Row && from.Column + direction === to.Column) {
      // logic to check block empty to pending
      return true;
    }
    console.log("Is valid move clicked: ", from, to);
    return false;
  };

  const CanCapture=(from,to)=>{
    return false;
  }

  const currentUi = (currentGameState) => {
    dispatch(setCurrentUi(currentGameState));
  };
  let timeIntervalTurn = null;
  let timeIntervalGame = null;
  const turnTimeOver = () => {
    const turnTimeoutDuration = getGameState.turnTime;
    timeIntervalTurn = setInterval(() => {
      if (turnTimeLeft === 0) {
        clearTimeout(timeIntervalTurn);
        setTurnTimeLeft((prevState) => {
          return 0;
        });
        setSelectedPiece(null);
        //  dispatch(setCurrentUi({ id: getGameState.turnUi.id }));
        dispatch(setCurrentUi(1));
        dispatch(clearSelectedPiece());
        dispatch(setGameCurrentGameState("playing")); //set win, if user is winner
        dispatch(togglePlayer());
      } else {
        console.log("turn time remaining: ", turnTimeLeft);
        setTurnTimeLeft((prevState) => {
          if (prevState <= 0) {
            clearTimeout(timeIntervalTurn);
            return 0;
          }

          return prevState - 1;
        });
      }
    }, 1000);
    clickTimeout = setTimeout(() => {
      //TBD >> timer need to clear, otherwise may be adverse affects
      setSelectedPiece(null);
      // dispatch(setCurrentUi({ id: getGameState.turnUi.id }));
      dispatch(setCurrentUi(1));
      dispatch(clearSelectedPiece());
      dispatch(setGameCurrentGameState("playing")); //set win, if user is winner
      dispatch(togglePlayer());
    }, turnTimeoutDuration);
  };
  const gameTimeOver = () => {
    const gameTimeoutDuration = getGameState.gameTime * 1000;

    timeIntervalGame = setInterval(() => {
      if (gameTimeLeft === 0) {
        setGameTimeLeft((prevState) => {
          return 0;
        });
        setSelectedPiece(null);
        // dispatch(setCurrentUi({ id: getGameState.endUi.id }));
        dispatch(setCurrentUi(3));
        dispatch(setGameCurrentGameState("over")); //set win, if user is winner
        dispatch(clearSelectedPiece());
        dispatch(
          setWinState({ winner: "Kashmir Singh", gameOver: true, points: 1313 })
        );
        socketService.leaveRoom(gameToken);
        clearTimeout(timeIntervalTurn);
        clearTimeout(timeIntervalGame);
      } else {
        // console.log("game time remaining: ", gameTimeLeft);
        setGameTimeLeft((prevState) => {
          if (prevState <= 0) return 0;

          return prevState - 1;
        });
      }
    }, 1000);
    gameTimout = setTimeout(() => {
      //setGameTimeLeft([gameTimeLeft]-1);
      //TBD >> timer need to clear, otherwise may be adverse affects
      setSelectedPiece(null);
      dispatch(setCurrentUi(3));//{ id: getGameState.endUi.id }));
      dispatch(setGameCurrentGameState("over")); //set win, if user is winner
      dispatch(clearSelectedPiece());
      dispatch(
        setWinState({ winner: "Kashmir Singh", gameOver: true, points: 1313 })
      );
    }, gameTimeoutDuration);
  };

  const OnGameExitHandler = () => {
    toast.show({
      severity: "info",
      summary: "Exit Game!",
      detail: "You clicked on 'Exit'. Thank for your time, hope you enjoyed it.",
      life: 3000
    })
    socketService.leaveRoom(gameToken);
    navigate("/");
  }
  const renderBoard = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    //get all image path
    const pawnImageId = document.getElementById("pawnImageId");
    // ctx.drawImage(pawnImageId, 10, 10);/
    console.log('getGameState.objects > ', gameObjects);
    console.log('getGameState.objects > ', getGameState);
    console.log('loadBoard > ', loadBoard);
    
    for (let y = 0; y <getGameState.grid.rows; y++) {
      for (let x = 0; x <getGameState.grid.columns; x++) {
        // Alternate colors for a checkerboard pattern or however you want to style it.
        let hoverColor=undefined;
        const canHover=getGameState.possibleMoves?.possible_moves?.find(item=>item?.Row===y+1 && item?.Column===x+1);
        // console.log('hightlight logic: ',canHover,getGameState.possibleMoves);
        if(canHover!==undefined){
          hoverColor="green";
        }
        const tileColor = (x + y) % 2 === 0 ? "#eeeeee" : "#dddddd";
        ctx.fillStyle = hoverColor??tileColor;
        // ctx.fillStyle = tileColor;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        // If there's a game piece at this position, render it

        if (loadBoard[y][x]) {
          // console.log('loadBoard[y][x] > ', loadBoard[y][x]);
          // Image logic working
          const imagen = new Image();
          // const whitePawn="http://localhost:3000/images/game/pawn.svg";
          // const blackPawn="http://localhost:3000/images/game/pawn_black.svg";
          if (loadBoard[y][x]?.piece?.player) {
            // const pawn=loadBoard[y][x]?.piece.player === 1?whitePawn:blackPawn;
            imagen.onload = () => {
              ctx.drawImage(imagen, (x) * tileSize, (y) * tileSize, tileSize - 5, tileSize - 5);
            }
            // imagen.src=pawn;//"http://localhost:3000/images/game/pawn.svg";
            imagen.src = `${appBaseUrl}${loadBoard[y][x]?.piece?.Image}`;//"http://localhost:3000/images/game/pawn.svg";
          }
          ctx.fillStyle = `${loadBoard[y][x]?.piece?.color}` // `${loadBoard[y][x]?.piece.player === 1 ? 'black' : 'red'}`;
          ctx.font = "36px Arial";
          // ctx.fillText(
          //   `${getGameState.objects.find((obj) => obj.ObjectID === loadBoard[y][x].ObjectID) //board[y][x].piece.type)
          //     ?.piece.symbol || ""
          //   }`,
          //   x * tileSize + tileSize / 2 - 10,
          //   y * tileSize + tileSize / 2 + 10
          // );
          if (loadBoard[y][x]?.ObjectID===getGameState.possibleMoves?.ObjectID){
            ctx.fillStyle="lightgreen";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }

        }
      }
    }
   
  };

  useEffect(() => {
    renderBoard();

    if (getGameState.gameTime > 0) {
      gameTimeOver();
    }

    if (getGameState.turnTime > 0) {
      console.log('turn time is enabled for : ', getGameState.turnTime + 's')
      turnTimeOver();
    }

    return () => {
      clearTimeout(gameTimout);
      clearTimeout(clickTimeout);
    };
  }, [loadBoard,gameObjects,gameToken,getGameState.possibleMoves,capturedObjects]);

  useEffect(() => {
    if (auth.user?.name === "" && searchParams?.get("name") === "") {
      toast.show({
        severity: "error",
        summary: "Unauthorized!",
        detail: "You are not authorized to this game",
        life: 3000
      })
      return;
    }
    if (gameToken && auth.accessToken !== "") {
      dispatch(getPlayGameState(gameToken, (result) => {

        if (result.success) {
          setGameState(result.data);
          console.log('getPlayGameState service getGameState : ', getGameState);

          console.log('getPlayGameState service result : ', result.data);
          var loadRunInfo = result.data.load_run_info;

          var canvas = { id: 'canvas-' + uuidv4(), width: loadRunInfo.CanvasList[0].Size.Width, height: loadRunInfo.CanvasList[0].Size.Height, backgroundImage: '' };
          var gridList = loadRunInfo.GridList[0];
          var grid = { id: `${gridList.Size.Rows}x${gridList.Size.Columns}Grid-${uuidv4()}`, rows: gridList.Size.Rows, columns: gridList.Size.Columns, width: gridList.SquareWidth, height: gridList.SquareHeight, layer: gridList.Layer, justify: gridList.Justify, backgroundImage: gridList.BackgroundImage };

          console.log('getPlayGameState service canvas : ', canvas, grid);

          var objectList = loadRunInfo.ObjectList;
          var style = result.data.game_state_script.ClassList.find(item => item.Name === 'tokenPlayer1');

          console.log('token for player class: ', style);

          var objects = objectList.map(object => {
            var objectStyle = result.data.game_state_script.ClassList.find(item => item.Name === object.Class);
            return {
              ObjectID: object.ObjectID, class: object.Class, name: object.Name, style: { ...objectStyle },
              piece: {
                type: object.Type, color: objectStyle?.Colour, symbol: 'P', Image: object.Image,
                size: { height: objectStyle.Height, width: objectStyle.Width },
                moves: object.Moves, player: object.Player,
                CurrentPosition: { row: object.CurrentPosition.Row, column: object.CurrentPosition.Column }
              },
              layer: object.Layer, CurrentPosition: [object.CurrentPosition.Row, object.CurrentPosition.Column]
            }
          });
          console.log('getPlayGameState service objects : ', objects);
          dispatch(changeGameState({ canvas: canvas, grid: grid, objects: objects, uiList: result.data.game_state_script.UiList }));
          // [
          //       {id:'1',name:'PawnPlayer1', piece: { type: 'Pawn', color: 'black',symbol:'P', size:{height:80,width:80}, moves: ['up', 'down'], player: 1,position:{row:'0',column:'1'},animation:{onClick:{size:1.1,sound:'somesound'},onMove:{rotate:-35,sound:'somesound'},onCapturedSelf:{rotate:35,sound:'somesound'},onCapturedOther:{rotate:45,sound:'somesound'}}  }, layer:1, position: [0, 1] },
          //       {id:'2',name:'PawnPlayer2', piece: { type: 'Pawn', color: 'white', symbol:'P', size:{height:80,width:80}, moves: ['up', 'down'], player: 2,position:{row:'2',column:'2'},animation:{onClick:{size:1.1,sound:'somesound'},onMove:{rotate:-35,sound:'somesound'},onCapturedSelf:{rotate:35,sound:'somesound'},onCapturedOther:{rotate:45,sound:'somesound'}} }, layer:3, position: [2, 2] }
          //   ],
          //           state.canvas=action.payload.canvas;
          // state.objects = action.payload.objects;
          // state.grid=action.payload.grid;
          // canvas:{id:'canvas1',width:300,height:300,backgroundImage:''},
          //     loadCanvas:generateCanvas(8,8),
          //     grid:{id:'3x3Grid',rows:8,columns:8,width:100,height:100,layer:1},
          //     objects:[
          //         {id:'1',name:'PawnPlayer1', piece: { type: 'Pawn', color: 'black',symbol:'P', size:{height:80,width:80}, moves: ['up', 'down'], player: 1,position:{row:'0',column:'1'},animation:{onClick:{size:1.1,sound:'somesound'},onMove:{rotate:-35,sound:'somesound'},onCapturedSelf:{rotate:35,sound:'somesound'},onCapturedOther:{rotate:45,sound:'somesound'}}  }, layer:1, position: [0, 1] },
          //         {id:'2',name:'PawnPlayer2', piece: { type: 'Pawn', color: 'white', symbol:'P', size:{height:80,width:80}, moves: ['up', 'down'], player: 2,position:{row:'2',column:'2'},animation:{onClick:{size:1.1,sound:'somesound'},onMove:{rotate:-35,sound:'somesound'},onCapturedSelf:{rotate:35,sound:'somesound'},onCapturedOther:{rotate:45,sound:'somesound'}} }, layer:3, position: [2, 2] }
          //     ],

          if (result?.data?.current_turn?.name !== undefined) {
            dispatch(setInitialTurn(result?.data?.current_turn?.name));
            dispatch(changeGameState({ canvas: canvas, grid: grid, objects: objects, uiList: result.data.game_state_script.UiList }));
            dispatch(setPlayers(JSON.stringify(result?.data?.players)));
          }

          if (result?.data?.game_state_result?.winner !== undefined) {
            console.log(
              "winner is : ",
              result?.data?.game_state_result.winner
            );
            console.log("getGameState is : ", getGameState);
            const currentUiIndex =
              result?.data?.game_state_result?.matched_win_item?.Run
                ?.UiList;
            dispatch(
              setCurrentUi(
                currentUiIndex === undefined ? 3 : currentUiIndex
              )
            );
            dispatch(
              setWinState({
                winner: result?.data?.game_state_result.winner.name,
                winnerId: result?.data?.game_state_result.winner.user_id,
                gameOver: true,
                points: result?.data?.game_state_result.winner.points,
                WinnerText: result?.data?.game_state_result.winner_message,
                LoseText: result?.data?.game_state_result.loser_message,
                Message: result?.data?.game_state_result.message,
              })
            );
          }

          console.log('getPlayGameState service getGameState : ', getGameState);

        } else {
          console.log("createGameState error: ", result);
        }
      }));
    }
  }, [gameToken]);

  useEffect(() => {
    socketService.connectWithAuthToken(auth.accessToken)
    socketService.joinRoom({ gameToken: gameToken,userId:auth.user.id });
    // socketService.sendMove();
    socketService.subscribeToLoad(dispatch, (loadData) => {
      console.log('subscribeToLoad data: ', loadData);
    });
    socketService.subscribeToCapturedObjects(dispatch, (capturedObjects) => {
      console.log('subscribeToCapturedObjects data: ', capturedObjects);
    });
    socketService.subscribeToPossibleMoves(dispatch, (loadData) => {
      console.log('subscribeToPossibleMoves data: ', loadData);
    });
    socketService.subscribeToStart(dispatch);
    socketService.subscribeToPlayer(dispatch, playerTurnName, (playersInGame) => {
      console.log('on player subscribeToPlayer : playersInGame ', getGameState, playersInGame);
      console.log('on player subscribeToPlayer : authUser ', auth);
      const playerTurnEvent = JSON.parse(playersInGame);
      if (playerTurnEvent && (playerTurnEvent.user_id === auth.user.id)) {
        const userIdOfGameOwner = playerTurnEvent.owner_user_id;
      }
    });
    socketService.sendMessage(JSON.stringify({ data: 'Hey I joined the game and I am ' + auth.user.name, gameToken: gameToken,userId:auth.user.id }));
    socketService.subscribeToMessages(dispatch, (data) => {
      console.log('on player subscribe message : ', JSON.parse(data));

    });
    socketService.subscribeToMove(dispatch, (data) => {
      console.log('on player subscribeToMove : ', data);
    });
    socketService.subscribeToTurn(dispatch, (data) => {
      console.log('on player subscribeToTurn : ', data, JSON.parse(data));
    });
    socketService.subscribeToAcknowledge(dispatch);
    socketService.subscribeToEnd(dispatch, (endGame) => {
      console.log('End game event fired: ', endGame);
      if (getGameState.UiList?.length > 0) dispatch(setCurrentUi(3));
    });

    return () => {
      //socketService.leaveRoom(gameToken);
    };
  }, [dispatch, gameToken, auth.accessToken]);

  const goToMyGame = () => {
    navigate("/my-games");
  }

  return (
    <div className={`row my-5 ${playGameStyle.play_game_container}`}>
      <Toast ref={(el) => (toast = el)} />
      <div className="col-lg-9 col-md-8">
      <div className="row capturedObjectplayer1">
        {capturedObjects?.filter(player=>player?.Player===2)?.map((object)=>(<div width="85px" height="85px">
      <img src={`${appBaseUrl}${object.Image}`} width="85px" height="85px" /></div>))}
    </div>
        <div
          className={`h-100 ${playGameStyle.play_game_card} ${playGameStyle.game_card_center}`}>

          <canvas
            ref={canvasRef}
            color="#45445"
            width={getGameState.grid.columns * getGameState.grid.width}
            height={getGameState.grid.rows * getGameState.grid.height}
            onClick={handleCanvasClick}>
          </canvas>

        </div>
        
     <div className="row capturedObjectplayer2">
     {capturedObjects?.filter(player=>player?.Player===1)?.map((object)=>(<div width="85px" height="85px">
      <img src={`${appBaseUrl}${object.Image}`} width="85px" height="85px" /></div>))}
 </div>

      </div>
      <div className="col-lg-3 col-md-4 mt-md-0 mt-3">
        <div className={`h-100 ${playGameStyle.play_game_card}`}>
          <div className={`p-3 ${playGameStyle.play_card_heading}`}>
            <div className={` ${playGameStyle.play_heading}`}>
              <h1>{gameState?.game_state_script?.gameName}</h1>
            </div>
            <div className={` ${playGameStyle.time_icon_text}`}>
              <div className={`${playGameStyle.time_icon_img}`}>
                <img src="../images/time-svg-icon.svg" alt="" />
              </div>
              <div className={`ms-2 ${playGameStyle.time_text}`}>
                {getGameState.turnTime > 0 && (
                  <p>turn time remaining: {turnTimeLeft}</p>
                )}
                {"  "}
                {getGameState.gameTime > 0 && (
                  <p>game time remaining: {gameTimeLeft}</p>
                )}
                {getGameState.turnTime > 0 && (
                  <p>turn time remaining: {turnTimeLeft}</p>
                )}
                {"  "}
                {getGameState.gameTime > 0 && (
                  <p>game time remaining: {gameTimeLeft}</p>
                )}
              </div>
            </div>
          </div>
          <div className={`p-3 ${playGameStyle.play_card_bottom}`}>
            {getGameState?.currentUi?.Name === "gameTurn" && (
              <div className={`p-2 ${playGameStyle.player_turn_diablo_btn}`}>
                <div className={`${playGameStyle.player_turn_text}`}>
                  <p>Player Turn</p>
                </div>
                <div>
                  <button className={`${playGameStyle.diablo_btn}`}>
                    {playerTurnName}
                  </button>
                </div>
              </div>
            )}

            {getGameState?.players === undefined && (
              <div
                className={`p-2 mb-2 mt-2 ${playGameStyle.player_score_btn}`}
              >
                <div className={`${playGameStyle.player_name}`}>
                  <p className={`${playGameStyle.player_full_name}`}>
                    {getGameState.currentUi?.Name === "welcome" &&
                      getGameState.currentUi.Text.Content}
                  </p>
                </div>
              </div>
            )}

            {getGameState?.players !== undefined &&
              getGameState?.players?.length > 0 &&
              getGameState?.players.map((player) => (
                <div key={player.name}>
                  <div
                    className={`p-2 mb-2 mt-2 ${playGameStyle.player_score_btn}`}
                  >
                    <div className={`${playGameStyle.player_name}`}>
                      <p className={`me-2 ${playGameStyle.player_name_letter}`}>
                        {player.name[0]}
                      </p>
                      <p className={`${playGameStyle.player_full_name}`}>
                        {player.name}
                      </p>
                    </div>

                    <div className={`${playGameStyle.player_score}`}>
                      <p>Score 500</p>
                    </div>
                  </div>

                  {getGameState?.players?.length === 1 && (
                    <div
                      className={`p-2 mb-2 mt-2 ${playGameStyle.player_score_btn}`}
                    >
                      <div className={`${playGameStyle.player_name}`}>
                        <p className={`${playGameStyle.player_full_name}`}>
                          Waiting for other player to join
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            {getGameState?.players && (
              <div>
                <button
                  onClick={OnGameExitHandler}
                  className={`${playGameStyle.exit_gate_btn}`}
                >
                  <span>Exit Game</span>
                  <span className={`ps-2 ${playGameStyle.exit_game_img}`}>
                    <img src="../images/door-open-icon.svg" alt="Exit Game" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <img
          src={`${mainAppUrl}/images/game/pawn.svg`}
          hidden
          id="pawnImageId"
        />
        <img
          src={`${mainAppUrl}/images/game/bishop.svg`}
          hidden
          id="bishopImageId"
        />
      </div>
      <div>
        <Dialog
          showHeader={false}
          visible={getGameState.winState.gameOver}
          style={{ width: "600px" }}
          className="dialog-box-container play-game-dialog-box">
          <div className={`px-3 pt-2 pb-4 ${playGameStyle.dialog_box_container}`}>
            <div className={`${playGameStyle.dialog_box_content}`}>
              <div className={`${playGameStyle.winner_img}`}>
                {getGameState.currentUi?.Name === "end" && (getGameState.winState.winnerId.toString() ===
                  auth.user.id.toString()
                  ? <img className={`${playGameStyle.play_game_winner}`} src="../images/winner.svg" alt="" />
                  : <img className={`${playGameStyle.play_game_loser}`} src="../images/loser.svg" alt="" />)
                }
              </div>
              <div className={`mb-2 mt-3 ${playGameStyle.dialog_box_heading}`}>
                <h1>
                  {getGameState.currentUi?.Name === "end" && (getGameState.winState.winnerId.toString() ===
                    auth.user.id.toString()
                    ? getGameState.winState?.WinnerText
                    : getGameState.winState?.LoseText)
                  }
                </h1>
              </div>

              <div className={`my-2 ${playGameStyle.dialog_box_winner}`}>
                <p>
                  Winner is <span className={`${playGameStyle.play_game_player}`}>"{getGameState.winState.winner}"</span>
                </p>

              </div>
              {/* <div>
              {getGameState.currentUi?.Name === "end" && getGameState.winState.points > 0 &&
                (getGameState.winState.winnerId.toString() ===
                  auth.user.id.toString()
                  ? "Your score is "
                  : "Winner have score ") + getGameState.winState.points}
            </div> */}
              <div className={`mb-3 ${playGameStyle.dialog_box_game_end}`}>
                <p>
                  {getGameState.currentUi?.Name === "end" && getGameState.winState.gameOver && getGameState.winState.Message}
                </p>
              </div>
            </div>
            <div className={`d-flex justify-content-center align-items-center`}>
              <button
                onClick={goToMyGame}
                className={`${playGameStyle.exit_gate_btn}`}>
                <span>Back to My Game</span>
              </button>
            </div>
          </div>

        </Dialog>
      </div>

    </div>
  );
};

export default PlayGameRoom;
