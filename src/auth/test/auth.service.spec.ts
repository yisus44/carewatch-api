import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

import { MailService } from '../../mail/mail.service';
import { CommonService } from '../../common/common.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { EmailInUseException } from '../../common/exceptions/email-in-use.exception';
import { PostgresErrorCode } from '../../database/postgresErrorCodes.enum';

import { SignUpDto } from '../dto/signup.dto';
import { BcryptType } from '../types/bcrypt.type';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.excepction';
import { SignInDto } from '../dto/signin.dto';
import { InvalidCredentialsException } from '../../common/exceptions/invalid-credentails.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let subscriptionsService: SubscriptionsService;
  let commonService: CommonService;
  let bcryptMock: BcryptType;

  beforeEach(async () => {
    bcryptMock = {
      genSalt: jest.fn(),
      hash: jest.fn(),
      compare: jest.fn(),
      compareSync: jest.fn(),
      genSaltSync: jest.fn(),
      hashSync: jest.fn(),
      getRounds: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: SubscriptionsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CommonService,
          useValue: {
            parseDurationToMilliseconds: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            demoEmail: jest.fn(),
          },
        },
        {
          provide: 'BcryptType',
          useValue: bcryptMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    subscriptionsService =
      module.get<SubscriptionsService>(SubscriptionsService);
    commonService = module.get<CommonService>(CommonService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' } as User;
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);
      (subscriptionsService.create as jest.Mock).mockResolvedValue(null);

      const signUpDto: SignUpDto = {
        name: 'John',
        lastName: 'Doe',
        profilePictureId: 123,
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      const result = await authService.signUp(signUpDto);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
      expect(result.expirationTimestamp).toBeDefined();
    });

    it('should encrypt the password', async () => {
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (usersService.create as jest.Mock).mockResolvedValue({} as User);
      (subscriptionsService.create as jest.Mock).mockResolvedValue(null);

      const signUpDto: SignUpDto = {
        name: 'John',
        lastName: 'Doe',
        profilePictureId: 123,
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      await authService.signUp(signUpDto);

      expect(bcryptMock.hash).toHaveBeenCalledWith(signUpDto.password, 10);
    });

    it('should throw validation error for invalid input', async () => {
      const signUpDto: SignUpDto = {
        name: 'J',
        lastName: 'Doe',
        profilePictureId: 123,
        email: 'invalid-email',
        password: 'short',
        phone: '123',
      };

      await expect(authService.signUp(signUpDto)).rejects.toThrow();
    });

    it('should throw EmailInUseException for duplicate email', async () => {
      (bcryptMock.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (usersService.create as jest.Mock).mockRejectedValue({
        code: PostgresErrorCode.UniqueViolation,
      });
      (subscriptionsService.create as jest.Mock).mockResolvedValue(null);

      const signUpDto: SignUpDto = {
        name: 'John',
        lastName: 'Doe',
        profilePictureId: 123,
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890',
      };

      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        EmailInUseException,
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        email: signInDto.email,
        password: 'hashedPassword',
      } as User;

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (bcryptMock.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.signIn(signInDto);

      expect(result.token).toBeDefined();
      expect(result.user).toEqual(mockUser);
      expect(result.expirationTimestamp).toBeDefined();
    });

    it('should throw UserNotFoundException when user does not exist', async () => {
      const signInDto: SignInDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UserNotFoundException,
      );
    });

    it('should throw InvalidCredentialsException when password is incorrect', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'incorrectPassword',
      };
      const mockUser = {
        id: 1,
        email: signInDto.email,
        password: 'hashedPassword',
      } as User;

      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
    });
  });

  describe('getAuthInfo', () => {
    it('should return authentication info', async () => {
      const user: User = new User();
      user.id = 1;
      user.email = 'test@example.com';
      user.password = 'hashedPassword';
      user.isActive = true;

      const expirationTime = '48h';
      const token = 'fakeToken';
      const expirationTimestamp = Date.now() + 48 * 60 * 60 * 1000;

      (authService as any).signPayload = jest.fn().mockResolvedValue(token);
      (commonService.parseDurationToMilliseconds as jest.Mock).mockReturnValue(
        expirationTimestamp - Date.now(),
      );

      const result = await authService.getAuthInfo(user);

      expect(result.token).toEqual(token);
      expect(result.user).toEqual({
        id: 1,
        email: 'test@example.com',
        isActive: true,
      });
      expect(result.expirationTimestamp).toBeCloseTo(expirationTimestamp, -2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true when passwords match', async () => {
      const plainTextPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcryptMock.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService['verifyPassword'](
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(true);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
    });

    it('should return false when passwords do not match', async () => {
      const plainTextPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcryptMock.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService['verifyPassword'](
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
    });
  });
});
