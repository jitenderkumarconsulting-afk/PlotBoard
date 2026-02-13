import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearSelectedPiece,
  movePiece,
  selectPiece,
  togglePlayer,
  setGameState
} from "../../redux/slices/game.slice";

import css from "./gameboard.module.css";

const GameBoard = (props) => {
  console.log('play game data from parent/database: ',props);
  const canvasRef = useRef(null);
  const tileSize = 180; // This means each tile will be 180x180 pixels
  const [selectedPiece, setSelectedPiece] = useState(null);

  const board = useSelector((state) => state.game.board);
  const boardRXC = useSelector((state) => state.game.boardRXC);
  const gameData = useSelector((state) => state.game.gameObjects);
  const currentPlayer = useSelector((state) => state.game.currentPlayer);

  //   const selectedPiece = useSelector(state => state.game.selectedPiece);

  const dispatch = useDispatch();

  console.log("board : ", board);
  console.log("gameboard, gamdata: ", gameData);
  console.log("boardRXC, boardRXC: ", boardRXC);
  const handleTileClick = (x, y) => {
    console.log("handleTileClick : ", x, y);
    if (selectedPiece) {
      // Deselect the piece if clicked on the same position.
      if (selectedPiece.x === x && selectedPiece.y === y) {
        dispatch(clearSelectedPiece());
        return;
      }

      // If trying to move to a tile that contains the current player's piece, re-select that piece.
      if (board[y][x] && board[y][x].includes(currentPlayer)) {
        dispatch(selectPiece({ x, y, piece: board[y][x] }));
        return;
      }

      // Make the move and switch the player.
      dispatch(
        movePiece({
          startX: selectedPiece.x,
          startY: selectedPiece.y,
          endX: x,
          endY: y,
        })
      );
      dispatch(togglePlayer());
    } else if (board[y][x] && board[y][x].includes(currentPlayer)) {
      // If the clicked tile contains the current player's piece, select that piece.
      dispatch(selectPiece({ x, y, piece: board[y][x] }));
    }
  };

  //   const handleCanvasClick = (event) => {
  //     const boundingRect = canvasRef.current.getBoundingClientRect();
  //     const scaleX = canvasRef.current.width / boundingRect.width;
  //     const scaleY = canvasRef.current.height / boundingRect.height;

  //     const canvasX = (event.clientX - boundingRect.left) * scaleX;
  //     const canvasY = (event.clientY - boundingRect.top) * scaleY;

  //     const x = Math.floor(canvasX / tileSize);
  //     const y = Math.floor(canvasY / tileSize);

  //     handleTileClick(x, y);
  //   };
  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / tileSize);
    const y = Math.floor((event.clientY - rect.top) / tileSize);

    // Check if the clicked tile has a piece
    const clickedPiece = board[y][x];

    //Logic to check Player Turn and click event
    const playerTurn = currentPlayer === "player1" ? 1 : 2;
    console.log("clicked piece: ", selectedPiece, playerTurn);
    if (
      selectedPiece &&
      playerTurn.toString() !== selectedPiece?.piece.piece?.player?.toString()
    ) {
      alert(
        "Oh... It is not your turn, It is " + currentPlayer,
        currentPlayer.toUpperCase() + "'s Turn"
      );
      setSelectedPiece(null);
      return;
    }

    let movementMade = false; // Initialize the flag

    // logic to check for invalid move
    if (selectedPiece && !IsValidMove(selectedPiece, { x, y })) {
      console.log("from and to :", selectedPiece, { x, y });
      alert("This move is not valid!");
      setSelectedPiece(null);
      return;
    }

    if (clickedPiece) {
      setSelectedPiece({ x, y, piece: clickedPiece });
    } else if (selectedPiece) {
      dispatch(movePiece({ from: selectedPiece, to: { x, y } }));
      setSelectedPiece(null);
      movementMade = true; // Set the flag to true when a piece is moved
    }

    if (movementMade) {
      dispatch(togglePlayer());
    }
  };

  const IsValidMove = (from, to) => {
    let direction = currentPlayer === "player1" ? 1 : -1;
    const playerTurn = currentPlayer === "player1" ? 1 : 2;
    console.log('from, to: ', from, to);
    // logic for player moving up
    if (from.y > to.y) {
      var step = "down";
      console.log(
        "Before whic is this? ?direction for current player : step ",
        step,
        playerTurn,
        currentPlayer,
        direction, from.piece.piece.moves.includes('up')
      );

      // Playerx move up, values from, to
      direction = -1;
      if (playerTurn === 2) {
        step = "up";
        // check if move is up for player 2
        // direction=1;
      }
      if (from.piece.piece?.moves?.includes(step)) {
        console.log(' you have permission for it, go and move one...')
      }
      else {
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
    if (from.y < to.y) {
      var step = "up";
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
      if (from.piece.piece?.moves?.includes(step)) {
        console.log(' you have permission for it, go and move one...')
      }
      else {
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
    if (from.x > to.x) {
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
      if (from.piece.piece?.moves?.includes(step)) {
        console.log(' you have permission for it, go and move one...')
      }
      else {
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
    if (from.x < to.x) {
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
      if (from.piece.piece?.moves?.includes(step)) {
        console.log(' you have permission for it, go and move one...')
      }
      else {
        return false;
      }
      //
    }
    // console.log('direction for current player : ',playerTurn,currentPlayer,direction);
    if (from.y + direction === to.y) {
      console.log(
        playerTurn,
        currentPlayer,
        direction,
        " move up condition for player"
      );
    }
    if (from.y === to.y + direction) {
      console.log(" move down condition for player");
    }
    if (from.x + direction === to.x) {
      console.log(" move right condition for player");
    }
    if (from.x === to.x + direction) {
      console.log(" move left condition for player");
    }
    console.log(
      "IsValidMove check from.x+1===to.x:",
      from.x === to.x && from.y + direction === to.y
    );

    //up down logic
    if (from.x === to.x && from.y + direction === to.y) {
      console.log('up downlogic')
      // logic to check block empty to pending
      return true;
    }

    //left right logic
    if (from.y === to.y && from.x + direction === to.x) {
      // logic to check block empty to pending
      return true;
    }
    console.log("Is valid move clicked: ", from, to);
    return false;
  };

  const renderBoard = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    for (let y = 0; y < boardRXC.rows; y++) {
      for (let x = 0; x < boardRXC.columns; x++) {
        // Alternate colors for a checkerboard pattern or however you want to style it.
        const tileColor = (x + y) % 2 === 0 ? "#eeeeee" : "#dddddd";
        ctx.fillStyle = tileColor;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

        // If there's a game piece at this position, render it
        if (board[y][x]) {
          ctx.fillStyle = "black";
          ctx.font = "36px Arial";
          ctx.fillText(
            `${gameData.find((obj) => obj.id ===  board[y][x].piece.id) //board[y][x].piece.type)
              ?.symbol || ""
            }`,
            x * tileSize + tileSize / 2 - 10,
            y * tileSize + tileSize / 2 + 10
          );
        }
      }
    }
  };

  useEffect(() => {
    renderBoard();
  }, [board]);

  useEffect(() => {
    console.log("game state to update from props: ", props);
    dispatch(setGameState(props.gameData.game_script.gameObjects));
  }, [dispatch]);

  return (
    // style={{background:`${((rowIndex + cellIndex) % 2 === 0) ? 'white' : 'black'}`
    <div>
      <h2>{currentPlayer.toUpperCase()}'s Turn</h2>{" "}
      {/* Display whose turn it is */}
      <canvas
        ref={canvasRef}
        width={boardRXC.columns * tileSize}
        height={boardRXC.rows * tileSize}
        onClick={handleCanvasClick}
      ></canvas>
    </div>
  );
};

export default GameBoard;
