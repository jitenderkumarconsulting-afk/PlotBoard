import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { GameState } from '../interfaces/game-state.interface';
import { GameScriptKeys } from '../constants/game-script-keys';
import GameScriptWinConditionType from '../enums/game-script-win-condition-type.enum';
import { EventMoveRequestDTO } from '../dtos/request/event-move-request.dto';
import { PositionRequestDTO } from '../dtos/request/position-request.dto';
import { GameBuilder } from './game.builder';
import { GameEndBuilder } from './game-end.builder';

@Injectable()
export class GameWinBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameBuilder: GameBuilder, // Inject the GameBuilder service
    private readonly gameEndBuilder: GameEndBuilder, // Inject the GameEndBuilder service
  ) {
    this.logger = new Logger(GameWinBuilder.name);
  }

  /**
   * Checks if the game is won based on the provided game state and player's move.
   *
   * @param gameState The current game state.
   * @param eventMoveRequestDto The data related to the player's move.
   * @param capturedObjectItem The captured object information.
   * @returns The matched win item if the game is won, or null if not won.
   */
  public checkGameWin(
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
    capturedObjectItem: Record<string, any> | null,
  ): Record<string, any> | null {
    this.logger.log(`checkGameWin`);

    // Extract the player's moved target position from the move data.
    const { to: movedPosition } = eventMoveRequestDto;

    // Ensure valid movement data exists.
    if (
      !movedPosition ||
      typeof movedPosition.Row !== 'number' ||
      typeof movedPosition.Column !== 'number'
    ) {
      // No win is possible without valid movement data, return null.
      return null;
    }

    this.logger.log(
      `checkGameWin :: movedPosition - ${JSON.stringify(movedPosition)}`,
    );

    // Extract the current turn from the current game state.
    const { current_turn: currentTurn } = gameState;
    const { player_num: currentPlayerNum } = currentTurn;

    // Extract the game state script and the win list from the current game state.
    const { game_state_script: gameStateScript } = gameState;
    const winList = gameStateScript?.[GameScriptKeys.WinList.WIN_LIST] || [];

    // Check if the moved position matches any target position in the win list.
    const matchedWinItem =
      winList.find((winItem) => {
        const playerNum = winItem[GameScriptKeys.WinList.PLAYER];

        // Check if the player number in the win item matches the current player number.
        if (currentPlayerNum != playerNum) {
          return false;
        }

        const condition = winItem[GameScriptKeys.WinList.CONDITION];

        switch (condition) {
          case GameScriptWinConditionType.REACHED_POSITION:
            return this.checkWinForReachedPosition(winItem, movedPosition);

          case GameScriptWinConditionType.CAPTURED_OBJECT:
            return this.checkWinForCapturedObject(winItem, capturedObjectItem);
        }

        return false;
      }) || null;

    this.logger.log(
      `checkGameWin :: matchedWinItem - ${JSON.stringify(matchedWinItem)}`,
    );

    // Return the matched win item if found, or null if the game is not won.
    return matchedWinItem;
  }

  /**
   * Checks if the game is won based on the "REACHED_POSITION" win condition.
   *
   * @param winItem The win condition item to check.
   * @param movedPosition The position to compare with the win condition.
   * @returns True if the win condition is met, false otherwise.
   */
  private checkWinForReachedPosition(
    winItem: Record<string, any>,
    movedPosition: PositionRequestDTO,
  ): boolean {
    this.logger.log(`checkWinForReachedPosition`);

    const targetPosition = winItem[GameScriptKeys.WinList.TARGET_POSITION];

    // Ensure the target position exists.
    if (!targetPosition) {
      return false;
    }

    // Check if the moved position matches the target position.
    return (
      targetPosition[GameScriptKeys.WinList.ROW] === movedPosition.Row &&
      targetPosition[GameScriptKeys.WinList.COLUMN] === movedPosition.Column
    );
  }

  /**
   * Checks if the game is won based on the "CAPTURED_OBJECT" win condition.
   *
   * @param winItem The win condition item to check.
   * @param capturedObjectItem The captured object information.
   * @returns True if the win condition is met, false otherwise.
   */
  private checkWinForCapturedObject(
    winItem: Record<string, any>,
    capturedObjectItem: Record<string, any> | null,
  ): boolean {
    this.logger.log(`checkWinForCapturedObject`);

    // Check if there is a captured object; if not, the win condition is not met.
    if (!capturedObjectItem) {
      return false;
    }

    const objectTypes = winItem[GameScriptKeys.WinList.OBJECT_TYPES];

    // Check if objectTypes is an array; if not, return false.
    if (!Array.isArray(objectTypes)) {
      return false;
    }

    // Check if the captured object's type is in the list of expected types.
    return objectTypes.includes(
      capturedObjectItem[GameScriptKeys.ObjectList.TYPE],
    );
  }

  /**
   * Handles actions when the game is won.
   *
   * @param client The WebSocket client triggering the game win event.
   * @param gameToken The game token representing the room where the game was won.
   * @param gameState The current game state.
   * @param matchedWinItem The matched win item from the game's script.
   */
  public async handleGameWon(
    client: Socket,
    gameToken: string,
    gameState: GameState,
    matchedWinItem: Record<string, any>,
  ) {
    this.logger.log(
      `handleGameWon :: gameToken - ${gameToken}, matchedWinItem - ${JSON.stringify(
        matchedWinItem,
      )}`,
    );

    let updatedGameState = gameState;
    try {
      // Attempt to update the game state to mark it as end with player won.
      updatedGameState =
        await this.gameEndBuilder.updateGameStateForGameEndWithPlayerWon(
          gameState,
          matchedWinItem,
        );
      this.logger.log(
        `handleGameWon :: updatedGameState - ${JSON.stringify(
          updatedGameState,
        )}`,
      );
    } catch (error) {
      this.logger.error(`handleGameWon :: error - ${error}`);
    }

    // Send end event to the client with updated game state.
    this.gameEndBuilder.sendEndEvent(client, gameToken, updatedGameState);
  }
}
