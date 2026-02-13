import { ApiProperty } from '@nestjs/swagger';

export class EventCapturedObjectsResponseDTO {
  @ApiProperty({
    name: 'captured_objects',
    type: Array,
    description: '',
    example: '[]',
  })
  captured_objects: Array<Record<string, any>>;

  @ApiProperty({
    name: 'captured_object_item',
    type: Object,
    description: '',
    example: '{}',
  })
  captured_object_item?: Record<string, any>;
}
