import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Game } from '../interfaces/game.interface';

@Injectable()
export class GameRepository {
  constructor(@InjectModel('Game') private readonly gameModel: Model<Game>) {}

  /**
   * Create a new game in the database.
   * @param gameData The data for creating the game.
   * @returns A Promise that resolves to the created game object.
   */
  public async createGame(gameData: Partial<Game>): Promise<Game> {
    // Create a new Mongoose model instance using the provided data
    const game = new this.gameModel(gameData);

    // Save the new game to the database and return the result as a Promise
    return game.save();
  }

  /**
   * Update a game in the database.
   * @param gameId The ID of the game to update.
   * @param gameData The data to update the game.
   * @returns A Promise that resolves to the updated game object.
   */
  public async updateGame(
    gameId: string,
    gameData: Partial<Game>,
  ): Promise<Game> {
    // Find the game by its ID, update its properties with the provided data,
    // and set the { new: true } option to return the updated document
    const updatedGame = await this.gameModel
      .findByIdAndUpdate({ _id: gameId }, gameData, { new: true })
      .exec();

    return updatedGame;
  }

  /**
   * Soft delete a game from the database.
   * @param gameId The ID of the game to delete.
   * @returns A Promise that resolves to the soft deleted game object.
   */
  public async deleteGame(gameId: string): Promise<Game> {
    // Find the game by its ID and mark it as deleted (soft delete)
    const deletedGame = await this.gameModel
      .findByIdAndUpdate(
        { _id: gameId },
        {
          is_deleted: true, // Mark the game as soft deleted
          deleted_at: new Date(), // Set the timestamp for when the game was soft deleted
        },
        { new: true }, // Return the updated document
      )
      .exec();

    return deletedGame;
  }

  /**
   * Retrieve all games from the database that are not soft deleted.
   * @returns A Promise that resolves to an array of games.
   */
  public async getAllGames(): Promise<Game[]> {
    // Find all games in the database that are not soft deleted
    const games = await this.gameModel.find({ is_deleted: false }).exec();

    return games;
  }

  /**
   * Retrieve all games of a specific user from the database that are not soft deleted.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to an array of games.
   */
  public async findAllGamesByUserId(userId: string): Promise<Game[]> {
    // Find all games of the specified user in the database that are not soft deleted
    const games = await this.gameModel
      .find({ user_id: userId, is_deleted: false })
      .exec();

    return games;
  }

  /**
   * Find a game by its ID in the database (ignoring soft deleted).
   * @param gameId The ID of the game.
   * @returns A Promise that resolves to the game object.
   */
  public async findGameById(gameId: string): Promise<Game> {
    // Find the game by its ID, excluding soft deleted games, and return it as a Promise
    const game = await this.gameModel
      .findOne({ _id: gameId, is_deleted: false })
      .exec();

    return game;
  }

  /**
   * Find a game by its name in the database (case-insensitive) (ignoring soft deleted).
   * @param name The name of the game.
   * @returns A Promise that resolves to the game object.
   */
  public async findGameByName(name: string): Promise<Game> {
    // Use a case-insensitive regular expression to find the game by name,
    // excluding soft deleted games, and return it as a Promise
    const game = await this.gameModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        is_deleted: false,
      })
      .exec();

    return game;
  }

  /**
   * Find a game by its ID and userId in the database (ignoring soft deleted).
   * @param gameId The ID of the game.
   * @param userId The user ID of the game.
   * @returns A Promise that resolves to the game object.
   */
  public async findGameByIdAndUserId(
    gameId: string,
    userId: string,
  ): Promise<Game> {
    // Find the game by its ID, user ID, and excluding soft deleted games, and return it as a Promise
    const game = await this.gameModel
      .findOne({
        _id: gameId,
        user_id: userId,
        is_deleted: false,
      })
      .exec();

    return game;
  }

  /**
   * Find a game by its name and userId in the database (case-insensitive) and ignore soft deleted games.
   * @param name The name of the game.
   * @param userId The user ID of the game.
   * @returns A Promise that resolves to the game object.
   */
  public async findGameByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<Game> {
    // Use a case-insensitive regular expression to find the game by name,
    // excluding soft deleted games, and return it as a Promise
    const game = await this.gameModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        user_id: userId,
        is_deleted: false,
      })
      .exec();

    return game;
  }

  /**
   * Find a game by its name and userId in the database (case-insensitive).
   * Exclude the game with the provided gameId from the search and ignore soft deleted games.
   * @param name The name of the game.
   * @param userId The user ID of the game.
   * @param gameId The ID of the game to exclude from the search.
   * @returns A Promise that resolves to the game object.
   */
  public async findGameByNameAndUserIdExceptGameId(
    name: string,
    userId: string,
    gameId: string,
  ): Promise<Game> {
    // Use a case-insensitive regular expression to find the game by name, user ID,
    // excluding the game with the provided gameId, and ignoring soft deleted games.
    const game = await this.gameModel
      .findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        user_id: userId,
        _id: { $ne: gameId },
        is_deleted: false,
      })
      .exec();

    return game;
  }
}
