import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendGridService {
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService, // Inject ConfigService to access environment variables
  ) {
    this.logger = new Logger(SendGridService.name);

    // Initialize the SendGrid client with the API key retrieved from the environment variables
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  /**
   * Sends an email using the SendGrid service.
   * @param senderEmail The sender's email address
   * @param recipientEmail The recipient's email address
   * @param subject The email subject
   * @param text The plain text version of the email content
   * @param html The HTML version of the email content
   */
  public async sendEmail(
    senderEmail: string,
    recipientEmail: string,
    subject: string,
    text: string,
    html: string,
  ) {
    this.logger.log(
      `sendEmail :: recipientEmail - ${recipientEmail}, subject - ${subject}`,
    );

    // Construct the message object with the necessary details
    const msg = {
      to: recipientEmail, // Recipient's email address
      from: senderEmail, // Sender's email address
      subject: subject, // Email subject
      text: text, // Plain text version of the email content
      html: html, // HTML version of the email content
    };

    try {
      // Use the SendGrid client to send the email
      await sgMail.send(msg);
      this.logger.log(`sendEmail :: sent successfully`);
    } catch (error) {
      // If an error occurs during email sending, log the error
      this.logger.error(`sendEmail :: error - ${JSON.stringify(error)}`);
    }
  }
}
