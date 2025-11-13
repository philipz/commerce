
import type { CommerceProvider } from './provider.interface';
import { CommerceError } from './errors';
import { ensureStartsWith } from '../utils';

export type CommerceProviderName = 'shopify' | 'mock';

const COMMERCE_PROVIDERS: {
  [key in CommerceProviderName]: () => Promise<{ default: CommerceProvider }>;
} = {
  shopify: () => import('./providers/shopify'),
  mock: () => import('./providers/mock'),
};

export function validateProviderEnv(providerName: CommerceProviderName, requiredEnvVars: string[]) {
  const missingVars: string[] = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new CommerceError(
      `Commerce provider "${providerName}" is missing required environment variables: ${missingVars.join(', ')}`,
      { code: "MISSING_ENV_VARS" },
    );
  }
}

export async function getCommerceProvider(): Promise<CommerceProvider> {
  const providerName = (process.env.COMMERCE_PROVIDER || 'mock') as CommerceProviderName;

  if (!COMMERCE_PROVIDERS[providerName]) {
    throw new CommerceError(
      `Commerce provider "${providerName}" is not supported. Available providers are: ${Object.keys(COMMERCE_PROVIDERS).join(', ')}`,
      { code: "UNSUPPORTED_PROVIDER" },
    );
  }

  const providerModule = await COMMERCE_PROVIDERS[providerName]();
  const provider = providerModule.default;

  validateProviderEnv(providerName, provider.requiredEnvVars);

  // Ensure SHOPIFY_STORE_DOMAIN is correctly formatted if it's a Shopify provider
  if (providerName === 'shopify' && process.env.SHOPIFY_STORE_DOMAIN) {
    process.env.SHOPIFY_STORE_DOMAIN = ensureStartsWith(
      process.env.SHOPIFY_STORE_DOMAIN,
      'https://',
    );
  }

  return provider;
}
