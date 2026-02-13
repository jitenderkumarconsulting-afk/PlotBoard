# SampleApp

[SampleApp](http://plotboard.com) Service-Create-Game

## Description

The Service-Create-Game is a micro-service API that facilitates the creation of new games for the SampleApp project. It is an integral part of the SampleApp platform, which aims to provide an immersive gaming experience to its users. The micro-service is built using the NestJS framework, a progressive Node.js framework that offers a modular architecture and promotes code reusability.

With the Service-Create-Game micro-service, users can easily create new games and set up their unique gaming experiences. It leverages MongoDB, a popular NoSQL database, to efficiently store and retrieve game-related data, ensuring high performance and scalability.

## Tech Stack

The Service-Create-Game micro-service utilizes the following technologies:

- **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications. It provides a modular architecture that helps in organizing the codebase and promotes code reusability.
- **MongoDB:** A popular NoSQL database for storing and retrieving data efficiently. It offers high performance, scalability, and flexibility, making it suitable for handling user data in the SampleApp platform.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a higher-level abstraction for working with MongoDB and simplifies tasks such as defining schemas, performing database operations, and handling relationships between data models.
- **Docker:** A containerization platform that allows packaging applications and their dependencies into portable containers. It provides a consistent environment for running the micro-service across different environments.
- **Docker Compose:** A tool for defining and running multi-container Docker applications. It allows defining the micro-service and its dependencies in a YAML file and starting them with a single command.
- **Swagger:** Swagger UI is integrated to provide a comprehensive documentation of the API endpoints. It allows developers to explore and test the API, making it easier to understand and consume the micro-service.
- **Passport:** A flexible authentication middleware for Node.js that supports various authentication strategies, including local authentication, OAuth, and JWT. It simplifies the implementation of authentication in the micro-service.
- **JWT:** JSON Web Tokens are used for secure authentication and authorization. JWTs are generated upon successful user signup or signin and are used to verify the authenticity of API requests.

## Installation

To install and run the SampleApp Service-Create-Game micro-service locally, follow these steps:

1. Install NVM (Node Version Manager):
   - Visit the [NVM for Windows repository on GitHub](https://github.com/coreybutler/nvm-windows).
   - Scroll down to the "Installation & Upgrades" section.
   - Download the latest installer for NVM for Windows (nvm-setup.zip).
   - Extract the contents of the downloaded zip file to a directory of your choice, e.g., `C:\nvm`.

2. Install Node.js:
   - Open a Command Prompt or PowerShell window.
   - Navigate to the directory where you extracted NVM in the previous step (e.g., `C:\nvm`).
   - Run the following command to install Node.js version 16.0.0:

     ```bash
     nvm install 16.0.0
     ```

   - After the installation is complete, you can verify that Node.js has been installed successfully by running the following command:

     ```bash
     node -v
     ```

     It should display the installed Node.js version, which should be 16.0.0.

3. Install the Nest CLI (Command Line Interface):

   Open your terminal or command prompt and run the following command to install the Nest CLI globally:

   ```bash
   $ npm install -g @nestjs/cli
   ```

4. Install Git:
   - Visit the official Git website.
   - Download the appropriate installer for your operating system.
   - Follow the installation instructions to install Git on your system.

5. Clone the repository:

   ```bash
   $ git clone https://github.com/ned-plotboard/service-create-game.git
   ```

6. Install the dependencies:

   ```bash
   $ cd service-create-game
   $ npm install
   ```

7. Set up the environment variables:

   Copy the **`.env.example`** file and rename to **`.env`** and update the values as per your environment. The **`.env`** file contains configuration options such as the database connection URL, JWT secret key, and other environment-specific variables.

8. Install MongoDB:
   - Visit the [official MongoDB website](https://www.mongodb.com/try/download/community).
   - Download the appropriate installer for your operating system.
   - Follow the installation instructions to install MongoDB on your system.

9. Set up the MongoDB database:

   Create a MongoDB database and update the **`MONGO_DB_URL`** value in the **`.env`** file with the connection string. Make sure the database is running and accessible.

## Running the app

To start the Service-Create-Game micro-service, run the following command:

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

By default, the micro-service will start on port 7004. You can access the API endpoints using the base URL: **http://localhost:7004**.

## Test

To run the tests for the Service-Create-Game micro-service, use the following command:

```bash
# Run unit tests
$ npm run test

# Run e2e tests
$ npm run test:e2e

# Generate test coverage
$ npm run test:cov
```

This will execute unit tests, end-to-end tests, and generate test coverage reports to ensure the reliability of the micro-service.

## Usage

The Service-Create-Game micro-service provides the following endpoints:

- **POST /games:** Create a new game.

Refer to the [Swagger UI](http://localhost:7004/swagger-ui) documentation for detailed information on the request and response payloads of each endpoint. The Swagger UI provides an interactive interface to explore and test the API endpoints.

## Authentication

The Service-Create-Game micro-service uses JWT (JSON Web Tokens) for authentication. When a user signs in, an access token is generated and returned in the response. This token should be included in the **`Authorization`** header of subsequent requests as a bearer token.

To access protected routes, include the access token in the request header as follows:

```bash
Authorization: Bearer <access_token>
```

The micro-service uses the Passport library to handle authentication. It supports multiple authentication strategies, including local authentication (email and password) and JWT authentication.

## Error Handling

The Service-Create-Game micro-service follows a consistent error handling approach. In case of errors, the API will return a JSON response with the appropriate HTTP status code and an error message indicating the reason for the failure. Error responses include meaningful error codes and messages to help with debugging and troubleshooting.

Feel free to customize this README.md file to include any additional information specific to the project.
