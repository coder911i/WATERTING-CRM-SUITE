import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { createMockPrismaClient } from './prisma.mock';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: any;

  beforeAll(async () => {
    prisma = createMockPrismaClient();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth Flow', () => {
    it('/auth/register (POST) -> 201', () => {
      prisma.tenant.findUnique.mockResolvedValue(null);
      prisma.user.findFirst.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue({ accessToken: 'token' });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ tenantName: 'E2E Tenant', slug: 'e2e', email: 'e2e@e2e.com', password: 'password', name: 'E2E User' })
        .expect(201);
    });

    it('/auth/login (POST) -> 201/200', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: '1', email: 'e2e@e2e.com', passwordHash: 'hashed', isActive: true });
      // Bcrypt.compare mock is needed if we fully execute auth triggers layout dashboards
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'e2e@e2e.com', password: 'password' })
        .expect(res => {
          if (![200, 201].includes(res.status)) throw new Error(`Expected 200 or 201, got ${res.status}`);
        });
    });
  });

  describe('Leads Guard test', () => {
    it('/leads (GET) without token -> 401', () => {
      return request(app.getHttpServer())
        .get('/leads')
        .expect(401);
    });
  });
});
