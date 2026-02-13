import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository';
import { SignUpRequestDTO } from '../../../modules/auth/dtos/request/sign-up-request.dto';
import { UserBuilder } from '../builders/user.builder';
import { UserResponseDTO } from '../dtos/response/user-response.dto';

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

  /**
   * Create a new user.
   * @param userData The data for creating the user.
   * @returns A Promise that resolves to the created user object.
   */
  private async createUser(userData: Partial<User>): Promise<User> {
    this.logger.log(`createUser :: userData - ${JSON.stringify(userData)}`);

    try {
      return this.userRepository.createUser(userData);
    } catch (error) {
      this.logger.error(
        `createUser :: Error while saving user to the database`,
      );
      this.logger.error(`createUser :: error - ${error}`);
      throw new InternalServerErrorException(
        'Error while saving user to the database.',
      );
    }
  }

  /**
   * Creates a new user with the hashed password and additional details.
   * @param signUpRequestDTO The DTO containing the sign-up request data
   * @param hashedPassword The hashed password
   * @returns The created user
   */
  public async createUserWithHashedPassword(
    signUpRequestDTO: SignUpRequestDTO,
    hashedPassword: string,
  ): Promise<User> {
    this.logger.log(
      `createUserWithHashedPassword :: signUpRequestDTO - ${JSON.stringify(
        signUpRequestDTO,
      )}`,
    );

    // Create the user data object with hashedPassword
    const userData: Partial<User> = this.userBuilder.buildCreateUserData(
      signUpRequestDTO,
      hashedPassword,
    );
    this.logger.log(
      `createUserWithHashedPassword :: userData - ${JSON.stringify(userData)}`,
    );

    // Call the createUser method to create the user
    const user = await this.createUser(userData);
    this.logger.log(
      `createUserWithHashedPassword :: user - ${JSON.stringify(user)}`,
    );

    // Return the created user
    return user;
  }
}
