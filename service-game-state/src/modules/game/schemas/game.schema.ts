import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import BaseSchema from '../../../shared/schemas/base.schema';
import { GameVisibility } from '../enums/game-visibility.enum';

// Define the type for the GameDocument
export type GameDocument = HydratedDocument<Game>;

@Schema({
  collection: 'games', // Map the collection name to 'games' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class Game extends BaseSchema {
  // UserId field
  @Prop({
    name: 'user_id', // Map the field name to 'user_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'User', // Reference the 'User' model
    required: [true, 'User ID is required.'], // User ID is a required field
  })
  user_id: string; // Define the field type in the class

  // Name field
  @Prop({
    name: 'name', // Map the field name to 'name' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Name is required.'], // Name is a required field
    minlength: [1, 'Name must be at least 1 character long.'], // Name must have a minimum length of 1 character
    maxlength: [50, 'Name cannot exceed 50 characters.'], // Name cannot exceed a length of 50 characters
  })
  name: string; // Define the field type in the class

  // Description field
  @Prop({
    name: 'description', // Map the field name to 'description' in the database
    type: SchemaTypes.String, // Define the field type as String
    maxlength: [500, 'Description cannot exceed 500 characters.'], // Description cannot exceed a length of 500 characters
  })
  description: string; // Define the field type in the class

  // OriginalImageUrl field
  @Prop({
    name: 'original_image_url', // Map the field name to 'original_image_url' in the database
    type: SchemaTypes.String, // Define the field type as String
    validate: {
      validator: (value: string) => {
        const imageRegex = /\.(png|jpe?g|gif|bmp|webp|svg)$/i; // Validate original image url format using a regular expression to check if the URL points to an image resource
        return imageRegex.test(value);
      },
      message: 'Original image URL must point to a valid image resource.', // Validation error message for invalid original image URL
    },
    maxlength: [256, 'Original image URL cannot exceed 256 characters.'], // Original image cannot exceed a length of 256 characters
  })
  original_image_url: string; // Define the field type in the class

  // ThumbnailImageUrl field
  @Prop({
    name: 'thumbnail_image_url', // Map the field name to 'thumbnail_image_url' in the database
    type: SchemaTypes.String, // Define the field type as String
    validate: {
      validator: (value: string) => {
        const imageRegex = /\.(png|jpe?g|gif|bmp|webp|svg)$/i; // Validate thumbnail image url format using a regular expression to check if the URL points to an image resource
        return imageRegex.test(value);
      },
      message: 'Thumbnail image URL must point to a valid image resource.', // Validation error message for invalid thumbnail image URL
    },
    maxlength: [256, 'Thumbnail image URL cannot exceed 256 characters.'], // Thumbnail image cannot exceed a length of 256 characters
  })
  thumbnail_image_url: string; // Define the field type in the class

  // Game Script field (JSON data)
  @Prop({
    name: 'game_script', // Map the field name to 'game_script' in the database
    type: SchemaTypes.Mixed, // Store game_script with a mixed data type to store JSON object data
    required: [true, 'Game script is required.'], // Game script is a required field
    default: {}, // Default value is an empty JSON object
    validate: {
      validator: (value: any) => {
        // Check if the value is a valid JSON object
        return typeof value === 'object';
      },
      message: 'Game script must be a valid JSON object.', // Validation error message for invalid JSON object
    },
  })
  game_script: Record<string, any>; // Define the field type in the class

  // Visibility field
  @Prop({
    name: 'visibility', // Map the field name to 'visibility' in the database
    type: String, // Define the field type as String (enum)
    enum: Object.values(GameVisibility), // Use Object.values to extract all enum values
    required: [true, 'Visibility is required.'], // Visibility is a required field
    default: GameVisibility.PUBLIC, // Default value is 'PUBLIC' (game is public)
  })
  visibility: GameVisibility; // Define the field type in the class
}

// Create the schema based on the Game class
export const GameSchema = SchemaFactory.createForClass(Game);

// Define a unique compound index for the combination of 'name', 'user_id', and 'is_deleted' fields
GameSchema.index(
  { name: 1, user_id: 1 }, // Index the 'name' and 'user_id' fields in ascending order
  {
    name: 'game_unique_name_user_id_idx', // Name the index 'game_unique_name_user_id_idx' for better readability and manageability
    unique: true, // Ensures that the combination of 'name' and 'user_id' is unique in the collection
    partialFilterExpression: { is_deleted: false }, // Index only non-deleted documents
    collation: { locale: 'en', strength: 2 }, // Makes the index case-insensitive for the 'name' field
  },
);
