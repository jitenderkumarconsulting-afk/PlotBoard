import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedPiece, movePiece, selectPiece } from "../../redux/slices/game.slice";
import css from './game-canvas.module.css';

const TILE_SIZE = 50;

const GameCanvas = () => {
  const gameData = {
    board: {
      rows: 3,
      columns: 3
    }
  };
  const board = useSelector(state => state.game.board);
  const gameObjects = useSelector(state => state.game.gameObjects);
  const selectedPiece = useSelector(state => state.game.selectedPiece);
  const dispatch = useDispatch();


  const handleTileClick = (x, y) => {
    console.log('cell clicked');
    console.log('board is :', board);
    console.log('cell click, x,y: ', x, y, selectedPiece, selectedPiece?.piece);
    // if (selectedPiece) {
    //     dispatch(movePiece({ startX: selectedPiece.x, startY: selectedPiece.y, endX: x, endY: y }));
    //     setSelectedPiece(null);
    // } else if (board[x][y]) {
    //     setSelectedPiece({ x, y, piece: board[x][y] });
    // }
    // If a piece is currently selected and the destination tile is clicked

    // if (selectedPiece) {
    //     dispatch(movePiece({ startX: selectedPiece.x, startY: selectedPiece.y, endX: x, endY: y }));
    //     setSelectedPiece(null);
    //   } else if (board[y][x]) {
    //     setSelectedPiece({ x, y, piece: board[y][x] });
    //   }
    // if (selectedPiece) {
    //     dispatch(movePiece({ startX: selectedPiece.x, startY: selectedPiece.y, endX: x, endY: y }));
    //   } else if (board[y][x]) {
    //     dispatch(selectPiece({ x, y, piece: board[y][x] }));
    //   }

    // If a piece is currently selected
    if (selectedPiece) {
      // Check if the clicked tile is the same as the selected piece.
      // If so, deselect the piece.
      if (selectedPiece.x === x && selectedPiece.y === y) {
        dispatch(clearSelectedPiece());
        return;
      }

      // If the clicked tile is another piece of the same player, select that piece instead.
      // For this example, let's assume that each piece ID also contains information about which player it belongs to.
      // e.g., "rook_player1", "knight_player2". This is just a mock example; modify based on your actual structure.
      if (board[y][x] && selectedPiece.piece.includes("player1") && board[y][x].includes("player1")) {
        dispatch(selectPiece({ x, y, piece: board[y][x] }));
        return;
      }

      // At this point, we can move the selected piece to the clicked tile.
      // More checks can be added here based on game rules to ensure the move is valid.
      dispatch(movePiece({ startX: selectedPiece.x, startY: selectedPiece.y, endX: x, endY: y }));
    } else if (board[y][x]) {  // If no piece is currently selected and the clicked tile contains a piece
      dispatch(selectPiece({ x, y, piece: board[y][x] }));
    }
  };

  return (
    <Stage width={TILE_SIZE * gameData.board.columns} height={TILE_SIZE * gameData.board.rows} className={css.board}>
      <Layer>
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <React.Fragment key={`${rowIndex}-${cellIndex}`} >
              <Rect className={css.tile}
                x={cellIndex * TILE_SIZE}
                y={rowIndex * TILE_SIZE}
                width={TILE_SIZE}
                height={TILE_SIZE}
                fill={((rowIndex + cellIndex) % 2 === 0) ? 'white' : 'black'}
                onClick={() => handleTileClick(rowIndex, cellIndex)}
              />
              {cell && <Text className={css.piece}
                x={cellIndex * TILE_SIZE}
                y={rowIndex * TILE_SIZE}
                width={TILE_SIZE}
                height={TILE_SIZE}
                align="center"
                verticalAlign="middle"
                text={gameObjects.find(obj => obj.id === cell)?.symbol || ''}
                fontSize={24}
                fill={((rowIndex + cellIndex) % 2 === 0) ? 'black' : 'white'}
                fontWeight="bold"
                onClick={() => handleTileClick(rowIndex, cellIndex)}
              />}
            </React.Fragment>
          ))
        )}
      </Layer>
    </Stage>
  );
};

export default GameCanvas;
