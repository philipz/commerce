# Migration Guide – Shopify to Commerce Provider Abstraction

This project now ships with a provider-agnostic commerce layer (`lib/commerce`) and a mock provider for local development. If you are upgrading from an **older release that still contains `lib/shopify`**, you can use the compatibility layer in that version to migrate gradually before pulling the latest code (which no longer ships the `lib/shopify` directory).

> **Who is this for?**  
> Teams already running the Shopify version of Next.js Commerce who want to adopt the new provider abstraction without breaking production.

---

## 1. What Changed?

- All storefront features (cart, catalog, menus, pages, revalidation) are now accessed through `getCommerce()` and the `CommerceProvider` interface.
- In older releases, `lib/shopify` still exports the legacy functions, proxying to the provider abstraction and emitting deprecation warnings in development.
- `COMMERCE_PROVIDER` controls which provider is active (`shopify` or `mock`). It defaults to `mock` for local development.

---

## 2. Quick Checklist

1. ✅ Add `COMMERCE_PROVIDER=shopify` to your `.env` or Vercel Environment Variables.
2. ✅ Verify your existing app still runs on your current release (the compatibility layer keeps `lib/shopify` imports working).
3. ✅ Migrate imports from `lib/shopify` to `@/lib/commerce` (or `lib/commerce`).
4. ✅ Replace direct function calls (e.g., `getProduct`) with `const commerce = await getCommerce(); await commerce.getProduct(...)`.
5. ✅ Watch the console for any remaining deprecation warnings.
6. ✅ Run tests (`pnpm test:unit`, `pnpm prettier:check`) and your normal QA flows.
7. ✅ Remove `lib/shopify` imports entirely before pulling the latest release (where the directory has already been removed).

---

## 3. Required Environment Updates

Add the provider flag alongside your existing Shopify credentials:

```dotenv
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN="https://your-shop-name.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="shpat_xxx"
SHOPIFY_REVALIDATION_SECRET="super-secret"
```

Nothing else changes—your Shopify Storefront API keys, revalidation secret, and OAuth configuration continue to work exactly as before.

---

## 4. Before/After Code Examples

### Loading Products (pages, layouts, server components)

**Before**

```ts
import { getProduct } from "lib/shopify";

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  // ...
}
```

**After**

```ts
import { getCommerce } from "@/lib/commerce";

export default async function ProductPage({ params }) {
  const commerce = await getCommerce();
  const product = await commerce.getProduct(params.handle);
  // ...
}
```

### Server Actions / API Routes (cart mutations, revalidation)

**Before**

```ts
import { addToCart, getCart } from "lib/shopify";

export async function addItem(_, merchandiseId: string) {
  const cart = await getCart();
  await addToCart([{ merchandiseId, quantity: 1 }]);
  return cart;
}
```

**After**

```ts
import { getCommerce } from "@/lib/commerce";

export async function addItem(_, merchandiseId: string) {
  const commerce = await getCommerce();
  const cart = await commerce.getCart();
  await commerce.addToCart([{ merchandiseId, quantity: 1 }]);
  return cart;
}
```

---

## 5. Migration Steps in Detail

1. **Lock in Shopify provider**  
   Ensure `COMMERCE_PROVIDER=shopify` is set in every environment (local, preview, production). Without it, the app falls back to the mock provider.

2. **Run your existing app**  
   On your current release, `lib/shopify` still works. Start your dev server (`pnpm dev`) or run an integration script to confirm checkout flows, search, and revalidation behave normally before upgrading.

3. **Address deprecation warnings**  
   In development, calls to `lib/shopify/*` log warnings pointing to the matching `commerce.*` method. Treat these logs as a to-do list.

4. **Update imports incrementally**  
   - Replace `import { getProduct } from "lib/shopify"` with `import { getCommerce } from "@/lib/commerce"`.
   - Cache the `commerce` instance (`const commerce = await getCommerce();`) per request and reuse it.
   - Update any type imports (`Product`, `Cart`, etc.) to come from `lib/commerce/types`.

5. **Verify each module**  
   After converting a page or server action, hit the route in your browser. Because the real Shopify provider is still active, you’ll get immediate feedback.

6. **Repeat until no `lib/shopify` imports remain**  
   Once the tree is clean, you can safely update to the latest release (where the deprecated directory is already gone).

---

## 6. Testing the Migration

- **Automated**: `pnpm test:unit` (Vitest suites) and `pnpm prettier:check`.
- **Integration (mock)**: `COMMERCE_PROVIDER=mock pnpm tsx scripts/tests/mock-integration.ts`.
- **Integration (Shopify)**: run your normal QA flows (`pnpm dev`, `pnpm build && pnpm start`) with `COMMERCE_PROVIDER=shopify` and real credentials.
- **Manual regression**: browse products, search, add/remove items, execute the revalidation webhook.

---

## 7. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Commerce provider "shopify" is missing required environment variables` | Double-check all Shopify env vars are set in the active shell / Vercel dashboard. |
| Revalidation returns 401 | Ensure `SHOPIFY_REVALIDATION_SECRET` matches the value configured in Shopify webhooks and your `.env`. |
| Still seeing `lib/shopify` warnings | Search for `from "lib/shopify"` and update the remaining files. Cached builds may show stale warnings until the server restarts. |
| Need to run locally without Shopify credentials | Switch to the mock provider by removing `COMMERCE_PROVIDER` or setting it to `mock`. |

---

## 8. Rollback Plan

If you encounter an issue mid-migration:

1. Revert the file to its previous `lib/shopify` import on your existing branch (older releases still include the compatibility layer).
2. Confirm `COMMERCE_PROVIDER=shopify` is set so the old path stays functional.
3. Open an issue or check the migration steps above—most failures stem from missing `await getCommerce()` or missing env vars.

---

Need help? Open an issue or reach out to the maintainers with details about your store configuration and the step that failed. Finish the migration on your current release before pulling the latest version (where `lib/shopify` has already been removed).
