import { ApiProperty } from '@nestjs/swagger';

import { UserResponseDTO } from 'src/modules/user/dtos/response/user-response.dto';

export class SignInResponseDTO {
  // Represents the access token returned upon successful sign-in
  @ApiProperty({
    name: 'access_token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'Access token',
  })
  access_token: string;

  // Represents the user details of the signed-in user
  @ApiProperty({
    name: 'user',
    type: UserResponseDTO,
    description: 'User details',
  })
  user: UserResponseDTO;
}
