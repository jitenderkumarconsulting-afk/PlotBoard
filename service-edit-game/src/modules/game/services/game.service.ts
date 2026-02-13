import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
import { UpdateGameRequestDTO } from '../dtos/request/update-game-request.dto';
import { GameBuilder } from '../builders/game.builder';
import { Game } from '../interfaces/game.interface';
import { GameRepository } from '../repositories/game.repository';

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
   * Get a game by its name and user ID, excluding the current game ID.
   * @param name The name of the game.
   * @param userId The ID of the user.
   * @param gameId The ID of the current game to exclude from the search.
   * @returns A Promise that resolves to the game object, or null if not found.
   */
  private async getGameByNameAndUserIdExceptGameId(
    name: string,
    userId: string,
    gameId: string,
  ): Promise<Game | null> {
    return this.gameRepository.findGameByNameAndUserIdExceptGameId(
      name,
      userId,
      gameId,
    );
  }

  /**
   * Check if a game exists with the given gameId and userId.
   * @param gameId The ID of the game to check.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the game object if found.
   * @throws NotFoundException if the game with the given gameId does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game from the database.
   */
  private async checkIfGameExists(
    gameId: string,
    userId: string,
  ): Promise<Game> {
    this.logger.log(`checkIfGameExists :: gameId - ${gameId}`);

    let game: Game;
    try {
      // Find the game by its ID and user ID from the gameRepository
      game = await this.gameRepository.findGameByIdAndUserId(gameId, userId);
    } catch (error) {
      this.logger.error(
        `checkIfGameExists :: Error while fetching game from the database`,
      );
      this.logger.error(`checkIfGameExists :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while fetching game from the database.',
      );
    }

    if (!game) {
      this.logger.error(
        `checkIfGameExists :: Game with ID ${gameId} not found`,
      );
      throw new NotFoundException(`Game with given ID not found.`);
    }

    return game;
  }

  /**
   * Validate the request to update an existing game.
   * @param gameId The ID of the game to update.
   * @param updateGameRequestDTO The DTO containing the game updation data.
   * @param user The user object associated with the request.
   * @throws ConflictException if a game with the same name already exists for the user (excluding the current game).
   */
  private async validateUpdateGameRequest(
    gameId: string,
    updateGameRequestDTO: UpdateGameRequestDTO,
    user: User,
  ): Promise<void> {
    this.logger.log(
      `validateUpdateGameRequest :: updateGameRequestDTO - ${JSON.stringify(
        updateGameRequestDTO,
      )}`,
    );

    const { name } = updateGameRequestDTO;

    // Check if any other game with the provided name and user ID exists (excluding the current game).
    const existingGame = await this.getGameByNameAndUserIdExceptGameId(
      name,
      user.id,
      gameId,
    );
    if (existingGame) {
      this.logger.error(
        `validateUpdateGameRequest :: Game with the same name already exists`,
      );
      throw new ConflictException('Game with the same name already exists.');
    }
  }

  /**
   * Update an existing game.
   * @param gameId The ID of the game to update.
   * @param updateGameRequestDTO The DTO containing the game updation data.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameResponseDTO representing the updated game.
   */
  public async updateGameRequest(
    gameId: string,
    updateGameRequestDTO: UpdateGameRequestDTO,
    user: User,
  ): Promise<GameResponseDTO> {
    this.logger.log(
      `updateGameRequest :: updateGameRequestDTO - ${JSON.stringify(
        updateGameRequestDTO,
      )}`,
    );

    // Check if the game with the given gameId exists
    await this.checkIfGameExists(gameId, user.id);

    // Validate the request before updating the game
    await this.validateUpdateGameRequest(gameId, updateGameRequestDTO, user);

    // Call the updateGame method of the gameBuilder to update the game entity
    const game = await this.gameBuilder.updateGame(
      gameId,
      updateGameRequestDTO,
    );
    this.logger.log(`updateGameRequest :: game - ${JSON.stringify(game)}`);

    // Prepare the game response DTO
    const gameResponse = this.gameBuilder.buildGameResponse(game);
    this.logger.log(
      `updateGameRequest :: gameResponse - ${JSON.stringify(gameResponse)}`,
    );

    return gameResponse;
  }
}
