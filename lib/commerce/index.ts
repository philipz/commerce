
import { getCommerceProvider } from './config';
import type { CommerceProvider } from './provider.interface';

// Re-export all types and errors for convenience
export * from './types';
export * from './errors';

let commerce: CommerceProvider | undefined;

export async function getCommerce(): Promise<CommerceProvider> {
  if (commerce) {
    return commerce;
  }

  commerce = await getCommerceProvider();

  if (process.env.NODE_ENV === 'development') {
    console.log(`Commerce provider active: ${commerce.name}`);
  }

  return commerce;
}
