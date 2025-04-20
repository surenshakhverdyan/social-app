import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatus } from '../enums/friendship-status.enum';

export class UpdateFriendRequestDto {
  @ApiProperty({
    description: 'New status for the friend request',
    enum: FriendshipStatus,
    example: FriendshipStatus.ACCEPTED,
  })
  @IsEnum(FriendshipStatus)
  @IsNotEmpty()
  status: FriendshipStatus;
}
