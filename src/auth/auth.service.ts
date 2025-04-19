import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from 'src/common/token/token.service';
import { AuthHelper } from './helpers/auth.helper';
import { UserRepository } from './repositories/user.repository';
import { SignUpDto } from './dtos/sign-up.dto';
import { IUser } from './interfaces/user.interface';
import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authHelper: AuthHelper,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto): Promise<IUser> {
    const hashedPassword = await this.authHelper.hashPassword(dto.password);
    const user = await this.userRepository.createUser({
      ...dto,
      password: hashedPassword,
    });
    const payload = { sub: user.id };
    const authToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      authToken,
      refreshToken,
    };
  }

  async signIn(dto: SignInDto): Promise<IUser> {
    const user = await this.userRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.authHelper.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id };
    const authToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      authToken,
      refreshToken,
    };
  }
}
