import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { AuthBuilder } from '../builders/auth.builder';
import { User } from '../../user/interfaces/user.interface';
import { RefreshTokenResponseDTO } from '../dtos/response/refresh-token-response.dto';

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

  /**
   * Generates a JWT access token for the authenticated user.
   * @param user The authenticated user object
   * @returns A Promise that resolves to the JWT access token
   */
  private async generateJwtToken(user: User): Promise<string> {
    this.logger.log(`generateJwtToken :: user - ${JSON.stringify(user)}`);

    // Create the payload for the JWT token
    const payload = { email: user.email, sub: user.id, name: user.name };

    // Sign the JWT token with the payload
    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }

  /**
   * Handles the refresh token process for a user.
   * @param user The authenticated user object
   * @returns An object containing the new access token
   */
  public async refreshToken(user: User): Promise<RefreshTokenResponseDTO> {
    this.logger.log(`refreshToken :: user - ${JSON.stringify(user)}`);

    // Generate the JWT access token
    const accessToken = await this.generateJwtToken(user);

    // Prepare the response DTO
    const refreshTokenResponse: RefreshTokenResponseDTO = {
      access_token: accessToken,
    };

    return refreshTokenResponse;
  }
}
