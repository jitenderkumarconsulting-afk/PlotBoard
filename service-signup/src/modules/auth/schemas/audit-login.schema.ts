import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { AuditLoginStatus } from '../enums/audit-login-status.enum';
import { BaseSchema } from 'src/shared/schemas/base.schema';

// Define the type for the AuditLoginDocument
export type AuditLoginDocument = HydratedDocument<AuditLogin>;

@Schema({
  collection: 'audit_logins', // Map the collection name to 'audit_logins' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
}) // Decorator to define the schema for the AuditLogin model
export class AuditLogin extends BaseSchema {
  // userId field
  @Prop({
    name: 'user_id', // Map the field name to 'user_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'User', // Reference the 'User' model
    required: false, // Make the field optional
  })
  userId: string; // Define the field type in the class

  // Email field
  @Prop({
    name: 'email', // Map the field name to 'email' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Email is required.'], // Email is a required field
    minlength: [3, 'Email must be at least 3 characters long.'], // Email must have a minimum length of 3 characters
    maxlength: [50, 'Email cannot exceed 50 characters.'], // Email cannot exceed a length of 50 characters
  })
  email: string; // Define the field type in the class

  // Status field
  @Prop({
    name: 'status', // Map the field name to 'status' in the database
    type: SchemaTypes.String, // Define the field type as String
    enum: Object.values(AuditLoginStatus), // Use Object.values to extract all enum values
    required: [true, 'Status is required.'], // Status is a required field
  })
  status: string; // Define the field type in the class

  // IPAddress field
  @Prop({
    name: 'ip_address', // Map the field name to 'ip_address' in the database
    type: SchemaTypes.String, // Define the field type as String
  })
  ip_address: string; // Define the field type in the class

  // LoginAttempts field
  @Prop({
    name: 'login_attempts', // Map the field name to 'login_attempts' in the database
    type: SchemaTypes.Number, // Define the field type as Number
    default: 0, // Default value of login_attempts is 0
  })
  login_attempts: number; // Define the field type in the class
}

export const AuditLoginSchema = SchemaFactory.createForClass(AuditLogin); // Create the schema based on the AuditLogin class
