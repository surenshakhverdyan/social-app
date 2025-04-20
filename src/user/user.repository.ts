import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';

import { DatabaseService } from '../common/database/database.service';
import { SearchUsersDto } from './dtos/search-users.dto';
import { FriendshipStatus } from './enums/friendship-status.enum';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async searchUsers(dto: SearchUsersDto): Promise<User[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (dto.firstName) {
      conditions.push(`LOWER(first_name) LIKE LOWER($${paramIndex})`);
      params.push(`%${dto.firstName}%`);
      paramIndex++;
    }

    if (dto.lastName) {
      conditions.push(`LOWER(last_name) LIKE LOWER($${paramIndex})`);
      params.push(`%${dto.lastName}%`);
      paramIndex++;
    }

    if (dto.age) {
      conditions.push(`age = $${paramIndex}`);
      params.push(dto.age);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT id, email, first_name, last_name, age, created_at, updated_at 
      FROM users 
      ${whereClause}
      LIMIT 50
    `;

    const result = await this.databaseService.query<User>(query, params);
    return result.rows;
  }

  async sendFriendRequest(senderId: string, receiverId: string): Promise<void> {
    await this.databaseService.query(
      `INSERT INTO friendship_requests (sender_id, receiver_id, status) 
       VALUES ($1, $2, $3)
       ON CONFLICT (sender_id, receiver_id) DO NOTHING`,
      [senderId, receiverId, FriendshipStatus.PENDING],
    );
  }

  async getFriendRequest(requestId: string): Promise<QueryResult> {
    return this.databaseService.query(
      `SELECT * FROM friendship_requests WHERE id = $1`,
      [requestId],
    );
  }

  async updateFriendRequestStatus(
    requestId: string,
    status: FriendshipStatus,
  ): Promise<void> {
    await this.databaseService.query(
      `UPDATE friendship_requests 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [status, requestId],
    );
  }

  async getFriendRequests(userId: string): Promise<any[]> {
    const result = await this.databaseService.query(
      `SELECT fr.*, 
              u.first_name as sender_first_name, 
              u.last_name as sender_last_name,
              u.email as sender_email
       FROM friendship_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id = $1 AND fr.status = $2`,
      [userId, FriendshipStatus.PENDING],
    );
    return result.rows;
  }

  async getFriends(userId: string): Promise<any[]> {
    const result = await this.databaseService.query(
      `SELECT u.id, u.first_name, u.last_name, u.email
       FROM friendship_requests fr
       JOIN users u ON (
         CASE 
           WHEN fr.sender_id = $1 THEN fr.receiver_id = u.id
           ELSE fr.sender_id = u.id
         END
       )
       WHERE (fr.sender_id = $1 OR fr.receiver_id = $1)
         AND fr.status = $2`,
      [userId, FriendshipStatus.ACCEPTED],
    );
    return result.rows;
  }
}
