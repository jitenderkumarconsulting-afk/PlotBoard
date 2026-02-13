import { Injectable, Logger } from '@nestjs/common';

import { GameStatePlayerResponseDTO } from '../dtos/response/game-state-player-response.dto';
import { GameStatePlayer } from '../interfaces/game-state-player.interface';
import { GameState } from '../interfaces/game-state.interface';
import { DateHelper } from '../../../shared/helpers/date.helper';
import { GameStateInfo } from '../interfaces/game-state-info.interface';
import { GameStateInfoResponseDTO } from '../dtos/response/game-state-info-response.dto';
import { PlayerTurn } from '../interfaces/player-turn.interface';
import { PlayerTurnResponseDTO } from '../dtos/response/player-turn-response.dto';
import { GameScriptKeys } from '../constants/game-script-keys';
import { EventEndResponseDTO } from '../dtos/response/event-end-response.dto';
import { GameStateResultPlayerResponseDTO } from '../dtos/response/game-state-result-player-response.dto';
import { GameStateResultPlayer } from '../interfaces/game-state-result-player.interface';
import { GameStateResultResponseDTO } from '../dtos/response/game-state-result-response.dto';
import { GameStateResult } from '../interfaces/game-state-result.interface';
import GameStateResultType from '../enums/game-state-result-type.enum';
import { EventMoveRequestDTO } from '../dtos/request/event-move-request.dto';
import { EventPossibleMovesResponseDTO } from '../dtos/response/event-possible-moves-response.dto';
import { PositionResponseDTO } from '../dtos/response/position-response.dto';
import { GridInfoResponseDTO } from '../dtos/response/grid-info-response.dto';
import { GridInfo } from '../interfaces/grid-info.interface';
import { GameStateConfigResponseDTO } from '../dtos/response/game-state-config-response.dto';
import { GameStateConfig } from '../interfaces/game-state-config.interface';
import { EventCapturedObjectsResponseDTO } from '../dtos/response/event-captured-objects-response.dto';

@Injectable()
export class GameObjectBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(GameObjectBuilder.name);
  }

  /**
   * Builds a list of game state player response DTOs.
   * @param gameStatePlayersList - Array of game state player objects.
   * @returns Array of game state player response DTOs.
   */
  public buildGameStatePlayersListResponse(
    gameStatePlayersList: Array<GameStatePlayer>,
  ): Array<GameStatePlayerResponseDTO> {
    this.logger.log(
      `buildGameStatePlayersListResponse :: gameStatePlayersList length - ${gameStatePlayersList.length}`,
    );

    // Use the `map` function to create an array of `GameStatePlayerResponseDTO` objects.
    const gameStatePlayersListResponse: Array<GameStatePlayerResponseDTO> =
      gameStatePlayersList.map((gameStatePlayer) =>
        this.buildGameStatePlayerResponse(gameStatePlayer),
      );
    this.logger.log(
      `buildGameStatePlayersListResponse :: gameStatePlayersListResponse length - ${gameStatePlayersListResponse.length}`,
    );

    // Return the array of game state player response DTOs.
    return gameStatePlayersListResponse;
  }

  /**
   * Builds a single game state player response DTO.
   * @param gameStatePlayer - Game state player object.
   * @returns Game state player response DTO.
   */
  private buildGameStatePlayerResponse(
    gameStatePlayer: GameStatePlayer,
  ): GameStatePlayerResponseDTO {
    this.logger.log(
      `buildGameStatePlayerResponse :: gameStatePlayer - ${JSON.stringify(
        gameStatePlayer,
      )}`,
    );

    // Extract necessary game state player data for the response.
    const { user_id, name, is_anonymous, points } = gameStatePlayer;

    // Create a GameStatePlayerResponseDTO object with the necessary game state player data.
    const gameStatePlayerResponse: GameStatePlayerResponseDTO = {
      user_id,
      name,
      is_anonymous,
      points,
    };
    this.logger.log(
      `buildGameStatePlayerResponse :: gameStatePlayerResponse - ${JSON.stringify(
        gameStatePlayerResponse,
      )}`,
    );

    // Return the game state player response DTO.
    return gameStatePlayerResponse;
  }

  /**
   * Builds the data object for updating the game state to mark the game as started.
   * @param gameState - The game state object.
   * @returns A partial game state object with updated data.
   */
  public buildUpdateGameStateDataForGameStart(
    gameState: GameState,
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateDataForGameStart :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Build the updated game state info.
    const updatedGameStateInfo =
      this.buildUpdateGameStateInfoDataForGameStart(gameState);

    // Extract the necessary fields from the game state and updated game state info objects.
    const { load_run_info: loadRunInfo } = gameState;
    const { players_turn_sequence: playersTurnSequence } = updatedGameStateInfo;

    const updatedLoadRunInfo = this.buildUpdateLoadRunInfoDataForGameStart(
      loadRunInfo,
      playersTurnSequence,
    );

    // Create the game state data object with the necessary data.
    const gameStateData: Partial<GameState> = {
      ...gameState, // Copy existing game state properties.
      game_state_info: updatedGameStateInfo, // Update game state info.
      load_run_info: updatedLoadRunInfo, // Update load run info.
      current_turn: playersTurnSequence[0], // Set the current turn.
    };
    this.logger.log(
      `buildUpdateGameStateDataForGameStart :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    // Return the partially updated game state data.
    return gameStateData;
  }

  /**
   * Builds game state info data to mark the game as started.
   * This method takes a game state object and prepares the necessary data to update the game state and indicate that the game has started. It calculates the start and end dates, as well as the player turn sequence.
   * @param gameState - The game state object to be updated for game start.
   * @returns The updated game state info data for a started game.
   */
  private buildUpdateGameStateInfoDataForGameStart(
    gameState: GameState,
  ): GameStateInfo {
    this.logger.log(
      `buildUpdateGameStateInfoDataForGameStart :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Extract the necessary fields from the game state object, game state info object and game state config object.
    const { game_state_info: gameStateInfo, players } = gameState;
    const { game_state_config: gameStateConfig } = gameStateInfo;
    const { game_duration: gameDuration } = gameStateConfig;

    // Calculate the start date as the current date and time.
    const startedAt = DateHelper.getCurrentDate();

    // Calculate the end date by adding the game duration to the start date.
    const endDate = gameDuration
      ? DateHelper.getAdjustedDate(startedAt, gameDuration)
      : undefined;

    // Build the player turn sequence data based on the players in the game.
    const playersTurnSequence = this.buildPlayersTurnSequenceListData(players);

    // Create the game state info data object with the updated information.
    const gameStateInfoData: GameStateInfo = {
      ...gameStateInfo,
      started_at: startedAt.getTime(),
      end_date: endDate?.getTime(),
      players_turn_sequence: playersTurnSequence,
    };
    this.logger.log(
      `buildUpdateGameStateInfoDataForGameStart :: gameStateInfoData - ${JSON.stringify(
        gameStateInfoData,
      )}`,
    );

    // Return the updated game state info data for a started game.
    return gameStateInfoData;
  }

  /**
   * Builds a list of player turn data from an array of game state players.
   * This method takes an array of game state players and converts each player into player turn data. Player turn data is used to represent the players in the turn sequence.
   * @param gameStatePlayersList - An array of game state players to be converted into player turn data.
   * @returns An array of player turn data representing the players in the turn sequence.
   */
  public buildPlayersTurnSequenceListData(
    gameStatePlayersList: Array<GameStatePlayer>,
  ): Array<PlayerTurn> {
    this.logger.log(
      `buildPlayersTurnSequenceListData :: gameStatePlayersList length - ${gameStatePlayersList.length}`,
    );

    // Use the `map` function to create an array of `PlayerTurn` objects.
    const playersTurnSequenceListData: Array<PlayerTurn> =
      gameStatePlayersList.map((gameStatePlayer, index) =>
        this.buildPlayerTurnData(gameStatePlayer, ++index),
      );
    this.logger.log(
      `buildPlayersTurnSequenceListData :: playersTurnSequenceListData length - ${playersTurnSequenceListData.length}`,
    );

    // Return the array of player turn data representing the players in the turn sequence.
    return playersTurnSequenceListData;
  }

  /**
   * Builds player turn data from a game state player.
   * This method takes a game state player and converts it into player turn data, which is used to represent the player in the turn sequence.
   * @param gameStatePlayer - The game state player to be converted into player turn data.
   * @param playerNum
   * @returns Player turn data representing the player.
   */
  private buildPlayerTurnData(
    gameStatePlayer: GameStatePlayer,
    playerNum: number,
  ): PlayerTurn {
    this.logger.log(
      `buildPlayerTurnData :: gameStatePlayer - ${JSON.stringify(
        gameStatePlayer,
      )}`,
    );

    // Extract the necessary fields from the game state player.
    const {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
    } = gameStatePlayer;

    // Create the player turn data object with the extracted information.
    const playerTurnData: PlayerTurn = {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      player_num: playerNum,
    };
    this.logger.log(
      `buildPlayerTurnData :: playerTurnData - ${JSON.stringify(
        playerTurnData,
      )}`,
    );

    // Return the player turn data representing the player.
    return playerTurnData;
  }

  /**
   * Builds and updates load run information data for the start of a game.
   *
   * @param loadRunInfo - The load run information data.
   * @param playersTurnSequence - An array of player turn information.
   * @returns The updated load run information data.
   */
  private buildUpdateLoadRunInfoDataForGameStart(
    loadRunInfo: Record<string, any>,
    playersTurnSequence: Array<PlayerTurn>,
  ): Record<string, any> {
    this.logger.log(`buildUpdateLoadRunInfoDataForGameStart`);

    // Retrieve the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    if (Array.isArray(objectList)) {
      // Map through each object in the 'OBJECT_LIST' and update 'PLAYER_USER_ID'.
      loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST] = objectList.map(
        (objectItem) => {
          // Extract 'PLAYER' value from the object.
          const playerNumber = objectItem[GameScriptKeys.ObjectList.PLAYER];

          // Check conditions for updating 'PLAYER_USER_ID'.
          if (
            objectItem[GameScriptKeys.ObjectList.OBJECT_ID] &&
            typeof playerNumber === 'number' &&
            playerNumber > 0 &&
            playerNumber <= playersTurnSequence.length
          ) {
            // Update 'PLAYER_USER_ID' with the corresponding user ID.
            objectItem[GameScriptKeys.ObjectList.PLAYER_USER_ID] =
              playersTurnSequence[playerNumber - 1].user_id;
          }

          return objectItem;
        },
      );
    }

    this.logger.log(
      `buildUpdateLoadRunInfoDataForGameStart :: loadRunInfo - ${JSON.stringify(
        loadRunInfo,
      )}`,
    );

    return loadRunInfo;
  }

  /**
   * Builds a game state info response DTO from a game state info object.
   * @param gameStateInfo The game state info object to be transformed into a response.
   * @returns The game state info response DTO representing game state information.
   */
  public buildGameStateInfoResponse(
    gameStateInfo: GameStateInfo,
  ): GameStateInfoResponseDTO {
    this.logger.log(
      `buildGameStateInfoResponse :: gameStateInfo - ${JSON.stringify(
        gameStateInfo,
      )}`,
    );

    // Extract necessary game state info data for the response
    const {
      game_id: gameId,
      game_state_config: gameStateConfig,
      owner_user_id: ownerUserId,
      players_count: playersCount,
      started_at: startedAt,
      end_date: endDate,
      players_turn_sequence: playersTurnSequence,
    } = gameStateInfo;

    // Build the players turn sequence list response
    const playersTurnSequenceListResponse =
      this.buildPlayersTurnSequenceListResponse(playersTurnSequence);
    this.logger.log(
      `buildGameStateInfoResponse :: playersTurnSequenceListResponse - ${JSON.stringify(
        playersTurnSequenceListResponse,
      )}`,
    );

    // Create a GameStateInfoResponseDTO object with the necessary game state info data
    const gameStateInfoResponse: GameStateInfoResponseDTO = {
      game_id: gameId,
      game_state_config: this.buildGameStateConfigResponse(gameStateConfig),
      owner_user_id: ownerUserId,
      players_count: playersCount,
      started_at: startedAt,
      end_date: endDate,
      players_turn_sequence: playersTurnSequenceListResponse,
    };
    this.logger.log(
      `buildGameStateInfoResponse :: gameStateInfoResponse - ${JSON.stringify(
        gameStateInfoResponse,
      )}`,
    );

    // Return the game state info response DTO
    return gameStateInfoResponse;
  }

  /**
   * Builds a list of player turn responses from an array of player turn objects.
   * @param playersTurnSequence An array of player turn objects to be transformed into responses.
   * @returns An array of PlayerTurnResponseDTO objects representing player turns, or null if the input array is null.
   */
  private buildPlayersTurnSequenceListResponse(
    playersTurnSequence?: Array<PlayerTurn>,
  ): Array<PlayerTurnResponseDTO> | null {
    this.logger.log(`buildPlayersTurnSequenceListResponse`);

    if (!playersTurnSequence) {
      this.logger.log(
        `buildPlayersTurnSequenceListResponse :: playersTurnSequence - null`,
      );
      // Return null if the input array is null.
      return null;
    }

    this.logger.log(
      `buildPlayersTurnSequenceListResponse :: playersTurnSequence length - ${playersTurnSequence.length}`,
    );

    // Use the `map` function to create an array of PlayerTurnResponseDTO objects.
    const playersTurnSequenceListResponse: Array<PlayerTurnResponseDTO> =
      playersTurnSequence.map((playerTurn) =>
        this.buildPlayerTurnResponse(playerTurn),
      );

    this.logger.log(
      `buildPlayersTurnSequenceListResponse :: playersTurnSequenceListResponse length - ${playersTurnSequenceListResponse.length}`,
    );

    return playersTurnSequenceListResponse;
  }

  /**
   * Builds a player turn response object from a player turn object.
   * @param playerTurn The player turn object.
   * @returns A PlayerTurnResponseDTO representing the player's turn.
   */
  public buildPlayerTurnResponse(
    playerTurn: PlayerTurn,
  ): PlayerTurnResponseDTO {
    this.logger.log(
      `buildPlayerTurnResponse :: playerTurn - ${JSON.stringify(playerTurn)}`,
    );

    // Extract necessary player turn data for the response.
    const {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      player_num: playerNum,
    } = playerTurn;

    // Create a PlayerTurnResponseDTO object with the necessary player turn data.
    const playerTurnResponse: PlayerTurnResponseDTO = {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      player_num: playerNum,
    };
    this.logger.log(
      `buildPlayerTurnResponse :: playerTurnResponse - ${JSON.stringify(
        playerTurnResponse,
      )}`,
    );

    return playerTurnResponse;
  }

  /**
   * Builds a response DTO for game state configuration.
   *
   * @param gameStateConfig - The game state configuration data.
   * @returns The constructed GameStateConfigResponseDTO.
   */
  private buildGameStateConfigResponse(
    gameStateConfig: GameStateConfig,
  ): GameStateConfigResponseDTO {
    this.logger.log(
      `buildGameStateConfigResponse :: gameStateConfig - ${JSON.stringify(
        gameStateConfig,
      )}`,
    );

    const {
      grid_info: gridInfo,
      description,
      max_players: maxPlayers,
      game_duration: gameDuration,
      turn_duration: turnDuration,
    } = gameStateConfig;

    // Create a GameStateConfigResponseDTO object with the necessary game state config data.
    const gameStateConfigResponse: GameStateConfigResponseDTO = {
      grid_info: this.buildGridInfoResponse(gridInfo),
      description,
      max_players: maxPlayers,
      game_duration: gameDuration,
      turn_duration: turnDuration,
    };
    this.logger.log(
      `buildGameStateConfigResponse :: gameStateConfigResponse - ${JSON.stringify(
        gameStateConfigResponse,
      )}`,
    );

    return gameStateConfigResponse;
  }

  /**
   * Builds a response DTO for grid information.
   *
   * @param gridInfo - The grid information data.
   * @returns The constructed GridInfoResponseDTO.
   */
  private buildGridInfoResponse(gridInfo: GridInfo): GridInfoResponseDTO {
    this.logger.log(
      `buildGridInfoResponse :: gridInfo - ${JSON.stringify(gridInfo)}`,
    );

    // Extract necessary grid info data for the response
    const { rows, columns } = gridInfo;

    // Create a GridInfoResponseDTO object with the necessary grid info data.
    const gridInfoResponse: GridInfoResponseDTO = {
      rows,
      columns,
    };
    this.logger.log(
      `buildGridInfoResponse :: gridInfoResponse - ${JSON.stringify(
        gridInfoResponse,
      )}`,
    );

    // Return the constructed GridInfoResponseDTO object.
    return gridInfoResponse;
  }

  /**
   * Builds the data object for updating the game state to mark the game as ended with a player's win.
   * @param gameState - The current game state object.
   * @param matchedWinItem - Information about the winning condition, such as the matched items.
   * @returns A partial game state object with updated data.
   */
  public buildUpdateGameStateDataForGameEndWithPlayerWon(
    gameState: GameState,
    matchedWinItem: Record<string, any>,
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateDataForGameEndWithPlayerWon :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Build the game state result data for a player's win.
    const gameStateResult =
      this.buildUpdateGameStateResultDataForGameEndWithPlayerWon(
        gameState,
        matchedWinItem,
      );

    // Create the game state data object with the necessary data.
    const gameStateData: Partial<GameState> = {
      ...gameState,
      game_state_result: gameStateResult,
    };
    this.logger.log(
      `buildUpdateGameStateDataForGameEndWithPlayerWon :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    return gameStateData;
  }

  /**
   * Builds and returns the game state result data for a game that ended with a player's victory.
   * @param gameState - The current game state.
   * @param matchedWinItem - The specifics of the winning condition.
   * @returns The game state result data.
   */
  private buildUpdateGameStateResultDataForGameEndWithPlayerWon(
    gameState: GameState,
    matchedWinItem: Record<string, any>,
  ): GameStateResult {
    this.logger.log(
      `buildUpdateGameStateResultDataForGameEndWithPlayerWon :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Extract the necessary fields from the game state object.
    const {
      players,
      current_turn: currentTurn,
      game_state_script: gameStateScript,
    } = gameState;

    // Build a list of game state result players excluding the winner.
    const resultPlayers: Array<GameStateResultPlayer> =
      this.buildGameStateResultPlayersListData(players, currentTurn, 'Loser');

    // Create information about the winning condition.
    const matchedWinRunInfo = this.buildCreateMatchedWinRunInfoData(
      gameStateScript,
      matchedWinItem,
    );

    // Find the winner among the players.
    const winner: GameStateResultPlayer =
      this.buildWinnerGameStateResultPlayerData(players, currentTurn);

    // Create the game state result data object with the information.
    const gameStateResultData: GameStateResult = {
      players: resultPlayers,
      result_type: GameStateResultType.PLAYER_WON,
      message: 'Game ended with a player victory.',
      matched_win_item: matchedWinItem,
      matched_win_run_info: matchedWinRunInfo,
      winner: winner,
      winner_message:
        'Congratulations! You won the game. Keep your spirits high.',
      loser_message:
        'Although you lost, your effort was great! Keep playing and striving for improvement!',
    };

    this.logger.log(
      `buildUpdateGameStateResultDataForGameEndWithPlayerWon :: gameStateResultData - ${JSON.stringify(
        gameStateResultData,
      )}`,
    );

    // Return the game state result data for an ended game with a player's victory.
    return gameStateResultData;
  }

  /**
   * Build and return a list of game state result player data objects for all players except the winner.
   * @param gameStatePlayersList - The list of GameStatePlayer objects representing all players in the game.
   * @param currentTurn - The current player's turn information, including user ID and anonymity status.
   * @param message - The message to be displayed for all non-winning players.
   * @returns The list of game state result player data.
   */
  private buildGameStateResultPlayersListData(
    gameStatePlayersList: Array<GameStatePlayer>,
    currentTurn: PlayerTurn,
    message: string,
  ): Array<GameStateResultPlayer> {
    this.logger.log(
      `buildGameStateResultPlayersListData :: gameStatePlayersList length - ${gameStatePlayersList.length}`,
    );

    // Extract the current player's user ID and anonymity status for efficient filtering.
    const { user_id: currentUserID, is_anonymous: currentUserIsAnonymous } =
      currentTurn;

    // Use the `map` function to create an array of game state result player data for non-winning players.
    const gameStateResultPlayersListData = gameStatePlayersList
      .filter(
        (gameStatePlayer) =>
          !(
            gameStatePlayer.user_id === currentUserID &&
            gameStatePlayer.is_anonymous === currentUserIsAnonymous
          ),
      )
      .map((gameStatePlayer) =>
        this.buildGameStateResultPlayerData(gameStatePlayer, message),
      );

    this.logger.log(
      `buildGameStateResultPlayersListData :: gameStateResultPlayersListData length - ${gameStateResultPlayersListData.length}`,
    );

    // Return the array of game state result player data representing the players' results.
    return gameStateResultPlayersListData;
  }

  /**
   * Build and return a game state result player data object for a specific player.
   * @param gameStatePlayer - The GameStatePlayer object representing a player.
   * @param message - The message to be displayed for the player.
   * @returns The game state result player data for the player.
   */
  private buildGameStateResultPlayerData(
    gameStatePlayer: GameStatePlayer,
    message: string,
  ): GameStateResultPlayer {
    this.logger.log(
      `buildGameStateResultPlayerData :: gameStatePlayer - ${JSON.stringify(
        gameStatePlayer,
      )}`,
    );

    // Extract the necessary fields from the game state player object.
    const {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      points,
    } = gameStatePlayer;

    // Create the game state result player data object with the extracted data.
    const gameStateResultPlayerData: GameStateResultPlayer = {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      points,
      message,
    };
    this.logger.log(
      `buildGameStateResultPlayerData :: gameStateResultPlayerData - ${JSON.stringify(
        gameStateResultPlayerData,
      )}`,
    );

    // Return the game state result player data representing the player's result.
    return gameStateResultPlayerData;
  }

  /**
   * Build and return a GameStateResultPlayer object for the winner of the game.
   *
   * @param gameStatePlayersList - The list of GameStatePlayer objects representing all players in the game.
   * @param currentTurn - The current player's turn information, including user ID and anonymity status.
   * @returns The GameStateResultPlayer object for the winner, or null if the winner details are not found in the players' list.
   */
  private buildWinnerGameStateResultPlayerData(
    gameStatePlayersList: Array<GameStatePlayer>,
    currentTurn: PlayerTurn,
  ): GameStateResultPlayer | null {
    this.logger.log(
      `buildWinnerGameStateResultPlayerData :: gameStatePlayersList length - ${gameStatePlayersList.length}`,
    );

    // Extract the current player's user ID and anonymity status for efficient filtering.
    const { user_id: currentUserID, is_anonymous: currentUserIsAnonymous } =
      currentTurn;

    // Find the winner player based on user ID and anonymity status.
    let winnerPlayer = gameStatePlayersList.find(
      (gameStatePlayer) =>
        gameStatePlayer.user_id === currentUserID &&
        gameStatePlayer.is_anonymous === currentUserIsAnonymous,
    );

    if (!winnerPlayer) {
      this.logger.log(
        `buildWinnerGameStateResultPlayerData :: winnerPlayer - null`,
      );
      return null; // Return null if the winner details are not found in the players' list.
    }

    this.logger.log(
      `buildWinnerGameStateResultPlayerData :: winnerPlayer - ${JSON.stringify(
        winnerPlayer,
      )}`,
    );

    // Build the GameStateResultPlayer object for the winner.
    const winnerPlayerResult: GameStateResultPlayer =
      this.buildGameStateResultPlayerData(winnerPlayer, 'Winner');
    this.logger.log(
      `buildWinnerGameStateResultPlayerData :: winnerPlayerResult - ${JSON.stringify(
        winnerPlayerResult,
      )}`,
    );

    return winnerPlayerResult;
  }

  /**
   * Builds and returns run information data for a specific event from the game state script.
   *
   * @param gameStateScript - The game state script object containing event information.
   * @param runObj - The specific run object for which run information is needed.
   * @returns Run information data for the specified run object.
   */
  private buildCreateRunInfoData(
    gameStateScript: Record<string, any>,
    runObj: Record<string, any>,
  ): Record<string, any> {
    this.logger.log(
      `buildCreateRunInfoData :: runObj - ${JSON.stringify(runObj)}`,
    );

    // Initialize an empty object to store the resulting run information.
    const runInfoObj: Record<string, any> = {};

    // Check if runObj is provided and not empty.
    if (runObj) {
      // Iterate through the keys in runObj.
      for (const key in runObj) {
        if (runObj.hasOwnProperty(key)) {
          // Retrieve values for the current key from gameStateScript and runObj.
          const gameScriptValue = gameStateScript[key];
          const runObjValue = runObj[key];

          // Check if the runObjValue is an array.
          if (Array.isArray(runObjValue)) {
            // If the gameScriptValue is also an array, filter and map for concise processing.
            if (Array.isArray(gameScriptValue)) {
              // Filter the indices and map them to corresponding values.
              runInfoObj[key] = runObjValue
                .filter(
                  (index) => index >= 1 && index <= gameScriptValue.length,
                )
                .map((index) => gameScriptValue[index - 1]);
            } else if (key === GameScriptKeys.Events.EVENTS) {
              // If key is EVENTS and runObjValue is an array, call the separate function for each value.
              runInfoObj[key] = {};
              runObjValue.forEach((event) => {
                runInfoObj[key][event] = this.buildCreateEventsRunInfoData(
                  gameStateScript,
                  event,
                );
              });
            } else {
              // If it's not an array or the key is not EVENTS, use the value from gameScriptValue or runObjValue.
              runInfoObj[key] = gameScriptValue ?? runObjValue;
            }
          } else {
            // If runObjValue is not an array, use the value from gameScriptValue or runObjValue.
            runInfoObj[key] = gameScriptValue ?? runObjValue;
          }
        }
      }
    }

    this.logger.log(
      `buildCreateRunInfoData :: runInfoObj - ${JSON.stringify(runInfoObj)}`,
    );

    // Return the resulting run information object.
    return runInfoObj;
  }

  /**
   * Build and return run information data for a specific event from the game state script.
   *
   * @param gameStateScript - The game state script object containing event information.
   * @param event - The specific event for which run information is needed.
   * @returns Run information data for the specified event.
   */
  private buildCreateEventsRunInfoData(
    gameStateScript: Record<string, any>,
    event: string,
  ): Record<string, any> {
    this.logger.log(`buildCreateEventsRunInfoData :: event - ${event}`);

    // Access the "events" field in the game state script.
    const eventsObj = gameStateScript[GameScriptKeys.Events.EVENTS];

    // Access the event field within "events".
    const eventObj = eventsObj?.[event];

    // Access the "run" field within the event.
    const runObj = eventObj?.[GameScriptKeys.Events.RUN];

    // Initialize an empty object to store run information.
    const runInfoObj: Record<string, any> = this.buildCreateRunInfoData(
      gameStateScript,
      runObj,
    );

    this.logger.log(
      `buildCreateEventsRunInfoData :: runInfoObj - ${runInfoObj}`,
    );

    // Return the run information data for the specified event.
    return runInfoObj;
  }

  /**
   * Build and return "CreateMatchedWinRunInfo" data by processing the game state script and a matchedWinItem.
   *
   * @param gameStateScript - The game state script containing various fields and events.
   * @param matchedWinItem - The specifics of the matched win item.
   * @returns "CreateMatchedWinRunInfo" data to be sent to the client.
   */
  private buildCreateMatchedWinRunInfoData(
    gameStateScript: Record<string, any>,
    matchedWinItem: Record<string, any>,
  ): Record<string, any> {
    this.logger.log(
      `buildCreateMatchedWinRunInfoData :: gameStateScript - ${JSON.stringify(
        gameStateScript,
      )}`,
    );

    // Access the "run" field within "matchedWinItem."
    const runObj = matchedWinItem?.[GameScriptKeys.Events.RUN];

    // Build run information data using the common function.
    const matchedWinRunInfo: Record<string, any> = this.buildCreateRunInfoData(
      gameStateScript,
      runObj,
    );

    return matchedWinRunInfo;
  }

  /**
   * Builds an event end response based on the provided game state.
   *
   * @param gameState - The current game state.
   * @returns EventEndResponseDTO representing the event end response.
   */
  public buildEventEndResponse(gameState: GameState): EventEndResponseDTO {
    this.logger.log(
      `buildEventEndResponse :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Extract relevant fields from the game state.
    const { end_run_info: endRunInfo, game_state_result: gameStateResult } =
      gameState;

    // Create an EventEndResponseDTO object with the extracted information.
    const eventEndResponse: EventEndResponseDTO = {
      end_run_info: endRunInfo,
      game_state_result: this.buildGameStateResultResponse(gameStateResult),
    };
    this.logger.log(
      `buildEventEndResponse :: eventEndResponse - ${JSON.stringify(
        eventEndResponse,
      )}`,
    );

    return eventEndResponse;
  }

  /**
   * Builds a response for game state results based on the provided game state result object.
   *
   * @param gameStateResult - The game state result object to be transformed into a response.
   * @returns GameStateResultResponseDTO representing the game state result response, or null if the input is null.
   */
  private buildGameStateResultResponse(
    gameStateResult?: GameStateResult,
  ): GameStateResultResponseDTO | null {
    this.logger.log(`buildGameStateResultResponse`);

    if (!gameStateResult) {
      this.logger.log(`buildGameStateResultResponse :: gameStateResult - null`);
      return null;
    }

    // Extract necessary game state result data for the response
    const {
      players,
      result_type: resultType,
      message,
      matched_win_item: matchedWinItem,
      matched_win_run_info: matchedWinRunInfo,
      winner,
      winner_message: winnerMessage,
      loser_message: loserMessage,
    } = gameStateResult;

    // Create a GameStateResultResponseDTO object with the necessary game state result data
    const gameStateResultResponse: GameStateResultResponseDTO = {
      players: this.buildGameStateResultPlayersListResponse(players),
      result_type: resultType,
      message,
      matched_win_item: matchedWinItem,
      matched_win_run_info: matchedWinRunInfo,
      winner: winner && this.buildGameStateResultPlayerResponse(winner),
      winner_message: winnerMessage,
      loser_message: loserMessage,
    };
    this.logger.log(
      `buildGameStateResultResponse :: gameStateResultResponse - ${JSON.stringify(
        gameStateResultResponse,
      )}`,
    );

    return gameStateResultResponse;
  }

  /**
   * Builds a response for a list of game state result players based on the provided array of game state result player objects.
   *
   * @param gameStateResultPlayersList - An array of game state result player objects to be transformed into responses.
   * @returns An array of GameStateResultPlayerResponseDTO objects representing game state result players, or an empty array if the input is empty.
   */
  private buildGameStateResultPlayersListResponse(
    gameStateResultPlayersList: Array<GameStateResultPlayer>,
  ): Array<GameStateResultPlayerResponseDTO> {
    this.logger.log(
      `buildGameStateResultPlayersListResponse :: gameStateResultPlayersList length - ${gameStateResultPlayersList.length}`,
    );

    let gameStateResultPlayersListResponse =
      new Array<GameStateResultPlayerResponseDTO>();

    gameStateResultPlayersList.forEach((gameStateResultPlayer) => {
      const gameStateResultPlayerResponse: GameStateResultPlayerResponseDTO =
        this.buildGameStateResultPlayerResponse(gameStateResultPlayer);

      gameStateResultPlayersListResponse.push(gameStateResultPlayerResponse);
    });

    this.logger.log(
      `buildGameStateResultPlayersListResponse :: gameStateResultPlayersListResponse length - ${gameStateResultPlayersListResponse.length}`,
    );

    return gameStateResultPlayersListResponse;
  }

  /**
   * Builds a response for a single game state result player based on the provided game state result player object.
   *
   * @param gameStateResultPlayer - The game state result player object to be transformed into a response.
   * @returns A GameStateResultPlayerResponseDTO representing the game state result player.
   */
  private buildGameStateResultPlayerResponse(
    gameStateResultPlayer: GameStateResultPlayer,
  ): GameStateResultPlayerResponseDTO {
    this.logger.log(
      `buildGameStateResultPlayerResponse :: gameStateResultPlayer - ${JSON.stringify(
        gameStateResultPlayer,
      )}`,
    );

    // Extract necessary game state result player data for the response
    const { user_id, name, is_anonymous, points, message } =
      gameStateResultPlayer;

    // Create a GameStateResultPlayerResponseDTO object with the necessary game state result player data
    const gameStateResultPlayerResponse: GameStateResultPlayerResponseDTO = {
      user_id,
      name,
      is_anonymous,
      points,
      message,
    };
    this.logger.log(
      `buildGameStateResultPlayerResponse :: gameStateResultPlayerResponse - ${JSON.stringify(
        gameStateResultPlayerResponse,
      )}`,
    );

    return gameStateResultPlayerResponse;
  }

  /**
   * Builds a data object for updating the game state to set the next player's turn.
   * This method calculates the next player's turn based on the current turn and player sequence.
   *
   * @param gameState - The game state object.
   * @param nextPlayerTurn - The player turn object representing the next player's turn.
   * @returns A partial game state object with updated data for the next player's turn.
   */
  public buildUpdateGameStateDataForNextPlayerTurn(
    gameState: GameState,
    nextPlayerTurn: PlayerTurn,
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateDataForNextPlayerTurn :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Create a game state data object with the necessary updates.
    const gameStateData: Partial<GameState> = {
      ...gameState,
      current_turn: nextPlayerTurn,
    };
    this.logger.log(
      `buildUpdateGameStateDataForNextPlayerTurn :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    return gameStateData;
  }

  public buildUpdateGameStateDataForValidMove(
    gameState: GameState,
    eventMoveRequestDto: EventMoveRequestDTO,
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateDataForValidMove :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    const { load_run_info: loadRunInfo } = gameState;

    const updatedLoadRunInfo = this.buildUpdateLoadRunInfoDataForValidMove(
      loadRunInfo,
      eventMoveRequestDto,
    );

    // Create a game state data object with the necessary updates.
    const gameStateData: Partial<GameState> = {
      ...gameState,
      load_run_info: updatedLoadRunInfo,
    };
    this.logger.log(
      `buildUpdateGameStateDataForValidMove :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    return gameStateData;
  }

  /**
   * Builds an updated loadRunInfo data object to reflect a valid player move.
   *
   * @param loadRunInfo - The current loadRunInfo data.
   * @param eventMoveRequestDto - The data related to the player's move.
   * @returns The updated loadRunInfo data after the move.
   */
  private buildUpdateLoadRunInfoDataForValidMove(
    loadRunInfo: Record<string, any>,
    eventMoveRequestDto: EventMoveRequestDTO,
  ): Record<string, any> {
    this.logger.log(`buildUpdateLoadRunInfoDataForValidMove`);

    // Retrieve the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    // Check if 'OBJECT_LIST' is an array.
    if (Array.isArray(objectList)) {
      // Map through each object in the 'OBJECT_LIST' and update 'CURRENT_POSITION'.
      loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST] = objectList.map(
        (objectItem) => {
          // Extract 'OBJECT_ID' value from the object.
          const objectId = objectItem[GameScriptKeys.ObjectList.OBJECT_ID];

          // Check if this object matches the one in the move request.
          if (objectId === eventMoveRequestDto.ObjectID) {
            // Increment the MOVE_COUNTER for the current object
            objectItem[GameScriptKeys.ObjectList.MOVE_COUNTER]++;

            // Check if 'CURRENT_POSITION' exists in the object.
            if (GameScriptKeys.ObjectList.CURRENT_POSITION in objectItem) {
              // Update the current position of the object to match the new position.
              objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION][
                GameScriptKeys.ObjectList.ROW
              ] = eventMoveRequestDto.to.Row;
              objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION][
                GameScriptKeys.ObjectList.COLUMN
              ] = eventMoveRequestDto.to.Column;
            }
          }

          return objectItem;
        },
      );
    }

    this.logger.log(
      `buildUpdateLoadRunInfoDataForValidMove :: loadRunInfo - ${JSON.stringify(
        loadRunInfo,
      )}`,
    );

    // Return the updated loadRunInfo.
    return loadRunInfo;
  }

  /**
   * Builds a response DTO for event possible moves.
   *
   * @param objectId - The ID of the object for which possible moves are calculated.
   * @param possibleMoves - An array of possible move positions.
   * @returns The constructed EventPossibleMovesResponseDTO.
   */
  public buildEventPossibleMovesResponse(
    objectId: string,
    possibleMoves: Array<PositionResponseDTO>,
  ): EventPossibleMovesResponseDTO {
    this.logger.log(
      `buildEventPossibleMovesResponse :: objectId - ${objectId}`,
    );

    // Create an EventPossibleMovesResponseDTO object with the extracted information.
    const eventPossibleMovesResponse: EventPossibleMovesResponseDTO = {
      ObjectID: objectId,
      possible_moves: possibleMoves,
    };
    this.logger.log(
      `buildEventPossibleMovesResponse :: eventPossibleMovesResponse - ${JSON.stringify(
        eventPossibleMovesResponse,
      )}`,
    );

    // Return the constructed EventPossibleMovesResponseDTO object.
    return eventPossibleMovesResponse;
  }

  /**
   * Builds updated game state data after capturing an object.
   *
   * @param gameState - The current game state.
   * @param capturedObjectItem - The captured object item.
   * @returns Partial game state data with the necessary updates.
   */
  public buildUpdateGameStateDataForCapturedObject(
    gameState: GameState,
    capturedObjectItem: Record<string, any>,
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateDataForCapturedObject :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Extract relevant fields from the current game state.
    const { load_run_info: loadRunInfo, captured_objects: capturedObjects } =
      gameState;

    // Build updated data for loadRunInfo based on the captured object.
    const updatedLoadRunInfo = this.buildUpdateLoadRunInfoDataForCapturedObject(
      loadRunInfo,
      capturedObjectItem,
    );

    // Build updated data for capturedObjects based on the captured object.
    const updatedCapturedObjects =
      this.buildUpdateCapturedObjectsDataForCapturedObject(
        capturedObjects,
        capturedObjectItem,
      );

    // Create a game state data object with the necessary updates.
    const gameStateData: Partial<GameState> = {
      ...gameState,
      load_run_info: updatedLoadRunInfo,
      captured_objects: updatedCapturedObjects,
    };
    this.logger.log(
      `buildUpdateGameStateDataForCapturedObject :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    return gameStateData;
  }

  /**
   * Builds an updated loadRunInfo data object to reflect the capturing of an object.
   *
   * @param loadRunInfo - The current loadRunInfo data.
   * @param capturedObjectItem - The captured object item.
   * @returns The updated loadRunInfo data after capturing the object.
   */
  private buildUpdateLoadRunInfoDataForCapturedObject(
    loadRunInfo: Record<string, any>,
    capturedObjectItem: Record<string, any>,
  ): Record<string, any> {
    this.logger.log(`buildUpdateLoadRunInfoDataForCapturedObject`);

    // Extract the 'OBJECT_ID' of the captured object.
    const capturedObjectId =
      capturedObjectItem[GameScriptKeys.ObjectList.OBJECT_ID];

    // Retrieve the 'OBJECT_LIST' from loadRunInfo.
    const objectList = loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST];

    // Check if 'OBJECT_LIST' is an array.
    if (Array.isArray(objectList)) {
      // Update 'OBJECT_LIST' by removing the captured object.
      loadRunInfo[GameScriptKeys.ObjectList.OBJECT_LIST] = objectList.filter(
        (objectItem) => {
          // Extract 'OBJECT_ID' value from the object.
          const objectId = objectItem[GameScriptKeys.ObjectList.OBJECT_ID];

          // Keep objects that do not match the captured object ID.
          return objectId !== capturedObjectId;
        },
      );
    }

    this.logger.log(
      `buildUpdateLoadRunInfoDataForCapturedObject :: loadRunInfo - ${JSON.stringify(
        loadRunInfo,
      )}`,
    );

    // Return the updated loadRunInfo.
    return loadRunInfo;
  }

  /**
   * Builds an updated array of captured objects to reflect the capturing of a new object.
   *
   * @param capturedObjects - The current array of captured objects.
   * @param capturedObjectItem - The captured object item to be added.
   * @returns The updated array of captured objects after capturing the new object.
   */
  private buildUpdateCapturedObjectsDataForCapturedObject(
    capturedObjects: Array<Record<string, any>>,
    capturedObjectItem: Record<string, any>,
  ): Array<Record<string, any>> {
    this.logger.log(
      `buildUpdateCapturedObjectsDataForCapturedObject :: capturedObjects - ${JSON.stringify(
        capturedObjects,
      )}`,
    );

    // Concatenate the current array of captured objects with the new captured object.
    const updatedCapturedObjects = capturedObjects.concat(capturedObjectItem);

    this.logger.log(
      `buildUpdateCapturedObjectsDataForCapturedObject :: updatedCapturedObjects - ${JSON.stringify(
        updatedCapturedObjects,
      )}`,
    );

    // Return the updated array of captured objects.
    return updatedCapturedObjects;
  }

  /**
   * Builds an event captured objects response based on the provided game state.
   *
   * @param gameState - The current game state.
   * @param capturedObjectItem - (Optional) The captured object item to include in the response.
   * @returns EventCapturedObjectsResponseDTO representing the event captured objects response.
   */
  public buildEventCapturedObjectsResponse(
    gameState: GameState,
    capturedObjectItem?: Record<string, any>,
  ): EventCapturedObjectsResponseDTO {
    this.logger.log(
      `buildEventCapturedObjectsResponse :: gameState - ${JSON.stringify(
        gameState,
      )}`,
    );

    // Extract relevant fields from the game state.
    const { captured_objects: capturedObjects } = gameState;

    // Create an EventCapturedObjectsResponseDTO object with the extracted information.
    const eventCapturedObjectsResponse: EventCapturedObjectsResponseDTO = {
      captured_objects: capturedObjects,
      captured_object_item: capturedObjectItem,
    };

    this.logger.log(
      `buildEventCapturedObjectsResponse :: eventCapturedObjectsResponse - ${JSON.stringify(
        eventCapturedObjectsResponse,
      )}`,
    );

    // Return the built eventCapturedObjectsResponse.
    return eventCapturedObjectsResponse;
  }
}
