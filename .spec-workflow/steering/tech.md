# Technical Architecture – Next.js Commerce

## Stack Snapshot
- **Runtime**: Next.js 15.3 App Router with React 19 Server Components/Server Actions, targeting Node.js 18+ and Vercel hosting.
- **Languages & Tooling**: TypeScript (strict, `noUncheckedIndexedAccess`), pnpm workspace, Prettier + Tailwind plugin for formatting, minimal automated tests (`pnpm test` runs Prettier check).
- **UI Layer**: Tailwind CSS v4 via `app/globals.css`, Geist Sans font, Headless UI + Heroicons + Sonner for feedback, custom component library in `components/`.
- **State & Auth**: NextAuth v5 beta with Google OAuth, custom `SessionProvider` and cart context built on `useOptimistic`.
- **Data Sources**: Shopify Storefront GraphQL API (primary product/catalog/cart source) plus local JSON persistence under `data/users` for account metadata, addresses, preferences, and saved carts.

## Application Architecture
### Rendering & Routing
- App Router directory (`app/`) organizes top-level routes: homepage (`page.tsx`), dynamic product pages (`product/[handle]/page.tsx`), collection/search surfaces (`search/[category]/page.tsx`), account dashboard, authentication, and marketing/static pages.
- `app/layout.tsx` composes global providers (session, cart) and shared UI (Navbar, WelcomeToast, Sonner Toaster). It fetches the cart server-side (`getCart`) and streams it via context to client subtrees.
- Progressive Page Rendering (PPR) and `inlineCss` experimental flags are enabled in `next.config.ts` to reduce blocking rendering and minimize CSS payloads.
- Static assets and metadata helpers (`opengraph-image.tsx`, `sitemap.ts`, `robots.ts`) rely on Next.js file-convention routes for SEO primitives.

### UI Composition
- UI components live under `components/` and are grouped by concern (cart, product, layout, grid, etc.). Components default to server components; client interactivity is opt-in via `"use client"` at file top (e.g., `components/cart/cart-context.tsx`, `components/cart/add-to-cart.tsx`).
- Tailwind v4 is used with plugin directives declared in `app/globals.css`. Design tokens lean on Tailwind defaults plus minimal custom CSS—focus is on utility classes for rapid iteration.
- Iconography uses Heroicons and bespoke SVG components under `components/icons`. Imagery is optimized via `next/image` and `next.config.ts` remotePatterns for Shopify CDN + Google profile images.

### State & Interactivity
- `components/cart/cart-context.tsx` supplies optimistic cart state using `useOptimistic` reducers; UI updates immediately while server actions mutate Shopify’s cart.
- Cart mutations (`components/cart/actions.ts`) are server actions that call `lib/shopify` mutations, tag revalidation, and `syncCartToUser` to persist state for authenticated users.
- Toasts (`components/welcome-toast.tsx`, `sonner`) surface state transitions (e.g., first-visit welcome, cart updates), keeping the UX responsive even when server actions round-trip.
- Account and settings pages use file-based data via `lib/user/*` helpers, with server actions for saving addresses, preferences, and orders.

## Data & Integration Layer
### Shopify Storefront GraphQL
- `lib/shopify` owns query/mutation documents, data reshaping, and error normalization. It enforces env validation (`validateEnvironmentVariables`) and ensures store domains have proper protocol prefix.
- Fetch helpers add Shopify access tokens and throw typed errors via `isShopifyError`. Responses are reshaped to UI-friendly `Product`, `Collection`, `Cart`, etc., by flattening GraphQL connections and augmenting missing data (e.g., generated image alt text).
- Tag-based caching (`unstable_cacheTag`, `unstable_cacheLife`) partitions data by `TAGS.products`, `TAGS.collections`, and `TAGS.cart`. Mutations call `revalidateTag` to keep ISR caches coherent.
- `app/api/revalidate/route.ts` exposes a webhook endpoint that calls `lib/shopify.revalidate` after verifying `SHOPIFY_REVALIDATION_SECRET`.

### User Persistence (File-Based)
- `lib/user/storage.ts` and `lib/user/cart-storage.ts` use the filesystem (`data/users`) to persist profiles, preferences, addresses, carts, and orders as JSON blobs. This is sufficient for local development but is not production-grade (no locking, no encryption, limited concurrency).
- Server actions under `lib/user/order-actions.ts` create and mutate orders after checkout by combining current cart contents with stored default billing/shipping addresses.
- These helpers are only invoked from authenticated contexts (session IDs from NextAuth). Missing records auto-seed defaults (e.g., `getCurrentUser()` creates a profile on first access).

### Authentication & Authorization
- `auth.ts` configures NextAuth with Google as the sole provider, custom sign-in page (`/login`), and session callback that injects `user.id`. Session typing is enforced in `types/next-auth.d.ts`.
- `app/api/auth/[...nextauth]/route.ts` exports handlers for OAuth callbacks. Application routes gate access via `auth()` server helper, and client components consume context through `SessionProvider`.
- There is no role-based authorization layer yet; account pages rely on server-provided session IDs, while API routes (e.g., `/api/orders/complete`) return 401 if no authenticated user.

### Internal APIs
- `app/api/orders/complete/route.ts` finalizes an order: it validates auth, loads the latest Shopify cart, uses `createOrderFromCart`, clears the saved cart, and returns the persisted order JSON. This route is meant to be invoked after a headless checkout completes.
- `app/api/revalidate/route.ts` proxies revalidation requests to `lib/shopify.revalidate`, enabling Shopify webhooks to invalidate ISR caches.
- Additional server-only utilities (`components/cart/cart-sync.ts`) expose server actions for syncing cart state with user storage.

## Performance, Caching, and Delivery
- **Rendering**: Server Components minimize client bundles; client islands are limited to interactivity (cart, search inputs, modals). Streaming + Suspense boundaries enable skeleton loaders while server data resolves.
- **Caching**: Next cache tags/lifetimes wrap catalog queries; `TAG.cart` remains uncacheable per-user but is memoized in `cookies().get("cartId")`. Revalidation endpoint plus Shopify webhook secret coordinate incremental updates.
- **Images**: Next image optimization with AVIF/WebP ensures fast media across Shopify CDN assets.
- **CSS**: Inline critical CSS combined with Tailwind ensures minimal blocking resources. Tailwind’s JIT plus `@tailwindcss/typography` + `@tailwindcss/container-queries` plugins address responsive layouts.
- **Env Validation**: `lib/utils.validateEnvironmentVariables` throws early if Shopify secrets are unset, preventing a broken build.

## Deployment & Environments
- Intended target is Vercel (see README). `pnpm dev` runs locally with `.env` derived from `.env.example`. Production builds rely on Vercel Environment Variables for Shopify + Auth secrets.
- `next.config.ts` enables remote image domains (Shopify CDN, Google avatars) and sets experimental caching features that currently require Vercel infrastructure.
- File-based persistence (`data/users`) assumes a writable filesystem; on Vercel this would need to be replaced with a durable store (KV, Postgres, etc.) to survive stateless deployments.

## Developer Experience & Tooling
- Commands: `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm prettier`, `pnpm test` (Prettier check). There is no Jest/Playwright suite checked in.
- Type safety enforced via strict TS config with path aliases (`@/*`). Most server files run in ESM modules with top-level async/await.
- No CI config in-repo; expect Vercel to run builds/tests on push.
- Coding conventions favor co-locating UI logic by domain (e.g., `components/product/*`, `components/layout/*`) and storing GraphQL fragments alongside queries.

## Security, Privacy, and Compliance
- OAuth relies on Google credentials plus `AUTH_SECRET`. All secrets must be set in environment variables; none are hard-coded.
- Webhook revalidation uses `SHOPIFY_REVALIDATION_SECRET`; requests failing verification are rejected in `lib/shopify.revalidate`.
- File-based persistence stores PII (addresses) unencrypted on disk, which is acceptable only for local dev. Production deployments must move data into a managed database with encryption-at-rest and access controls.
- There is no rate limiting or CSRF protection beyond what NextAuth provides. Server Actions must validate user identity before mutating user-specific data (currently done via `auth()` calls).

## Known Gaps & Risks
1. **Shopify Coupling** – `lib/shopify` permeates the UI; replacing Shopify requires either an abstraction layer or rewriting data hooks. This is a core consideration for any “remove Shopify” initiative.
2. **Persistence Layer** – JSON file storage is not deployable on serverless platforms; migrating to a real database (Planetscale/Postgres) is mandatory for production.
3. **Testing & Observability** – No automated tests or logging/monitoring exist, raising regression risk. Introducing unit tests for data reshaping and integration tests for cart/order flows should be prioritized.
4. **Auth Providers** – Google-only auth limits adoption. Adding email/password or additional providers will need updates to NextAuth config, session typing, and account management UIs.
5. **Checkout Experience** – Checkout is delegated to the commerce provider; order completion API assumes external checkout will call back. Documenting this contract (payloads, triggers) will reduce integration bugs.

## Future Considerations
- Introduce a data-provider interface (e.g., `CommerceProvider`) so Shopify-specific logic stays in one module, easing migrations to other backends.
- Replace filesystem persistence with a storage service (KV, Prisma/Postgres) and ensure server actions use transactional writes.
- Add automated accessibility/performance tests (Lighthouse CI) and integration tests for cart/order flows.
- Expand observability (structured logging, analytics hooks) to trace server actions and webhook activity in production.
