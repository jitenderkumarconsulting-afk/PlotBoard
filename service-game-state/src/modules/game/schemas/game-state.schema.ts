import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import BaseSchema from '../../../shared/schemas/base.schema';

// Define the type for the GameStateDocument
export type GameStateDocument = HydratedDocument<GameState>;

@Schema({
  collection: 'game_states', // Map the collection name to 'game_states' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class GameState extends BaseSchema {
  // Game ID field
  @Prop({
    name: 'game_id', // Map the field name to 'game_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'Game', // Reference the 'Game' model
    required: [true, 'Game ID is required.'], // Game ID is a required field
  })
  game_id: string; // Define the field type in the class

  // Play URL Code field
  @Prop({
    name: 'game_token', // Map the field name to 'play_url_code' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Play URL code is required.'], // Play URL code is a required field
    unique: true, // Play URL code must be unique
    validate: {
      validator: (value: string) => /^[a-zA-Z0-9]+$/.test(value), // Validation regular expression allowing alphanumeric characters only
      message: 'Play URL code can only contain alphanumeric characters.', // Validation error message for invalid play URL code format
    },
    minlength: [50, 'Play URL code must be at least 50 character long.'], // Play URL code must have a minimum length of 50 characters
    maxlength: [50, 'Play URL code cannot exceed 50 characters.'], // Play URL code cannot exceed a length of 50 characters
  })
  game_token: string; // Define the field type in the class

  // Game State Script field (JSON data)
  @Prop({
    name: 'game_state_script', // Map the field name to 'game_state_script' in the database
    type: SchemaTypes.Mixed, // Store game_state_script with a mixed data type to store JSON object data
    required: [true, 'Game state script is required.'], // Game state script is a required field
    default: {}, // Default value is an empty JSON object
    validate: {
      validator: (value: any) => {
        // Check if the value is a valid JSON object
        return typeof value === 'object';
      },
      message: 'Game state script must be a valid JSON object.', // Validation error message for an invalid JSON object
    },
  })
  game_state_script: Record<string, any>; // Define the field type in the class
}

export const GameStateSchema = SchemaFactory.createForClass(GameState); // Create the schema based on the GameState class

// Define a unique index for the 'play_url_code' field
GameStateSchema.index(
  { game_token: 1 }, // Index the 'play_url_code' field in ascending order
  {
    name: 'game_state_unique_game_token_idx', // Name the index 'game_state_unique_play_url_code_idx' for better readability and manageability
    unique: true, // Enforce uniqueness constraint on the 'play_url_code' field
    partialFilterExpression: { is_deleted: false }, // Index only non-deleted documents
  },
);
