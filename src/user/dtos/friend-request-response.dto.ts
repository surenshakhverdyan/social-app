import { ApiProperty } from '@nestjs/swagger';

import { FriendshipStatus } from '../enums/friendship-status.enum';

export class FriendRequestResponseDto {
  @ApiProperty({
    description: 'Friend request ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Sender user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sender_id: string;

  @ApiProperty({
    description: 'Sender first name',
    example: 'John',
  })
  sender_first_name: string;

  @ApiProperty({
    description: 'Sender last name',
    example: 'Doe',
  })
  sender_last_name: string;

  @ApiProperty({
    description: 'Sender email',
    example: 'john.doe@example.com',
  })
  sender_email: string;

  @ApiProperty({
    description: 'Request status',
    enum: FriendshipStatus,
    example: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @ApiProperty({
    description: 'Request creation timestamp',
    example: '2025-04-20T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Request last update timestamp',
    example: '2025-04-20T10:00:00Z',
  })
  updated_at: Date;
}
