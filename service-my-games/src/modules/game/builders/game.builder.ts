import { Injectable, Logger } from '@nestjs/common';

import { Game } from '../interfaces/game.interface';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(GameBuilder.name);
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
   * Builds a ListResponseDTO object containing an array of GameResponseDTO objects.
   * @param games The array of game objects.
   * @returns The constructed ListResponseDTO object with the array of GameResponseDTO objects and total count.
   */
  public buildGameResponseList(
    games: Game[],
  ): ListResponseDTO<GameResponseDTO> {
    this.logger.log('buildGameResponseList');

    // Use arrow function with implicit return and object destructuring directly
    const gameResponses: GameResponseDTO[] = games.map((game) => ({
      id: game.id,
      user_id: game.user_id,
      name: game.name,
      description: game.description,
      original_image_url: game.original_image_url,
      thumbnail_image_url: game.thumbnail_image_url,
      visibility: game.visibility,
    }));
    this.logger.log(
      `buildGameResponseList :: gameResponses.length - ${gameResponses.length}`,
    );

    // Prepare the list response
    const listResponse: ListResponseDTO<GameResponseDTO> = {
      items: gameResponses,
      total: gameResponses.length,
    };

    return listResponse;
  }
}
