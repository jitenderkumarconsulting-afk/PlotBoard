import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { BaseSchema } from 'src/shared/schemas/base.schema';

// Define the type for the UserDocument
export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users', // Map the collection name to 'users' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
}) // Decorator to define the schema for the User model
export class User extends BaseSchema {
  // Username field
  @Prop({
    name: 'username', // Map the field name to 'username' in the database
    type: SchemaTypes.String,
    required: [true, 'Username is required.'], // Username is a required field
    validate: {
      validator: (value: string) => /^[a-z0-9_.@\-]+$/.test(value), // Validation regular expression allowing lowercase alphanumeric characters, underscore, dot, hyphen, and "@" symbol
      message:
        'Username can only contain lowercase alphanumeric characters, underscore, dot, hyphen, and "@" symbol.', // Validation error message for invalid username format
    },
    minlength: [3, 'Username must be at least 3 characters long.'], // Username must have a minimum length of 3 characters
    maxlength: [50, 'Username cannot exceed 50 characters.'], // Username cannot exceed a length of 50 characters
  })
  username: string; // Define the field type in the class

  // Email field
  @Prop({
    name: 'email', // Map the field name to 'email' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Email is required.'], // Email is a required field
    lowercase: true, // Convert the value to lowercase before saving
    validate: {
      validator: (value: string) => /\S+@\S+\.\S+/.test(value), // Validate email format using a regular expression
      message: 'Invalid email format.', // Validation error message for invalid email format
    },
    minlength: [3, 'Email must be at least 3 characters long.'], // Email must have a minimum length of 3 characters
    maxlength: [50, 'Email cannot exceed 50 characters.'], // Email cannot exceed a length of 50 characters
  })
  email: string; // Define the field type in the class

  // Password field
  @Prop({
    name: 'password', // Map the field name to 'password' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Password is required.'], // Password is a required field
    minlength: [6, 'Password must be at least 6 characters long.'], // Password must have a minimum length of 6 characters
    maxlength: [256, 'Password cannot exceed 256 characters.'], // Password cannot exceed a length of 256 characters
  })
  password: string; // Define the field type in the class

  // Name field
  @Prop({
    name: 'name', // Map the field name to 'name' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Name is required.'], // Name is a required field
    validate: {
      validator: (value: string) => /^[a-zA-Z\s]+$/.test(value), // Validate name format using a regular expression
      message: 'Name can only contain alphabets and spaces.', // Validation error message for invalid name format
    },
    minlength: [1, 'Name must be at least 1 character long.'], // Name must have a minimum length of 1 character
    maxlength: [50, 'Name cannot exceed 50 characters.'], // Name cannot exceed a length of 50 characters
  })
  name: string; // Define the field type in the class

  // Phone field
  @Prop({
    name: 'phone', // Map the field name to 'phone' in the database
    type: SchemaTypes.String, // Define the field type as String
    validate: {
      validator: (value: string) => /^\+[1-9]\d{1,14}$/.test(value), // Validate phone number format using a regular expression
      message:
        'Invalid phone number format. Phone number must be in the format "+1234567890".', // Validation error message for invalid phone number format
    },
    maxlength: [15, 'Phone number cannot exceed 15 characters.'], // Phone number cannot exceed a length of 15 characters
  })
  phone: string; // Define the field type in the class

  // Country field
  @Prop({
    name: 'country', // Map the field name to 'country' in the database
    type: SchemaTypes.String, // Define the field type as String
    validate: {
      validator: (value: string) => /^[A-Za-z]+$/.test(value), // Validate country format using a regular expression
      message: 'Country can only contain alphabets.', // Validation error message for invalid country format
    },
    maxlength: [20, 'Country cannot exceed 20 characters.'], // Country cannot exceed a length of 20 characters
  })
  country: string; // Define the field type in the class
}

export const UserSchema = SchemaFactory.createForClass(User); // Create the schema based on the User class

// Define a unique index for the 'username' field
UserSchema.index(
  { username: 1 }, // Index the 'username' field in ascending order
  {
    name: 'user_unique_username_idx', // Name the index 'user_unique_username_idx' for better readability and manageability
    unique: true, // Enforce uniqueness constraint on the 'username' field
    partialFilterExpression: { is_deleted: false }, // Exclude soft-deleted documents from the uniqueness constraint
    collation: { locale: 'en', strength: 2 }, // Make the comparison case-insensitive by specifying collation with strength 2
  },
);

// Define a unique index for the 'email' field
UserSchema.index(
  { email: 1 }, // Index the 'email' field in ascending order
  {
    name: 'user_unique_email_idx', // Name the index 'user_unique_email_idx' for better readability and manageability
    unique: true, // Enforce uniqueness constraint on the 'email' field
    partialFilterExpression: { is_deleted: false }, // Exclude soft-deleted documents from the uniqueness constraint
    collation: { locale: 'en', strength: 2 }, // Make the comparison case-insensitive by specifying collation with strength 2
  },
);
