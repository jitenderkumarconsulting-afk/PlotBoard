import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { AuthBuilder } from '../builders/auth.builder';
import { User } from '../../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService, // Inject UserService
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly authBuilder: AuthBuilder, // Inject AuthBuilder
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * Validates the user's email and password during the authentication process.
   * @param email The user's email
   * @param password The user's password
   * @returns A Promise that resolves to the authenticated user or null if not found or invalid credentials
   * @throws UnauthorizedException if the email or password is invalid
   */
  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    this.logger.log(`validateUser :: email - ${email}`);

    // Retrieve the user from the userService based on the email
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      this.logger.error(`validateUser :: User not found`);
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Compare the provided password with the user's hashed password
    const isPasswordValid = await this.authBuilder.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.error(`validateUser :: Password invalid`);
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }
}
