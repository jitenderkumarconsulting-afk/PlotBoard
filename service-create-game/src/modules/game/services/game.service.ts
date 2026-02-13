import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
import { CreateGameRequestDTO } from '../dtos/request/create-game-request.dto';
import { GameBuilder } from '../builders/game.builder';
import { Game } from '../interfaces/game.interface';
import { GameRepository } from '../repositories/game.repository';
import { GameUserRole } from '../enums/game-user-role.enum';

@Injectable()
export class GameService {
  private readonly logger: Logger;

  constructor(
    private readonly gameBuilder: GameBuilder, // Inject GameBuilder
    private readonly gameRepository: GameRepository, // Inject GameRepository
  ) {
    this.logger = new Logger(GameService.name);
  }

  /**
   * Get a game by its name and user ID.
   * @param name The name of the game.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the game object, or null if not found.
   */
  private async getGameByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Game | null> {
    return this.gameRepository.findGameByNameAndUserId(name, userId);
  }

  /**
   * Validate the request to create a new game.
   * @param createGameRequestDTO The DTO containing the game creation data.
   * @param user The user object associated with the request.
   * @throws ConflictException if a game with the same name already exists for the user.
   */
  private async validateCreateGameRequest(
    createGameRequestDTO: CreateGameRequestDTO,
    user: User,
  ): Promise<void> {
    this.logger.log(
      `validateCreateGameRequest :: createGameRequestDTO - ${JSON.stringify(
        createGameRequestDTO,
      )}`,
    );

    const { name } = createGameRequestDTO;

    // Check if the game already exists with the provided name and user ID
    const existingGame = await this.getGameByNameAndUserId(name, user.id);
    if (existingGame) {
      this.logger.error(
        `validateCreateGameRequest :: Game with the same name already exists`,
      );
      throw new ConflictException('Game with the same name already exists.');
    }
  }

  /**
   * Create a new game.
   * @param createGameRequestDTO The DTO containing the game creation data.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameResponseDTO representing the created game.
   */
  public async createGameRequest(
    createGameRequestDTO: CreateGameRequestDTO,
    user: User,
  ): Promise<GameResponseDTO> {
    this.logger.log(
      `createGameRequest :: createGameRequestDTO - ${JSON.stringify(
        createGameRequestDTO,
      )}`,
    );

    // Validate the request before creating the game
    await this.validateCreateGameRequest(createGameRequestDTO, user);

    // Call the createGame method of the gameBuilder to create the game entity
    const game = await this.gameBuilder.createGame(createGameRequestDTO, user);
    this.logger.log(`createGameRequest :: game - ${JSON.stringify(game)}`);

    // Create a game-user entry with the current user as the owner of the game
    await this.gameBuilder.createGameUser(game, user, GameUserRole.OWNER);

    // Prepare the game response DTO
    const gameResponse = this.gameBuilder.buildGameResponse(game);
    this.logger.log(
      `createGameRequest :: gameResponse - ${JSON.stringify(gameResponse)}`,
    );

    return gameResponse;
  }
}
