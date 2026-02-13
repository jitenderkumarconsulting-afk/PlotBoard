import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

import { PositionResponseDTO } from '../dtos/response/position-response.dto';
import { GameScriptKeys } from '../constants/game-script-keys';
import { SocketEvents } from '../../../shared/constants/socket-events';
import { EventPossibleMovesRequestDTO } from '../dtos/request/event-possible-moves-request.dto';
import { GameObjectBuilder } from './game-object.builder';
import { SocketHelper } from '../../../shared/helpers/socket.helper';
import { GameStateRepository } from '../repositories/game-state.repository';
import { GameState } from '../interfaces/game-state.interface';
import { EventMoveRequestDTO } from '../dtos/request/event-move-request.dto';
import { GameWinBuilder } from './game-win.builder';
import { GamePlayerTurnBuilder } from './game-player-turn.builder';
import { GameCapturedObjectBuilder } from './game-captured-object.builder';
import { GameBuilder } from './game.builder';

@Injectable()
export class GameMoveBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gamePlayerTurnBuilder: GamePlayerTurnBuilder, // Inject the GamePlayerTurnBuilder service
    private readonly gameCapturedObjectBuilder: GameCapturedObjectBuilder, // Inject the GameCapturedObjectBuilder service
    private readonly gameWinBuilder: GameWinBuilder, // Inject the GameWinBuilder service
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
    private readonly socketHelper: SocketHelper, // Inject the SocketHelper service
  ) {
    this.logger = new Logger(GameMoveBuilder.name);
  }

  /**
   * Sends the possible moves event to the client.
   * @param client The Socket.IO client.
   * @param moveObject The move object containing move rules.
   * @param eventPossibleMovesRequestDto The request DTO for possible moves event.
   */
  public sendPossibleMovesEvent(
    client: Socket,
    moveObject: Record<string, any>,
    eventPossibleMovesRequestDto: EventPossibleMovesRequestDTO,
    gameState: GameState,
  ) {
    this.logger.log(
      `sendPossibleMovesEvent :: eventPossibleMovesRequestDto - ${JSON.stringify(
        eventPossibleMovesRequestDto,
      )}`,
    );

    // Extract relevant information from the request DTO.
    const { ObjectID: objectId, from: currentPosition } =
      eventPossibleMovesRequestDto;
    const { Row: currentRow, Column: currentColumn } = currentPosition;

    // Calculate valid possible moves based on move rules.
    const possibleMoves: Array<PositionResponseDTO> =
      this.calculateAllValidPossibleMoves(
        currentRow,
        currentColumn,
        moveObject,
        gameState,
      );

    // Build the response DTO for possible moves event.
    const eventPossibleMovesResponse =
      this.gameObjectBuilder.buildEventPossibleMovesResponse(
        objectId,
        possibleMoves,
      );

    console.log(
      `sendPossibleMovesEvent :: eventPossibleMovesResponse - ${JSON.stringify(
        eventPossibleMovesResponse,
      )}`,
    );

    // Convert the event response to a JSON string for transmission.
    const eventPossibleMovesResponseRawData = JSON.stringify(
      eventPossibleMovesResponse,
    );

    // Emit the possible moves event to the client.
    this.socketHelper.emitEventToClient(
      client,
      SocketEvents.POSSIBLE_MOVES,
      eventPossibleMovesResponseRawData,
    );
  }

  /**
   * Calculates all valid possible moves based on the provided move rules.
   *
   * @param currentRow - The current row position.
   * @param currentColumn - The current column position.
   * @param moveObject - The move object containing move rules.
   * @param gameState - The current game state.
   * @returns An array of valid possible move positions.
   */
  private calculateAllValidPossibleMoves(
    currentRow: number,
    currentColumn: number,
    moveObject: Record<string, any>,
    gameState: GameState,
  ): Array<PositionResponseDTO> {
    this.logger.log(
      `calculateAllValidPossibleMoves :: moveObject - ${JSON.stringify(
        moveObject,
      )}`,
    );

    // Extract move rules from the move object.
    const { Moves: moveRules, move_counter: moveCounter } = moveObject;

    // Check if moveRules is an array; otherwise, return an empty array.
    if (!Array.isArray(moveRules)) {
      return [];
    }

    this.logger.log(
      `calculateAllValidPossibleMoves :: moveRules - ${JSON.stringify(
        moveRules,
      )}`,
    );

    // Preprocess the moveRules before processing different direction types.
    const processedMoveRules = this.preprocessMoveRules(moveRules, moveCounter);

    this.logger.log(
      `calculateAllValidPossibleMoves :: processedMoveRules - ${JSON.stringify(
        processedMoveRules,
      )}`,
    );

    // Extract necessary fields from the game state, game state info, game state config, grid info, and currentTurn.
    const {
      game_state_info: gameStateInfo,
      load_run_info: loadRunInfo,
      current_turn: currentTurn,
    } = gameState;
    const { game_state_config: gameStateConfig } = gameStateInfo;
    const { grid_info: gridInfo } = gameStateConfig;
    const { rows: gridRows, columns: gridColumns } = gridInfo;
    const { user_id: playerUserId } = currentTurn;

    this.logger.log(
      `calculateAllValidPossibleMoves :: gridRows - ${gridRows}, gridColumns - ${gridColumns}`,
    );

    // Retrieve the current objects list from loadRunInfo.
    const currentObjectsList = this.getCurrentObjectsListArray(loadRunInfo);

    // Array to store all valid possible moves.
    const allValidPossibleMoves: Array<PositionResponseDTO> = [];

    // Iterate through each move rule and calculate possible moves.
    processedMoveRules.forEach((moveRule) => {
      allValidPossibleMoves.push(
        ...this.calculatePossibleMovesForMoveRule(
          currentRow,
          currentColumn,
          moveRule,
          gridRows,
          gridColumns,
          currentObjectsList,
          moveObject,
          playerUserId,
        ),
      );
    });

    this.logger.log(
      `calculateAllValidPossibleMoves :: allValidPossibleMoves - ${JSON.stringify(
        allValidPossibleMoves,
      )}`,
    );

    // Return the array of all valid possible moves.
    return allValidPossibleMoves;
  }

  /**
   * Preprocesses the move rules before iteration.
   * @param moveRules - The move rules for different directions.
   * @returns The updated move rules.
   */
  private preprocessMoveRules(
    moveRules: Array<Record<string, any>>,
    moveCounter: number,
  ): Array<Record<string, any>> {
    this.logger.log(
      `preprocessMoveRules :: moveRules - ${JSON.stringify(moveRules)}`,
    );

    const processedMoveRules: Array<Record<string, any>> = [];

    // Iterate through each move rule
    moveRules.forEach((moveRule) => {
      processedMoveRules.push(
        ...this.preprocessMoveRule(moveRule, moveCounter),
      );
    });

    this.logger.log(
      `preprocessMoveRules :: processedMoveRules - ${JSON.stringify(
        processedMoveRules,
      )}`,
    );

    return processedMoveRules;
  }

  /**
   * Preprocesses a single move rule before iteration.
   *
   * @param moveRule - The move rule for a specific direction.
   * @param moveCounter - The move counter to determine if it's the first move.
   * @returns The updated move rules.
   */
  private preprocessMoveRule(
    moveRule: Record<string, any>,
    moveCounter: number,
  ): Array<Record<string, any>> {
    this.logger.log(
      `preprocessMoveRule :: moveRule - ${JSON.stringify(moveRule)}`,
    );

    // Array to store the processed move rules
    const processedMoveRules: Array<Record<string, any>> = [];

    // Object to store the current processed move rule
    let processedMoveRule: Record<string, any> = {};

    // Function to add a processed move rule to the array and reset
    const addProcessedMoveRuleAndReset = () => {
      if (Object.keys(processedMoveRule).length > 0) {
        processedMoveRules.push(processedMoveRule);
        processedMoveRule = {};
      }
    };

    // Check if it's not the first move and the rule allows first move only
    if (
      moveCounter !== 0 &&
      moveRule[GameScriptKeys.ObjectList.FIRST_MOVE_ONLY] === true
    ) {
      // If true, return an empty array of processed move rules
      return processedMoveRules;
    }

    // Iterate through each direction type in the move rule
    for (const directionType in moveRule) {
      const directionValues = moveRule[directionType];

      this.logger.log(
        `preprocessMoveRule :: directionType - ${JSON.stringify(
          directionType,
        )}, directionValues - ${directionValues}`,
      );

      // Process different direction types
      switch (directionType) {
        // Handle basic moves (UP, DOWN, LEFT, RIGHT)
        case GameScriptKeys.ObjectList.UP:
        case GameScriptKeys.ObjectList.DOWN:
        case GameScriptKeys.ObjectList.LEFT:
        case GameScriptKeys.ObjectList.RIGHT: {
          processedMoveRule = {
            ...processedMoveRule,
            [directionType]: directionValues,
          };
          break;
        }

        // Handle diagonal moves
        case GameScriptKeys.ObjectList.DIAGONAL: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }

        // Handle diagonal up and down moves
        case GameScriptKeys.ObjectList.DIAGONAL_UP: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }
        case GameScriptKeys.ObjectList.DIAGONAL_DOWN: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }

        // Handle diagonal left and right moves
        case GameScriptKeys.ObjectList.DIAGONAL_LEFT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          break;
        }
        case GameScriptKeys.ObjectList.DIAGONAL_RIGHT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          addProcessedMoveRuleAndReset(); // Add processed move rule and reset
          processedMoveRule = {
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }

        // Handle diagonal up-left, up-right, down-left, and down-right moves
        case GameScriptKeys.ObjectList.DIAGONAL_UP_LEFT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          break;
        }
        case GameScriptKeys.ObjectList.DIAGONAL_UP_RIGHT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.UP]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }
        case GameScriptKeys.ObjectList.DIAGONAL_DOWN_LEFT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.LEFT]: directionValues,
          };
          break;
        }
        case GameScriptKeys.ObjectList.DIAGONAL_DOWN_RIGHT: {
          processedMoveRule = {
            ...processedMoveRule,
            [GameScriptKeys.ObjectList.DOWN]: directionValues,
            [GameScriptKeys.ObjectList.RIGHT]: directionValues,
          };
          break;
        }
      }
    }

    addProcessedMoveRuleAndReset(); // Ensure the last processed move rule is added

    this.logger.log(
      `preprocessMoveRule :: processedMoveRules - ${JSON.stringify(
        processedMoveRules,
      )}`,
    );

    return processedMoveRules;
  }

  /**
   * Retrieves the list of objects from the 'OBJECT_LIST' in the provided load run information.
   *
   * @param loadRunInfo - The load run information containing the 'OBJECT_LIST'.
   * @returns An array of objects or an empty array if 'OBJECT_LIST' is not an array.
   */
  private getCurrentObjectsListArray(
    loadRunInfo: Record<string, any>,
  ): Array<Record<string, any>> {
    // Extract the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    // Check if 'OBJECT_LIST' is an array, otherwise return an empty array.
    return Array.isArray(objectList) ? objectList : [];
  }

  /**
   * Calculates possible moves for a specific move rule.
   *
   * @param currentRow - The current row of the object.
   * @param currentColumn - The current column of the object.
   * @param moveRule - The move rule for a specific direction.
   * @param gridRows - The total number of rows in the grid.
   * @param gridColumns - The total number of columns in the grid.
   * @param currentObjectsList - The list of current objects.
   * @param moveObject - The move object for which moves are calculated.
   * @param playerUserId - The ID of the user associated with the object.
   * @returns An array of possible positions for the given move rule.
   */
  private calculatePossibleMovesForMoveRule(
    currentRow: number,
    currentColumn: number,
    moveRule: Record<string, any>,
    gridRows: number,
    gridColumns: number,
    currentObjectsList: Array<Record<string, any>>,
    moveObject: Record<string, any>,
    playerUserId: string,
  ): Array<PositionResponseDTO> {
    this.logger.log(
      `calculatePossibleMovesForMoveRule :: moveRule - ${JSON.stringify(
        moveRule,
      )}`,
    );

    // Arrays to store row and column moves.
    let rowMoves: Array<number>;
    let columnMoves: Array<number>;

    // Iterate through each direction type in the move rule.
    for (const directionType in moveRule) {
      const directionValues = moveRule[directionType];

      this.logger.log(
        `calculatePossibleMovesForMoveRule :: directionType - ${JSON.stringify(
          directionType,
        )}, directionValues - ${directionValues}`,
      );

      // Process different direction types.
      switch (directionType) {
        case GameScriptKeys.ObjectList.UP:
        case GameScriptKeys.ObjectList.DOWN: {
          // Calculate row moves for up or down directions.
          rowMoves = this.calculatePossibleMovesForUpOrDown(
            currentRow,
            directionType,
            directionValues,
            gridRows,
          );
          break;
        }

        case GameScriptKeys.ObjectList.LEFT:
        case GameScriptKeys.ObjectList.RIGHT: {
          // Calculate column moves for left or right directions.
          columnMoves = this.calculatePossibleMovesForLeftRight(
            currentColumn,
            directionType,
            directionValues,
            gridColumns,
          );
          break;
        }
      }
    }

    this.logger.log(
      `calculatePossibleMovesForMoveRule :: rowMoves - ${JSON.stringify(
        rowMoves,
      )}`,
    );
    this.logger.log(
      `calculatePossibleMovesForMoveRule :: columnMoves - ${JSON.stringify(
        columnMoves,
      )}`,
    );

    // Concatenate row and column moves to get all possible positions.
    const possibleMoves: Array<PositionResponseDTO> =
      this.generateValidMovePositions(
        currentRow,
        currentColumn,
        rowMoves,
        columnMoves,
        gridRows,
        gridColumns,
        currentObjectsList,
        moveObject,
        playerUserId,
      );

    this.logger.log(
      `calculatePossibleMovesForMoveRule :: possibleMoves - ${JSON.stringify(
        possibleMoves,
      )}`,
    );

    // Return the array of possible moves for the move rule.
    return possibleMoves;
  }

  /**
   * Calculates possible row moves for up or down directions.
   * @param currentRow - The current row of the object.
   * @param directionType - The type of direction (UP or DOWN).
   * @param directionValues - The values associated with the direction.
   * @param gridRows - The total number of rows in the grid.
   * @returns An array of possible row positions.
   */
  private calculatePossibleMovesForUpOrDown(
    currentRow: number,
    directionType: string,
    directionValues: any,
    gridRows: number,
  ): Array<number> {
    this.logger.log(
      `calculatePossibleMovesForUpOrDown :: currentRow - ${currentRow}, directionType - ${directionType}`,
    );

    // Array to store row moves
    let rowMoves: Array<number>;

    // Check if direction values is an array
    if (Array.isArray(directionValues)) {
      // Calculate fixed row moves
      rowMoves = this.calculateFixedRowMoves(
        currentRow,
        directionType,
        directionValues,
        gridRows,
      );
    } else if (directionValues === GameScriptKeys.ObjectList.INFINITE) {
      // Calculate infinite row moves
      rowMoves = this.calculateInfiniteRowMoves(
        currentRow,
        directionType,
        gridRows,
      );
    }

    this.logger.log(
      `calculatePossibleMovesForUpOrDown :: rowMoves - ${JSON.stringify(
        rowMoves,
      )}`,
    );

    // Return the array of possible row moves.
    return rowMoves;
  }

  /**
   * Calculates fixed row moves based on direction values.
   * @param currentRow - The current row of the object.
   * @param directionType - The type of direction (UP or DOWN).
   * @param directionValues - The values associated with the direction.
   * @param gridRows - The total number of rows in the grid.
   * @returns An array of possible row positions.
   */
  private calculateFixedRowMoves(
    currentRow: number,
    directionType: string,
    directionValues: number[],
    gridRows: number,
  ): Array<number> {
    this.logger.log(
      `calculateFixedRowMoves :: directionType - ${directionType}, directionValues - ${JSON.stringify(
        directionValues,
      )}`,
    );

    // Array to store row values
    const rowValues: Array<number> = [];

    // Iterate through each direction value and calculate row positions
    directionValues.forEach((directionValue) => {
      // Calculate row change based on direction type
      const rowChange =
        directionType === GameScriptKeys.ObjectList.UP
          ? -1
          : directionType === GameScriptKeys.ObjectList.DOWN
          ? 1
          : 0;

      // Calculate the new row position
      const rowTo = currentRow + directionValue * rowChange;

      // Check if the new row position is valid
      const isValidRow = this.isValidRow(rowTo, gridRows);

      // Add the row position to the array (or -1 if not valid)
      rowValues.push(isValidRow ? rowTo : -1);
    });

    this.logger.log(
      `calculateFixedRowMoves :: rowValues - ${JSON.stringify(rowValues)}`,
    );

    // Return the array of possible row values.
    return rowValues;
  }

  /**
   * Calculates infinite row moves based on the specified direction.
   * @param currentRow The current row position.
   * @param directionType The type of direction (UP or DOWN).
   * @param gridRows The number of rows in the game grid.
   * @returns An array of row positions representing infinite moves.
   */
  private calculateInfiniteRowMoves(
    currentRow: number,
    directionType: string,
    gridRows: number,
  ): Array<number> {
    this.logger.log(
      `calculateInfiniteRowMoves :: directionType - ${directionType}`,
    );

    // Array to store row values for infinite moves.
    const rowValues: Array<number> = [];

    // Initialize the row position.
    let rowTo = currentRow;

    // Determine the row change based on the direction type.
    const rowChange =
      directionType === GameScriptKeys.ObjectList.UP
        ? -1
        : directionType === GameScriptKeys.ObjectList.DOWN
        ? 1
        : 0;

    // Continue adding row values until an invalid row is reached.
    while (this.isValidRow(rowTo + rowChange, gridRows)) {
      // Update the row position.
      rowTo += rowChange;

      // Add the current row position to the array.
      rowValues.push(rowTo);
    }

    this.logger.log(
      `calculateInfiniteRowMoves :: rowValues - ${JSON.stringify(rowValues)}`,
    );

    // Return the array of possible row values.
    return rowValues;
  }

  /**
   * Calculates possible column moves for left or right directions.
   * @param currentColumn - The current column of the object.
   * @param directionType - The type of direction (LEFT or RIGHT).
   * @param directionValues - The values associated with the direction.
   * @param gridColumns - The total number of columns in the grid.
   * @returns An array of possible column positions.
   */
  private calculatePossibleMovesForLeftRight(
    currentColumn: number,
    directionType: string,
    directionValues: any,
    gridColumns: number,
  ): Array<number> {
    this.logger.log(
      `calculatePossibleMovesForLeftRight :: currentColumn - ${currentColumn}, directionValues - ${JSON.stringify(
        directionValues,
      )}`,
    );

    // Array to store column moves
    let columnMoves: Array<number>;

    // Check if direction values is an array
    if (Array.isArray(directionValues)) {
      // Calculate fixed column moves
      columnMoves = this.calculateFixedColumnMoves(
        currentColumn,
        directionType,
        directionValues,
        gridColumns,
      );
    } else if (directionValues === GameScriptKeys.ObjectList.INFINITE) {
      // Calculate infinite column moves
      columnMoves = this.calculateInfiniteColumnMoves(
        currentColumn,
        directionType,
        gridColumns,
      );
    }

    this.logger.log(
      `calculatePossibleMovesForLeftRight :: columnMoves - ${JSON.stringify(
        columnMoves,
      )}`,
    );

    // Return the array of possible column moves.
    return columnMoves;
  }

  /**
   * Calculates fixed column moves based on direction values.
   * @param currentColumn - The current column of the object.
   * @param directionType - The type of direction (LEFT or RIGHT).
   * @param directionValues - The values associated with the direction.
   * @param gridColumns - The total number of columns in the grid.
   * @returns An array of possible column positions.
   */
  private calculateFixedColumnMoves(
    currentColumn: number,
    directionType: string,
    directionValues: number[],
    gridColumns: number,
  ): Array<number> {
    this.logger.log(
      `calculateFixedColumnMoves :: directionType - ${directionType}, directionValues - ${JSON.stringify(
        directionValues,
      )}`,
    );

    // Array to store column values
    const columnValues: Array<number> = [];

    // Iterate through each direction value and calculate column positions
    directionValues.forEach((directionValue) => {
      // Calculate column change based on direction type
      const colChange =
        directionType === GameScriptKeys.ObjectList.LEFT
          ? -1
          : directionType === GameScriptKeys.ObjectList.RIGHT
          ? 1
          : 0;

      // Calculate the new column position
      const colTo = currentColumn + directionValue * colChange;

      // Check if the new column position is valid
      const isValidColumn = this.isValidColumn(colTo, gridColumns);

      // Add the column position to the array (or -1 if not valid)
      columnValues.push(isValidColumn ? colTo : -1);
    });

    this.logger.log(
      `calculateFixedColumnMoves :: columnValues - ${JSON.stringify(
        columnValues,
      )}`,
    );

    // Return the array of possible column values.
    return columnValues;
  }

  /**
   * Calculates infinite column moves based on the specified direction.
   * @param currentColumn The current column position.
   * @param directionType The type of direction (LEFT or RIGHT).
   * @param gridColumns The number of columns in the game grid.
   * @returns An array of column positions representing infinite moves.
   */
  private calculateInfiniteColumnMoves(
    currentColumn: number,
    directionType: string,
    gridColumns: number,
  ): Array<number> {
    this.logger.log(
      `calculateInfiniteColumnMoves :: directionType - ${directionType}`,
    );

    // Array to store column values for infinite moves.
    const columnValues: Array<number> = [];

    // Initialize the column position.
    let colTo = currentColumn;

    // Determine the column change based on the direction type.
    const colChange =
      directionType === GameScriptKeys.ObjectList.LEFT
        ? -1
        : directionType === GameScriptKeys.ObjectList.RIGHT
        ? 1
        : 0;

    // Continue adding column values until an invalid column is reached.
    while (this.isValidColumn(colTo + colChange, gridColumns)) {
      // Update the column position.
      colTo += colChange;

      // Add the current column position to the array.
      columnValues.push(colTo);
    }

    this.logger.log(
      `calculateInfiniteColumnMoves :: columnValues - ${JSON.stringify(
        columnValues,
      )}`,
    );

    // Return the array of possible column values.
    return columnValues;
  }

  /**
   * Generates valid move positions by concatenating pairs of row and column values.
   *
   * @param currentRow - The current row position.
   * @param currentColumn - The current column position.
   * @param rowValues - An array of row values. Can be null.
   * @param colValues - An array of column values. Can be null.
   * @param gridRows - The number of rows in the game grid.
   * @param gridColumns - The number of columns in the game grid.
   * @param currentObjectsList - The list of current objects in the game.
   * @param moveObject - The move object for which validity is checked.
   * @param playerUserId - The ID of the user associated with the object.
   * @returns An array of valid move positions.
   */
  private generateValidMovePositions(
    currentRow: number,
    currentColumn: number,
    rowValues: Array<number> | null,
    colValues: Array<number> | null,
    gridRows: number,
    gridColumns: number,
    currentObjectsList: Array<Record<string, any>>,
    moveObject: Record<string, any>,
    playerUserId: string,
  ): Array<PositionResponseDTO> {
    this.logger.log(
      `generateValidMovePositions :: rowValues - ${JSON.stringify(
        rowValues,
      )}, colValues - ${JSON.stringify(colValues)}`,
    );
    this.logger.log(
      `generateValidMovePositions :: gridRows - ${gridRows}, gridColumns - ${gridColumns}`,
    );

    // Array to store the final move positions.
    const validMoves: Array<PositionResponseDTO> = [];

    // Check if at least one of rowValues or colValues is present and has a non-zero length.
    if (
      (!rowValues || (rowValues && rowValues.length > 0)) &&
      (!colValues || (colValues && colValues.length > 0))
    ) {
      // Determine the loop length based on the presence and lengths of rowValues and colValues.
      const loopLength =
        rowValues && colValues
          ? Math.min(rowValues.length, colValues.length)
          : rowValues
          ? rowValues.length
          : colValues
          ? colValues.length
          : 0;

      this.logger.log(
        `generateValidMovePositions :: loopLength - ${loopLength}`,
      );

      // Retrieve the current object's ability to jump over other objects.
      const moveObjectCanJump = moveObject[GameScriptKeys.ObjectList.CAN_JUMP];
      this.logger.log(
        `generateValidMovePositions :: moveObjectCanJump - ${moveObjectCanJump}`,
      );

      // Iterate through the pairs of row and column values.
      for (let i = 0; i < loopLength; i++) {
        // Get the current row and column values or use the current positions if not available.
        const newRow = rowValues ? rowValues[i] ?? currentRow : currentRow;
        const newColumn = colValues
          ? colValues[i] ?? currentColumn
          : currentColumn;

        // Create a new position object
        const newPosition: PositionResponseDTO = {
          Row: newRow,
          Column: newColumn,
        };

        // Validate the move at the current position.
        const { addToValidMoves, objectEncountered } =
          this.validateMoveAtPosition(
            newPosition,
            gridRows,
            gridColumns,
            currentObjectsList,
            playerUserId,
            moveObjectCanJump,
          );

        // Add the position to validMoves if required.
        if (addToValidMoves) {
          validMoves.push(newPosition);
        }

        // Break the loop if an object is encountered at the current position.
        if (objectEncountered) {
          break;
        }
      }
    }

    this.logger.log(
      `generateValidMovePositions :: validMoves - ${JSON.stringify(
        validMoves,
      )}`,
    );

    // Return the array of valid moves.
    return validMoves;
  }

  /**
   * Validates if a move is permissible at the given position and determines
   * whether it should be added to the final array of moves.
   *
   * @param newPosition - The new position to check.
   * @param gridRows - The number of rows in the game grid.
   * @param gridColumns - The number of columns in the game grid.
   * @param currentObjectsList - The list of current objects in the game.
   * @param playerUserId - The ID of the user associated with the object.
   * @param moveObjectCanJump - Indicates whether the current object can jump.
   * @returns Object containing flags for whether the move should be added and if an object is encountered.
   */
  private validateMoveAtPosition(
    newPosition: PositionResponseDTO,
    gridRows: number,
    gridColumns: number,
    currentObjectsList: Array<Record<string, any>>,
    playerUserId: string,
    moveObjectCanJump: boolean,
  ): { addToValidMoves: boolean; objectEncountered: boolean } {
    this.logger.log(
      `validateMoveAtPosition :: newPosition - ${JSON.stringify(newPosition)}`,
    );

    // Extracting row and column from newPosition
    const { Row: newRow, Column: newColumn } = newPosition;

    // Check if the move is valid within the game grid.
    const isValidMove = this.isValidSquare(
      newRow,
      newColumn,
      gridRows,
      gridColumns,
    );

    // Flags to determine whether to add the move and if an object is encountered
    let addToValidMoves = false;
    let objectEncountered = false;

    // If the move is valid, add it to the final array of moves.
    if (isValidMove) {
      // Check if the object can move to the new position.
      const canMoveHere = this.canObjectMoveToPosition(
        currentObjectsList,
        playerUserId,
        newRow,
        newColumn,
      );

      // If the object can jump, consider the move valid based on its ability to move to the new position.
      addToValidMoves = canMoveHere;

      // If the object can't jump and can't move to the new position, an object is encountered.
      objectEncountered = !moveObjectCanJump && !canMoveHere;
    }

    this.logger.log(
      `validateMoveAtPosition :: addToValidMoves - ${addToValidMoves}, objectEncountered - ${objectEncountered}`,
    );

    // Return the flags
    return { addToValidMoves, objectEncountered };
  }

  /**
   * Checks if a given square (row and column combination) is valid within the specified grid.
   *
   * @param row - The row position to check.
   * @param col - The column position to check.
   * @param gridRows - The number of rows in the game grid.
   * @param gridColumns - The number of columns in the game grid.
   * @returns True if the square is valid, otherwise false.
   */
  private isValidSquare(
    row: number,
    col: number,
    gridRows: number,
    gridColumns: number,
  ): boolean {
    this.logger.log(`isValidSquare :: row - ${row}, col - ${col}`);

    // Check if the row and column are within the valid range.
    const isValidRow = this.isValidRow(row, gridRows);
    const isValidColumn = this.isValidColumn(col, gridColumns);

    this.logger.log(
      `isValidSquare :: isValidRow - ${isValidRow}, isValidColumn - ${isValidColumn}`,
    );

    // Combine row and column validity to determine if the square is valid.
    let isValid = isValidRow && isValidColumn;
    this.logger.log(`isValidSquare :: isValid - ${isValid}`);

    // Return the result of the validity check.
    return isValid;
  }

  /**
   * Checks if a given row is valid within the specified grid.
   * @param row The row position to check.
   * @param gridRows The number of rows in the game grid.
   * @returns True if the row is valid, otherwise false.
   */
  private isValidRow(row: number, gridRows: number) {
    return row >= 1 && row <= gridRows;
  }

  /**
   * Checks if a given column is valid within the specified grid.
   * @param col The column position to check.
   * @param gridColumns The number of columns in the game grid.
   * @returns True if the column is valid, otherwise false.
   */
  private isValidColumn(col: number, gridColumns: number) {
    return col >= 1 && col <= gridColumns;
  }

  /**
   * Check if an object can move to the specified position.
   *
   * @param currentObjectsList - The list of current objects in the game.
   * @param playerUserId - The ID of the user associated with the object.
   * @param row - The row coordinate to check.
   * @param column - The column coordinate to check.
   * @returns True if the object can move to the specified position, false otherwise.
   */
  private canObjectMoveToPosition(
    currentObjectsList: Array<Record<string, any>>,
    playerUserId: string,
    row: number,
    column: number,
  ): boolean {
    this.logger.log(
      `canObjectMoveToPosition :: row - ${row}, column - ${column}`,
    );

    // Check if any object is already at the specified position.
    const isPositionOccupied = currentObjectsList.some((objectItem) => {
      // Check if the object is at the specified position.
      const isObjectAtPosition =
        objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION][
          GameScriptKeys.ObjectList.ROW
        ] === row &&
        objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION][
          GameScriptKeys.ObjectList.COLUMN
        ] === column;

      // Check if the object belongs to the current player.
      const isCurrentPlayer =
        playerUserId === objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID];

      // Check if the object belongs to another player.
      const isOtherPlayer =
        objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID] &&
        playerUserId !== objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID];

      // Check if the object is capturable.
      const isObjectCapturable =
        objectItem[GameScriptKeys.ObjectList.IS_CAPTURABLE] === true;

      // Return true if the object is at the specified position and is either the current player's or not capturable by other players.
      return (
        isObjectAtPosition &&
        (isCurrentPlayer || (isOtherPlayer && !isObjectCapturable))
      );
    });

    this.logger.log(
      `canObjectMoveToPosition :: isPositionOccupied - ${isPositionOccupied}`,
    );

    // Return true if the position is not occupied, indicating that the object can move to the specified position.
    return !isPositionOccupied;
  }

  /**
   * Validates a player's move in the game.
   *
   * @param gameState - The current game state.
   * @param eventMoveRequestDto - The data related to the player's move.
   * @param moveObject - The object currently being moved.
   * @returns `true` if the move is valid, `false` otherwise.
   */
  public validateMove(
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
    moveObject: Record<string, any>,
  ): boolean {
    this.logger.log(
      `validateMove :: eventMoveRequestDto - ${JSON.stringify(
        eventMoveRequestDto,
      )}`,
    );

    // Initialize the validity of the move to true.
    let isValidMove = true;

    // Extract the target position from the player's move data.
    const { to: movedPosition } = eventMoveRequestDto;

    // Ensure valid movement data exists.
    if (
      !movedPosition ||
      typeof movedPosition.Row !== 'number' ||
      typeof movedPosition.Column !== 'number'
    ) {
      // The move is invalid without valid movement data.
      isValidMove = false;
    }

    // Validate additional move rules specific to the game.
    if (!this.validateMoveRules(eventMoveRequestDto, moveObject, gameState)) {
      // If additional rules are not satisfied, mark the move as invalid.
      isValidMove = false;
    }

    this.logger.log(`validateMove :: isValidMove - ${isValidMove}`);

    // Return the result of the move validation.
    return isValidMove;
  }

  /**
   * Validates a player's move based on the rules defined in moveObject.
   *
   * @param eventMoveRequestDto - The data related to the player's move.
   * @param moveObject - The object containing move rules.
   * @param gameState
   * @returns `true` if the move is valid, `false` otherwise.
   */
  private validateMoveRules(
    eventMoveRequestDto: EventMoveRequestDTO,
    moveObject: Record<string, any>,
    gameState: GameState,
  ): boolean {
    this.logger.log(
      `validateMoveRules :: eventMoveRequestDto - ${JSON.stringify(
        eventMoveRequestDto,
      )}`,
    );

    // Extract positions from the player's move data.
    const { from: currentPosition, to: movedPosition } = eventMoveRequestDto;
    const { Row: currentRow, Column: currentColumn } = currentPosition;
    const { Row: movedRow, Column: movedColumn } = movedPosition;

    this.logger.log(
      `validateMoveRules :: currentPosition - ${JSON.stringify(
        currentPosition,
      )}, movedPosition - ${JSON.stringify(movedPosition)}`,
    );

    // Calculate valid possible moves based on move rules.
    const possibleMoves: Array<PositionResponseDTO> =
      this.calculateAllValidPossibleMoves(
        currentRow,
        currentColumn,
        moveObject,
        gameState,
      );

    this.logger.log(
      `validateMoveRules :: possibleMoves - ${JSON.stringify(possibleMoves)}`,
    );

    // Check if the moved position is among the valid possible moves.
    const isValidMove = possibleMoves.some(
      (possibleMove) =>
        possibleMove.Row === movedRow && possibleMove.Column === movedColumn,
    );

    this.logger.log(`validateMoveRules :: isValidMove - ${isValidMove}`);

    // Return the result of move validation.
    return isValidMove;
  }

  /**
   * Updates the game state in the database to reflect a valid player move.
   *
   * @param gameState - The current game state.
   * @param eventMoveRequestDto - The data related to the player's move.
   * @returns The updated game state after the move.
   */
  public async updateGameStateForValidMove(
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForValidMove :: eventMoveRequestDto - ${JSON.stringify(
        eventMoveRequestDto,
      )}`,
    );

    // Build a data object for updating the game state for a valid move.
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateDataForValidMove(
        gameState,
        eventMoveRequestDto,
      );
    this.logger.log(
      `updateGameStateForValidMove :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      // Attempt to update the game state in the database.
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      // Handle any errors that occur during the database update.
      this.logger.error(
        `updateGameStateForValidMove :: Error while updating game state in the database`,
      );
      this.logger.error(`updateGameStateForValidMove :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state in the database.',
      );
    }
  }

  /**
   * Handles actions after a player makes a move in the game.
   *
   * @param client - The WebSocket client.
   * @param gameToken - The game token representing the room.
   * @param gameState - The current game state.
   * @param eventMoveRequestDto - The data related to the player's move.
   * @param moveObject - The object currently moved.
   */
  public async afterMove(
    client: Socket,
    gameToken: string,
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
    moveObject: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`afterMove :: gameToken - ${gameToken}`);

    // Check if an object is captured.
    const capturedObjectItem =
      this.gameCapturedObjectBuilder.checkCapturedObject(
        gameState,
        eventMoveRequestDto,
      );

    // Handle the captured object if present.
    if (capturedObjectItem) {
      // Execute the logic to handle the captured object asynchronously.
      await this.gameCapturedObjectBuilder.handleCapturedObject(
        client,
        gameToken,
        gameState,
        capturedObjectItem,
      );
    }

    // Check if the game is won.
    const matchedWinItem = this.gameWinBuilder.checkGameWin(
      gameState,
      eventMoveRequestDto,
      capturedObjectItem,
    );

    // Process the outcome based on whether the game is won or not.
    if (matchedWinItem) {
      // If the game is won, send a "game won" event and perform necessary actions.
      await this.gameWinBuilder.handleGameWon(
        client,
        gameToken,
        gameState,
        matchedWinItem,
      );
    } else {
      // If the game is not won, proceed to the next player's turn.
      await this.gamePlayerTurnBuilder.advanceToNextPlayerTurn(
        client,
        gameToken,
        gameState,
      );
    }
  }
}
