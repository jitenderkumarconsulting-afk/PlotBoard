import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../models/event";

import { AddMessageDto } from "../models/message";

import { gameLoopSocketUrl } from "./urls";

import { movePiece, possibleMoves, refreshBoard, setCaptauredObjects, setCurrentUi, setInitialTurn, setPlayers, setWinState, toggleTurnForPlayer } from "./../redux/slices/play-game.slice";

export default class socketGatewayService {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(gameLoopSocketUrl, {
      autoConnect: false,
    });
    
  connectWithAuthToken(token: string) {
    this.socket.auth = { token };
    this.socket.connect();
  }

  joinRoom(data) {
    console.log('on join room', JSON.stringify(data));
    this.socket.emit("join", JSON.stringify(data));
  }

  disconnect() {
    this.socket.disconnect();
  }

  notifyPlayers(data: AddMessageDto) {
    this.socket.emit("players", data);
  }
  sendMessage(data: AddMessageDto) {
    this.socket.emit("message", data);
  }
  sendMove(data) {
    console.log('this.socket: ',this.socket);
    this.socket.emit("move", data);
  }
  subscribeToPlayer(dispatch, playerTurnName) {
    this.socket.on("players", (playersInGame) => {
      console.log('socket player subscribe: ', playersInGame);
      dispatch(setPlayers(playersInGame));

      return playersInGame;
    });
    ;
  }
  subscribeToTurn(dispatch) {
    console.log('subscribeToTurn: ');
    this.socket.on("turn", (playersInGame) => {
      console.log('socket subscribeToTurn: ', playersInGame);
      dispatch(setInitialTurn(JSON.parse(playersInGame).name));
      return playersInGame;
    });
    ;
  }
  subscribeToStart(dispatch) {
    console.log('subscribeToStart: ');
    this.socket.on("start", (playersInGame) => {
      console.log('socket player subscribeToStart: ', playersInGame);
      return playersInGame;
    });
    ;
  }
  subscribeToAcknowledge(dispatch) {
    this.socket.on("acknowledge", (acknowledgeResponse) => {
      console.log('socket acknowledge subscribe ', acknowledgeResponse);
      const { data } = JSON.parse(acknowledgeResponse);
      if (data.includes('turn|')) {
       // var name = JSON.parse(data).data;
        //  dispatch(toggleTurnForPlayer(name.split('|')[1]))
      }
    });
  };

  subscribeToMessages(dispatch) {
    this.socket.on("message", (recievedMessage) => {
      console.log('subscribe message: ', recievedMessage);
      const { data } = JSON.parse(recievedMessage);
      if (data.includes('turn|')) {
        //dispatch(toggleTurnForPlayer(data.split('|')[1]))
      }

    });
  }
  subscribeToMove(dispatch) {
    this.socket.on("move", (recievedMove) => {
      console.log('subscribe move: ', recievedMove);
      const { from, to } = JSON.parse(recievedMove).data;
      const data= JSON.parse(recievedMove).data;
      const fromdata={piece:{ObjectID:data.ObjectID},Row:from.Row,Column:from.Column};
      console.log('recived move : ', {fromdata,  to }, data);
      dispatch(movePiece({from:{...fromdata}, to:{Row:to.Row,Column:to.Column} }));
      dispatch(refreshBoard());
    });
  }
  subscribeToEnd(dispatch) {
    this.socket.on("end", (recievedData) => {
      console.log('subscribe end: ', recievedData);
      console.log("subscribe subscribeToEnd: ", JSON.parse(recievedData));
      var gameEndData = JSON.parse(recievedData);

      const currentUiIndex =
        recievedData.game_state_result?.matched_win_item?.Run?.UiList;

      dispatch(setCurrentUi(currentUiIndex === undefined ? 3 : currentUiIndex));
      dispatch(
        setWinState({
          winner: gameEndData.game_state_result.winner.name,
          winnerId: gameEndData.game_state_result.winner.user_id,
          gameOver: true,
          points: gameEndData.game_state_result.winner.points,
          WinnerText: gameEndData.game_state_result.winner_message,
          LoseText: gameEndData.game_state_result.loser_message,
          Message: gameEndData.game_state_result.message,
        })
      );
      return gameEndData;
    });
  }
  subscribeToCapturedObjects(dispatch) {
    this.socket.on("captured_objects", (capturedObjects) => {
      console.log('subscribe to subscribeToCapturedObjects: ', JSON.parse(capturedObjects));
      dispatch(setCaptauredObjects(JSON.parse(capturedObjects)));
      //dispatch(refreshBoard());
      return capturedObjects;
    });
  }
  subscribeToPossibleMoves(dispatch) {
    this.socket.on("possible_moves", (possibleMovesData) => {
      console.log('subscribe to possible_moves: ', possibleMovesData);
      dispatch(possibleMoves(JSON.parse(possibleMovesData)));
      //dispatch(refreshBoard());
      return possibleMovesData;
    });
  }
  
  sendPossibleMoves(data) {
    this.socket.emit("possible_moves", data);
  }
  
  subscribeToLoad(dispatch) {
    this.socket.on("load", (loadData) => {
      console.log('subscribe to load: ', loadData);
      return loadData;
    });
  }
  
  leaveRoom(gameToken: string) {
    this.socket.emit("leave", JSON.stringify({ gameToken: gameToken }));
  }
}

export const socketService = new socketGatewayService();
