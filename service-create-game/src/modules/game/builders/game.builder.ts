import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Game } from '../interfaces/game.interface';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { CreateGameRequestDTO } from '../dtos/request/create-game-request.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
import { GameRepository } from '../repositories/game.repository';
import { GameUserRepository } from '../repositories/game-user.repository';
import { GameUser } from '../interfaces/game-user.interface';
import { GameUserRole } from '../enums/game-user-role.enum';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameUserRepository: GameUserRepository,
  ) {
    this.logger = new Logger(GameBuilder.name);
  }

  /**
   * Build the game data object for creation with additional user_id property.
   * @param createGameRequestDTO The DTO containing the game creation data.
   * @param user The user object associated with the request.
   * @returns The updated game data object.
   */
  private buildCreateGameData(
    createGameRequestDTO: CreateGameRequestDTO,
    user: User,
  ): Partial<Game> {
    this.logger.log(
      `buildCreateGameData :: createGameRequestDTO - ${JSON.stringify(
        createGameRequestDTO,
      )}`,
    );

    // Extract the necessary fields from the create-game request DTO
    const {
      name,
      description,
      original_image_url,
      thumbnail_image_url,
      game_script,
      visibility,
    } = createGameRequestDTO;

    // Create the game data object with the necessary data
    const gameData: Partial<Game> = {
      user_id: user.id, // Add the user_id property to the CreateGameRequestDTO
      name,
      description,
      original_image_url,
      thumbnail_image_url,
      game_script,
      visibility,
    };
    this.logger.log(
      `buildCreateGameData :: gameData - ${JSON.stringify(gameData)}`,
    );

    return gameData;
  }

  /**
   * Builds a GameResponseDTO object with the necessary game data.
   * @param game The game object
   * @returns The constructed GameResponseDTO object
   */
  public buildGameResponse(game: Game): GameResponseDTO {
    this.logger.log(`buildGameResponse :: game - ${JSON.stringify(game)}`);

    // Extract necessary game data for the response
    const {
      id,
      user_id,
      name,
      description,
      original_image_url,
      thumbnail_image_url,
      game_script,
      visibility,
    } = game;

    // Create a GameResponseDTO object with the necessary game data
    const gameResponse: GameResponseDTO = {
      id,
      user_id,
      name,
      description,
      original_image_url,
      thumbnail_image_url,
      game_script,
      visibility,
    };
    this.logger.log(
      `buildGameResponse :: gameResponse - ${JSON.stringify(gameResponse)}`,
    );

    return gameResponse;
  }

  /**
   * Create a new game.
   * @param createGameRequestDTO The DTO containing the game creation data.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a Game representing the created game.
   */
  public async createGame(
    createGameRequestDTO: CreateGameRequestDTO,
    user: User,
  ): Promise<Game> {
    this.logger.log(
      `createGame :: createGameRequestDTO - ${JSON.stringify(
        createGameRequestDTO,
      )}`,
    );

    // Create the game data object with user_id property
    const gameData: Partial<Game> = this.buildCreateGameData(
      createGameRequestDTO,
      user,
    );
    this.logger.log(`createGame :: gameData - ${JSON.stringify(gameData)}`);

    try {
      return this.gameRepository.createGame(gameData);
    } catch (error) {
      this.logger.error(
        `createGame :: Error while saving game to the database`,
      );
      this.logger.error(`createGame :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while saving game to the database.',
      );
    }
  }

  /**
   * Create a game-user entry for the current user as the owner of the game.
   * @param game The game object.
   * @param user The user object representing the owner of the game.
   * @returns A Promise that resolves to the created GameUser object.
   */
  public async createGameUser(
    game: Game,
    user: User,
    role: GameUserRole,
  ): Promise<GameUser> {
    this.logger.log(`createGameUser :: game - ${JSON.stringify(game)}`);

    const gameUserData: Partial<GameUser> = {
      user_id: user.id,
      game_id: game.id,
      role,
    };

    try {
      return this.gameUserRepository.createGameUser(gameUserData);
    } catch (error) {
      this.logger.error(
        `createGameUser :: Error while creating game-user entry`,
      );
      this.logger.error(`createGameUser :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while creating game-user entry.',
      );
    }
  }
}
