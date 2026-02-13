import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameState } from '../interfaces/game-state.interface';
import { DynamoUtilService } from '../services/dynamoUtil.service';

@Injectable()
export class GameStateRepository {
  constructor(
    @InjectModel('GameState') private readonly gameStateModel: Model<GameState>,
    private readonly dynamoUtilService: DynamoUtilService,
  ) {}

  /**
   * Create a new game state in the database.
   * @param gameStateData The data for creating the game state.
   * @returns A Promise that resolves to the created game state object.
   */
  public async createGameState(
    gameStateData: Partial<GameState>,
  ): Promise<GameState> {
    // Create a new game state document based on the provided data
    // const gameState = new this.gameStateModel(gameStateData);
    // // Save the newly created game state document to the database
    // return gameState.save();

    return this.dynamoUtilService.createItem(gameStateData);
  }

  public async updateGameState(
    gameStateData: Partial<GameState>,
  ): Promise<GameState> {
    return this.dynamoUtilService.updateItem(gameStateData);
  }

  /**
   * Find an active game state by game URL code in the database (excluding soft-deleted URLs).
   * @param urlCode The game URL code of the game state.
   * @returns A Promise that resolves to the active game state object.
   */
  public async findGameStateByGameUrlCode(urlCode: string): Promise<GameState> {
    // Find the game state in the database based on the game URL code, and exclude soft-deleted URLs
    // const gameState = await this.gameStateModel
    //   .findOne({
    //     url_code: urlCode,
    //     is_deleted: false,
    //   })
    //   .exec();

    // // Return the found game state (or null if not found)
    // return gameState;
    return this.dynamoUtilService.findItemById(urlCode);
  }
}
