import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

// Function to bootstrap the application
async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Retrieve the ConfigService instance
  const configService = app.get(ConfigService);

  // Inject the Logger instance
  const logger = app.get(Logger);

  // Configure the application
  configureApp(app, logger);

  // Set up Swagger documentation
  setupSwagger(app, configService, logger);

  // Start the server
  startServer(app, configService, logger);
}

// Function to configure the application
function configureApp(app: NestExpressApplication, logger: Logger): void {
  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Parse JSON and url-encoded bodies
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Apply validation pipe for request payload validation
  app.useGlobalPipes(new ValidationPipe());

  // Register the HttpExceptionFilter as a global filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Load environment variables from .env file
  config();

  // Log the application configuration
  logger.log('Application configuration completed');
}

// Function to set up Swagger documentation
function setupSwagger(
  app: NestExpressApplication,
  configService: ConfigService,
  logger: Logger,
): void {
  // Retrieve the required information from the configuration
  const appName = configService.get<string>('APP_NAME');
  const appVersion = process.env.npm_package_version;
  const contactName = configService.get<string>('SWAGGER_CONTACT_NAME');
  const contactUrl = configService.get<string>('SWAGGER_CONTACT_URL');
  const contactEmail = configService.get<string>('SWAGGER_CONTACT_EMAIL');

  // Create Swagger options
  const options = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(
      `This API provides endpoints for managing ${appName}, allowing users to perform sign in. It follows RESTful principles and uses JSON as the data exchange format.`,
    )
    .setVersion(appVersion)
    .setContact(contactName, contactUrl, contactEmail)
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     schema: 'bearer',
    //     bearerFormat: 'JWT',
    //   } as SecuritySchemeObject,
    //   'Bearer',
    // )
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, options);

  // Set up the Swagger UI endpoint
  SwaggerModule.setup('swagger-ui', app, document);

  // Log the Swagger setup
  const swaggerUrl = `http://localhost:${process.env.PORT || 7002}/swagger-ui`;
  logger.log(`Swagger documentation is available at ${swaggerUrl}`);
}

// Function to start the server
async function startServer(
  app: NestExpressApplication,
  configService: ConfigService,
  logger: Logger,
): Promise<void> {
  const appName = configService.get<string>('APP_NAME');
  const appVersion = process.env.npm_package_version;
  const port = process.env.PORT || 7002;

  // Start listening on the specified port
  await app.listen(port);

  // Log the server startup message
  const serverUrl = `http://localhost:${port}`;
  logger.log(`${appName} ${appVersion} server is running at ${serverUrl}`);
}

// Call the bootstrap function to start the application
bootstrap();
