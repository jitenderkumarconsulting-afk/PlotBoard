import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendGridService } from '../../../shared/services/send-grid.service';
import { AuditMailRepository } from '../repositories/audit-mail.repository';
import { AuditMailStatus } from '../enums/audit-mail-status.enum';
import { MailBuilder } from '../builders/mail.builder';
import { AuditMailType } from '../enums/audit-mail-type.enum';

@Injectable()
export class MailService {
  private readonly logger: Logger;
  private readonly senderEmail: string;

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
    private readonly auditMailRepository: AuditMailRepository, // Inject AuditMailRepository
    private readonly mailBuilder: MailBuilder, // Inject MailBuilder
    private readonly sendGridService: SendGridService, // Inject SendGridService
  ) {
    this.logger = new Logger(MailService.name);

    // Get the sender email from the environment variables
    this.senderEmail = this.configService.get('SENDER_EMAIL');
  }

  /**
   * Sends a registration email to the specified email address.
   * @param userId The ID of the user
   * @param email The recipient's email address
   */
  public async sendRegistrationEmail(userId: string, email: string) {
    this.logger.log(
      `sendRegistrationEmail :: userId - ${userId}, email - ${email}`,
    );

    let mailStatus = AuditMailStatus.PENDING;

    try {
      // Send the registration email using the SendGridService
      await this.sendGridService.sendEmail(
        this.senderEmail,
        email,
        'Registration Successful',
        'Thank you for registering! Your account has been successfully created.',
        '<p>Thank you for registering! Your account has been successfully created.</p>',
      );
      mailStatus = AuditMailStatus.SUCCESS;
    } catch (error) {
      this.logger.error(
        `sendRegistrationEmail :: error - ${JSON.stringify(error)}`,
      );
      mailStatus = AuditMailStatus.FAILURE;
    }

    // Create an audit mail entry for the sign-up process
    await this.createSignUpAuditMailEntry(userId, email, mailStatus);
  }

  /**
   * Creates an audit mail entry for the sign-up process.
   * @param userId The ID of the user
   * @param email The recipient's email address
   * @param mailStatus The status of the mail
   */
  public async createSignUpAuditMailEntry(
    userId: string,
    email: string,
    mailStatus: AuditMailStatus,
  ) {
    this.logger.log(
      `createSignUpAuditMailEntry :: userId - ${userId}, email - ${email}`,
    );

    // Create the audit mail data object
    const auditMailData = this.mailBuilder.buildCreateAuditMailData(
      userId,
      email,
      this.senderEmail,
      AuditMailType.SIGN_UP,
      mailStatus,
    );

    // Create an audit mail entry for the sign-up process
    await this.auditMailRepository.createAuditMail(auditMailData);
  }
}
