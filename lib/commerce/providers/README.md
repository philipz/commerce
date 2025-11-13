# Commerce Provider Implementation Guide

This document explains how to build and register custom commerce providers for Next.js Commerce’s provider abstraction. Every provider is responsible for translating its backend (Shopify, a headless platform, your own APIs, etc.) into the shared `CommerceProvider` contract located at [`lib/commerce/provider.interface.ts`](../provider.interface.ts).

---

## 1. Architecture Overview

```
app/ + components/          <-- call getCommerce() in server components/actions
       |
       v
lib/commerce/index.ts       <-- returns the active provider singleton
       |
       v
lib/commerce/config.ts      <-- loads provider via dynamic import based on COMMERCE_PROVIDER,
                               validates env vars, ensures provider metadata is correct
       |
       v
lib/commerce/providers/*    <-- mock, shopify, and your future providers live here
```

- **Entry point**: Call `const commerce = await getCommerce()` inside server components/actions. Never import provider files directly.
- **Dynamic selection**: `COMMERCE_PROVIDER` env var chooses which provider to load (e.g., `shopify`, `mock`, or your new provider).
- **Validation**: Each provider declares `requiredEnvVars`, which `validateProviderEnv` enforces during startup.

---

## 2. Provider Directory Structure

Create a new directory under `lib/commerce/providers/`:

```
lib/commerce/providers/<your-provider>/
├── README.md              # optional provider-specific instructions
├── client.ts              # API client wrappers (REST/GraphQL helpers)
├── reshaping.ts           # translate backend responses → shared DTOs
├── types.ts               # backend-specific response types (optional)
└── index.ts               # exports the CommerceProvider implementation
```

Use the existing [shopify](./shopify) and [mock](./mock) directories as references.

---

## 3. Implementing the CommerceProvider Interface

At minimum, your `index.ts` must export:

```ts
import type { CommerceProvider } from "../../provider.interface";

const myProvider: CommerceProvider = {
  name: "my-provider",
  requiredEnvVars: ["MY_API_URL", "MY_API_TOKEN"],
  async createCart() { /* ... */ },
  async getCart(cartId) { /* ... */ },
  // implement every method in the interface...
  async revalidate(req) { /* ... */ },
};

export default myProvider;
```

### Required Methods

| Category | Methods | Notes |
| --- | --- | --- |
| Cart | `createCart`, `getCart`, `addToCart`, `updateCart`, `removeFromCart` | `getCart` should respect the `cartId` cookie used by the app. |
| Catalog | `getProduct`, `getProducts`, `getProductRecommendations` | Use caching directives (`"use cache"`, `cacheTag`, `cacheLife`) when appropriate. |
| Collections | `getCollection`, `getCollections`, `getCollectionProducts` | Ensure `Collection.path` is populated for navigation (e.g., `/search/${handle}`). |
| Pages & Menus | `getPage`, `getPages`, `getMenu` | Used for CMS-like content and navbar/footer links. |
| Webhooks | `revalidate` | Verify the provider’s webhook secret, then trigger `revalidateTag(TAGS.*)` as needed. |

Return values must conform to the shared DTOs in [`lib/commerce/types.ts`](../types.ts).

---

## 4. Step-by-Step: Creating a Provider

1. **Scaffold the directory**
   ```bash
   mkdir -p lib/commerce/providers/acme
   ```
2. **Author `client.ts` (optional)**
   - Wrap HTTP clients, add auth headers, handle retries, etc.
3. **Author `reshaping.ts`**
   - Convert raw backend responses into `Product`, `Cart`, `Collection`, etc.
   - Reuse `removeEdgesAndNodes` and similar helpers from `lib/commerce/utils`.
4. **Implement `index.ts`**
   - Import helpers, GraphQL/REST documents, and DTO types.
   - Implement every `CommerceProvider` method.
   - Export `const acmeProvider: CommerceProvider`.
5. **Document env vars**
   - Add a README describing required secrets and how to create them.
6. **Register the provider**
   - Update `CommerceProviderName` union in `lib/commerce/config.ts`.
   - Add a dynamic import entry to `COMMERCE_PROVIDERS`.
7. **Test**
   - Set `COMMERCE_PROVIDER=acme`.
   - Run `pnpm dev`, integration smoke tests, and `pnpm test:unit` (add suites if necessary).

---

## 5. Best Practices

- **Use shared DTOs**: Import `Cart`, `Product`, etc. from `lib/commerce/types` to guarantee consistency.
- **Centralize API calls**: Keep fetch logic inside `client.ts` to reuse headers, auth, and error handling.
- **Reshape data once**: `reshaping.ts` should be the only place converting backend responses to DTOs.
- **Handle errors consistently**: Throw `CommerceError` (from `lib/commerce/errors.ts`) with helpful codes/messages.
- **Cache carefully**: Use Next.js caching directives identical to the Shopify provider to maintain performance.
- **Log sparingly**: Console logging should be gated to `NODE_ENV === "development"` to avoid noisy logs in production.

---

## 6. Testing Recommendations

- **Unit tests**: Mirror the mock provider tests under `lib/commerce/providers/mock/__tests__/` to cover cart lifecycle and catalog behaviors.
- **Integration tests**: Add a script similar to `scripts/tests/mock-integration.ts` to exercise cart and search flows.
- **E2E**: Use Playwright/Cypress to cover checkout flows if your provider supports it.
- **Webhooks**: Simulate webhook payloads against the `/api/revalidate` route to ensure secrets and tag revalidation work.

---

## 7. Example: Mock Provider Highlights

- **Data fixtures**: `lib/commerce/providers/mock/data.ts` seeds products, collections, pages, menus, and a starter cart.
- **In-memory state**: Uses a `Map` to store carts during runtime; perfect for local development.
- **Latency simulation**: `delay()` adds small async pauses to mimic network calls.
- **Cart handling**: Demonstrates how to recalculate subtotals/taxes after each operation.

Use this provider as a blueprint for structuring your own data reshaping and cart logic.

---

## 8. Registration Checklist

- [ ] Provider files created under `lib/commerce/providers/<name>/`.
- [ ] `index.ts` exports a `CommerceProvider` with `name` + `requiredEnvVars`.
- [ ] Provider added to `CommerceProviderName` union and `COMMERCE_PROVIDERS` map in `lib/commerce/config.ts`.
- [ ] README documents required env vars and setup instructions.
- [ ] Tests added (unit/integration) and `pnpm test:unit` passes.
- [ ] Manual smoke test with `COMMERCE_PROVIDER=<name>` succeeds.

---

## 9. Debugging Tips

- **Missing env vars**: `CommerceError` with `MISSING_ENV_VARS` code indicates you forgot to set one of `requiredEnvVars`.
- **Provider not found**: Double-check `CommerceProviderName` union and dynamic import path in `lib/commerce/config.ts`.
- **Cart issues**: Ensure you’re reading/writing the same cart ID that the app stores in cookies. You may need to export helper functions or align with `components/cart/cart-context.ts`.
- **Webhook errors**: Log headers/payloads in development to ensure the secret or topic names match the provider’s documentation.
- **Caching confusion**: Compare your implementation against the Shopify provider’s usage of `"use cache"`, `cacheTag`, and `cacheLife`.

---

By following this guide, you can integrate any commerce backend—custom APIs, open-source platforms, or SaaS providers—without modifying the rest of the storefront. Happy building!
