import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { GameUserRole } from '../enums/game-user-role.enum';
import BaseSchema from '../../../shared/schemas/base.schema';

// Define the type for the GameUserDocument
export type GameUserDocument = HydratedDocument<GameUser>;

@Schema({
  collection: 'game_users', // Map the collection name to 'game_users' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class GameUser extends BaseSchema {
  // UserId field
  @Prop({
    name: 'user_id', // Map the field name to 'user_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'User', // Reference the 'User' model
    required: [true, 'User ID is required.'], // User ID is a required field
  })
  user_id: string; // Define the field type in the class

  // GameId field
  @Prop({
    name: 'game_id', // Map the field name to 'game_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'Game', // Reference the 'Game' model
    required: [true, 'Game ID is required.'], // Game ID is a required field
  })
  game_id: string; // Define the field type in the class

  // Role field with enum validation
  @Prop({
    name: 'role', // Map the field name to 'role' in the database
    type: String, // Define the field type as String
    enum: Object.values(GameUserRole), // Use Object.values to extract all enum values
    required: [true, 'Role is required.'], // Role is a required field
  })
  role: GameUserRole; // Define the field type in the class
}

export const GameUserSchema = SchemaFactory.createForClass(GameUser); // Create the schema based on the GameUser class

// Define a unique compound index for the combination of 'user_id', 'game_id', and 'is_deleted' fields
GameUserSchema.index(
  { user_id: 1, game_id: 1 }, // Define the fields to create the compound index on (user_id and game_id)
  {
    name: 'game_user_unique_user_id_game_id_idx', // Name the index 'game_user_unique_user_id_game_id_idx' for better readability and manageability
    unique: true, // Ensure uniqueness of the combination of user_id and game_id
    partialFilterExpression: { is_deleted: false }, // Apply the index only to non-deleted documents (is_deleted: false)
  },
);
