import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  tenantId: string;
}

export const tenantContextStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Get the current tenant ID from request context.
 * Returns undefined if called outside a request context.
 */
export function getTenantId(): string | undefined {
  const store = tenantContextStorage.getStore();
  return store?.tenantId;
}

/**
 * Run a function with the given tenant ID in context.
 */
export function runWithTenantId<R>(tenantId: string, fn: () => R): R {
  return tenantContextStorage.run({ tenantId }, fn);
}
