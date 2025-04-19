import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/common/database/database.service';
import { SignUpDto } from '../dtos/sign-up.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(dto: SignUpDto): Promise<User> {
    const result = await this.databaseService.query(
      `INSERT INTO users (email, password, first_name, last_name, age) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [dto.email, dto.password, dto.firstName, dto.lastName, dto.age],
    );
    return result.rows[0] as User;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    return result.rows[0] as User;
  }
}
