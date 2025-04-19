import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthHelper {
  private saltRounds = 10;
  private salt: string;

  constructor() {
    this.salt = bcrypt.genSaltSync(this.saltRounds);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
