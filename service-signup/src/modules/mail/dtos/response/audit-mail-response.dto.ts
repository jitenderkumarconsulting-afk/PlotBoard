import { ApiProperty } from '@nestjs/swagger';

import { AuditMailStatus } from '../../enums/audit-mail-status.enum';
import { AuditMailType } from '../../enums/audit-mail-type.enum';

export class AuditMailResponseDTO {
  // ID of the audit mail
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'ID of the audit mail',
    example: 'abcd1234',
  })
  readonly id: string;

  // User ID associated with the email
  @ApiProperty({
    name: 'user_id',
    type: String,
    description: 'User ID associated with the email',
    example: 'user123',
  })
  readonly user_id: string;

  // Email address to which the email is sent
  @ApiProperty({
    name: 'recipient_email',
    type: String,
    description: 'Email address to which the email is sent',
    example: 'recipient@example.com',
  })
  readonly recipient_email: string;

  // Email address from which the email is sent
  @ApiProperty({
    name: 'sender_email',
    type: String,
    description: 'Email address from which the email is sent',
    example: 'sender@example.com',
  })
  readonly sender_email: string;

  // Type of the email
  @ApiProperty({
    name: 'type',
    type: String,
    enum: AuditMailType,
    description: 'Type of the email',
    example: AuditMailType.SIGN_UP,
  })
  readonly type: AuditMailType;

  // Status of the email
  @ApiProperty({
    name: 'status',
    type: String,
    enum: AuditMailStatus,
    description: 'Status of the email',
    example: AuditMailStatus.PENDING,
  })
  readonly status: AuditMailStatus;

  // Date and time when the email record was created
  @ApiProperty({
    name: 'created_at',
    type: Date,
    description: 'Date and time when the email record was created',
    example: '2023-07-03T10:00:00Z',
  })
  readonly created_at: Date;
}
