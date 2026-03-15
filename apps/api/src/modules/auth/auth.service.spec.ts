import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaClient } from '../../../test/prisma.mock';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    prisma = createMockPrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { 
          provide: JwtService, 
          useValue: { 
            sign: jest.fn(() => 'mock-token'),
            verify: jest.fn(() => ({ sub: '123', email: 'test@test.com' }))
          } 
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create tenant and user and return tokens', async () => {
      const dto = { tenantName: 'New Tenant', slug: 'new', email: 'test@test.com', password: 'password', name: 'John' };
      prisma.tenant.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.register(dto);

      expect(result).toEqual({ accessToken: 'mock-token', refreshToken: 'mock-token' });
    });

    it('should throw ConflictException if slug taken', async () => {
      prisma.tenant.findUnique.mockResolvedValue({ id: '1' });
      const dto = { tenantName: 'New Tenant', slug: 'new', email: 'test@test.com', password: 'password', name: 'John' };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.login({ email: 'test@test.com', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on valid password', async () => {
      const user = { id: '1', email: 'test@test.com', passwordHash: 'hashed', name: 'John', role: UserRole.SALES_AGENT, isActive: true };
      prisma.user.findFirst.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual({ accessToken: 'mock-token', refreshToken: 'mock-token' });
    });
  });
});
