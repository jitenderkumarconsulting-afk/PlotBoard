import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDTO {
  @ApiProperty({
    name: 'access_token',
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'Access token',
  })
  access_token: string;
}
