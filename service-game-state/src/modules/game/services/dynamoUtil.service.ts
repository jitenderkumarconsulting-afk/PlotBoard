import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import * as AWS from 'aws-sdk';
import { DynamoDBService } from 'src/shared/services/dynamodb.service';

@Injectable()
export class DynamoUtilService {
  private readonly dynamoDB: AWS.DynamoDB;
  constructor(
    @Inject(DynamoDBService) private readonly dynamoDBService: DynamoDBService,
  ) {
    this.dynamoDB = new AWS.DynamoDB();
  }

  async createItem(createItemDto: any): Promise<any> {
    console.log('createItemDto', JSON.stringify(createItemDto));
    const id = uuidv4();
    const dynamoDBClient: DocumentClient = this.dynamoDBService.getClient();
    const createItemObj = { id, ...createItemDto };
    console.log('createItemObj', JSON.stringify(createItemObj));
    await dynamoDBClient
      .put({
        TableName: 'game_states', // Your DynamoDB table name
        Item: createItemObj,
      })
      .promise();

    return { id, ...createItemDto };
  }

  async updateItem(updateItemDto: any): Promise<any> {
    console.log('updateItemDto', JSON.stringify(updateItemDto));
    const dynamoDBClient: DocumentClient = this.dynamoDBService.getClient();
    await dynamoDBClient
      .put({
        TableName: 'game_states', // Your DynamoDB table name
        Item: updateItemDto,
      })
      .promise();

    return { ...updateItemDto };
  }

  async findAllItems(): Promise<any[]> {
    const dynamoDBClient: DocumentClient = this.dynamoDBService.getClient();

    const result = await dynamoDBClient
      .scan({
        TableName: 'game_states',
      })
      .promise();

    return result.Items;
  }

  async findItemById(id: string): Promise<any> {
    const dynamoDBClient: DocumentClient = this.dynamoDBService.getClient();
    const result = await dynamoDBClient
      .get({
        TableName: 'game_states',
        Key: {
          game_token: id,
        },
      })
      .promise();

    return result.Item;
  }

  async deleteItem(id: string): Promise<void> {
    const dynamoDBClient: DocumentClient = this.dynamoDBService.getClient();
    await dynamoDBClient
      .delete({
        TableName: 'game_states',
        Key: { game_token: id },
      })
      .promise();
  }
}
