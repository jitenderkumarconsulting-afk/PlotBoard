import { Binary } from 'bson';

import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { AuditMailStatus } from '../enums/audit-mail-status.enum';
import { AuditMailType } from '../enums/audit-mail-type.enum';

/**
 * Interface for the AuditMail model.
 */
export interface AuditMail extends BaseDocument {
  readonly user_id: string; // User ID associated with the email
  readonly recipient_email: string; // Email address to which email is sent
  readonly sender_email: string; // Email address from which email is sent
  readonly type: AuditMailType; // Type of the email
  readonly status: AuditMailStatus; // Status of the email
  readonly error_message?: Binary; // Optional field to store an error message in BSON format if the email status is "FAILURE"
}
