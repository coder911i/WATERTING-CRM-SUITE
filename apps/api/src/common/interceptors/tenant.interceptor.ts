import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tenantContextStorage } from '../context/tenant-context';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    // 1. From JWT user (authenticated routes)
    // 2. From URL params (public webhooks)
    // 3. From headers (API integration)
    const tenantId = request.user?.tenantId || request.params?.tenantId || request.headers?.['x-tenant-id'];

    if (tenantId) {
      return new Observable((subscriber) => {
        tenantContextStorage.run({ tenantId }, () => {
          next.handle().subscribe(subscriber);
        });
      });
    }

    return next.handle();
  }
}
