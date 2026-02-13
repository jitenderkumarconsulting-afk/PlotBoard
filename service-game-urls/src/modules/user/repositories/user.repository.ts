import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * Create a new user in the database.
   * @param userData The data for creating the user.
   * @returns A Promise that resolves to the created user object.
   */
  public async createUser(userData: Partial<User>): Promise<User> {
    // Create a new Mongoose model instance using the provided data
    const user = new this.userModel(userData);

    // Save the new user to the database and return the result as a Promise
    return user.save();
  }

  /**
   * Update a user in the database.
   * @param userId The ID of the user to update.
   * @param userData The data to update the user.
   * @returns A Promise that resolves to the updated user object.
   */
  public async updateUser(
    userId: string,
    userData: Partial<User>,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate({ _id: userId }, userData, { new: true })
      .exec();
  }

  /**
   * Soft delete a user from the database.
   * @param userId The ID of the user to delete.
   * @returns A Promise that resolves to the soft deleted user object.
   */
  public async deleteUser(userId: string): Promise<User> {
    // Find the user by its ID and mark it as deleted (soft delete)
    const deletedUser = await this.userModel
      .findByIdAndUpdate(
        { _id: userId },
        {
          is_deleted: true, // Mark the game as soft deleted
          deleted_at: new Date(), // Set the timestamp for when the game was soft deleted
        },
        { new: true }, // Return the updated document
      )
      .exec();

    return deletedUser;
  }

  /**
   * Retrieve all users from the database that are not soft deleted.
   * @returns A Promise that resolves to an array of users.
   */
  public async findAllUsers(): Promise<User[]> {
    // Find all users in the database that are not soft deleted
    const users = await this.userModel.find({ is_deleted: false }).exec();

    return users;
  }

  /**
   * Find a user by their ID in the database (ignoring soft deleted).
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the user object.
   */
  public async findUserById(userId: string): Promise<User> {
    // Find the user by its ID, excluding soft deleted games, and return it as a Promise
    const user = await this.userModel
      .findOne({ _id: userId, is_deleted: false })
      .exec();

    return user;
  }

  /**
   * Find a user by their username in the database (ignoring soft deleted).
   * @param username The username of the user.
   * @returns A Promise that resolves to the user object.
   */
  public async findUserByUsername(username: string): Promise<User> {
    // Find the user by its username, and excluding soft deleted games, and return it as a Promise
    const user = await this.userModel
      .findOne({
        username,
        is_deleted: false,
      })
      .exec();

    return user;
  }

  /**
   * Find a user by their email in the database (ignoring soft deleted).
   * @param email The email of the user.
   * @returns A Promise that resolves to the user object.
   */
  public async findUserByEmail(email: string): Promise<User> {
    // Find the user by its email, and excluding soft deleted games, and return it as a Promise
    const user = await this.userModel
      .findOne({
        email,
        is_deleted: false,
      })
      .exec();

    return user;
  }

  /**
   * Find a user by their ID and email in the database (ignoring soft deleted).
   * @param userId The ID of the user.
   * @param email The email of the user.
   * @returns A Promise that resolves to the user object.
   */
  public async findUserByIdAndEmail(
    userId: string,
    email: string,
  ): Promise<User> {
    // Find the user by its ID, email, and excluding soft deleted games, and return it as a Promise
    const user = await this.userModel
      .findOne({
        _id: userId,
        email,
        is_deleted: false,
      })
      .exec();

    return user;
  }

  /**
   * Find user IDs by their IDs in the database (ignoring soft deleted).
   * @param userIds An array of user IDs.
   * @returns A Promise that resolves to an array of user IDs.
   */
  public async findUserIdsByIds(userIds: string[]): Promise<string[]> {
    // Find user IDs by their IDs, excluding soft deleted users, and return them as a Promise
    const users = await this.userModel
      .find({
        _id: { $in: userIds },
        is_deleted: false,
      })
      .select('_id')
      .exec();

    return users.map((user) => user._id.toString());
  }
}
