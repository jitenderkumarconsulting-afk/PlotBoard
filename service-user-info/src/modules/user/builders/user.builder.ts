import { Injectable, Logger } from '@nestjs/common';

import { User } from '../../user/interfaces/user.interface';
import { UserResponseDTO } from '../dtos/response/user-response.dto';

@Injectable()
export class UserBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UserBuilder.name);
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
