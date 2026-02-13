import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { GameUrlResponseDTO } from '../dtos/response/game-url-response.dto';
import { GameUrlRepository } from '../repositories/game-url.repository';
import { Game } from '../interfaces/game.interface';
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';
import { User } from '../../../modules/user/interfaces/user.interface';
import { CreateGameUrlRequestDTO } from '../dtos/request/create-game-url-request.dto';
import { RandomGeneratorHelper } from '../../../shared/helpers/random-generator.helper';
import { GameUrl } from '../interfaces/game-url.interface';

@Injectable()
export class GameBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly gameUrlRepository: GameUrlRepository, // Inject GameUrlRepository
  ) {
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
   * Builds a GameUrlResponseDTO object with the necessary game URL data.
   * @param gameUrl The game URL object.
   * @param game The associated game object (optional).
   * @returns The constructed GameUrlResponseDTO object.
   */
  public buildGameUrlResponse(
    gameUrl: GameUrl,
    game?: Game,
  ): GameUrlResponseDTO {
    this.logger.log(
      `buildGameUrlResponse :: gameUrl - ${JSON.stringify(gameUrl)}`,
    );

    let gameResponse;
    if (game) {
      // Prepare the GameResponseDTO
      gameResponse = this.buildGameResponse(game);
      this.logger.log(
        `buildGameUrlResponse :: gameResponse - ${JSON.stringify(
          gameResponse,
        )}`,
      );
    }

    // Extract necessary game URL data for the response
    const {
      id,
      user_id,
      game_id,
      url_type,
      url_code,
      shared_with_all_users,
      shared_with_user_ids,
      expiration_date,
    } = gameUrl;

    // Create a GameUrlResponseDTO object with the necessary game URL data
    const gameUrlResponse: GameUrlResponseDTO = {
      id,
      user_id,
      game_id,
      url_type,
      url_code,
      shared_with_all_users,
      shared_with_user_ids,
      expiration_date: expiration_date && expiration_date.getTime(),
      game: gameResponse,
    };
    this.logger.log(
      `buildGameUrlResponse :: gameUrlResponse - ${JSON.stringify(
        gameUrlResponse,
      )}`,
    );

    return gameUrlResponse;
  }

  /**
   * Builds a ListResponseDTO object containing an array of GameUrlResponseDTO objects.
   * @param games The array of game URL objects.
   * @returns The constructed ListResponseDTO object with the array of GameUrlResponseDTO objects and total count.
   */
  public buildGameUrlResponseList(
    gameUrls: GameUrl[],
  ): ListResponseDTO<GameUrlResponseDTO> {
    this.logger.log('buildGameUrlResponseList');

    // Use arrow function with implicit return and object destructuring directly
    const gameUrlResponses: GameUrlResponseDTO[] = gameUrls.map((gameUrl) => ({
      id: gameUrl.id,
      user_id: gameUrl.user_id,
      game_id: gameUrl.game_id,
      url_type: gameUrl.url_type,
      url_code: gameUrl.url_code,
      shared_with_all_users: gameUrl.shared_with_all_users,
      shared_with_user_ids: gameUrl.shared_with_user_ids,
      expiration_date:
        gameUrl.expiration_date && gameUrl.expiration_date.getTime(),
    }));
    this.logger.log(
      `buildGameUrlResponseList :: gameUrlResponses.length - ${gameUrlResponses.length}`,
    );

    // Prepare the list response
    const listResponse: ListResponseDTO<GameUrlResponseDTO> = {
      items: gameUrlResponses,
      total: gameUrlResponses.length,
    };

    return listResponse;
  }

  /**
   * Build the game URL data object for creation.
   * @param createGameUrlRequestDTO The DTO containing the game URL creation data.
   * @param user The user object associated with the request.
   * @returns The updated game URL data object.
   */
  private buildCreateGameUrlData(
    createGameUrlRequestDTO: CreateGameUrlRequestDTO,
    gameId: string,
    user: User,
  ): Partial<GameUrl> {
    this.logger.log(
      `buildCreateGameUrlData :: createGameUrlRequestDTO - ${JSON.stringify(
        createGameUrlRequestDTO,
      )}`,
    );

    // Extract the necessary fields from the create-game-url request DTO
    const {
      url_type,
      shared_with_all_users,
      shared_with_user_ids,
      expiration_date,
    } = createGameUrlRequestDTO;

    // Generate a random alphanumeric code for the URL
    const generatedUrlCode =
      RandomGeneratorHelper.generateRandomAlphanumeric(50);
    const sharedWithUserIds = shared_with_all_users ? [] : shared_with_user_ids;
    const expirationDate = expiration_date && new Date(expiration_date);

    // Create the game URL data object with the necessary data
    const gameUrlData: Partial<GameUrl> = {
      user_id: user.id, // Add the user_id property to the CreateGameUrlRequestDTO
      game_id: gameId, // Add the game_id property to the CreateGameUrlRequestDTO
      url_type,
      url_code: generatedUrlCode,
      shared_with_all_users,
      shared_with_user_ids: sharedWithUserIds,
      expiration_date: expirationDate,
    };
    this.logger.log(
      `buildCreateGameUrlData :: gameUrlData - ${JSON.stringify(gameUrlData)}`,
    );

    return gameUrlData;
  }

  /**
   * Create a new game URL.
   * @param createGameUrlRequestDTO The DTO containing the game URL creation data.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a Game URL representing the created game URL.
   */
  public async createGameUrl(
    createGameUrlRequestDTO: CreateGameUrlRequestDTO,
    gameId: string,
    user: User,
  ): Promise<GameUrl> {
    this.logger.log(
      `createGameUrl :: createGameUrlRequestDTO - ${JSON.stringify(
        createGameUrlRequestDTO,
      )}`,
    );

    // Create the game URL data object
    const gameUrlData: Partial<GameUrl> = this.buildCreateGameUrlData(
      createGameUrlRequestDTO,
      gameId,
      user,
    );
    this.logger.log(
      `createGameUrl :: gameUrlData - ${JSON.stringify(gameUrlData)}`,
    );

    try {
      return this.gameUrlRepository.createGameUrl(gameUrlData);
    } catch (error) {
      this.logger.error(
        `createGame :: Error while saving game URL to the database`,
      );
      this.logger.error(`createGameUrl :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while saving game URL to the database.',
      );
    }
  }

  /**
   * Delete an existing game URL by its ID.
   * @param gameUrlId The ID of the game URL to delete.
   * @returns A Promise that resolves to a Game URL representing the deleted game URL.
   * @throws InternalServerErrorException if there is an error while deleting the game URL from the database.
   */
  public async deleteGameUrl(gameUrlId: string): Promise<GameUrl> {
    this.logger.log(`deleteGameUrl :: gameUrlId - ${gameUrlId}`);

    // Delete the game URL from the database
    try {
      return this.gameUrlRepository.deleteGameUrl(gameUrlId);
    } catch (error) {
      this.logger.error(
        `deleteGame :: Error while deleting game URL from the database`,
      );
      this.logger.error(`deleteGameUrl :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while deleting game URL from the database.',
      );
    }
  }

  /**
   * Performs an action to play the game based on the provided game URL.
   * @param game The game object.
   * @param gameUrl The game URL object.
   * @param user The user object associated with the request.
   * @returns The updated game object after performing the action.
   */
  public async performGameUrlCodeActionForPlayGame(
    game: Game,
    gameUrl: GameUrl,
    user: User,
  ): Promise<Game> {
    this.logger.log(`performGameUrlCodeActionForPlayGame`);

    // Perform the action for playing the game based on the game URL data
    // You can implement the specific logic here
    // For example, update game statistics or perform actions related to playing the game

    // Return the updated game object
    return game;
  }

  /**
   * Performs an action to add a member to the game based on the provided game URL.
   * @param game The game object.
   * @param gameUrl The game URL object.
   * @param user The user object associated with the request.
   * @returns The updated game object after performing the action.
   */
  public async performGameUrlCodeActionForAddMember(
    game: Game,
    gameUrl: GameUrl,
    user: User,
  ): Promise<Game> {
    this.logger.log(`performGameUrlCodeActionForAddMember`);

    // Perform the action for adding a member to the game based on the game URL data
    // You can implement the specific logic here
    // For example, update the list of members or perform actions related to adding a member

    // Return the updated game object
    return game;
  }

  /**
   * Performs an action to add an admin to the game based on the provided game URL.
   * @param game The game object.
   * @param gameUrl The game URL object.
   * @param user The user object associated with the request.
   * @returns The updated game object after performing the action.
   */
  public async performGameUrlCodeActionForAddAdmin(
    game: Game,
    gameUrl: GameUrl,
    user: User,
  ): Promise<Game> {
    this.logger.log(`performGameUrlCodeActionForAddAdmin`);

    // Perform the action for adding an admin to the game based on the game URL data
    // You can implement the specific logic here
    // For example, update the list of admins or perform actions related to adding an admin

    // Return the updated game object
    return game;
  }
}
