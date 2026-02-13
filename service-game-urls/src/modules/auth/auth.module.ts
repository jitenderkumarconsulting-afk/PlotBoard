import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtStrategy } from '../../shared/strategies/jwt.strategy';
import { LocalStrategy } from '../../shared/strategies/local.strategy';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthBuilder } from './builders/auth.builder';

@Module({
  imports: [
    // Configure the ConfigModule with root method for environment variable management
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to the .env file
    }),

    // Import PassportModule for authentication and authorization
    PassportModule.register({
      defaultStrategy: 'jwt', // Set the default authentication strategy to 'jwt'
      property: 'user', // Map the authenticated user to the 'user' property of the request object
      session: true, // Enable session-based authentication
    }),

    // Configure JWT module asynchronously with dynamic options
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for dynamic configuration
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT secret from ConfigService
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'), // Get JWT expiration time from ConfigService
        },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),

    // Import UserModule for user-related functionality
    UserModule,
  ],

  // Declare the controllers for the module
  controllers: [],

  // Declare the providers for the module
  providers: [AuthService, AuthBuilder, Logger, LocalStrategy, JwtStrategy],

  // Expose the providers to be used by other modules
  exports: [],
})
export class AuthModule {}
