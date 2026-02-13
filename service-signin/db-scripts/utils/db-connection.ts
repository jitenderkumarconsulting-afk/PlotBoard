// import { MongoClient, MongoClientOptions } from 'mongodb';
// import { Logger } from '@nestjs/common';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from the .env file

// const logger = new Logger('Database');

// export async function connectToDatabase(): Promise<MongoClient> {
//   logger.log('connectToDatabase');

//   try {
//     const connectionURI = process.env.MONGO_DB_URL; // Get the MONGO_DB_URL from the .env file
//     if (!connectionURI) {
//       throw new Error('MONGO_DB_URL is not set in the .env file');
//     }

//     const options: MongoClientOptions = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };

//     const client = new MongoClient(connectionURI, options);

//     await client.connect();
//     logger.log('connectToDatabase :: Connected to the database');

//     return client;
//   } catch (error) {
//     logger.error(
//       'connectToDatabase :: Failed to connect to the database',
//       error.stack,
//     );
//     process.exit(1);
//   }
// }
