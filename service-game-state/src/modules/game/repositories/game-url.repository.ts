import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameUrl } from '../interfaces/game-url.interface';
import { GameUrlType } from '../enums/game-url-type.enum';

@Injectable()
export class GameUrlRepository {
  constructor(
    @InjectModel('GameUrl') private readonly gameUrlModel: Model<GameUrl>,
  ) {}

  /**
   * Create a new game URL in the database.
   * @param gameUrlData The data for creating the game URL.
   * @returns A Promise that resolves to the created game URL object.
   */
  public async createGameUrl(gameUrlData: Partial<GameUrl>): Promise<GameUrl> {
    const gameUrl = new this.gameUrlModel(gameUrlData);
    return gameUrl.save();
  }

  /**
   * Update a game URL in the database.
   * @param gameUrlId The ID of the game URL to update.
   * @param gameUrlData The data to update the game URL.
   * @returns A Promise that resolves to the updated game URL object.
   */
  public async updateGameUrl(
    gameUrlId: string,
    gameUrlData: Partial<GameUrl>,
  ): Promise<GameUrl> {
    const updatedGameUrl = await this.gameUrlModel
      .findByIdAndUpdate({ _id: gameUrlId }, gameUrlData, { new: true })
      .exec();

    return updatedGameUrl;
  }

  /**
   * Soft delete a game URL from the database.
   * @param gameUrlId The ID of the game URL to delete.
   * @returns A Promise that resolves to the soft-deleted game URL object.
   */
  public async deleteGameUrl(gameUrlId: string): Promise<GameUrl> {
    const deletedGameUrl = await this.gameUrlModel
      .findByIdAndUpdate(
        { _id: gameUrlId },
        {
          is_deleted: true,
          deleted_at: new Date(),
        },
        { new: true },
      )
      .exec();

    return deletedGameUrl;
  }

  /**
   * Retrieve all active game URLs from the database (excluding soft-deleted).
   * @returns A Promise that resolves to an array of active game URLs.
   */
  public async getAllGameUrls(): Promise<GameUrl[]> {
    const gameUrls = await this.gameUrlModel.find({ is_deleted: false }).exec();
    return gameUrls;
  }

  /**
   * Retrieve all game URLs of a specific game from the database that are not soft deleted.
   * @param gameId The ID of the game.
   * @returns A Promise that resolves to an array of game URLs.
   */
  public async findAllGameUrlsByGameId(gameId: string): Promise<GameUrl[]> {
    // Find all game URLs of the specified game in the database that are not soft deleted
    const gameUrls = await this.gameUrlModel
      .find({ game_id: gameId, is_deleted: false })
      .exec();

    return gameUrls;
  }

  /**
   * Find an active game URL by its ID in the database (excluding soft-deleted).
   * @param gameUrlId The ID of the game URL.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlById(gameUrlId: string): Promise<GameUrl> {
    const gameUrl = await this.gameUrlModel
      .findOne({ _id: gameUrlId, is_deleted: false })
      .exec();

    return gameUrl;
  }

  /**
   * Find an active game URL by its ID and user ID in the database (excluding soft-deleted).
   * @param gameUrlId The ID of the game URL.
   * @param userId The user ID of the game.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlByIdAndUserId(
    gameUrlId: string,
    userId: string,
  ): Promise<GameUrl> {
    const gameUrl = await this.gameUrlModel
      .findOne({
        _id: gameUrlId,
        user_id: userId,
        is_deleted: false,
      })
      .exec();

    return gameUrl;
  }

  /**
   * Find an active game URL by its ID and user ID in the database (excluding soft-deleted URLs).
   * @param gameUrlId The ID of the game URL.
   * @param gameId The ID of the game.
   * @param userId The user ID of the game.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlByIdAndGameIdAndUserId(
    gameUrlId: string,
    gameId: string,
    userId: string,
  ): Promise<GameUrl> {
    const gameUrl = await this.gameUrlModel
      .findOne({
        _id: gameUrlId,
        game_id: gameId,
        user_id: userId,
        is_deleted: false,
      })
      .exec();

    return gameUrl;
  }

  /**
   * Find an active game URL by its URL code and user ID in the database (excluding soft-deleted URLs).
   * @param urlCode The URL code of the game URL.
   * @param userId The user ID of the game.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlByUrlCodeAndUserId(
    urlCode: string,
    userId: string,
  ): Promise<GameUrl> {
    // Find the game URL in the database based on the URL code, user ID, and exclude soft-deleted URLs
    const gameUrl = await this.gameUrlModel
      .findOne({
        url_code: urlCode,
        user_id: userId,
        is_deleted: false,
      })
      .exec();

    return gameUrl;
  }

  /**
   * Find an active game URL by its URL code in the database (excluding soft-deleted URLs).
   * @param urlCode The URL code of the game URL.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlByUrlCode(urlCode: string): Promise<GameUrl | null> {
    // Find the game URL in the database based on the URL code, excluding soft-deleted URLs
    const gameUrl = await this.gameUrlModel
      .findOne({
        url_code: urlCode,
        is_deleted: false,
      })
      .exec();

    return gameUrl;
  }

  /**
   * Find an active game URL by its URL code and URL type in the database (excluding soft-deleted URLs).
   * @param urlCode The URL code of the game URL.
   * @param urlType The URL type of the game URL.
   * @returns A Promise that resolves to the active game URL object.
   */
  public async findGameUrlByUrlCodeAndUrlType(
    urlCode: string,
    urlType: GameUrlType,
  ): Promise<GameUrl | null> {
    // Find the game URL in the database based on the URL code and URL type, excluding soft-deleted URLs
    const gameUrl = await this.gameUrlModel
      .findOne({
        url_code: urlCode,
        url_type: urlType,
        is_deleted: false,
      })
      .exec();

    return gameUrl;
  }
}
