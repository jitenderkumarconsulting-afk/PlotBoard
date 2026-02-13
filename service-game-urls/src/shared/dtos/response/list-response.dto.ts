import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Generic List Response DTO
 *
 * This class represents a generic list response with optional pagination fields. It is designed to wrap a list of items
 * and provide additional metadata about the list, such as the total count of items and pagination details when applicable.
 *
 * @template T - The type of items in the list.
 */
export class ListResponseDTO<T> {
  // items field
  @ApiProperty({
    name: 'items',
    type: [Object],
    description: 'Array of items',
    example: [],
  })
  items: T[];

  // total field
  @ApiProperty({
    name: 'total',
    type: Number,
    description: 'Total count of items',
    example: 10,
  })
  total: number;

  // page field (Optional, used for paginated list responses)
  @ApiPropertyOptional({
    name: 'page',
    type: Number,
    description:
      'Current page number (Optional, used for paginated list responses)',
    example: 1,
  })
  page?: number;

  // per_page field (Optional, used for paginated list responses)
  @ApiPropertyOptional({
    name: 'per_page',
    type: Number,
    description:
      'Number of items per page (Optional, used for paginated list responses)',
    example: 10,
  })
  per_page?: number;
}
