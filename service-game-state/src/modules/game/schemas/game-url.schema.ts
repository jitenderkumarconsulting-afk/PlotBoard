import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { GameUrlType } from '../enums/game-url-type.enum';
import BaseSchema from '../../../shared/schemas/base.schema';

// Define the type for the GameUrlDocument
export type GameUrlDocument = HydratedDocument<GameUrl>;

@Schema({
  collection: 'game_urls', // Map the collection name to 'game_urls' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class GameUrl extends BaseSchema {
  // User ID field
  @Prop({
    name: 'user_id', // Map the field name to 'user_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'User', // Reference the 'User' model
    required: [true, 'User ID is required.'], // User ID is a required field
  })
  user_id: string; // Define the field type in the class

  // Game ID field
  @Prop({
    name: 'game_id', // Map the field name to 'game_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'Game', // Reference the 'Game' model
    required: [true, 'Game ID is required.'], // Game ID is a required field
  })
  game_id: string; // Define the field type in the class

  // URL Type field with enum validation
  @Prop({
    name: 'url_type', // Map the field name to 'url_type' in the database
    type: String, // Define the field type as String
    enum: Object.values(GameUrlType), // Use Object.values to extract all enum values
    required: [true, 'URL type is required.'], // URL type is a required field
  })
  url_type: GameUrlType; // Define the field type in the class

  // URL Code field
  @Prop({
    name: 'url_code', // Map the field name to 'url_code' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'URL code is required.'], // URL code is a required field
    unique: true, // URL code must be unique
    validate: {
      validator: (value: string) => /^[a-zA-Z0-9]+$/.test(value), // Validation regular expression allowing alphanumeric characters only
      message: 'URL code can only contain alphanumeric characters.', // Validation error message for invalid URL code format
    },
    minlength: [50, 'URL code must be at least 50 character long.'], // URL code must have a minimum length of 50 characters
    maxlength: [50, 'URL code cannot exceed 50 characters.'], // URL code cannot exceed a length of 50 characters
  })
  url_code: string; // Define the field type in the class

  // Shared with all users field
  @Prop({
    name: 'shared_with_all_users', // Map the field name to 'shared_with_all_users' in the database
    type: SchemaTypes.Boolean, // Define the field type as Boolean
    required: [true, 'Shared with all users is required.'], // Shared with all users is a required field
    default: false, // Default value is false
  })
  shared_with_all_users: boolean; // Define the field type in the class

  // Shared with User IDs field
  @Prop({
    name: 'shared_with_user_ids', // Map the field name to 'shared_with_user_ids' in the database
    type: [{ type: SchemaTypes.ObjectId, ref: 'User' }], // Define the field type as an array of ObjectIds referencing the 'User' model
    required: [true, 'Shared with User IDs are required.'], // Shared with User IDs is a required field
  })
  shared_with_user_ids: string[]; // Define the field type in the class

  // Expiration Date field
  @Prop({
    name: 'expiration_date', // Map the field name to 'expiration_date' in the database
    type: SchemaTypes.Date, // Define the field type as Date
    validate: {
      validator: function (value: Date) {
        return value.getTime() > Date.now(); // Validate that the expiration date is in the future
      },
      message: 'Expiration date must be in the future.', // Validation error message for past expiration date
    },
  })
  expiration_date?: Date; // Define the field type in the class
}

export const GameUrlSchema = SchemaFactory.createForClass(GameUrl); // Create the schema based on the GameUrl class

// Define a unique index for the 'url_code' field
GameUrlSchema.index(
  { url_code: 1 }, // Index the 'url_code' field in ascending order
  {
    name: 'game_url_unique_url_code_idx', // Name the index 'game_url_unique_url_code_idx' for better readability and manageability
    unique: true, // Enforce uniqueness constraint on the 'url_code' field
    partialFilterExpression: { is_deleted: false }, // Index only non-deleted documents
  },
);
