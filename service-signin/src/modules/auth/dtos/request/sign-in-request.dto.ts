import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';

export class SignInRequestDTO extends BaseRequestDTO {
  // Email property
  @ApiProperty({
    example: 'john@example.com',
    description: "User's email address",
  })
  @IsNotEmpty() // The email field must not be empty
  @IsEmail() // Validate that the email field is a valid email address
  @MaxLength(50, { message: 'Email cannot exceed 50 characters.' }) // Validate the length of the email field
  readonly email: string;

  // Password property
  @ApiProperty({
    example: 'password123',
    description: 'Password',
  })
  @IsNotEmpty() // The password field must not be empty
  @MaxLength(20, { message: 'Password cannot exceed 20 characters.' }) // Validate the length of the password field
  readonly password: string;
}
