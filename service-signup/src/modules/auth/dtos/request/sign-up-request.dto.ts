import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  Length,
  MaxLength,
} from 'class-validator';

import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';

export class SignUpRequestDTO extends BaseRequestDTO {
  // // Username property
  // @ApiProperty({
  //   name: 'username',
  //   type: String,
  //   description: 'Username',
  //   example: '-john.doe_123@',
  // })
  // @IsString({ message: 'Username must be a string.' })
  // @IsNotEmpty({ message: 'Username is required.' }) // Must not be empty
  // @Matches(/^[a-z0-9_.@\-]+$/, {
  //   message:
  //     'Username can only contain lowercase alphanumeric characters, underscore, dot, hyphen, and "@" symbol.',
  // })
  // @Length(3, 50, { message: 'Username must be between 3 and 50 characters.' })
  // readonly username: string;

  // Email property
  @ApiProperty({
    name: 'email',
    type: String,
    description: "User's email address",
    example: 'john@example.com',
  })
  @IsString({ message: 'Email must be a string.' })
  @IsNotEmpty({ message: 'Email is required.' }) // The email field must not be empty
  @Transform(({ value }) => value.toLowerCase()) // Transform the email value to lowercase
  @IsEmail({}, { message: 'Email must be a valid email address.' }) // Validate that the email field is a valid email address
  @Length(3, 50, { message: 'Email must be between 3 and 50 characters.' }) // Validate the length of the email field
  readonly email: string;

  // Password property
  @ApiProperty({
    name: 'password',
    type: String,
    description: 'Password',
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' }) // The password field must not be empty
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters.' }) // Validate the length of the password field
  readonly password: string;

  // Name property
  @ApiProperty({
    name: 'name',
    type: String,
    description: "User's full name.",
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' }) // The name field must not be empty
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name can only contain alphabets and spaces.',
  }) // Validate that the name field contains only alphabets and spaces
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters.' }) // Validate the length of the name field
  readonly name: string;

  // Phone property (optional)
  @ApiPropertyOptional({
    name: 'phone',
    type: String,
    description: "User's phone number",
    example: '+1234567890',
  })
  @IsOptional() // The phone field is optional
  @IsString({ message: 'Phone must be a string.' })
  @Matches(/^\+\d{1,15}$/, {
    message: 'Phone must be a valid phone number.',
  }) // Validate that the phone field is a valid phone number format
  @MaxLength(15, { message: 'Phone number cannot exceed 15 characters.' }) // Validate the maximum length of the phone field
  readonly phone?: string;

  // Country property (optional)
  @ApiPropertyOptional({
    name: 'country',
    type: String,
    description: "User's country",
    example: 'USA',
  })
  @IsOptional() // The country field is optional
  @IsString({ message: 'Country must be a string.' }) // Validate that the country field is a string
  @Matches(/^[A-Za-z]+$/, { message: 'Country can only contain alphabets.' }) // Validate that the country field contains only alphabets
  @MaxLength(20, { message: 'Country cannot exceed 20 characters.' }) // Validate the maximum length of the country field
  readonly country?: string;
}
