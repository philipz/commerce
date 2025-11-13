# Project Structure – Next.js Commerce

## Directory Organization

```
project-root/
├── app/                    # Next.js App Router pages, layouts, metadata, route handlers
│   ├── api/                # Route handlers (auth, orders, revalidation)
│   ├── account/            # Authenticated dashboard sections (orders, addresses, preferences)
│   ├── product/, search/   # Product detail & discovery flows
│   └── [page]/, login/     # Marketing and auth views
├── components/             # Reusable UI building blocks grouped by domain (cart, layout, product, etc.)
├── lib/                    # Data + domain logic (Shopify client, user storage utilities, helpers)
│   ├── shopify/            # GraphQL queries/mutations, fetch helpers, reshaping utilities
│   └── user/               # File-backed persistence for carts, orders, addresses, preferences
├── fonts/                  # Local font assets
├── types/                  # Global TypeScript augmentations (e.g., NextAuth session typing)
├── public/ (generated)     # Static assets emitted by Next.js build (not checked in)
├── data/users/ (runtime)   # JSON blobs written by user storage helpers (ignored in VCS)
├── .spec-workflow/         # Spec + steering documentation (current workflow)
├── package.json / pnpm-lock.yaml
├── next.config.ts / postcss.config.mjs / tsconfig.json
└── README.md / AUTHENTICATION_SETUP.md / AGENTS.md
```

**Organization principles**
- App Router keeps routing concerns in `app/` for co-located layouts, loading states, and route-specific metadata.
- Presentational + interactive pieces live in `components/`, grouped by feature to encourage reuse (e.g., `components/cart/*`).
- Domain logic and integrations reside in `lib/`, split into provider-specific modules (`lib/shopify`) and user data helpers (`lib/user`).
- Supporting assets (fonts, docs, types) stay at the root for easy discovery.

## Naming Conventions

### Files
- **Components**: `kebab-case.tsx` (`add-to-cart.tsx`, `product-description.tsx`). Directory names follow the same convention.
- **Hooks/Utilities**: `kebab-case.ts` (`cart-context.tsx`, `cart-storage.ts`).
- **Next.js routes**: Directory-based naming (`app/product/[handle]/page.tsx`) with bracket syntax for dynamics.
- **Type augmentation**: `types/next-auth.d.ts`.
- **Docs**: `UPPER_SNAKE_CASE.md` for repo guides, lowercase for steering/spec files.

### Code
- **Components, Classes, Types**: `PascalCase` (`CartProvider`, `Order`, `ShippingAddress`).
- **Functions & Hooks**: `camelCase` (`getCart`, `syncCartToUser`, `createOrderFromCart`).
- **Constants & Enums**: `UPPER_SNAKE_CASE` (`TAGS`, `HIDDEN_PRODUCT_TAG`, `SHOPIFY_GRAPHQL_API_ENDPOINT`).
- **Variables & Props**: `camelCase`.

## Import Patterns

### Order
1. Node/third-party modules (`next/cache`, `react`, `sonner`).
2. Absolute project imports via alias `@/*` (configured in `tsconfig.json`).
3. Relative paths within the same feature folder (`./product-description`).
4. Styles/assets (`./globals.css`).

### Module Organization
- `tsconfig.json` defines `@/*` → project root; use absolute imports for cross-feature dependencies to avoid brittle `../../../`.
- Keep intra-feature imports relative to highlight local cohesion (e.g., `components/cart/*`).
- GraphQL documents in `lib/shopify/{queries,mutations,fragments}` are imported via barrel files to centralize API shapes.

## Code Structure Patterns

### File Layout
1. `"use client"` directive when needed.
2. External dependencies.
3. Internal dependencies (absolute before relative).
4. Constants/config/types.
5. Core implementation (component, handler, or function).
6. Helper utilities (kept local if only used in file).
7. Exports at bottom (`export function`, `export const`, default export when applicable).

### Component Patterns
- Server Components by default; mark interactive files with `"use client"` and keep client surface minimal.
- Hooks and context providers (`CartProvider`) encapsulate optimistic state updates so UI components stay declarative.
- Prefer composition: layout primitives (`components/layout/*`) wrap domain-specific views (product grid, search filters).

### Route Handlers / Server Actions
- Input validation + auth at the top (`auth()` guard, payload checks).
- Core side effects next (Shopify API calls, filesystem reads/writes).
- Error handling via early returns or structured exceptions with `NextResponse.json`.

## Code Organization Principles
1. **Feature-first structure**: keep related UI, state, and logic close.
2. **Separation of concerns**: `app/` handles routing/rendering, `components/` handles UI, `lib/` handles data + integrations.
3. **Client minimalism**: offload as much logic as possible to server components/actions to reduce bundle size.
4. **Optimistic UX**: wrap server mutations with optimistic state contexts and toast feedback.
5. **Type safety**: export shared interfaces from `lib/shopify/types` and `lib/user/types` to avoid ad-hoc shapes.

## Module Boundaries
- **App Router vs Components**: `app/*` should only orchestrate data fetching + layout composition; reusable logic stays in `components/` or `lib/`.
- **Shopify Integration**: All API access flows through `lib/shopify`. UI layers consume reshaped DTOs (`Product`, `Collection`, `Cart`) instead of raw GraphQL responses to isolate provider changes.
- **User Persistence**: The only modules touching `data/users` are under `lib/user/*` and server actions (`components/cart/cart-sync.ts`, `lib/user/order-actions.ts`). Client code never accesses filesystem helpers directly.
- **Auth**: `auth.ts` + `components/auth/session-provider.tsx` encapsulate NextAuth usage. Other modules request session data via exported helpers (`auth`, `SessionProvider`).
- **Cross-cutting utilities**: `lib/utils.ts` (URL helpers, env validation) stays provider-agnostic.

## Code Size Guidelines
- **Files**: Target ≤250 lines for React components/route handlers. Split view logic vs helpers if a file grows beyond that.
- **Functions/Components**: Keep under ~80 lines. Extract helper functions or child components when branching/side effects grow.
- **Nesting depth**: Limit JSX nesting to 3 levels; prefer descriptive subcomponents.
- **GraphQL documents**: Keep each query/mutation in its own file for readability and tree-shaking.

## Dashboard/Monitoring Structure
- No standalone dashboard/monitoring subsystem is checked in. Operational monitoring is expected to be handled externally (e.g., Vercel analytics). If a dashboard is added later, house it under `app/dashboard/` with self-contained server/client modules to avoid coupling with storefront routes.

## Documentation Standards
- `README.md` documents setup, providers, and dev workflow; extend it when adding new integrations or commands.
- `AUTHENTICATION_SETUP.md` (and similar guides) should stay updated whenever auth providers or env vars change.
- Source files should include concise comments when logic is non-obvious (e.g., reshaping Shopify payloads, optimistic cart math). Avoid redundant comments on self-explanatory code.
- Public APIs (server actions, exported helpers) need docstrings or block comments summarizing side effects, params, and expected usage.
