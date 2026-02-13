import { Injectable, Logger } from '@nestjs/common';
import { GameStateResponseDTO } from '../dtos/response/game-state-response.dto';
import { GameState } from '../interfaces/game-state.interface';
import { Game } from '../interfaces/game.interface';
import { User } from 'src/modules/user/interfaces/user.interface';
import { GameStatePlayer } from '../interfaces/game-state-player.interface';
import { GameStatePlayerResponseDTO } from '../dtos/response/game-state-player-response.dto';
import { GameStateInfo } from '../interfaces/game-state-info.interface';
import { GameUrl } from '../interfaces/game-url.interface';
import { GameStateInfoResponseDTO } from '../dtos/response/game-state-info-response.dto';
import { GameScriptKeys } from '../constants/game-script-keys';
import { RandomGeneratorHelper } from 'src/shared/helpers/random-generator.helper';
import { PlayerTurnResponseDTO } from '../dtos/response/player-turn-response.dto';
import { PlayerTurn } from '../interfaces/player-turn.interface';
import { GameStateResult } from '../interfaces/game-state-result.interface';
import { GameStateResultResponseDTO } from '../dtos/response/game-state-result-response.dto';
import { GameStateResultPlayer } from '../interfaces/game-state-result-player.interface';
import { GameStateResultPlayerResponseDTO } from '../dtos/response/game-state-result-player-response.dto';
import { GameStateConfig } from '../interfaces/game-state-config.interface';
import { GameDefaultValues } from '../constants/game-default-values';
import { GridInfo } from '../interfaces/grid-info.interface';
import { GameStateConfigResponseDTO } from '../dtos/response/game-state-config-response.dto';
import { GridInfoResponseDTO } from '../dtos/response/grid-info-response.dto';

@Injectable()
export class GameObjectBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(GameObjectBuilder.name);
  }

  /**
   * Builds a game state data object for creating a new game state.
   * @param gameUrl - The game URL object containing the URL code.
   * @param game - The game object associated with the request.
   * @param user - The user initiating the game state creation.
   * @returns The created game state data object.
   */
  public buildCreateGameStateData(
    gameUrl: GameUrl, // Game URL object with URL code.
    game: Game, // Associated game object.
    user: User, // Initiating user.
  ): Partial<GameState> {
    this.logger.log(
      `buildCreateGameStateData :: gameUrl - ${gameUrl.url_code}`,
    );

    // Extract essential fields for the game state.
    const urlCode = gameUrl.url_code;
    const { game_script: gameStateScript } = game;

    // Build the game state script data.
    const gameStateScriptData = this.buildGameStateScriptData(gameStateScript);

    // Create the list of players for the game state.
    const players = this.buildGameStatePlayersListData(user);

    // Construct the game state info.
    const gameStateInfo = this.buildCreateGameStateInfoData(
      gameUrl,
      game,
      players.length,
    );

    // Build run info for the 'load' and 'end' events in the game script.
    const loadRunInfo = this.buildCreateEventsRunInfoData(
      gameStateScriptData,
      GameScriptKeys.Events.LOAD,
    );
    const endRunInfo = this.buildCreateEventsRunInfoData(
      gameStateScriptData,
      GameScriptKeys.Events.END,
    );

    // Create the game state data object with all the constructed data.
    const gameStateData: Partial<GameState> = {
      game_token: urlCode, // Set the game token to the URL code.
      game_state_script: gameStateScriptData, // Set the game state script.
      game_state_info: gameStateInfo, // Set the game state info.
      load_run_info: loadRunInfo, // Set the load event run info.
      end_run_info: endRunInfo, // Set the end event run info.
      players, // Set the list of players.
      captured_objects: [],
    };

    // Log the completed game state data object.
    this.logger.log(
      `buildCreateGameStateData :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    // Return the created game state data.
    return gameStateData;
  }

  /**
   * Builds the game state script data by processing the provided game script.
   *
   * @param gameScript - The game script object containing various field information.
   * @returns The updated game state script data.
   */
  private buildGameStateScriptData(
    gameScript: Record<string, any>,
  ): Record<string, any> {
    // Create a copy of the original game script to avoid modifying the original data.
    const gameStateScript: Record<string, any> = { ...gameScript };

    // Check if the 'OBJECT_LIST' exists and is an array.
    if (Array.isArray(gameScript[GameScriptKeys.ObjectList.OBJECT_LIST])) {
      // Iterate through each object item in the 'OBJECT_LIST'.
      gameStateScript[GameScriptKeys.ObjectList.OBJECT_LIST] = gameScript[
        GameScriptKeys.ObjectList.OBJECT_LIST
      ].map((objectItem: Record<string, any>) => {
        // Check if the object item has the 'PLAYER' field.
        if (GameScriptKeys.ObjectList.PLAYER in objectItem) {
          // Add a new field 'OBJECT_ID' with a unique UUID.
          objectItem[GameScriptKeys.ObjectList.OBJECT_ID] =
            RandomGeneratorHelper.generateUUID();

          // Add a new field 'MOVE_COUNTER' with default value 0.
          objectItem[GameScriptKeys.ObjectList.MOVE_COUNTER] = 0;

          if (GameScriptKeys.ObjectList.START_POSITION in objectItem) {
            // If 'START_POSITION' exists, set 'CURRENT_POSITION' to 'START_POSITION'.
            objectItem[GameScriptKeys.ObjectList.CURRENT_POSITION] =
              objectItem[GameScriptKeys.ObjectList.START_POSITION];
          }
        }

        // Return the modified object item.
        return objectItem;
      });
    }

    // Return the updated game state script data.
    return gameStateScript;
  }

  /**
   * Build the list of players for the game state.
   * @param user - The user object.
   * @param players - Array of existing game state players (optional).
   * @returns Array of game state players, including the user.
   */
  private buildGameStatePlayersListData(
    user: User,
    players?: Array<GameStatePlayer>,
  ): Array<GameStatePlayer> {
    this.logger.log(
      `buildGameStatePlayersListData :: user - ${JSON.stringify(user)}`,
    );

    // Initialize the list of game state players with the provided players or an empty array.
    let gameStatePlayersList: Array<GameStatePlayer> = players || [];

    // Check if the user is already in the list of players.
    const isUserInList = gameStatePlayersList.some(
      (gameStatePlayer) => gameStatePlayer.name === user.name,
    );

    // If the user is not in the list, add them.
    if (!isUserInList) {
      // Extract the necessary fields from the user object.
      const { _id: userId } = user;

      // Create a new game state player entry for the user.
      const gameStatePlayer: GameStatePlayer = {
        user_id: userId.toString(),
        name: user.name,
        points: 0,
        is_anonymous: false,
      };
      // Add the user to the list of game state players.
      gameStatePlayersList.push(gameStatePlayer);
    }

    // Return the array of game state players, including the user.
    return gameStatePlayersList;
  }

  /**
   * Build the game state info data for creating a new game state.
   * @param gameUrl - The game URL object.
   * @param game - The game object associated with the request.
   * @param playersCount - The count of players in the game state.
   * @returns The created game state info data object.
   */
  private buildCreateGameStateInfoData(
    gameUrl: GameUrl,
    game: Game,
    playersCount: number,
  ): GameStateInfo {
    this.logger.log(
      `buildCreateGameStateInfoData :: game - ${JSON.stringify(game)}`,
    );

    // Extract the necessary fields from the game URL object.
    const { user_id: gameUrlUserId } = gameUrl;

    // Extract the necessary fields from the game object.
    const { _id: gameId, game_script: gameScript } = game;

    // Build the game state config data.
    const gameStateConfig = this.buildGameStateConfigData(gameScript);

    // Create the game state info data object with the necessary data.
    const gameStateInfoData: GameStateInfo = {
      game_id: gameId.toString(),
      game_state_config: gameStateConfig, // Set the game state config.
      owner_user_id: gameUrlUserId.toString(),
      players_count: playersCount,
    };

    this.logger.log(
      `buildCreateGameStateInfoData :: gameStateInfoData - ${JSON.stringify(
        gameStateInfoData,
      )}`,
    );

    // Return the created game state info data.
    return gameStateInfoData;
  }

  /**
   * Builds game state configuration data based on the provided game script.
   *
   * @param gameScript - The game script containing configuration information.
   * @returns The constructed GameStateConfig.
   */
  private buildGameStateConfigData(
    gameScript: Record<string, any>,
  ): GameStateConfig {
    this.logger.log(`buildGameStateConfigData`);

    // Extract the config object from the game script.
    const configObj = gameScript?.[GameScriptKeys.Config.CONFIG];

    // Build the grid information data.
    const gridInfo = this.buildGridInfoData(configObj);

    // Extract and validate description.
    const description = configObj?.[GameScriptKeys.Config.DESCRIPTION] || '';

    // Extract and validate maxPlayers. Use the default if not a number.
    let maxPlayers = configObj?.[GameScriptKeys.Config.MAX_PLAYERS];
    maxPlayers =
      typeof maxPlayers === 'number'
        ? maxPlayers
        : GameDefaultValues.MAX_PLAYERS;

    // Extract and validate gameDuration. If Infinite, make it undefined. If not a number, use the default value.
    let gameDuration = configObj?.[GameScriptKeys.Config.GAME_DURATION];
    gameDuration =
      gameDuration === GameScriptKeys.Config.INFINITE
        ? undefined
        : typeof gameDuration === 'number'
        ? gameDuration
        : GameDefaultValues.GAME_DURATION;

    // Extract and validate turnDuration. If Infinite, make it undefined. If not a number, use the default value.
    let turnDuration = configObj?.[GameScriptKeys.Config.TURN_DURATION];
    turnDuration =
      turnDuration === GameScriptKeys.Config.INFINITE
        ? undefined
        : typeof turnDuration === 'number'
        ? turnDuration
        : GameDefaultValues.TURN_DURATION;

    // Construct the game state configuration data.
    const gameStateConfigData: GameStateConfig = {
      grid_info: gridInfo,
      description,
      max_players: maxPlayers,
      game_duration: gameDuration,
      turn_duration: turnDuration,
    };
    this.logger.log(
      `buildGameStateConfigData :: gameStateConfigData - ${JSON.stringify(
        gameStateConfigData,
      )}`,
    );

    // Return the constructed GameStateConfig.
    return gameStateConfigData;
  }

  /**
   * Builds grid information data based on the provided configuration object.
   *
   * @param configObj - The configuration object containing grid information.
   * @returns The constructed GridInfo.
   */
  private buildGridInfoData(configObj: Record<string, any>): GridInfo {
    this.logger.log(`buildGridInfoData`);

    // Extract the grid object from the config object.
    const gridObj = configObj?.[GameScriptKeys.Config.GRID];

    // Extract and validate the number of rows.
    let rows = gridObj?.[GameScriptKeys.Config.ROWS];
    if (typeof rows !== 'number') {
      rows = GameDefaultValues.GRID_ROWS;
    }

    // Extract and validate the number of columns.
    let columns = gridObj?.[GameScriptKeys.Config.COLUMNS];
    if (typeof columns !== 'number') {
      columns = GameDefaultValues.GRID_COLUMNS;
    }

    // Construct the grid information data.
    const gridInfoData: GridInfo = {
      rows,
      columns,
    };
    this.logger.log(
      `buildGridInfoData :: gridInfoData - ${JSON.stringify(gridInfoData)}`,
    );

    return gridInfoData;
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
                  (value) => value >= 1 && value <= gameScriptValue.length,
                )
                .map((value) => gameScriptValue[value - 1]);
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
   * Build and return an updated game state data object.
   *
   * @param gameState - The original game state object to be updated.
   * @param user - The user object initiating the game state update.
   * @returns The updated game state data object.
   */
  public buildUpdateGameStateData(
    gameState: GameState, // The original game state to be updated.
    user: User, // The user initiating the update.
  ): Partial<GameState> {
    this.logger.log(
      `buildUpdateGameStateData :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Extract the necessary fields from the original game state object.
    const { players } = gameState;

    // Update the list of players with the new user.
    const updatedPlayers = this.buildGameStatePlayersListData(user, players);

    // Update the game state info with the new player count.
    const gameStateInfo = this.buildUpdateGameStateInfoData(
      gameState.game_state_info,
      updatedPlayers.length,
    );

    // Create the updated game state data object with the necessary data.
    const gameStateData: Partial<GameState> = {
      ...gameState,
      game_state_info: gameStateInfo,
      players: updatedPlayers,
    };

    this.logger.log(
      `buildUpdateGameStateData :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    // Return the updated game state data.
    return gameStateData;
  }

  /**
   * Build and return an updated game state info data object.
   *
   * @param gameStateInfo - The original game state info data to be updated.
   * @param playersCount - The count of players in the updated game state.
   * @returns The updated game state info data object.
   */
  private buildUpdateGameStateInfoData(
    gameStateInfo: GameStateInfo, // The original game state info data to be updated.
    playersCount: number, // The count of players in the updated game state.
  ): GameStateInfo {
    this.logger.log(
      `buildUpdateGameStateInfoData :: gameStateInfo - ${JSON.stringify(
        gameStateInfo,
      )}`,
    );

    // Create the updated game state info data object with the necessary data.
    const updatedGameStateInfo: GameStateInfo = {
      ...gameStateInfo, // Copy existing info fields
      players_count: playersCount, // Update the player count
    };

    this.logger.log(
      `buildUpdateGameStateInfoData :: updatedGameStateInfo - ${JSON.stringify(
        updatedGameStateInfo,
      )}`,
    );

    // Return the updated game state info data.
    return updatedGameStateInfo;
  }

  /**
   * Build a GameStateResponseDTO object with the necessary game state data.
   *
   * @param gameState - The game state object.
   * @returns The constructed GameStateResponseDTO object.
   */
  public buildGameStateResponse(gameState: GameState): GameStateResponseDTO {
    this.logger.log(
      `buildGameStateResponse :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Extract necessary game state data for the response
    const {
      game_token,
      game_state_script,
      game_state_info: gameStateInfo,
      load_run_info: loadRunInfo,
      end_run_info: endRunInfo,
      players,
      captured_objects: capturedObjects,
      current_turn: currentTurn,
      game_state_result: gameStateResult,
    } = gameState;

    // Create a GameStateResponseDTO object with the necessary game state data
    const gameStateResponse: GameStateResponseDTO = {
      game_token,
      game_state_script,
      game_state_info: this.buildGameStateInfoResponse(gameStateInfo),
      load_run_info: loadRunInfo,
      end_run_info: endRunInfo,
      players: this.buildGameStatePlayersListResponse(players),
      captured_objects: capturedObjects,
      current_turn: currentTurn,
      game_state_result: this.buildGameStateResultResponse(gameStateResult),
    };
    this.logger.log(
      `buildGameStateResponse :: gameStateResponse - ${JSON.stringify(
        gameStateResponse,
      )}`,
    );

    // Return the constructed GameStateResponseDTO object.
    return gameStateResponse;
  }

  /**
   * Build a GameStateInfoResponseDTO object with the necessary game state info data.
   *
   * @param gameStateInfo - The game state info object.
   * @returns The constructed GameStateInfoResponseDTO object.
   */
  private buildGameStateInfoResponse(
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

    // Return the constructed GameStateInfoResponseDTO object.
    return gameStateInfoResponse;
  }

  /**
   * Build a list of player turn responses from an array of player turn objects.
   *
   * @param playersTurnSequence - An array of player turn objects to be transformed into responses.
   * @returns An array of PlayerTurnResponseDTO objects representing player turns,
   *          or null if the input array is null.
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

    const playersTurnSequenceListResponse: Array<PlayerTurnResponseDTO> =
      playersTurnSequence.map((playerTurn) =>
        this.buildPlayerTurnResponse(playerTurn),
      );

    this.logger.log(
      `buildPlayersTurnSequenceListResponse :: playersTurnSequenceListResponse length - ${playersTurnSequenceListResponse.length}`,
    );

    // Return the array of player turn responses, or null if the input array is null.
    return playersTurnSequenceListResponse;
  }

  /**
   * Build a player turn response object from a player turn object.
   *
   * @param playerTurn - The player turn object containing player-specific data.
   * @returns A PlayerTurnResponseDTO representing the player's turn in the game state.
   */
  private buildPlayerTurnResponse(
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
      user_id: userId, // Unique user identifier.
      name, // Player's name.
      is_anonymous: isAnonymous, // Indicates if the player is anonymous.
      player_num: playerNum,
    };
    this.logger.log(
      `buildPlayerTurnResponse :: playerTurnResponse - ${JSON.stringify(
        playerTurnResponse,
      )}`,
    );

    // Return the PlayerTurnResponseDTO representing the player's turn.
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
   * Build an array of GameStatePlayerResponseDTO objects from an array of GameStatePlayer objects.
   *
   * @param gameStatePlayersList - The array of GameStatePlayer objects to be transformed into responses.
   * @returns An array of GameStatePlayerResponseDTO objects representing game state players.
   */
  private buildGameStatePlayersListResponse(
    gameStatePlayersList: Array<GameStatePlayer>,
  ): Array<GameStatePlayerResponseDTO> {
    this.logger.log(
      `buildGameStatePlayersListResponse :: gameStatePlayersList length - ${gameStatePlayersList.length}`,
    );

    // Map each GameStatePlayer to its corresponding response DTO.
    const gameStatePlayersListResponse: Array<GameStatePlayerResponseDTO> =
      gameStatePlayersList.map((gameStatePlayer) =>
        this.buildGameStatePlayerResponse(gameStatePlayer),
      );

    this.logger.log(
      `buildGameStatePlayersListResponse :: gameStatePlayersListResponse length - ${gameStatePlayersListResponse.length}`,
    );

    // Return the array of GameStatePlayerResponseDTO objects.
    return gameStatePlayersListResponse;
  }

  /**
   * Builds a GameStatePlayerResponseDTO object from a GameStatePlayer object.
   *
   * @param gameStatePlayer - The GameStatePlayer object containing player-specific data.
   * @returns A GameStatePlayerResponseDTO representing the player's data in the game state response.
   */
  private buildGameStatePlayerResponse(
    gameStatePlayer: GameStatePlayer,
  ): GameStatePlayerResponseDTO {
    this.logger.log(
      `buildGameStatePlayerResponse :: gameStatePlayer - ${JSON.stringify(
        gameStatePlayer,
      )}`,
    );

    // Extract necessary data from the GameStatePlayer for the response.
    const {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      points,
    } = gameStatePlayer;

    // Create a GameStatePlayerResponseDTO object with the extracted data.
    const gameStatePlayerResponse: GameStatePlayerResponseDTO = {
      user_id: userId, // Unique user identifier.
      name, // Player's name.
      is_anonymous: isAnonymous, // Indicates if the player is anonymous.
      points, // Player's current points.
    };
    this.logger.log(
      `buildGameStatePlayerResponse :: gameStatePlayerResponse - ${JSON.stringify(
        gameStatePlayerResponse,
      )}`,
    );

    // Return the GameStatePlayerResponseDTO representing the player's data in the game state response.
    return gameStatePlayerResponse;
  }

  /**
   * Builds a GameStateResultResponseDTO object from a GameStateResult object.
   *
   * @param gameStateResult - The GameStateResult object containing result-specific data.
   * @returns A GameStateResultResponseDTO representing the result of the game state.
   */
  private buildGameStateResultResponse(
    gameStateResult?: GameStateResult,
  ): GameStateResultResponseDTO | null {
    this.logger.log(`buildGameStateResultResponse`);

    // Check if gameStateResult is null.
    if (!gameStateResult) {
      this.logger.log(`buildGameStateResultResponse :: gameStateResult - null`);
      return null;
    }

    // Extract necessary data from the GameStateResult for the response.
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

    // Return the GameStateResultResponseDTO representing the result of the game state.
    return gameStateResultResponse;
  }

  /**
   * Builds an array of GameStateResultPlayerResponseDTO objects from an array of GameStateResultPlayer objects.
   *
   * @param gameStateResultPlayersList - An array of GameStateResultPlayer objects to be transformed into responses.
   * @returns An array of GameStateResultPlayerResponseDTO objects representing player-specific data in the game state result response.
   */
  private buildGameStateResultPlayersListResponse(
    gameStateResultPlayersList: Array<GameStateResultPlayer>,
  ): Array<GameStateResultPlayerResponseDTO> {
    this.logger.log(
      `buildGameStateResultPlayersListResponse :: gameStateResultPlayersList length - ${gameStateResultPlayersList.length}`,
    );

    // Map the array of GameStateResultPlayer objects to an array of GameStateResultPlayerResponseDTO objects.
    const gameStateResultPlayersListResponse: Array<GameStateResultPlayerResponseDTO> =
      gameStateResultPlayersList.map((gameStateResultPlayer) =>
        this.buildGameStateResultPlayerResponse(gameStateResultPlayer),
      );

    this.logger.log(
      `buildGameStateResultPlayersListResponse :: gameStateResultPlayersListResponse length - ${gameStateResultPlayersListResponse.length}`,
    );

    // Return the array of GameStateResultPlayerResponseDTO objects representing player-specific data in the game state result response.
    return gameStateResultPlayersListResponse;
  }

  /**
   * Builds a GameStateResultPlayerResponseDTO object from a GameStateResultPlayer object.
   *
   * @param gameStateResultPlayer - The GameStateResultPlayer object containing player-specific data.
   * @returns A GameStateResultPlayerResponseDTO representing the player's data in the game state result response.
   */
  private buildGameStateResultPlayerResponse(
    gameStateResultPlayer: GameStateResultPlayer,
  ): GameStateResultPlayerResponseDTO {
    this.logger.log(
      `buildGameStateResultPlayerResponse :: gameStateResultPlayer - ${JSON.stringify(
        gameStateResultPlayer,
      )}`,
    );

    // Extract necessary data from the GameStateResultPlayer for the response.
    const {
      user_id: userId,
      name,
      is_anonymous: isAnonymous,
      points,
      message,
    } = gameStateResultPlayer;

    // Create a GameStateResultPlayerResponseDTO object with the extracted data.
    const gameStateResultPlayerResponse: GameStateResultPlayerResponseDTO = {
      user_id: userId, // Unique user identifier.
      name, // Player's name.
      is_anonymous: isAnonymous, // Indicates if the player is anonymous.
      points, // Player's current points.
      message, // Additional message associated with the player's result.
    };
    this.logger.log(
      `buildGameStateResultPlayerResponse :: gameStateResultPlayerResponse - ${JSON.stringify(
        gameStateResultPlayerResponse,
      )}`,
    );

    // Return the GameStateResultPlayerResponseDTO representing the player's data in the game state result response.
    return gameStateResultPlayerResponse;
  }
}
