import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GameState } from '../interfaces/game-state.interface';
import { GameStateRepository } from '../repositories/game-state.repository';
import { GameUrlRepository } from '../repositories/game-url.repository';
import { Game } from '../interfaces/game.interface';
import { GameRepository } from '../repositories/game.repository';
import { GameUrlType } from '../enums/game-url-type.enum';
import { User } from 'src/modules/user/interfaces/user.interface';
import { GameUrl } from '../interfaces/game-url.interface';
import { GameObjectBuilder } from './game-object.builder';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
    private readonly gameRepository: GameRepository, // Inject the GameRepository service
    private readonly gameUrlRepository: GameUrlRepository, // Inject the GameUrlRepository service
    private readonly gameStateRepository: GameStateRepository, // Inject the GameStateRepository service
  ) {
    this.logger = new Logger(GameBuilder.name);
  }

  /**
   * Checks if a game exists with the given gameId.
   *
   * @param gameId - The ID of the game to check.
   * @returns A Promise that resolves to the game object if found.
   * @throws NotFoundException if the game with the given gameId does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game from the database.
   */
  public async checkIfGameExistsById(gameId: string): Promise<Game> {
    this.logger.log(`checkIfGameExistsById :: gameId - ${gameId}`);

    let game: Game;
    try {
      // Find the game by its ID from the gameRepository
      game = await this.gameRepository.findGameById(gameId);
    } catch (error) {
      this.logger.error(
        `checkIfGameExistsById :: Error while fetching the game from the database`,
      );
      this.logger.error(`checkIfGameExistsById :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while fetching the game from the database.',
      );
    }

    if (!game) {
      this.logger.error(
        `checkIfGameExistsById :: Game with ID ${gameId} not found`,
      );
      throw new NotFoundException(`Game with given ID not found.`);
    }

    return game;
  }

  /**
   * Checks if a play game URL exists with the given URL code.
   *
   * @param urlCode - The URL code of the game URL to check.
   * @returns A Promise that resolves to the game URL object if found.
   * @throws NotFoundException if the game URL with the given URL code does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game URL from the database.
   */
  public async checkIfPlayGameUrlExistsByUrlCode(
    urlCode: string,
  ): Promise<GameUrl> {
    this.logger.log(
      `checkIfPlayGameUrlExistsByUrlCode :: urlCode - ${urlCode}`,
    );

    let gameUrl: GameUrl;
    try {
      // Find the game URL by its URL code and URL type from the gameUrlRepository
      gameUrl = await this.gameUrlRepository.findGameUrlByUrlCodeAndUrlType(
        urlCode,
        GameUrlType.PLAY_GAME,
      );
    } catch (error) {
      this.logger.error(
        `checkIfPlayGameUrlExistsByUrlCode :: Error while fetching game URL from the database`,
      );
      this.logger.error(
        `checkIfPlayGameUrlExistsByUrlCode :: error - ${error}`,
      );
      throw new InternalServerErrorException(
        'Error while fetching play game URL from the database.',
      );
    }

    if (!gameUrl) {
      this.logger.error(
        `checkIfPlayGameUrlExistsByUrlCode :: Game URL with code ${urlCode} not found`,
      );
      throw new NotFoundException('Game URL with given code not found.');
    }

    return gameUrl;
  }

  /**
   * Checks if a game state exists with the given game URL code.
   *
   * @param urlCode - The game URL code of the game state to check.
   * @returns A Promise that resolves to the game state object if found.
   * @throws NotFoundException if the game state with the given game URL code does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game state from the database.
   */
  public async checkIfGameStateExistsByGameUrlCode(
    urlCode: string,
  ): Promise<GameState> {
    this.logger.log(
      `checkIfGameStateExistsByGameUrlCode :: urlCode - ${urlCode}`,
    );

    let gameState: GameState;
    try {
      // Find the game state by game URL code from the gameStateRepository
      gameState = await this.gameStateRepository.findGameStateByGameUrlCode(
        urlCode,
      );
    } catch (error) {
      this.logger.error(
        `checkIfGameStateExistsByGameUrlCode :: Error while fetching game state from the database`,
      );
      this.logger.error(
        `checkIfGameStateExistsByGameUrlCode :: error - ${error}`,
      );
      throw new InternalServerErrorException(
        'Error while fetching game state from the database.',
      );
    }

    if (!gameState) {
      this.logger.error(
        `checkIfGameStateExistsByGameUrlCode :: Game state with game URL code ${urlCode} not found`,
      );
      throw new NotFoundException(
        'Game state with given game URL code not found.',
      );
    }

    return gameState;
  }

  /**
   * Create a new game state for a play game URL code.
   *
   * @param gameUrl - The game URL object.
   * @param game - The game object.
   * @param user - The user object.
   * @returns A Promise that resolves to a GameState representing the created game state.
   * @throws InternalServerErrorException if there is an error while saving the game state to the database.
   */
  public async createGameStateForUrlCode(
    gameUrl: GameUrl,
    game: Game,
    user: User,
  ): Promise<GameState> {
    this.logger.log(`createGameStateForUrlCode :: gameUrl - ${gameUrl}`);

    // Create the game state data object
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildCreateGameStateData(gameUrl, game, user);
    this.logger.log(
      `createGameStateForUrlCode :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    try {
      return this.gameStateRepository.createGameState(gameStateData);
    } catch (error) {
      this.logger.error(
        `createGameStateForUrlCode :: Error while saving the game state to the database`,
      );
      this.logger.error(`createGameStateForUrlCode :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while saving game state to the database.',
      );
    }
  }

  /**
   * Update a game state for a given URL code.
   *
   * @param gameState - The game state object to update.
   * @param user - The user performing the update.
   * @returns A Promise that resolves to the updated GameState.
   * @throws InternalServerErrorException if there is an error while updating the game state in the database.
   */
  public async updateGameStateForUrlCode(
    gameState: GameState,
    user: User,
  ): Promise<GameState> {
    this.logger.log(
      `updateGameStateForUrlCode :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Update the game state data object
    const gameStateData: Partial<GameState> =
      this.gameObjectBuilder.buildUpdateGameStateData(gameState, user);
    this.logger.log(
      `updateGameStateForUrlCode :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    this.checkIfMaximumPlayersLimitReached(gameStateData);

    try {
      return this.gameStateRepository.updateGameState(gameStateData);
    } catch (error) {
      this.logger.error(
        `updateGameStateForUrlCode :: Error while updating the game state in the database`,
      );
      this.logger.error(`updateGameStateForUrlCode :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game state to the database.',
      );
    }
  }

  /**
   * Checks if the maximum player limit for a game state is reached.
   *
   * @param gameStateData - The game state data to check.
   * @throws {ConflictException} If the maximum players limit is reached.
   */
  private checkIfMaximumPlayersLimitReached(
    gameStateData: Partial<GameState>,
  ): void {
    this.logger.log(
      `checkIfMaximumPlayersLimitReached :: gameStateData - ${JSON.stringify(
        gameStateData,
      )}`,
    );

    // Extract necessary fields from the game state object.
    const { game_state_info: gameStateInfoData } = gameStateData;

    // Extract necessary fields from the game state info object.
    const { game_state_config: gameStateConfig, players_count: playersCount } =
      gameStateInfoData;

    // Extract necessary fields from the game state config object.
    const { max_players: maxPlayers } = gameStateConfig;

    if (playersCount > maxPlayers) {
      this.logger.error(
        `checkIfMaximumPlayersLimitReached :: Maximum players limit reached`,
      );
      throw new ConflictException('Maximum players limit reached.');
    }
  }
}
