import { Injectable, Logger } from '@nestjs/common';

import { AuditMailStatus } from '../enums/audit-mail-status.enum';
import { AuditMailType } from '../enums/audit-mail-type.enum';
import { AuditMail } from '../interfaces/audit-mail.interface';

@Injectable()
export class MailBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(MailBuilder.name);
  }

  /**
   * Build the audit mail data object for creation.
   * @param userId The ID of the user
   * @param recipientEmail The recipient's email address
   * @param senderEmail The sender's email address
   * @param type The type of the audit mail
   * @param status The status of the audit mail
   * @returns The created audit mail request object
   */
  public buildCreateAuditMailData(
    userId: string,
    recipientEmail: string,
    senderEmail: string,
    type: AuditMailType,
    status: AuditMailStatus,
  ): Partial<AuditMail> {
    this.logger.log('buildAuditMailRequest');

    // Create the audit mail data object with the necessary data
    const auditMailData: Partial<AuditMail> = {
      user_id: userId,
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      type,
      status,
    };
    this.logger.log(
      `buildAuditMailRequest :: auditMailData - ${JSON.stringify(
        auditMailData,
      )}`,
    );

    return auditMailData;
  }
}
