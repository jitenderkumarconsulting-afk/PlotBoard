import React from 'react';
import css from './chessboard.module.css';

const Chessboard = ({ gameData }) => {
  console.log('game data in checkboard.js: ', gameData);
  const isCellOccupied = (row, col) => {
    return gameData.gameObjects.some(obj => obj.position.row === row && obj.position.column === col);
  };

  const getCellStyles = (row, col) => {
    return {
      backgroundColor: (row + col) % 2 === 0 ? '#f0f0f0' : '#c9c9c9',
      color: isCellOccupied(row, col) ? '#000' : 'inherit',
      fontSize: isCellOccupied(row, col) ? '30px' : '24px',
      // width:'100%',
      // padding:'10px'
    };
  };

  return (
    <div className={css.chessboard}>
      {Array.from({ length: gameData.board.rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="d-flex">
          {Array.from({ length: gameData.board.columns }, (_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} style={getCellStyles(rowIndex + 1, colIndex + 1)} className={css.cell} onClick={(event) => console.log('cell clicked:', event)} >
              {gameData.gameObjects.map((gameObject) => {
                if (gameObject.position.row === rowIndex + 1 && gameObject.position.column === colIndex + 1) {
                  return (
                    <div key={gameObject.id} className={`${gameObject.color.toLowerCase()}`}>
                      {gameObject.type.charAt(0)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
