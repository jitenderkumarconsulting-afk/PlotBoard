import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Game } from '../interfaces/game.interface';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
import { GameBuilder } from '../builders/game.builder';
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
   * Fetch all games of the authenticated user.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a ListResponseDTO containing an array of GameResponseDTO representing all games of the authenticated user.
   * @throws InternalServerErrorException if there is an error while fetching games from the database.
   */
  public async getAllGames(
    user: User,
  ): Promise<ListResponseDTO<GameResponseDTO>> {
    this.logger.log(`getAllGames :: user - ${JSON.stringify(user)}`);

    let games: Game[];
    try {
      // Fetch all games of the authenticated user from the gameRepository
      games = await this.gameRepository.findAllGamesByUserId(user.id);
    } catch (error) {
      this.logger.error(
        `getAllGames :: Error while fetching all games from the database`,
      );
      this.logger.error(`getAllGames :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while fetching all games from the database.',
      );
    }

    // Build a ListResponseDTO with the array of GameResponseDTO objects
    const listResponse = this.gameBuilder.buildGameResponseList(games);
    this.logger.log(
      `getAllGames :: listResponse - ${JSON.stringify(listResponse)}`,
    );

    return listResponse;
  }

  /**
   * Fetch an existing game by its ID.
   * @param gameId The ID of the game to fetch.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameResponseDTO representing the fetched game.
   * @throws NotFoundException if the game with the given ID does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game from the database.
   */
  public async getGameById(
    gameId: string,
    user: User,
  ): Promise<GameResponseDTO> {
    this.logger.log(
      `getGameById :: gameId - ${gameId}, user - ${JSON.stringify(user)}`,
    );

    // Check if the game with the given gameId exists
    const game = await this.checkIfGameExists(gameId, user.id);
    this.logger.log(`getGameById :: game - ${JSON.stringify(game)}`);

    // Build the GameResponseDTO from the fetched game
    const gameResponse = this.gameBuilder.buildGameResponse(game);
    this.logger.log(
      `getGameById :: gameResponse - ${JSON.stringify(gameResponse)}`,
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
}
