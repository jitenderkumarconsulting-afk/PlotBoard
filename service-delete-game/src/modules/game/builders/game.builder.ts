import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Game } from '../interfaces/game.interface';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { GameRepository } from '../repositories/game.repository';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(private readonly gameRepository: GameRepository) {
    this.logger = new Logger(GameBuilder.name);
  }

  /**
   * Builds a GameResponseDTO object with the necessary game data.
   * @param game The game object.
   * @returns The constructed GameResponseDTO object.
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
   * Delete an existing game by its ID.
   * @param gameId The ID of the game to delete.
   * @returns A Promise that resolves to a Game representing the deleted game.
   * @throws InternalServerErrorException if there is an error while deleting the game from the database.
   */
  public async deleteGame(gameId: string): Promise<Game> {
    this.logger.log(`deleteGame :: gameId - ${gameId}`);

    // Delete the game from the database
    try {
      return this.gameRepository.deleteGame(gameId);
    } catch (error) {
      this.logger.error(
        `deleteGame :: Error while deleting game from the database`,
      );
      this.logger.error(`deleteGame :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while deleting game from the database.',
      );
    }
  }
}
