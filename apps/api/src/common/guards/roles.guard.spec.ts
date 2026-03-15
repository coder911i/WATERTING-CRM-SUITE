import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if no roles required', () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(null);
      const context = { getHandler: jest.fn(), getClass: jest.fn() } as any;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true if user role matches required', () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.TENANT_ADMIN]);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: UserRole.TENANT_ADMIN } })
        })
      } as any;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false if user role does not match', () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.TENANT_ADMIN]);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: () => ({
          getRequest: () => ({ user: { role: UserRole.SALES_AGENT } })
        })
      } as any;

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
