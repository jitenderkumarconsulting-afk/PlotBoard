import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuditMail } from '../interfaces/audit-mail.interface';

@Injectable()
export class AuditMailRepository {
  constructor(
    @InjectModel('AuditMail') private readonly auditMailModel: Model<AuditMail>,
  ) {}

  /**
   * Create a new audit mail in the database.
   * @param auditMailData The data for creating the audit mail.
   * @returns A Promise that resolves to the created audit mail object.
   */
  async createAuditMail(auditMailData: Partial<AuditMail>): Promise<AuditMail> {
    // Create a new Mongoose model instance using the provided data
    const auditMail = new this.auditMailModel(auditMailData);

    // Save the new audit mail to the database and return the result as a Promise
    return auditMail.save();
  }

  /**
   * Update an audit mail in the database.
   * @param auditMailId The ID of the audit mail to update.
   * @param auditMailData The data to update the audit mail.
   * @returns A Promise that resolves to the updated audit mail object.
   */
  async updateAuditMail(
    auditMailId: string,
    auditMailData: Partial<AuditMail>,
  ): Promise<AuditMail | null> {
    return this.auditMailModel
      .findByIdAndUpdate({ _id: auditMailId }, auditMailData, { new: true })
      .exec();
  }

  /**
   * Soft delete an audit mail from the database.
   * @param auditMailId The ID of the audit mail to delete.
   * @returns A Promise that resolves to the soft deleted audit mail object.
   */
  async deleteAuditMail(auditMailId: string): Promise<AuditMail | null> {
    // Find the user by its ID and mark it as deleted (soft delete)
    const deletedAuditMail = await this.auditMailModel
      .findByIdAndUpdate(
        { _id: auditMailId },
        {
          is_deleted: true, // Mark the game as soft deleted
          deleted_at: new Date(), // Set the timestamp for when the game was soft deleted
        },
        { new: true }, // Return the updated document
      )
      .exec();

    return deletedAuditMail;
  }

  /**
   * Retrieve all audit mails from the database that are not soft deleted.
   * @returns A Promise that resolves to an array of audit mails.
   */
  public async findAllAuditMails(): Promise<AuditMail[]> {
    // Find all audit mails in the database that are not soft deleted
    const auditMails = await this.auditMailModel
      .find({ is_deleted: false })
      .exec();

    return auditMails;
  }

  /**
   * Find all audit mails by their userID in the database (ignoring soft deleted).
   * @param userId The ID of the user.
   * @returns A Promise that resolves to an array of audit mails.
   */
  async findAuditMailsByUserId(userId: string): Promise<AuditMail[]> {
    // Find all audit mails by its user ID, excluding soft deleted games, and return it as a Promise
    const auditMails = await this.auditMailModel
      .find({ user_id: userId, is_deleted: false })
      .exec();

    return auditMails;
  }

  /**
   * Find an audit mail by their ID in the database (ignoring soft deleted).
   * @param auditMailId The ID of the audit mail.
   * @returns A Promise that resolves to the audit mail object.
   */
  async findAuditMailById(auditMailId: string): Promise<AuditMail> {
    // Find the audit mail by its ID, excluding soft deleted games, and return it as a Promise
    const auditMail = await this.auditMailModel
      .findOne({ _id: auditMailId, is_deleted: false })
      .exec();

    return auditMail;
  }
}
