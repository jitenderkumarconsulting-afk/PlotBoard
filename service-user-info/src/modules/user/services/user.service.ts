import { Injectable, Logger } from '@nestjs/common';

import { User } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDTO } from '../dtos/response/user-response.dto';
import { UserBuilder } from '../builders/user.builder';

@Injectable()
export class UserService {
  private readonly logger: Logger;

  constructor(
    private readonly userRepository: UserRepository, // Inject UserRepository
    private readonly userBuilder: UserBuilder, // Inject UserBuilder
  ) {
    this.logger = new Logger(UserService.name);
  }

  /**
   * Get a user by their ID.
   * @param userId The ID of the user.
   * @returns A Promise that resolves to the user object, or null if not found.
   */
  public async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findUserById(userId);
  }

  /**
   * Get a user by their email.
   * @param email The email of the user.
   * @returns A Promise that resolves to the user object, or null if not found.
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }

  /**
   * Get a user by their ID and email.
   * @param userId The ID of the user.
   * @param email The email of the user.
   * @returns A Promise that resolves to the user object, or null if not found.
   */
  public async getUserByIdAndEmail(
    userId: string,
    email: string,
  ): Promise<User | null> {
    return this.userRepository.findUserByIdAndEmail(userId, email);
  }

  /**
   * Retrieves the user information for the response.
   * @param user The authenticated user object
   * @returns The user information for the response
   */
  public getUserInfo(user: User): UserResponseDTO {
    this.logger.log(`getUserInfo :: user - ${user}`);

    // Build the user response using the UserBuilder
    const userResponse = this.userBuilder.buildUserResponse(user);
    this.logger.log(
      `getUserInfo :: userResponse - ${JSON.stringify(userResponse)}`,
    );

    return userResponse;
  }
}
