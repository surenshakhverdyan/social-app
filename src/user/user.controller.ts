import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateFriendRequestDto } from './dtos/update-friend-request.dto';
import { FriendRequestResponseDto } from './dtos/friend-request-response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/schemas/user.schema';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Search users by name and age' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users matching the search criteria',
    type: [User],
  })
  @Get('search')
  searchUsers(@Query() dto: SearchUsersDto): Promise<User[]> {
    return this.userService.searchUsers(dto);
  }

  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({
    status: 201,
    description: 'Friend request sent successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot send request to self',
  })
  @ApiParam({
    name: 'receiverId',
    description: 'ID of the user to send request to',
  })
  @ApiParam({
    name: 'senderId',
    description: 'ID of the user sending the request',
    required: true,
  })
  @Post(':receiverId/friend-request')
  sendFriendRequest(
    @Param('receiverId') receiverId: string,
    @Body('senderId') senderId: string,
  ): Promise<void> {
    return this.userService.sendFriendRequest(senderId, receiverId);
  }

  @ApiOperation({ summary: 'Update friend request status' })
  @ApiResponse({
    status: 200,
    description: 'Friend request status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Friend request not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status value',
  })
  @ApiParam({
    name: 'requestId',
    description: 'ID of the friend request',
  })
  @Put('friend-requests/:requestId')
  updateFriendRequestStatus(
    @Param('requestId') requestId: string,
    @Body() dto: UpdateFriendRequestDto,
  ): Promise<void> {
    return this.userService.updateFriendRequestStatus(requestId, dto.status);
  }

  @ApiOperation({ summary: 'Get pending friend requests' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of pending friend requests',
    type: [FriendRequestResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No friend requests found',
  })
  @ApiQuery({
    name: 'userId',
    description: 'ID of the user to get requests for',
    required: true,
  })
  @Get('friend-requests')
  async getFriendRequests(
    @Query('userId') userId: string,
  ): Promise<FriendRequestResponseDto[]> {
    const requests = await this.userService.getFriendRequests(userId);
    return requests as FriendRequestResponseDto[];
  }

  @ApiOperation({ summary: "Get user's friends list" })
  @ApiResponse({
    status: 200,
    description: "Returns a list of user's friends",
    type: [User],
  })
  @ApiResponse({
    status: 404,
    description: 'No friends found',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to get friends for',
    required: true,
  })
  @Get(':userId/friends')
  async getFriends(@Param('userId') userId: string): Promise<User[]> {
    const friends = await this.userService.getFriends(userId);
    return friends as User[];
  }
}
