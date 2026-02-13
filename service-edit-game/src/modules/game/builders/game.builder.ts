import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Game } from '../interfaces/game.interface';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { UpdateGameRequestDTO } from '../dtos/request/update-game-request.dto';
import { GameRepository } from '../repositories/game.repository';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(private readonly gameRepository: GameRepository) {
    this.logger = new Logger(GameBuilder.name);
  }

  /**
   * Build the game data object for updation.
   * @param updateGameRequestDTO The DTO containing the game updation data.
   * @returns The updated game data object.
   */
  private buildUpdateGameData(
    updateGameRequestDTO: UpdateGameRequestDTO,
  ): Partial<Game> {
    this.logger.log(
      `buildUpdateGameData :: updateGameRequestDTO - ${JSON.stringify(
        updateGameRequestDTO,
      )}`,
    );

    // Create an empty object to hold the properties that need to be updated
    const gameObj = {};

    // Check name property in the updateGameRequestDTO and add it to the gameObj if it exists
    if (updateGameRequestDTO.name) {
      gameObj['name'] = updateGameRequestDTO.name;
    }

    // Check description property in the updateGameRequestDTO and add it to the gameObj if it exists
    if (updateGameRequestDTO.description) {
      gameObj['description'] = updateGameRequestDTO.description;
    }

    // Check original_image_url property in the updateGameRequestDTO and add it to the gameObj if it exists
    if (updateGameRequestDTO.original_image_url) {
      gameObj['original_image_url'] = updateGameRequestDTO.original_image_url;
    }

    // Check thumbnail_image_url property in the updateGameRequestDTO and add it to the gameObj if it exists
    if (updateGameRequestDTO.thumbnail_image_url) {
      gameObj['thumbnail_image_url'] = updateGameRequestDTO.thumbnail_image_url;
    }

    // Check game_script property in the updateGameRequestDTO and add it to the gameObj if it exists
    if (updateGameRequestDTO.game_script) {
      gameObj['game_script'] = updateGameRequestDTO.game_script;
    }

    // Create the game data object with the necessary data from the updateGameRequestDTO
    const gameData: Partial<Game> = { ...gameObj };

    this.logger.log(
      `buildUpdateGameData :: gameData - ${JSON.stringify(gameData)}`,
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
   * Update an existing game.
   * @param gameId The ID of the game to update.
   * @param updateGameRequestDTO The DTO containing the game updation data.
   * @returns A Promise that resolves to a Game representing the updated game.
   */
  public async updateGame(
    gameId: string,
    updateGameRequestDTO: UpdateGameRequestDTO,
  ): Promise<Game> {
    this.logger.log(
      `updateGame :: updateGameRequestDTO - ${JSON.stringify(
        updateGameRequestDTO,
      )}`,
    );

    // Create the game data object
    const gameData: Partial<Game> =
      this.buildUpdateGameData(updateGameRequestDTO);
    this.logger.log(`updateGame :: gameData - ${JSON.stringify(gameData)}`);

    try {
      return this.gameRepository.updateGame(gameId, gameData);
    } catch (error) {
      this.logger.error(
        `updateGame :: Error while updating game to the database`,
      );
      this.logger.error(`updateGame :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while updating game to the database.',
      );
    }
  }
}
