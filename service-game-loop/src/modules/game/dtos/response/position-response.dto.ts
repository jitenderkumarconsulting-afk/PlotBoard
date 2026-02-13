import { ApiProperty } from '@nestjs/swagger';

export class PositionResponseDTO {
  @ApiProperty({
    name: 'Row',
    type: Number,
    description: '',
    example: '',
  })
  Row: number;

  @ApiProperty({
    name: 'Column',
    type: Number,
    description: '',
    example: '',
  })
  Column: number;
}
