import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GameBuilder } from '../builders/game.builder';
import { GameUrlResponseDTO } from '../dtos/response/game-url-response.dto';
import { GameRepository } from '../repositories/game.repository';
import { GameUrlRepository } from '../repositories/game-url.repository';
import { User } from '../../../modules/user/interfaces/user.interface';
import { Game } from '../interfaces/game.interface';
import { GameUrl } from '../interfaces/game-url.interface';
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';
import { CreateGameUrlRequestDTO } from '../dtos/request/create-game-url-request.dto';
import { UserService } from '../../../modules/user/services/user.service';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { GameUrlType } from '../enums/game-url-type.enum';
import { GameUserRepository } from '../repositories/game-user.repository';
import { DateHelper } from '../../../shared/helpers/date.helper';

@Injectable()
export class GameService {
  private readonly logger: Logger;

  constructor(
    private readonly gameBuilder: GameBuilder, // Inject GameBuilder
    private readonly gameRepository: GameRepository, // Inject GameRepository
    private readonly gameUrlRepository: GameUrlRepository, // Inject GameUrlRepository
    private readonly userService: UserService, // Inject UserService
    private readonly gameUserRepository: GameUserRepository, // Inject GameUserRepository
  ) {
    this.logger = new Logger(GameService.name);
  }

  /**
   * Checks for invalid user IDs in the shared user IDs list.
   * @param userIds The list of user IDs to check.
   * @returns An array of invalid user IDs.
   */
  private async checkInvalidUserIds(userIds: string[]): Promise<string[]> {
    this.logger.log(`checkInvalidUserIds :: userIds - ${userIds}`);

    // Retrieve existing user IDs from the database
    const existingUserIds = await this.userService.getUserIdsByIds(userIds);
    this.logger.log(
      `checkInvalidUserIds :: existingUserIds - ${existingUserIds}`,
    );

    // Filter out user IDs that are not in the existing user IDs list
    const invalidUserIds = userIds.filter(
      (userId) => !existingUserIds.includes(userId),
    );
    this.logger.log(
      `checkInvalidUserIds :: invalidUserIds - ${invalidUserIds}`,
    );

    return invalidUserIds;
  }

  /**
   * Validates the request to create a new game URL.
   * @param createGameUrlRequestDTO The DTO containing the game URL creation data.
   * @throws BadRequestException if validation fails.
   */
  private async validateCreateGameUrlRequest(
    createGameUrlRequestDTO: CreateGameUrlRequestDTO,
  ): Promise<void> {
    this.logger.log(
      `validateCreateGameUrlRequest :: createGameUrlRequestDTO - ${JSON.stringify(
        createGameUrlRequestDTO,
      )}`,
    );

    const {
      shared_with_all_users: sharedWithAllUsers,
      shared_with_user_ids: sharedWithUserIds,
    } = createGameUrlRequestDTO;

    if (!sharedWithAllUsers) {
      if (!sharedWithUserIds || sharedWithUserIds.length === 0) {
        this.logger.error(
          `validateCreateGameUrlRequest :: Shared with user IDs are required when shared with all users is false`,
        );
        throw new BadRequestException(
          'Shared with user IDs are required when shared with all users is false.',
        );
      }

      // Check if all shared user IDs exist in the user schema
      const invalidUserIds = await this.checkInvalidUserIds(sharedWithUserIds);
      if (invalidUserIds.length > 0) {
        this.logger.error(
          `validateCreateGameUrlRequest :: Invalid shared user IDs: ${invalidUserIds.join(
            ', ',
          )}`,
        );
        throw new BadRequestException(
          `Invalid shared with all user IDs: ${invalidUserIds.join(', ')}`,
        );
      }
    }
  }

  /**
   * Creates a new game URL.
   * @param createGameUrlRequestDTO The DTO containing the game URL creation data.
   * @param gameId The ID of the associated game.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameUrlResponseDTO representing the created game URL.
   * @throws NotFoundException if the associated game does not exist.
   * @throws BadRequestException if validation fails.
   */
  public async createGameUrlRequest(
    createGameUrlRequestDTO: CreateGameUrlRequestDTO,
    gameId: string,
    user: User,
  ): Promise<GameUrlResponseDTO> {
    this.logger.log(
      `createGameUrlRequest :: gameId - ${gameId}, createGameUrlRequestDTO - ${JSON.stringify(
        createGameUrlRequestDTO,
      )}`,
    );

    // Check if the game with the given gameId exists
    await this.checkIfGameExistsForUser(gameId, user.id);

    // Validate the request before creating the game URL
    await this.validateCreateGameUrlRequest(createGameUrlRequestDTO);

    // Call the createGameUrl method of the gameBuilder to create the game URL entity
    const gameUrl = await this.gameBuilder.createGameUrl(
      createGameUrlRequestDTO,
      gameId,
      user,
    );
    this.logger.log(
      `createGameUrlRequest :: gameUrl - ${JSON.stringify(gameUrl)}`,
    );

    // Prepare the game URL response DTO
    const gameUrlResponse = this.gameBuilder.buildGameUrlResponse(gameUrl);
    this.logger.log(
      `createGameUrlRequest :: gameUrlResponse - ${JSON.stringify(
        gameUrlResponse,
      )}`,
    );

    return gameUrlResponse;
  }

  /**
   * Fetches all game URLs for a specific game.
   * @param gameId The ID of the game to fetch game URLs.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a ListResponseDTO containing an array of GameUrlResponseDTO representing all game URLs for the specific game.
   * @throws InternalServerErrorException if there is an error while fetching game URLs from the database.
   * @throws NotFoundException if the associated game does not exist.
   */
  public async getAllGameUrlsForGame(
    gameId: string,
    user: User,
  ): Promise<ListResponseDTO<GameUrlResponseDTO>> {
    this.logger.log(`getAllGameUrlsForGame :: gameId - ${gameId}`);

    // Check if the game with the given gameId exists
    await this.checkIfGameExistsForUser(gameId, user.id);

    let gameUrls: GameUrl[];
    try {
      // Fetch all game URLs for the specific game from the gameUrlRepository
      gameUrls = await this.gameUrlRepository.findAllGameUrlsByGameId(gameId);
    } catch (error) {
      this.logger.error(
        `getAllGameUrlsForGame :: Error while fetching all game URLs for a specific game from the database`,
      );
      this.logger.error(`getAllGames :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while fetching all game URLs from the database.',
      );
    }

    // Build a ListResponseDTO with the array of GameUrlResponseDTO objects
    const listResponse = this.gameBuilder.buildGameUrlResponseList(gameUrls);
    this.logger.log(
      `getAllGameUrlsForGame :: listResponse - ${JSON.stringify(listResponse)}`,
    );

    return listResponse;
  }

  /**
   * Deletes an existing game URL by its ID within a specific game.
   * @param gameUrlId The ID of the game URL to delete.
   * @param gameId The ID of the game.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameUrlResponseDTO representing the deleted game URL.
   * @throws NotFoundException if the game URL with the given ID does not exist.
   * @throws InternalServerErrorException if there is an error while deleting the game URL from the database.
   */
  public async deleteGameUrlRequest(
    gameUrlId: string,
    gameId: string,
    user: User,
  ): Promise<GameUrlResponseDTO> {
    this.logger.log(
      `deleteGameUrlRequest :: gameUrlId - ${gameUrlId}, user - ${JSON.stringify(
        user,
      )}`,
    );

    // Check if the game URL with the given gameUrlId exists within the specified game
    await this.checkIfGameUrlExistsByIdAndGameId(gameUrlId, gameId, user.id);

    // Call the deleteGameUrl method of the gameBuilder to delete the game URL entity
    const gameUrl = await this.gameBuilder.deleteGameUrl(gameUrlId);
    this.logger.log(
      `deleteGameUrlRequest :: gameUrl - ${JSON.stringify(gameUrl)}`,
    );

    // Build the GameUrlResponseDTO from the deleted game URL
    const gameUrlResponse = this.gameBuilder.buildGameUrlResponse(gameUrl);
    this.logger.log(
      `deleteGameUrlRequest :: gameUrlResponse - ${JSON.stringify(
        gameUrlResponse,
      )}`,
    );

    return gameUrlResponse;
  }

  /**
   * Checks if a game exists with the given gameId and userId.
   * @param gameId The ID of the game to check.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the game object if found.
   * @throws NotFoundException if the game with the given gameId does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game from the database.
   */
  private async checkIfGameExistsForUser(
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
   * Checks if a game exists with the given gameId and userId.
   * @param gameId The ID of the game to check.
   * @returns A Promise that resolves to the game object if found.
   * @throws NotFoundException if the game with the given gameId does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game from the database.
   */
  private async checkIfGameExists(gameId: string): Promise<Game> {
    this.logger.log(`checkIfGameExists :: gameId - ${gameId}`);

    let game: Game;
    try {
      // Find the game by its ID from the gameRepository
      game = await this.gameRepository.findGameById(gameId);
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
   * Checks if a game URL exists with the given gameUrlId and userId within a specific game.
   * @param gameUrlId The ID of the game URL to check.
   * @param gameId The ID of the game.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the game URL object if found.
   * @throws NotFoundException if the game URL with the given gameUrlId does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game URL from the database.
   */
  private async checkIfGameUrlExistsByIdAndGameId(
    gameUrlId: string,
    gameId: string,
    userId: string,
  ): Promise<GameUrl> {
    this.logger.log(
      `checkIfGameUrlExistsByIdAndGameId :: gameId - ${gameId}, gameUrlId - ${gameUrlId}`,
    );

    let gameUrl: GameUrl;
    try {
      // Find the game URL by its ID, user ID, and game ID from the gameUrlRepository
      gameUrl = await this.gameUrlRepository.findGameUrlByIdAndGameIdAndUserId(
        gameUrlId,
        gameId,
        userId,
      );
    } catch (error) {
      this.logger.error(
        `checkIfGameUrlExistsByIdAndGameId :: Error while fetching game URL from the database`,
      );
      this.logger.error(
        `checkIfGameUrlExistsByIdAndGameId :: error - ${error}`,
      );
      throw new InternalServerErrorException(
        'Error while fetching game URL from the database.',
      );
    }

    if (!gameUrl) {
      this.logger.error(
        `checkIfGameUrlExistsByIdAndGameId :: Game URL with ID ${gameUrlId} not found`,
      );
      throw new NotFoundException(`Game URL with given ID not found.`);
    }

    return gameUrl;
  }

  /**
   * Checks if a game URL exists with the given URL code and userId within a specific game.
   * @param urlCode The URL code of the game URL to check.
   * @returns A Promise that resolves to the game URL object if found.
   * @throws NotFoundException if the game URL with the given URL code does not exist.
   * @throws InternalServerErrorException if there is an error while fetching the game URL from the database.
   */
  private async checkIfGameUrlExistsByUrlCode(
    urlCode: string,
  ): Promise<GameUrl> {
    this.logger.log(`checkIfGameUrlExistsByUrlCode :: urlCode - ${urlCode}`);

    let gameUrl: GameUrl;
    try {
      // Find the game URL by its URL code and user ID from the gameUrlRepository
      gameUrl = await this.gameUrlRepository.findGameUrlByUrlCodeAndUserId(
        urlCode,
      );
    } catch (error) {
      this.logger.error(
        `checkIfGameUrlExistsByUrlCode :: Error while fetching game URL from the database`,
      );
      this.logger.error(`checkIfGameUrlExistsByUrlCode :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while fetching game URL from the database.',
      );
    }

    if (!gameUrl) {
      this.logger.error(
        `checkIfGameUrlExistsByUrlCode :: Game URL with code ${urlCode} not found`,
      );
      throw new NotFoundException('Game URL with given code not found.');
    }

    return gameUrl;
  }

  /**
   * Validates the request before performing an action based on the provided game URL code.
   * @param gameUrl The game URL associated with the action.
   * @param user The user object associated with the request.
   * @throws BadRequestException if validation fails.
   */
  private async validatePerformGameUrlCodeActionRequest(
    gameUrl: GameUrl,
    user: User,
  ): Promise<void> {
    this.logger.log(
      `validatePerformGameUrlCodeActionRequest :: gameUrl - ${JSON.stringify(
        gameUrl,
      )}`,
    );

    const {
      url_type: urlType,
      expiration_date: expirationDate,
      shared_with_all_users: sharedWithAllUsers,
      shared_with_user_ids: sharedWithUserIds,
      game_id: gameId,
    } = gameUrl;

    // Check if the game URL has expired
    if (expirationDate && DateHelper.isDateInPast(expirationDate)) {
      this.logger.error(
        `validatePerformGameUrlCodeActionRequest :: Expired game URL`,
      );
      throw new BadRequestException('Expired game URL.');
    }

    // If shared with all users is false, validate that the current user is in sharedWithUserIds
    if (
      !sharedWithAllUsers &&
      sharedWithUserIds &&
      sharedWithUserIds.length > 0 &&
      !sharedWithUserIds.includes(user.id)
    ) {
      this.logger.error(
        `validatePerformGameUrlCodeActionRequest :: Current user is not authorized to perform this action`,
      );
      throw new BadRequestException(
        'Current user is not authorized to perform this action.',
      );
    }

    switch (urlType) {
      case GameUrlType.PLAY_GAME:
        // No specific validation required for playing the game
        break;

      case GameUrlType.ADD_MEMBER:
        // // Validate if the user entry exists in the GameUser entity for this user and game
        // const gameUserIsMember =
        //   await this.gameUserRepository.findGameUserByUserIdAndGameId(
        //     user.id,
        //     gameId,
        //   );
        // if (gameUserIsMember) {
        //   this.logger.error(
        //     `validatePerformGameUrlCodeActionRequest :: Current user is already a member of the game`,
        //   );
        //   throw new BadRequestException(
        //     'Current user is already a member of the game.',
        //   );
        // }
        break;

      case GameUrlType.ADD_ADMIN:
        // // Validate if the user entry exists in the GameUser entity for this user and game
        // const gameUserIsAdmin =
        //   await this.gameUserRepository.findGameUserByUserIdAndGameId(
        //     user.id,
        //     gameId,
        //   );
        // if (gameUserIsAdmin) {
        //   this.logger.error(
        //     `validatePerformGameUrlCodeActionRequest :: Current user is already an admin of the game`,
        //   );
        //   throw new BadRequestException(
        //     'Current user is already an admin of the game.',
        //   );
        // }
        break;

      default:
        // Invalid game URL type
        this.logger.log(
          `validatePerformGameUrlCodeActionRequest :: Invalid game URL type.`,
        );
        throw new BadRequestException('Invalid game URL type.');
    }
  }

  /**
   * Performs an action based on the provided game URL code.
   * @param urlCode The URL code associated with the action.
   * @param user The user object associated with the request.
   * @returns A Promise that resolves to a GameUrlResponseDTO representing the result of the action.
   * @throws NotFoundException if the game with the associated game ID does not exist.
   * @throws InternalServerErrorException if there is an error while fetching game URL from the database.
   * @throws InternalServerErrorException if the game URL type is invalid.
   */
  public async performGameUrlCodeAction(
    urlCode: string,
    user: User,
  ): Promise<GameUrlResponseDTO> {
    this.logger.log(`performGameUrlCodeAction :: urlCode - ${urlCode}`);

    // Check if the game URL with the given URL code exists and retrieve its entity
    const gameUrl = await this.checkIfGameUrlExistsByUrlCode(urlCode);

    // Validate the request before performing an action based on the provided game URL code
    await this.validatePerformGameUrlCodeActionRequest(gameUrl, user);

    const { game_id: gameId, url_type: urlType } = gameUrl;

    // Check if the game with the given gameId exists
    let game: Game = await this.checkIfGameExists(gameId);

    // Perform action based on game URL type
    switch (urlType) {
      case GameUrlType.PLAY_GAME:
        // Action: Play the game
        // Call the gameBuilder method to perform the action for playing the game
        game = await this.gameBuilder.performGameUrlCodeActionForPlayGame(
          game,
          gameUrl,
          user,
        );
        break;

      case GameUrlType.ADD_MEMBER:
        // Action: Add user as a member in the GameUser
        // Call the gameBuilder method to perform the action for adding a member
        game = await this.gameBuilder.performGameUrlCodeActionForAddMember(
          game,
          gameUrl,
          user,
        );
        break;

      case GameUrlType.ADD_ADMIN:
        // Action: Add user as an admin in the GameUser
        // Call the gameBuilder method to perform the action for adding an admin
        game = await this.gameBuilder.performGameUrlCodeActionForAddAdmin(
          game,
          gameUrl,
          user,
        );
        break;

      default:
        // Invalid game URL type
        // Log an error and throw an exception for invalid game URL type
        this.logger.log(`performGameUrlCodeAction :: Invalid game URL type.`);
        throw new InternalServerErrorException('Invalid game URL type.');
    }

    this.logger.log(
      `performGameUrlCodeAction :: game - ${JSON.stringify(game)}`,
    );

    // Prepare the GameUrlResponseDTO representing the result of the action
    const gameUrlResponse = this.gameBuilder.buildGameUrlResponse(
      gameUrl,
      game,
    );
    this.logger.log(
      `performGameUrlCodeAction :: gameUrlResponse - ${JSON.stringify(
        gameUrlResponse,
      )}`,
    );

    return gameUrlResponse;
  }
}
