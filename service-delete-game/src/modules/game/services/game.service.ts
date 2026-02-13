import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
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
   * Delete an existing game by its ID.
   * @param gameId The ID of the game to delete.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameResponseDTO representing the deleted game.
   * @throws NotFoundException if the game with the given ID does not exist.
   * @throws InternalServerErrorException if there is an error while deleting the game from the database.
   */
  public async deleteGameRequest(
    gameId: string,
    user: User,
  ): Promise<GameResponseDTO> {
    this.logger.log(
      `deleteGameRequest :: gameId - ${gameId}, user - ${JSON.stringify(user)}`,
    );

    // Check if the game with the given gameId exists
    await this.checkIfGameExists(gameId, user.id);

    // Call the deleteGame method of the gameBuilder to delete the game entity
    const game = await this.gameBuilder.deleteGame(gameId);
    this.logger.log(`deleteGameRequest :: game - ${JSON.stringify(game)}`);

    // Build the GameResponseDTO from the deleted game
    const gameResponse = this.gameBuilder.buildGameResponse(game);
    this.logger.log(
      `deleteGameRequest :: gameResponse - ${JSON.stringify(gameResponse)}`,
    );

    return gameResponse;
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

    let game;
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
}
