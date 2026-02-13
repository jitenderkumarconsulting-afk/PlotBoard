import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { GameBuilder } from '../builders/game.builder';
import { User } from '../../../modules/user/interfaces/user.interface';
import { GameStateResponseDTO } from '../dtos/response/game-state-response.dto';
import { GameObjectBuilder } from '../builders/game-object.builder';

@Injectable()
export class GameService {
  private readonly logger: Logger;

  constructor(
    private readonly gameBuilder: GameBuilder, // Inject the GameBuilder service
    private readonly gameObjectBuilder: GameObjectBuilder, // Inject the GameObjectBuilder service
  ) {
    this.logger = new Logger(GameService.name);
  }

  /**
   * Creates a new game state if it doesn't already exist for the given URL code (applicable for URL type PLAY_GAME only).
   * @param urlCode The game URL code of the game state.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameStateResponseDTO representing the created or existing game state.
   * @throws InternalServerErrorException if there is an error while fetching the game state from the database.
   */
  public async createGameStateIfNotExists(
    urlCode: string,
    user: User,
  ): Promise<GameStateResponseDTO> {
    this.logger.log(`createGameStateIfNotExists :: urlCode - ${urlCode}`);

    // Check if a play game URL exists based on the provided URL code
    const gameUrl = await this.gameBuilder.checkIfPlayGameUrlExistsByUrlCode(
      urlCode,
    );
    this.logger.log(`createGameStateIfNotExists :: gameUrl - ${gameUrl}`);

    // Check if the game with the given gameId exists
    const game = await this.gameBuilder.checkIfGameExistsById(gameUrl.game_id);
    this.logger.log(
      `createGameStateIfNotExists :: game - ${JSON.stringify(game)}`,
    );

    let gameState;
    try {
      // Check if a game state with the given URL code already exists
      gameState = await this.gameBuilder.checkIfGameStateExistsByGameUrlCode(
        urlCode,
      );
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        // Handle errors that are not instances of NotFoundException here.
        this.logger.error(
          `createGameStateIfNotExists :: Error while fetching game state from the database`,
        );
        this.logger.error(`createGameStateIfNotExists :: error - ${error}`);
        throw new InternalServerErrorException(
          'Error while fetching game state from the database.',
        );
      }
    }

    if (!gameState) {
      // If it doesn't exist, create a new game state
      gameState = await this.gameBuilder.createGameStateForUrlCode(
        gameUrl,
        game,
        user,
      );
      this.logger.log(
        `createGameStateIfNotExists :: created gameState - ${JSON.stringify(
          gameState,
        )}`,
      );
    } else {
      // If it exist, update game state
      gameState = await this.gameBuilder.updateGameStateForUrlCode(
        gameState,
        user,
      );
      this.logger.log(
        `createGameStateIfNotExists :: updated gameState - ${JSON.stringify(
          gameState,
        )}`,
      );
    }

    // Build the game state response DTO
    const gameStateResponse =
      this.gameObjectBuilder.buildGameStateResponse(gameState);
    this.logger.log(
      `createGameStateIfNotExists :: gameStateResponse - ${JSON.stringify(
        gameStateResponse,
      )}`,
    );

    return gameStateResponse;
  }

  /**
   * Fetch an existing game state by its game URL code.
   * @param urlCode The game URL code of the game state to fetch.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameStateResponseDTO representing the fetched game state.
   */
  public async getGameStateByGameUrlCode(
    urlCode: string,
    user: User,
  ): Promise<GameStateResponseDTO> {
    this.logger.log(`getGameStateByGameUrlCode :: urlCode - ${urlCode}`);

    // Check if the game state with the given game URL code exists and retrieve its entity
    const gameState =
      await this.gameBuilder.checkIfGameStateExistsByGameUrlCode(urlCode);
    this.logger.log(
      `getGameStateByGameUrlCode :: gameState - ${JSON.stringify(gameState)}`,
    );

    // Build the GameStateResponseDTO from the fetched game state
    const gameStateResponse =
      this.gameObjectBuilder.buildGameStateResponse(gameState);
    this.logger.log(
      `getGameStateByGameUrlCode :: gameStateResponse - ${JSON.stringify(
        gameStateResponse,
      )}`,
    );

    return gameStateResponse;
  }
}
