import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { UserModule } from '../modules/user/user.module';
import { GameModule } from '../modules/game/game.module';

@Module({
  imports: [
    // Configure the ConfigModule with root method for environment variable management
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to the .env file
    }),

    // Set up the MongoDB connection using MongooseModule
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_DB_URL'), // Retrieve the MONGO_DB_URL from the ConfigService
          useNewUrlParser: false, // Add any additional Mongoose options if required
        };
      },
      inject: [ConfigService], // Inject the ConfigService into the useFactory function
    }),

    // Import AuthModule for auth-related functionality
    AuthModule,

    // Import UserModule for user-related functionality
    UserModule,

    // Import GameModule for game-related functionality
    GameModule,
  ],

  // Declare the controllers for the module
  controllers: [AppController],

  // Declare the providers for the module
  providers: [AppService, Logger],
})
export class AppModule {}
