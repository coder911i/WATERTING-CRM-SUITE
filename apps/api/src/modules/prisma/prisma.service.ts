import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { tenantContextStorage } from '../../common/context/tenant-context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });

    return new Proxy(this, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);
        if (prop === '$transaction') {
          return async (...args: any[]) => {
            if (typeof args[0] === 'function') {
              const callback = args[0];
              return target.$transaction(async (tx) => {
                return callback(this.wrapClient(tx));
              }, args[1]);
            }
            return target.$transaction(...args);
          };
        }
        if (typeof value === 'object' && value !== null && prop !== 'tenant') {
          return this.wrapModel(value);
        }
        return value;
      },
    });
  }

  private wrapClient(client: any) {
    return new Proxy(client, {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'object' && value !== null && prop !== 'tenant') {
          return this.wrapModel(value);
        }
        return value;
      },
    });
  }

  private wrapModel(model: any) {
    const methodsToWrap = ['findMany', 'findFirst', 'findUnique', 'count', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
    return new Proxy(model, {
      get: (target, prop, receiver) => {
        const originalMethod = Reflect.get(target, prop, receiver);
        if (typeof originalMethod === 'function' && methodsToWrap.includes(prop as string)) {
          return (...args: any[]) => {
            const context = tenantContextStorage.getStore();
            if (context?.tenantId) {
              const query = args[0] || {};
              query.where = {
                ...query.where,
                tenantId: context.tenantId,
              };
              args[0] = query;
            }
            return originalMethod.apply(target, args);
          };
        }
        return originalMethod;
      },
    });
  }

  async onModuleInit() {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    if (!dbUrl) {
      this.logger.error('DATABASE_URL environment variable is not defined');
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
