import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TokenService } from '../../common/token/token.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: TokenService;

  const mockTokenService = {
    extractTokenFromHeader: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: 'Bearer mock-token',
        },
      }),
    }),
  } as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when token is valid', () => {
      mockTokenService.extractTokenFromHeader.mockReturnValue('valid-token');
      mockTokenService.verifyToken.mockReturnValue({ sub: 'user-id' });

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.extractTokenFromHeader).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.verifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should throw UnauthorizedException when token is not found', () => {
      mockTokenService.extractTokenFromHeader.mockReturnValue(null);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new UnauthorizedException('Token not found'),
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.extractTokenFromHeader).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.verifyToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token is invalid', () => {
      mockTokenService.extractTokenFromHeader.mockReturnValue('invalid-token');
      mockTokenService.verifyToken.mockImplementation(() => {
        throw new UnauthorizedException('Invalid token');
      });

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        UnauthorizedException,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.extractTokenFromHeader).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(tokenService.verifyToken).toHaveBeenCalledWith('invalid-token');
    });
  });
});
