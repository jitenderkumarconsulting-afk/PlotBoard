import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

import { AuditMailStatus } from '../enums/audit-mail-status.enum';
import { AuditMailType } from '../enums/audit-mail-type.enum';
import { BaseSchema } from 'src/shared/schemas/base.schema';

// Define the type for the AuditMailDocument
export type AuditMailDocument = HydratedDocument<AuditMail>;

@Schema({
  collection: 'audit_mails', // Map the collection name to 'audit_mails' in the database
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
}) // Decorator to define the schema for the AuditMail model
export class AuditMail extends BaseSchema {
  // UserId field
  @Prop({
    name: 'user_id', // Map the field name to 'user_id' in the database
    type: SchemaTypes.ObjectId, // Define the field type as ObjectId
    ref: 'User', // Reference the 'User' model
    required: [true, 'User ID is required.'], // User ID is a required field
  })
  user_id: string; // Define the field type in the class

  // RecipientEmail field
  @Prop({
    name: 'recipient_email', // Map the field name to 'recipient_email' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Recipient email is required.'], // Recipient email is a required field
    validate: {
      validator: (value: string) => /\S+@\S+\.\S+/.test(value), // Validate email format using a regular expression
      message: 'Invalid email format.',
    },
    minlength: [3, 'Recipient email must be at least 3 characters long.'], // Recipient email must have a minimum length of 3 characters
    maxlength: [50, 'Recipient email cannot exceed 50 characters.'], // Recipient email cannot exceed a length of 50 characters
  })
  recipient_email: string; // Define the field type in the class

  // SenderEmail field
  @Prop({
    name: 'sender_email', // Map the field name to 'sender_email' in the database
    type: SchemaTypes.String, // Define the field type as String
    required: [true, 'Sender email is required.'], // Sender email is a required field
    validate: {
      validator: (value: string) => /\S+@\S+\.\S+/.test(value), // Validate email format using a regular expression
      message: 'Invalid email format.',
    },
    minlength: [3, 'Sender email must be at least 3 characters long.'], // Sender email must have a minimum length of 3 characters
    maxlength: [50, 'Sender email cannot exceed 50 characters.'], // Sender email cannot exceed a length of 50 characters
  })
  sender_email: string; // Define the field type in the class

  // Type field
  @Prop({
    name: 'type', // Map the field name to 'type' in the database
    type: SchemaTypes.String, // Define the field type as String
    enum: Object.values(AuditMailType), // Use Object.values to extract all enum values
    required: [true, 'Type is required.'], // Type is a required field
  })
  type: string; // Define the field type in the class

  // Status field
  @Prop({
    name: 'status', // Map the field name to 'status' in the database
    type: SchemaTypes.String, // Define the field type as String
    enum: Object.values(AuditMailStatus), // Use Object.values to extract all enum values
    required: [true, 'Status is required.'], // Status is a required field
  })
  status: string; // Define the field type in the class

  // ErrorMessage field
  @Prop({
    name: 'error_message', // Map the field name to 'error_message' in the database
    type: SchemaTypes.Mixed, // Store error_message with a mixed data type to store error_message in BSON format
  })
  error_message: string; // Define the field type in the class
}

export const AuditMailSchema = SchemaFactory.createForClass(AuditMail); // Create the schema based on the AuditMail class
