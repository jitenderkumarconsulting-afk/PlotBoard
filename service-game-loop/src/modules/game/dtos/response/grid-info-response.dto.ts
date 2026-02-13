import { ApiProperty } from '@nestjs/swagger';

export class GridInfoResponseDTO {
  @ApiProperty({
    name: 'rows',
    type: Number,
    description: '',
    example: 6,
  })
  rows: Number;

  @ApiProperty({
    name: 'columns',
    type: Number,
    description: '',
    example: 6,
  })
  columns: Number;
}
