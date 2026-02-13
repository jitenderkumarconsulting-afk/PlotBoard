import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { MailService } from './services/mail.service';
import { AuditMailSchema } from './schemas/audit-mail.schema';
import { AuditMailRepository } from './repositories/audit-mail.repository';
import { SendGridService } from '../../shared/services/send-grid.service';
import { MailBuilder } from './builders/mail.builder';

@Module({
  imports: [
    // Configure the ConfigModule with root method for environment variable management
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to the .env file
    }),

    // Import the AuditMail model from Mongoose
    MongooseModule.forFeature([{ name: 'AuditMail', schema: AuditMailSchema }]),
  ],

  // Declare the controllers for the module
  controllers: [],

  // Declare the providers for the module
  providers: [
    MailService,
    MailBuilder,
    Logger,
    AuditMailRepository,
    SendGridService,
  ],

  // Expose the providers to be used by other modules
  exports: [MailService],
})
export class MailModule {}
