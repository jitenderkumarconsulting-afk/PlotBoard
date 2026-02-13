import { Injectable, Logger } from '@nestjs/common';

import { User } from '../../user/interfaces/user.interface';
import { SignUpRequestDTO } from '../../../modules/auth/dtos/request/sign-up-request.dto';
import { UserResponseDTO } from '../dtos/response/user-response.dto';

@Injectable()
export class UserBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UserBuilder.name);
  }

  /**
   * Build the user data object for creation.
   * @param signUpRequestDTO The DTO containing the sign-up request data
   * @param hashedPassword The hashed password
   * @returns The updated game data object.
   */
  public buildCreateUserData(
    signUpRequestDTO: SignUpRequestDTO,
    hashedPassword: string,
  ): Partial<User> {
    this.logger.log(
      `buildCreateUserData :: signUpRequestDTO - ${JSON.stringify(
        signUpRequestDTO,
      )}`,
    );

    // Extract the necessary fields from the sign-up request DTO
    const { email, name, phone, country } = signUpRequestDTO;

    // Create the user data object with the necessary data
    const userData: Partial<User> = {
      username: email,
      email,
      password: hashedPassword,
      name,
      phone,
      country,
    };
    this.logger.log(
      `buildCreateUserData :: userData - ${JSON.stringify(userData)}`,
    );

    return userData;
  }

  /**
   * Builds a UserResponseDTO object with the necessary user data.
   * @param user The user object
   * @returns The constructed UserResponseDTO object
   */
  public buildUserResponse(user: User): UserResponseDTO {
    this.logger.log(`buildUserResponse :: user - ${JSON.stringify(user)}`);

    // Extract necessary user data from the user object
    const { id, email, name, phone, country } = user;

    // Create a UserResponseDTO object with the necessary user data
    const userResponse: UserResponseDTO = {
      id,
      email,
      name,
      phone,
      country,
    };
    this.logger.log(
      `buildUserResponse :: userResponse - ${JSON.stringify(userResponse)}`,
    );

    return userResponse;
  }
}
