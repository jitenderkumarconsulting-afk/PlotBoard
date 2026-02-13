import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

// Define the base options for the schema, including timestamps configuration
const baseOptions: SchemaOptions = {};

@Schema(baseOptions)
export class BaseSchema extends Document {
  // This is the base schema class that can be extended by other schemas to inherit properties and functionality.

  // IsDeleted field
  @Prop({
    name: 'is_deleted', // Map the field name to 'is_deleted' in the database
    type: SchemaTypes.Boolean, // Define the field type as Boolean
    default: false, // Default to false, indicating the document is not deleted
  })
  is_deleted: boolean; // Define the field type in the class

  // DeletedAt field
  @Prop({
    name: 'deleted_at', // Map the field name to 'deleted_at' in the database. This is a new field to store the date when the document was soft deleted.
    type: SchemaTypes.Date, // Define the field type as Date
    default: null, // Default to null, indicating the document is not deleted
  })
  deleted_at: Date;
}

export default BaseSchema;
