import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { User } from '../../user/interfaces/user.interface';
import { AuthBuilder } from '../builders/auth.builder';
import { SignInResponseDTO } from '../dtos/response/sign-in-response.dto';
import { UserResponseDTO } from '../../../modules/user/dtos/response/user-response.dto';
import { UserBuilder } from '../../../modules/user/builders/user.builder';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService, // Inject UserService
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly authBuilder: AuthBuilder, // Inject AuthBuilder
    private readonly userBuilder: UserBuilder, // Inject UserBuilder
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
   * Handles the sign-in process for a user.
   * @param user The authenticated user object
   * @returns An object containing the access token and user information
   */
  public async signIn(user: User): Promise<SignInResponseDTO> {
    this.logger.log(`signIn :: user - ${user}`);

    // Generate the JWT access token
    const accessToken = await this.generateJwtToken(user);

    // Get the user information for the response
    const userResponse = this.userService.getUserInfo(user);

    // Prepare the user response DTO using the AuthBuilder class
    const signInResponse = this.authBuilder.buildSignInResponse(
      accessToken,
      userResponse,
    );
    this.logger.log(
      `signIn :: signInResponse - ${JSON.stringify(signInResponse)}`,
    );

    return signInResponse;
  }
}
