import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../../modules/auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger;

  constructor(private readonly authService: AuthService) {
    // Call the constructor of the PassportStrategy class with the 'Strategy' parameter
    super({ usernameField: 'email' });

    // Create an instance of the Logger to log messages
    this.logger = new Logger(LocalStrategy.name);
  }

  /**
   * Validate the user's email and password during the authentication process.
   * @param email The user's email
   * @param password The user's password
   * @returns A Promise that resolves to the authenticated user
   * @throws UnauthorizedException if the user is not authenticated
   */
  public async validate(email: string, password: string): Promise<any> {
    // Log the validation process with the provided email
    this.logger.log(`validate :: email - ${email}`);

    // Call the 'validateUser' method of the 'authService' to validate the user
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      // Throw an UnauthorizedException if the user is not authenticated
      throw new UnauthorizedException('User is not authenticated.');
    }

    // Return the validated user
    return user;
  }
}
