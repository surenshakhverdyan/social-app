import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import { SearchUsersDto } from './dtos/search-users.dto';
import { FriendshipStatus } from './enums/friendship-status.enum';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async searchUsers(dto: SearchUsersDto): Promise<User[]> {
    return this.userRepository.searchUsers(dto);
  }

  async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    if (senderId === receiverId) {
      throw new ConflictException('Cannot send friend request to yourself');
    }
    await this.userRepository.sendFriendRequest(senderId, receiverId);
  }

  async updateFriendRequestStatus(
    requestId: string,
    status: FriendshipStatus,
  ): Promise<void> {
    const request = await this.userRepository.getFriendRequest(requestId);
    if (!request.rows.length) {
      throw new NotFoundException('Friend request not found');
    }
    await this.userRepository.updateFriendRequestStatus(requestId, status);
  }

  async getFriendRequests(userId: string): Promise<any[]> {
    const requests = await this.userRepository.getFriendRequests(userId);
    if (!requests.length) {
      throw new NotFoundException('No friend requests found');
    }
    return requests;
  }

  async getFriends(userId: string): Promise<any[]> {
    const friends = await this.userRepository.getFriends(userId);
    if (!friends.length) {
      throw new NotFoundException('No friends found');
    }
    return friends;
  }
}
