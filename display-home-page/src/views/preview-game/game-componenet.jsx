import React from 'react';
import Chessboard from './chessboard';
import css from './chessboard.module.css';
import GameCanvas from './game-canvas';
import GameBoard from './gameboard';

const GameComponent = (props) => {
  const { playGameData } = props;
  console.log('play game data: ', playGameData)
  const gameData = {
    "gameName": "My Custom Game",
    "description": "A custom game using a generic game engine",
    "board": {
      "rows": 3,
      "columns": 3
    },
    "gameObjects": [
      {
        "id": "rook_white_1",
        "type": "Rook",
        "color": "White",
        "position": {
          "row": 1,
          "column": 1
        }
      },
      {
        "id": "knight_white_1",
        "type": "Knight",
        "color": "White",
        "position": {
          "row": 1,
          "column": 2
        }
      },
      {
        "id": "bishop_white_1",
        "type": "Bishop",
        "color": "White",
        "position": {
          "row": 1,
          "column": 3
        }
      },
      {
        "id": "pawn_white_1",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 1
        }
      },
      {
        "id": "pawn_white_2",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 2
        }
      },
      {
        "id": "pawn_white_3",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 3
        }
      },
      {
        "id": "pawn_white_4",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 4
        }
      },
      {
        "id": "pawn_white_5",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 5
        }
      },
      {
        "id": "pawn_white_6",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 6
        }
      },
      {
        "id": "pawn_white_7",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 7
        }
      },
      {
        "id": "pawn_white_8",
        "type": "Pawn",
        "color": "White",
        "position": {
          "row": 2,
          "column": 8
        }
      },
      {
        "id": "rook_black_1",
        "type": "Rook",
        "color": "Black",
        "position": {
          "row": 8,
          "column": 1
        }
      },
      {
        "id": "pawn_black_1",
        "type": "Pawn",
        "color": "Black",
        "position": {
          "row": 7,
          "column": 1
        }
      }
    ],
    "gameRules": [
      {
        "name": "MoveRule",
        "description": "Validates the movement of a game object on the board",
        "allowedMovements": [
          "Orthogonal",
          "Diagonal",
          "L-Shaped"
        ],
        "maxSteps": 2
      },
      {
        "name": "CaptureRule",
        "description": "Validates capturing an opponent's game object",
        "applicableTo": [
          "Rook",
          "Knight",
          "Bishop",
          "Pawn"
        ]
      }
    ]

  };

  // Function to generate the game board
  const renderGameBoard = () => {
    const { rows, columns } = gameData.board;
    const board = [];

    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= columns; column++) {
        // Render the board cells here
        // You can use CSS classes to style the cells based on row and column positions
        board.push(<div key={`cell_${row}_${column}`} className="board-cell">{`(${row}, ${column})`}</div>);
      }
    }

    return board;
  };

  // Function to generate the game objects
  const renderGameObjects = () => {
    return gameData.gameObjects.map((gameObject) => (
      <div key={gameObject.id}>
        <p>Type: {gameObject.type}</p>
        <p>Color: {gameObject.color}</p>
        <p>Position: ({gameObject.position.row}, {gameObject.position.column})</p>
      </div>
    ));
  };

  return (
    <div className={css.chessboard_container}>
      <div className={css.game_info}>
        <h1>{playGameData.name}</h1>
        {/* <p>{playGameData.description}</p> */}
        <h5>Board: {playGameData.game_script.board.rows}x{playGameData.game_script.board.columns}</h5>
      </div>
      {/* <Chessboard gameData={playGameData.game_script} /> */}
      {/* <GameCanvas /> */}
      {<GameBoard gameData={playGameData} />}
      <div className={css.game_rules}>
        <h2>Game Rules:</h2>
        <ul>
          {playGameData.game_script.gameRules.map((rule) => (
            <li key={rule.name}>
              {rule.name}: {rule.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameComponent;
