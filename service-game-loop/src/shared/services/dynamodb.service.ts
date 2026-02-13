import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

@Injectable()
export class DynamoDBService {
  private readonly dynamoDBClient: DocumentClient;

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
  ) {
    AWS.config.update({
      region: this.configService.get('DYNAMO_DB_REGION'), // DynamoDB region
      accessKeyId: this.configService.get('DYNAMO_DB_ACCESS_KEY_ID'), // DynamoDB access key id
      secretAccessKey: this.configService.get('DYNAMO_DB_SECRET_ACCESS_KEY'), // DynamoDB secret access key
    });
    this.dynamoDBClient = new AWS.DynamoDB.DocumentClient({
      endpoint: this.configService.get('DYNAMO_DB_URL'), // DynamoDB connection URL
    });
  }

  getClient(): DocumentClient {
    return this.dynamoDBClient;
  }
}
