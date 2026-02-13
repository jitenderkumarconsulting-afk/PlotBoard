import { Document } from 'mongoose';

export interface BaseDocument extends Document {
  readonly created_at: Date; // Date when the entry was created
  readonly updated_at: Date; // Date when the entry was updated
  readonly is_deleted: boolean; // Flag to mark the document as deleted (soft delete)
  readonly deleted_at: Date; // Date when the document was soft deleted
}
