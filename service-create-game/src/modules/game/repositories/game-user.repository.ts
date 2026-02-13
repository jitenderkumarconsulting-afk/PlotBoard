import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameUser } from '../interfaces/game-user.interface';

@Injectable()
export class GameUserRepository {
  constructor(
    @InjectModel('GameUser')
    private readonly gameUserModel: Model<GameUser>,
  ) {}

  /**
   * Create a new game user in the database.
   * @param gameUserData The data for creating the game user.
   * @returns A Promise that resolves to the created game user object.
   */
  public async createGameUser(
    gameUserData: Partial<GameUser>,
  ): Promise<GameUser> {
    const gameUser = new this.gameUserModel(gameUserData);
    return gameUser.save();
  }

  /**
   * Update a game user in the database.
   * @param gameUserId The ID of the game user to update.
   * @param gameUserData The data to update the game user.
   * @returns A Promise that resolves to the updated game user object.
   */
  public async updateGameUser(
    gameUserId: string,
    gameUserData: Partial<GameUser>,
  ): Promise<GameUser> {
    const updatedGameUser = await this.gameUserModel
      .findByIdAndUpdate({ _id: gameUserId }, gameUserData, { new: true })
      .exec();

    return updatedGameUser;
  }

  /**
   * Soft delete a game user from the database.
   * @param gameUserId The ID of the game user to delete.
   * @returns A Promise that resolves to the soft deleted game user object.
   */
  public async deleteGameUser(gameUserId: string): Promise<GameUser> {
    const deletedGameUser = await this.gameUserModel
      .findByIdAndUpdate(
        { _id: gameUserId },
        {
          is_deleted: true,
          deleted_at: new Date(),
        },
        { new: true },
      )
      .exec();

    return deletedGameUser;
  }

  /**
   * Retrieve all game users from the database that are not soft deleted.
   * @returns A Promise that resolves to an array of game users.
   */
  public async getAllGameUsers(): Promise<GameUser[]> {
    const gameUsers = await this.gameUserModel
      .find({ is_deleted: false })
      .exec();
    return gameUsers;
  }

  /**
   * Find a game user by its ID in the database (ignoring soft deleted).
   * @param gameUserId The ID of the game user.
   * @returns A Promise that resolves to the game user object.
   */
  public async findGameUserById(gameUserId: string): Promise<GameUser> {
    const gameUser = await this.gameUserModel
      .findOne({ _id: gameUserId, is_deleted: false })
      .exec();

    return gameUser;
  }
}
