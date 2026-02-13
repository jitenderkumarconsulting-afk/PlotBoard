import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDTO {
  // Id of the user
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'Id of the user',
    example: '12345',
  })
  id: string;

  // Username of the user
  // @ApiProperty({
  //   name: 'username',
  //   type: String,
  //   description: 'Username of the user',
  //   example: '-john.doe_123@',
  // })
  // username: string;

  // Email address of the user
  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email address of the user',
    example: 'john@example.com',
  })
  email: string;

  // Full name of the user
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name: string;

  // Phone number of the user (optional)
  @ApiPropertyOptional({
    name: 'phone',
    type: String,
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  phone?: string;

  // Country of the user (optional)
  @ApiPropertyOptional({
    name: 'country',
    type: String,
    description: 'Country of the user',
    example: 'USA',
  })
  country?: string;
}
