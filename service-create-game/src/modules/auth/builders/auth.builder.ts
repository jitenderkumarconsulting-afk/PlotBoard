import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(AuthBuilder.name);
  }

  /**
   * Compares a plain password with a hashed password.
   * @param plainPassword The plain password to compare.
   * @param hashedPassword The hashed password to compare against.
   * @returns A Promise that resolves to a boolean indicating whether the passwords match or not.
   */
  public async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    this.logger.log('comparePasswords');

    // Compare the plain password with the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(plainPassword, hashedPassword);
    this.logger.log(`comparePasswords :: isPasswordValid - ${isPasswordValid}`);

    return isPasswordValid;
  }
}
