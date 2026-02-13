import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignInResponseDTO } from '../dtos/response/sign-in-response.dto';
import { UserBuilder } from 'src/modules/user/builders/user.builder';
import { UserResponseDTO } from 'src/modules/user/dtos/response/user-response.dto';

@Injectable()
export class AuthBuilder {
  private readonly logger: Logger;

  constructor(
    private readonly userBuilder: UserBuilder, // Inject UserBuilder
  ) {
    this.logger = new Logger(AuthBuilder.name);
  }

  /**
   * Hashes a password using bcrypt.
   * @param password The plain password to hash.
   * @returns A Promise that resolves to the hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    this.logger.log('hashPassword');

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt();

    // Hash the password using bcrypt and the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
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

  /**
   * Builds a SignInResponseDTO object with the provided access token and user data.
   * @param accessToken The access token.
   * @param userResponse The user response data to be included in the SignInResponseDTO.
   * @returns The constructed SignInResponseDTO object.
   */
  public buildSignInResponse(
    accessToken: string,
    userResponse: UserResponseDTO,
  ): SignInResponseDTO {
    this.logger.log('buildSignInResponse');

    // Create a SignInResponseDTO object with the access token and user response
    const signInResponse: SignInResponseDTO = {
      access_token: accessToken,
      user: userResponse,
    };
    this.logger.log(
      `buildSignInResponse :: signInResponse - ${JSON.stringify(
        signInResponse,
      )}`,
    );

    // Return the constructed SignInResponseDTO object
    return signInResponse;
  }
}
