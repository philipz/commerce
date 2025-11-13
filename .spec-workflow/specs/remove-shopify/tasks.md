# Tasks Document - Remove Shopify Dependencies

## Phase 1: Foundation (Create Commerce Abstraction Layer)

- [x] 1. Create commerce abstraction directory structure and core types
  - Files: `lib/commerce/types.ts`, `lib/commerce/errors.ts`, `lib/commerce/utils.ts`
  - Create directory structure: `lib/commerce/`, `lib/commerce/providers/`
  - Define generic commerce DTOs (Cart, Product, Collection, etc.) by moving types from `lib/shopify/types.ts`
  - Create `CommerceError` class and error normalization utilities
  - Extract generic GraphQL utilities (e.g., `removeEdgesAndNodes<T>()`)
  - Purpose: Establish type-safe foundation for provider abstraction
  - _Leverage: `lib/shopify/types.ts` (existing types), `lib/type-guards.ts` (error patterns)_
  - _Requirements: 2.1, 2.2, 6.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer specializing in type systems and domain modeling | Task: Create the foundational type system for the commerce abstraction layer by extracting and refactoring types from lib/shopify/types.ts into generic, provider-agnostic DTOs. Move all non-Shopify-specific types (Cart, Product, Collection, Image, Money, Page, Menu, etc.) to lib/commerce/types.ts. Create CommerceError class with code, status, and cause fields in lib/commerce/errors.ts with normalizeError and isCommerceError utilities. Extract removeEdgesAndNodes utility to lib/commerce/utils.ts for GraphQL connection flattening. | Restrictions: Do not modify existing Shopify-specific types (prefixed with 'Shopify'), maintain exact type signatures for backward compatibility, ensure all exported types are properly documented with JSDoc, do not introduce runtime dependencies | Leverage: Examine lib/shopify/types.ts for type definitions to extract, review lib/type-guards.ts for error handling patterns to generalize | Requirements: Implements requirement 2 (Type-Safe Provider Interface), requirement 6 (UI Components Must Be Provider-Agnostic) | Success: lib/commerce/types.ts contains all generic DTOs with full TypeScript coverage, CommerceError class properly extends Error with required fields, removeEdgesAndNodes utility is generic and reusable, all types compile without errors and maintain backward compatibility | Instructions: First, mark this task as in-progress in tasks.md by changing [ ] to [-]. After completing implementation, use the log-implementation tool to record all artifacts (types created, utilities extracted) with file locations and purposes. Then mark task as complete [x] in tasks.md._

- [x] 2. Create CommerceProvider interface
  - File: `lib/commerce/provider.interface.ts`
  - Define complete interface with all required methods (cart, product, collection, page, menu operations)
  - Add `name` and `requiredEnvVars` properties
  - Include method signatures for createCart, getCart, addToCart, updateCart, removeFromCart
  - Include getProduct, getProducts, getProductRecommendations, getCollection, getCollections, etc.
  - Add revalidate method signature for webhook handling
  - Purpose: Define the contract all commerce providers must implement
  - _Leverage: `lib/shopify/index.ts` (existing method signatures), `lib/commerce/types.ts` (newly created DTOs)_
  - _Requirements: 1.1, 2.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Software Architect specializing in interface design and TypeScript contracts | Task: Design the CommerceProvider interface that defines the contract for all commerce backend implementations. Study lib/shopify/index.ts to extract all exported functions and convert them into interface method signatures. Include cart operations (createCart, getCart, addToCart, updateCart, removeFromCart), product operations (getProduct, getProducts, getProductRecommendations), collection operations (getCollection, getCollections, getCollectionProducts), content operations (getPage, getPages, getMenu), and webhook handling (revalidate). Add name property (string) and requiredEnvVars property (string[]). Ensure all methods use the generic types from lib/commerce/types.ts. | Restrictions: Must include ALL methods from current lib/shopify/index.ts exports, use only generic types (no Shopify-specific types), ensure methods support async operations, do not add implementation details | Leverage: Review lib/shopify/index.ts for complete method list, use lib/commerce/types.ts for parameter and return types | Requirements: Implements requirement 1 (Commerce Provider Abstraction Layer), requirement 2 (Type-Safe Provider Interface) | Success: Interface defines all required methods with proper TypeScript signatures, uses generic commerce types throughout, includes name and requiredEnvVars metadata fields, compiles without errors and provides full IntelliSense support | Instructions: Mark task as in-progress [-] in tasks.md, implement interface, use log-implementation tool to document the interface structure with all method signatures, mark complete [x] in tasks.md._

- [x] 3. Create provider factory and configuration
  - Files: `lib/commerce/config.ts`, `lib/commerce/index.ts`
  - Implement `getCommerceProvider()` factory function with dynamic imports for tree-shaking
  - Add provider selection logic based on `COMMERCE_PROVIDER` env var (defaults to 'mock')
  - Add environment variable validation (`validateProviderEnv` function)
  - Create singleton pattern for caching provider instance
  - Export public API and re-export types for convenience
  - Purpose: Enable provider selection and validation at runtime
  - _Leverage: `lib/utils.ts` (env validation patterns), `lib/commerce/provider.interface.ts`_
  - _Requirements: 4.1, 5.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Architect specializing in factory patterns and dependency injection | Task: Create the provider factory system for dynamic provider selection. In lib/commerce/config.ts, implement getCommerceProvider() that reads COMMERCE_PROVIDER env var, validates it against available providers (shopify, mock), dynamically imports the selected provider module, validates required env vars by calling validateProviderEnv(), and returns the provider instance. Add validateProviderEnv() function that checks provider.requiredEnvVars against process.env and throws descriptive errors for missing vars. In lib/commerce/index.ts, create getCommerce() that caches the provider instance and logs active provider in development mode. Re-export all types and errors for convenience. | Restrictions: Must use dynamic imports for tree-shaking, do not hardcode provider list (use const object), ensure error messages include provider name and missing var names, cache must be module-level singleton | Leverage: Review lib/utils.ts for ensureStartsWith and env validation patterns, use lib/commerce/provider.interface.ts for type contracts | Requirements: Implements requirement 4 (Mock/Demo Provider), requirement 5 (Environment Configuration) | Success: Factory dynamically loads providers without bundling unused ones, env var validation provides clear error messages, caching prevents repeated provider initialization, development logs show active provider name, all exports are properly typed | Instructions: Mark task in-progress [-], implement factory and exports, use log-implementation tool to document getCommerceProvider and getCommerce functions with their responsibilities, mark complete [x]._

## Phase 2: Mock Provider Implementation

- [x] 4. Create mock provider data fixtures
  - File: `lib/commerce/providers/mock/data.ts`
  - Create realistic mock data: 12+ products with variants, images, pricing
  - Add 5+ collections with different categories
  - Create mock cart structure with sample items
  - Add mock pages and menu data
  - Purpose: Provide realistic fake data for local development without external dependencies
  - _Leverage: `lib/commerce/types.ts` (DTO definitions)_
  - _Requirements: 4.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Full-stack Developer with expertise in test data generation and ecommerce domain modeling | Task: Create comprehensive mock data fixtures for development and testing. Generate at least 12 realistic products covering various categories (t-shirts, hoodies, accessories) with proper variants (sizes, colors), high-quality placeholder images (using placeholder services or real product images), realistic pricing in USD, proper SEO fields, and tags. Create 5+ collections (Featured, New Arrivals, Sale, Shirts, Accessories) with descriptions and SEO. Add a pre-populated mock cart with 2-3 items showing different products. Include mock pages (About, Returns, FAQ) and navigation menus. All data must match the types in lib/commerce/types.ts exactly. | Restrictions: Must use valid image URLs (placeholder services acceptable), ensure all required fields are populated, prices must be realistic (not $0.00), variants must have unique IDs, do not use copyrighted brand names | Leverage: Reference lib/commerce/types.ts for exact data structures, examine lib/shopify/types.ts for examples of complete product data | Requirements: Implements requirement 4 (Mock/Demo Provider Implementation) | Success: At least 12 complete products with multiple variants and images, 5+ themed collections, realistic pricing and descriptions, all data is valid against commerce types, mock data enables full UI testing without API | Instructions: Mark in-progress [-], create data.ts with exported constants (mockProducts, mockCollections, mockCart, mockPages, mockMenus), use log-implementation tool to document data structure with product count and collection types, mark complete [x]._

- [x] 5. Implement mock provider with all interface methods
  - File: `lib/commerce/providers/mock/index.ts`
  - Implement `CommerceProvider` interface using mock data
  - Add realistic delays (50-200ms) to simulate API latency
  - Implement cart state management with in-memory storage
  - Add search/filter logic for getProducts (query, sortKey, reverse)
  - Implement collection filtering and product recommendations
  - Add console logging for debugging in development
  - Purpose: Enable full application functionality without external commerce backend
  - _Leverage: `lib/commerce/providers/mock/data.ts`, `lib/commerce/provider.interface.ts`_
  - _Requirements: 4.1, 4.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer specializing in mock implementations and state management | Task: Create a fully functional mock commerce provider implementing CommerceProvider interface. Implement all cart methods (createCart returns new cart with random ID, getCart retrieves from memory, addToCart/updateCart/removeFromCart manipulate mock cart state), product methods (getProduct finds by handle, getProducts supports query/sortKey/reverse filtering, getProductRecommendations returns random products), collection methods (getCollection/getCollections return mock data, getCollectionProducts filters products by collection), content methods (getPage/getPages/getMenu return mock data), and revalidate (no-op returning 200). Add realistic async delays (50-200ms) and console logs in development mode. Set name='mock' and requiredEnvVars=[]. | Restrictions: Must implement ALL interface methods, cart state must persist during app runtime, search must be case-insensitive, do not use external libraries for filtering, ensure type safety throughout | Leverage: Import mock data from ./data.ts, implement CommerceProvider from ../../provider.interface.ts, reference lib/shopify/index.ts for expected behavior patterns | Requirements: Implements requirement 4 (Mock/Demo Provider Implementation) | Success: All interface methods implemented and functional, cart operations work with in-memory state, product search and filtering work correctly, realistic API behavior with delays, enables full local development without external dependencies | Instructions: Mark in-progress [-], implement provider class, export as default, use log-implementation tool to document all implemented methods and mock behavior, mark complete [x]._

- [x] 6. Add mock provider README with usage instructions
  - File: `lib/commerce/providers/mock/README.md`
  - Document how to enable mock provider (`COMMERCE_PROVIDER=mock`)
  - Explain mock data structure and how to customize
  - List limitations (no persistence, simplified logic)
  - Add troubleshooting section
  - Purpose: Help developers understand and use mock provider effectively
  - _Leverage: Mock provider implementation_
  - _Requirements: 10.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer specializing in developer documentation | Task: Create comprehensive documentation for the mock provider. Write README.md covering: (1) Purpose and use cases, (2) How to enable (set COMMERCE_PROVIDER=mock in .env), (3) Mock data overview (number of products, collections, what's included), (4) How to customize mock data by editing data.ts, (5) Limitations (no persistence across restarts, no real checkout, simplified search), (6) Troubleshooting (provider not loading, data not showing), (7) Comparison with real providers. Use clear headings, code examples, and practical tips. | Restrictions: Keep documentation concise (under 200 lines), use markdown formatting, include code examples for common tasks, do not over-promise capabilities | Leverage: Review lib/commerce/providers/mock/index.ts and data.ts for accurate capability descriptions | Requirements: Implements requirement 10 (Provider Documentation) | Success: README provides clear setup instructions, developers can customize mock data easily, limitations are clearly stated, troubleshooting covers common issues | Instructions: Mark in-progress [-], write README.md, use log-implementation tool to log documentation creation, mark complete [x]._

## Phase 3: Shopify Provider Migration

- [x] 7. Create Shopify provider directory and move GraphQL queries/mutations
  - Files: Move `lib/shopify/queries/*.ts` → `lib/commerce/providers/shopify/queries/*.ts`
  - Files: Move `lib/shopify/mutations/*.ts` → `lib/commerce/providers/shopify/mutations/*.ts`
  - Files: Move `lib/shopify/fragments/*.ts` → `lib/commerce/providers/shopify/fragments/*.ts`
  - Create directory structure for Shopify provider
  - Move all GraphQL query, mutation, and fragment files unchanged
  - Purpose: Relocate Shopify-specific GraphQL documents to provider directory
  - _Leverage: Existing Shopify GraphQL files_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with expertise in code migration and file organization | Task: Migrate Shopify GraphQL documents to the new provider structure. Create lib/commerce/providers/shopify/ directory with queries/, mutations/, and fragments/ subdirectories. Move all files from lib/shopify/queries/ to lib/commerce/providers/shopify/queries/, lib/shopify/mutations/ to lib/commerce/providers/shopify/mutations/, and lib/shopify/fragments/ to lib/commerce/providers/shopify/fragments/. Keep all file contents exactly as-is (no modifications). Update any internal imports within these files if they reference sibling files. | Restrictions: Do NOT modify GraphQL query/mutation content, do NOT change exports, only update import paths if necessary, maintain exact file names, do not move types.ts yet | Leverage: Review lib/shopify/ directory structure for complete file list, check for internal imports between fragments and queries | Requirements: Implements requirement 3 (Shopify Implementation as Reference Provider) | Success: All GraphQL files relocated to new provider directory, internal imports updated correctly, no GraphQL content changed, files compile without errors | Instructions: Mark in-progress [-], use git mv or create new files with exact content, use log-implementation tool to list all migrated files, mark complete [x]._

- [x] 8. Create Shopify provider client and reshaping utilities
  - Files: `lib/commerce/providers/shopify/client.ts`, `lib/commerce/providers/shopify/reshaping.ts`, `lib/commerce/providers/shopify/types.ts`
  - Extract `shopifyFetch` function to `client.ts` with error handling
  - Move reshaping functions (reshapeCart, reshapeProduct, etc.) to `reshaping.ts`
  - Move Shopify-specific types (ShopifyCart, ShopifyProduct, etc.) to provider `types.ts`
  - Update imports to use generic types from `lib/commerce/types.ts` where appropriate
  - Purpose: Modularize Shopify provider internals for clarity and maintainability
  - _Leverage: `lib/shopify/index.ts` (existing functions), `lib/constants.ts`, `lib/type-guards.ts`_
  - _Requirements: 3.1, 3.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer specializing in API integration and data transformation | Task: Refactor Shopify provider internals into organized modules. Create client.ts with shopifyFetch function (extract from lib/shopify/index.ts lines 71-119), including error handling with isShopifyError. Create reshaping.ts with all reshaping functions: reshapeCart, reshapeProduct, reshapeProducts, reshapeCollection, reshapeCollections, reshapeImages (extract from lib/shopify/index.ts). Create types.ts with all Shopify-specific types (those prefixed with 'Shopify' from lib/shopify/types.ts). Update reshaping functions to import generic types (Cart, Product, etc.) from lib/commerce/types.ts and Shopify types from local types.ts. Ensure client.ts imports SHOPIFY_GRAPHQL_API_ENDPOINT from lib/constants and uses ensureStartsWith from lib/utils. | Restrictions: Maintain exact function logic (do not refactor behavior), preserve error handling patterns, ensure all imports are correct, do not break existing functionality | Leverage: Extract code from lib/shopify/index.ts, reference lib/constants.ts for constants, use lib/type-guards.ts for error checks, import from lib/commerce/types.ts for generic types | Requirements: Implements requirement 3 (Shopify Implementation as Reference Provider) | Success: client.ts has working shopifyFetch with error handling, reshaping.ts has all transformation functions working correctly, types.ts has complete Shopify-specific types, all modules compile and imports resolve correctly | Instructions: Mark in-progress [-], create three files with extracted code, use log-implementation tool to document each module's responsibilities and exported functions, mark complete [x]._

- [x] 9. Implement Shopify provider implementing CommerceProvider interface
  - File: `lib/commerce/providers/shopify/index.ts`
  - Create Shopify provider object implementing `CommerceProvider` interface
  - Implement all cart methods using existing mutations/queries
  - Implement all product, collection, and page methods
  - Implement revalidate method with webhook validation
  - Set `name: 'shopify'` and `requiredEnvVars: ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN']`
  - Add optional `SHOPIFY_REVALIDATION_SECRET` for webhook validation
  - Purpose: Wrap existing Shopify logic in provider interface
  - _Leverage: `lib/commerce/providers/shopify/client.ts`, `lib/commerce/providers/shopify/reshaping.ts`, queries, mutations_
  - _Requirements: 3.1, 3.2, 3.3_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer specializing in API integration and interface implementation | Task: Create the Shopify provider by implementing CommerceProvider interface. Import shopifyFetch from ./client, reshaping functions from ./reshaping, queries from ./queries, and mutations from ./mutations. Create an object literal implementing CommerceProvider with name='shopify', requiredEnvVars=['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN']. Implement all methods by calling shopifyFetch with appropriate query/mutation, then reshaping the response. For cart methods, read cartId from cookies (import from next/headers). For revalidate, extract webhook handling logic from lib/shopify/index.ts (lines 464-501) including secret validation. Maintain all Next.js caching directives ('use cache', cacheTag, cacheLife) from original implementation. | Restrictions: Must implement ALL CommerceProvider interface methods, maintain exact caching behavior, preserve cookie handling, keep webhook secret validation, do not change GraphQL query/mutation logic | Leverage: Reference lib/shopify/index.ts for method implementations, import from ./client, ./reshaping, ./queries/*, ./mutations/*, use lib/constants for TAGS, import Next.js helpers (cookies, headers, revalidateTag, etc.) | Requirements: Implements requirement 3 (Shopify Implementation as Reference Provider), requirement 7 (Server Actions Must Be Provider-Independent) | Success: All interface methods implemented correctly, caching behavior preserved, webhook validation works, cart operations use cookies correctly, provider passes all existing Shopify integration tests | Instructions: Mark in-progress [-], implement provider object and export as default, use log-implementation tool to document all implemented methods and maintained behaviors, mark complete [x]._

- [x] 10. Add Shopify provider README with setup instructions
  - File: `lib/commerce/providers/shopify/README.md`
  - Document required environment variables
  - Explain Shopify Storefront API setup
  - Add webhook configuration instructions for revalidation
  - Include troubleshooting for common Shopify errors
  - Purpose: Guide developers through Shopify provider configuration
  - _Leverage: Existing Shopify documentation, main README.md_
  - _Requirements: 10.1, 10.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with expertise in API integration documentation | Task: Create comprehensive Shopify provider documentation. Write README.md covering: (1) Overview and purpose, (2) Required environment variables (SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_REVALIDATION_SECRET) with descriptions, (3) Shopify Storefront API setup steps (create app, get credentials, configure permissions), (4) How to enable (set COMMERCE_PROVIDER=shopify), (5) Webhook configuration for cache revalidation (endpoint URL, secret setup, topics to subscribe), (6) Caching behavior (cache tags, revalidation), (7) Troubleshooting (invalid credentials, GraphQL errors, webhook failures), (8) Limitations (Storefront API restrictions, rate limits). Include links to Shopify developer docs. | Restrictions: Keep under 300 lines, use clear headings and code blocks, provide exact env var names, include actual Shopify setup screenshots or links | Leverage: Review lib/commerce/providers/shopify/index.ts for capabilities, reference main README.md for existing setup guidance, check Shopify Storefront API docs for accurate instructions | Requirements: Implements requirement 10 (Provider Documentation), requirement 9 (Backward Compatibility) | Success: README provides complete Shopify setup guide, env vars clearly documented, webhook setup is step-by-step, troubleshooting covers common issues, developers can configure Shopify without external help | Instructions: Mark in-progress [-], write README.md, use log-implementation tool to log documentation completion, mark complete [x]._

## Phase 4: Component Migration to Provider-Agnostic API

- [x] 11. Update cart server actions to use commerce abstraction
  - File: `components/cart/actions.ts`
  - Replace `import { addToCart, getCart, ... } from "lib/shopify"` with `import { getCommerce } from "@/lib/commerce"`
  - Update all cart operations to call `commerce.methodName()` pattern
  - Update `addItem`, `removeItem`, `updateItemQuantity`, `redirectToCheckout` functions
  - Maintain exact same behavior and error handling
  - Purpose: Make cart actions provider-agnostic
  - _Leverage: `lib/commerce/index.ts`, existing cart sync logic_
  - _Requirements: 6.1, 7.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer specializing in server actions and refactoring | Task: Refactor cart server actions to use the commerce abstraction. Read components/cart/actions.ts and replace the import statement 'import { addToCart, createCart, getCart, removeFromCart, updateCart } from "lib/shopify"' with 'import { getCommerce } from "@/lib/commerce"'. Then update each server action function (addItem, removeItem, updateItemQuantity, redirectToCheckout) to: (1) call 'const commerce = await getCommerce()' at the start, (2) replace direct function calls with commerce methods (e.g., 'addToCart(...)' becomes 'commerce.addToCart(...)', 'getCart()' becomes 'commerce.getCart()', etc.). Maintain all existing logic including error handling, cart syncing (syncCartToUser), and revalidateTag calls. | Restrictions: Do NOT change function signatures or exports, maintain exact same behavior, preserve error handling and return values, keep syncCartToUser calls, do not refactor other logic | Leverage: Reference components/cart/actions.ts for current implementation, use lib/commerce/index.ts for getCommerce function, maintain TAGS usage from lib/constants | Requirements: Implements requirement 6 (UI Components Must Be Provider-Agnostic), requirement 7 (Server Actions Must Be Provider-Independent) | Success: All cart server actions use commerce abstraction, behavior is identical to before, tests pass without modification, no direct Shopify imports remain, cart operations work with any provider | Instructions: Mark in-progress [-], refactor import and function calls, test cart operations, use log-implementation tool to document updated functions and integration points, mark complete [x]._

- [x] 12. Update product page routes to use commerce abstraction
  - Files: `app/product/[handle]/page.tsx`, `app/page.tsx` (homepage), `app/search/page.tsx`, `app/search/[collection]/page.tsx`
  - Replace Shopify imports with commerce imports
  - Update product and collection fetching to use `commerce.methodName()` pattern
  - Maintain caching behavior with 'use cache' directives
  - Purpose: Make product pages provider-agnostic
  - _Leverage: `lib/commerce/index.ts`, existing page structures_
  - _Requirements: 6.1, 8.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Full-stack Developer with expertise in Next.js App Router and server components | Task: Refactor product and search pages to use commerce abstraction. For each file (app/product/[handle]/page.tsx, app/page.tsx, app/search/page.tsx, app/search/[collection]/page.tsx), replace 'import { getProduct, getProducts, getCollection, ... } from "lib/shopify"' with 'import { getCommerce } from "@/lib/commerce"'. Update all data fetching: (1) add 'const commerce = await getCommerce()' at start of page component, (2) replace function calls with commerce methods (getProduct → commerce.getProduct, getProducts → commerce.getProducts, etc.). Maintain all Next.js features (dynamic routes, metadata generation, caching, Suspense boundaries). Keep generateMetadata functions working correctly. | Restrictions: Do NOT change page layouts or UI components, maintain exact caching behavior, preserve metadata generation, keep dynamic route parameters, do not refactor UI logic | Leverage: Read each page file for current Shopify imports, use lib/commerce/index.ts for commerce API, preserve Next.js caching with 'use cache' and cache tags | Requirements: Implements requirement 6 (UI Components Must Be Provider-Agnostic), requirement 8 (Search and Discovery Abstraction) | Success: All pages use commerce abstraction, no direct Shopify imports, pages work with any provider, caching and performance maintained, metadata generation works correctly | Instructions: Mark in-progress [-], update each page file, test rendering and data fetching, use log-implementation tool to document updated pages and maintained features, mark complete [x]._

- [x] 13. Update layout and navigation components to use commerce abstraction
  - Files: `components/layout/navbar/index.tsx`, `components/layout/navbar/mobile-menu.tsx`, `components/layout/footer.tsx`, `components/layout/footer-menu.tsx`
  - Replace Shopify imports with commerce imports
  - Update menu and collection fetching to use commerce API
  - Purpose: Make navigation components provider-agnostic
  - _Leverage: `lib/commerce/index.ts`, existing component patterns_
  - _Requirements: 6.1, 8.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer specializing in React components and navigation systems | Task: Refactor layout and navigation components to use commerce abstraction. For each component (navbar/index.tsx, mobile-menu.tsx, footer.tsx, footer-menu.tsx), replace 'import { getMenu, getCollections, ... } from "lib/shopify"' with 'import { getCommerce } from "@/lib/commerce"'. Update data fetching logic: (1) for server components, add 'const commerce = await getCommerce()' and replace direct calls, (2) for client components receiving props, ensure parent server components pass commerce-fetched data. Maintain component structure, styling, and interactivity. | Restrictions: Do NOT change component UI or user interactions, maintain server/client component boundaries, preserve styling and responsive behavior, keep existing props interfaces | Leverage: Review each component for Shopify imports, use lib/commerce/index.ts for commerce methods, check if components are server or client components | Requirements: Implements requirement 6 (UI Components Must Be Provider-Agnostic), requirement 8 (Search and Discovery Abstraction) | Success: All navigation components use commerce abstraction, menus and collections load correctly, no Shopify imports remain, components work with any provider, UI and styling unchanged | Instructions: Mark in-progress [-], refactor each component, test navigation and menu rendering, use log-implementation tool to document updated components and data flow, mark complete [x]._

- [x] 14. Update remaining components using Shopify imports
  - Files: `components/carousel.tsx`, `components/grid/three-items.tsx`, `components/layout/product-grid-items.tsx`, `components/layout/search/collections.tsx`, `components/product/product-description.tsx`, `components/product/variant-selector.tsx`
  - Replace all remaining Shopify imports with commerce imports
  - Update data fetching and prop handling
  - Purpose: Complete component migration to provider-agnostic code
  - _Leverage: `lib/commerce/index.ts`, pattern from previous component updates_
  - _Requirements: 6.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Frontend Developer with expertise in component refactoring and React patterns | Task: Complete the component migration by refactoring remaining files that import from lib/shopify. For each file (carousel.tsx, three-items.tsx, product-grid-items.tsx, collections.tsx, product-description.tsx, variant-selector.tsx), replace Shopify imports with commerce imports ('import { getCommerce } from "@/lib/commerce"'). Update data fetching logic: (1) server components get commerce instance and call methods, (2) client components receive data via props (no changes needed unless they import types). Most of these components likely just use types or receive data as props, so focus on import statements and type usage. Ensure Product, Collection, and other types come from lib/commerce/types. | Restrictions: Do NOT change component functionality or UI, maintain prop interfaces, preserve client/server boundaries, keep existing component composition patterns | Leverage: Search each file for 'from "lib/shopify"' or 'from "lib/shopify' imports, use lib/commerce for types and methods, follow patterns from tasks 11-13 | Requirements: Implements requirement 6 (UI Components Must Be Provider-Agnostic) | Success: Zero imports from lib/shopify in components/ directory, all components work with commerce abstraction, types are correct, UI functionality unchanged, components work with any provider | Instructions: Mark in-progress [-], update imports in each file, verify components render correctly, use log-implementation tool to list all updated files, mark complete [x]._

- [x] 15. Update API route handlers to use commerce abstraction
  - File: `app/api/revalidate/route.ts`
  - Replace Shopify revalidate import with commerce import
  - Update handler to call `commerce.revalidate(req)`
  - Maintain webhook secret validation and error handling
  - Purpose: Make API routes provider-agnostic
  - _Leverage: `lib/commerce/index.ts`, provider revalidate implementations_
  - _Requirements: 7.1, 8.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Backend Developer specializing in API development and webhook handling | Task: Refactor the revalidation API route to use commerce abstraction. Read app/api/revalidate/route.ts and replace 'import { revalidate } from "lib/shopify"' with 'import { getCommerce } from "@/lib/commerce"'. Update the POST handler function to: (1) call 'const commerce = await getCommerce()' at the start, (2) replace 'return revalidate(req)' with 'return commerce.revalidate(req)'. The provider's revalidate method handles all webhook verification internally, so the route handler becomes very simple. Maintain any existing error handling or logging. | Restrictions: Do NOT change route exports or HTTP method handling, maintain exact response format, preserve any existing logging, keep route as simple as possible | Leverage: Read app/api/revalidate/route.ts for current implementation, use lib/commerce/index.ts for getCommerce, provider's revalidate method handles all logic | Requirements: Implements requirement 7 (Server Actions Must Be Provider-Independent) | Success: API route uses commerce abstraction, webhook validation works for Shopify provider, mock provider returns 200 response, no Shopify imports remain, existing webhook setup continues to work | Instructions: Mark in-progress [-], refactor route handler, test webhook endpoint, use log-implementation tool to document API route integration, mark complete [x]._

## Phase 5: Environment Configuration and Backward Compatibility

- [x] 16. Update environment variable validation
  - Files: `lib/utils.ts`, `.env.example`
  - Remove Shopify-specific env validation from utils
  - Provider factory now handles provider-specific validation
  - Update `.env.example` to include `COMMERCE_PROVIDER` variable with comments
  - Add migration note about COMMERCE_PROVIDER defaults
  - Purpose: Support configurable provider selection and clear env setup
  - _Leverage: `lib/commerce/config.ts` (provider validation)_
  - _Requirements: 5.1, 9.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with expertise in configuration management and environment setup | Task: Update environment configuration for provider abstraction. In lib/utils.ts, find and remove the validateEnvironmentVariables function (or remove Shopify-specific checks if it validates other things too), since provider validation is now handled by lib/commerce/config.ts. Update .env.example to add COMMERCE_PROVIDER variable with inline comment explaining options (shopify, mock, default is mock). Add comments for each Shopify env var indicating they're only needed when COMMERCE_PROVIDER=shopify. Add a migration comment at the top explaining that existing Shopify users should add COMMERCE_PROVIDER=shopify. | Restrictions: Do NOT remove other utility functions from lib/utils.ts, only remove Shopify env validation, maintain existing env var names, add clear inline comments, do not change .env.example format | Leverage: Review lib/utils.ts for validateEnvironmentVariables function, check .env.example current structure, provider validation is in lib/commerce/config.ts | Requirements: Implements requirement 5 (Environment Configuration), requirement 9 (Backward Compatibility and Migration Path) | Success: Shopify env validation removed from utils, provider factory handles validation, .env.example clearly documents COMMERCE_PROVIDER, migration path is clear, existing Shopify setups work with COMMERCE_PROVIDER=shopify | Instructions: Mark in-progress [-], update files, use log-implementation tool to document configuration changes, mark complete [x]._

- [x] 17. Create deprecation bridge for backward compatibility
  - File: `lib/shopify/index.ts` (modified)
  - Replace all exports with re-exports from commerce abstraction
  - Add deprecation warnings in development mode
  - Maintain exact same export names and signatures
  - Purpose: Enable gradual migration without breaking existing code
  - _Leverage: `lib/commerce/index.ts`, existing export signatures_
  - _Requirements: 9.1, 9.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Software Engineer specializing in API deprecation and backward compatibility | Task: Create a backward compatibility layer for gradual migration. Replace the contents of lib/shopify/index.ts with a deprecation bridge that re-exports commerce methods. Add a JSDoc comment at the top warning that this module is deprecated and users should migrate to lib/commerce. Create wrapper functions for each exported method (getProduct, getProducts, getCart, addToCart, etc.) that: (1) log a deprecation warning in development mode (use process.env.NODE_ENV check), (2) call getCommerce() to get provider, (3) forward the call to the provider method, (4) return the result. Maintain exact function signatures. Warning should include function name and migration guidance. | Restrictions: Must maintain exact export signatures, warnings only in development, do not break any existing code, ensure all current exports are present | Leverage: List all exports from original lib/shopify/index.ts, use lib/commerce/index.ts for getCommerce, check each function signature matches exactly | Requirements: Implements requirement 9 (Backward Compatibility and Migration Path) | Success: All existing Shopify imports continue to work, deprecation warnings appear in development console, migrations can happen gradually, no code breaks, warnings provide clear guidance | Instructions: Mark in-progress [-], rewrite lib/shopify/index.ts as bridge, test with existing imports, use log-implementation tool to document all re-exported functions, mark complete [x]._

- [x] 18. Update main documentation (README, setup guides)
  - Files: `README.md`, `AUTHENTICATION_SETUP.md`
  - Add provider abstraction section explaining architecture
  - Document how to choose and configure providers
  - Update Shopify setup instructions to include `COMMERCE_PROVIDER=shopify`
  - Add quick start for mock provider
  - Link to provider-specific READMEs
  - Purpose: Help users understand and configure the provider system
  - _Leverage: Provider READMEs, existing documentation structure_
  - _Requirements: 10.1, 10.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Technical Writer with expertise in developer documentation and API guides | Task: Update main project documentation for provider abstraction. In README.md, add a new section 'Commerce Providers' after the existing 'Providers' section explaining: (1) architecture overview (pluggable providers), (2) available providers (Shopify, Mock), (3) how to configure via COMMERCE_PROVIDER env var, (4) links to provider-specific setup (./lib/commerce/providers/*/README.md). Update 'Running locally' section to mention mock provider works without any env vars. Update Shopify setup instructions to explicitly include COMMERCE_PROVIDER=shopify in .env. In AUTHENTICATION_SETUP.md, update any Shopify references to mention it's one provider option. Keep existing content, add provider context. | Restrictions: Do NOT remove existing content, maintain markdown structure, keep README concise (under 200 lines total), use clear headings, add provider section near top for visibility | Leverage: Read current README.md and AUTHENTICATION_SETUP.md, reference lib/commerce/providers/*/README.md files for details to link | Requirements: Implements requirement 10 (Provider Documentation and Examples) | Success: README explains provider system clearly, users understand how to configure providers, Shopify setup includes COMMERCE_PROVIDER, mock provider quick start is present, documentation is accurate and helpful | Instructions: Mark in-progress [-], update documentation files, use log-implementation tool to document changes, mark complete [x]._

## Phase 6: Testing and Validation

- [x] 19. Create unit tests for commerce abstraction layer
  - Files: Create test files for provider factory, types, errors
  - Test provider selection logic and env validation
  - Test error normalization utilities
  - Test mock provider functionality
  - Purpose: Ensure core abstraction is reliable and error handling works
  - _Leverage: Existing test setup (if any), Jest/Vitest configuration_
  - _Requirements: All requirements (validation)_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer with expertise in unit testing and Jest/Vitest | Task: Create comprehensive unit tests for the commerce abstraction. Create test files: (1) lib/commerce/__tests__/config.test.ts testing getCommerceProvider() with different COMMERCE_PROVIDER values, invalid provider names, missing env vars, (2) lib/commerce/__tests__/errors.test.ts testing CommerceError class, normalizeError function, isCommerceError type guard, (3) lib/commerce/__tests__/utils.test.ts testing removeEdgesAndNodes utility, (4) lib/commerce/providers/mock/__tests__/index.test.ts testing mock provider methods (getProduct, getProducts with filtering, cart operations). Use Jest or Vitest. Mock environment variables where needed. Aim for 80%+ coverage of core logic. | Restrictions: Do NOT test Next.js internals, mock external dependencies, tests must run independently, avoid testing implementation details, focus on behavior | Leverage: Review lib/commerce/config.ts, errors.ts, utils.ts, and providers/mock/index.ts for functions to test, use existing test setup if present | Requirements: Validates all requirements through automated testing | Success: Unit tests cover provider factory, error handling, and mock provider, tests pass consistently, coverage meets 80%+ for commerce layer, tests catch regressions | Instructions: Mark in-progress [-], create test files, write and run tests, use log-implementation tool to document test coverage and key scenarios, mark complete [x]._

- [x] 20. Perform integration testing with both providers
  - Test complete user flows with mock provider
  - Test complete user flows with Shopify provider (if test store available)
  - Verify cart persistence and operations
  - Test search and product filtering
  - Validate webhook revalidation
  - Purpose: Ensure end-to-end functionality works with both providers
  - _Leverage: Existing integration test setup (if any), Playwright/Cypress_
  - _Requirements: All requirements (validation)_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: QA Engineer specializing in integration and E2E testing | Task: Perform comprehensive integration testing of the provider abstraction with both providers. Set up integration tests using Playwright or Cypress (or manual testing if no E2E framework exists). Test scenarios: (1) Browse products and add to cart with mock provider, (2) Search/filter products, (3) View product details, (4) Update cart quantities, (5) Remove items from cart, (6) Navigate collections, (7) View pages (About, etc.). If Shopify test store is available, repeat all tests with COMMERCE_PROVIDER=shopify. Verify cart persists across page refreshes. Test revalidation webhook with curl/Postman. Document any failures or issues. | Restrictions: Do NOT test UI styling, focus on functionality, tests should work on localhost, mock provider tests must not require external services | Leverage: Use both providers (switch via COMMERCE_PROVIDER), test all major user flows from requirements doc, check cart state persistence | Requirements: Validates all functional requirements end-to-end | Success: All user flows work with mock provider, Shopify flows work (if tested), cart operations persist correctly, search/filter works, no provider-specific errors in UI, integration validates requirements | Instructions: Mark in-progress [-], run integration tests, document results, use log-implementation tool to record test scenarios and outcomes, mark complete [x]._

- [x] 21. Verify and document migration for existing Shopify users
  - Create migration checklist document
  - Test migration path: existing Shopify setup → add COMMERCE_PROVIDER=shopify → verify works
  - Document any breaking changes (should be none with backward compat bridge)
  - Create migration guide with before/after code examples
  - Purpose: Ensure smooth migration for existing users
  - _Leverage: Backward compat bridge, documentation_
  - _Requirements: 9.1, 9.2, 9.3, 10.1_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Developer Advocate with expertise in migration planning and technical documentation | Task: Create a comprehensive migration guide for existing Shopify users. Create file MIGRATION.md covering: (1) Overview of changes (provider abstraction introduced), (2) For existing Shopify users: add COMMERCE_PROVIDER=shopify to .env (show example), (3) What stays the same (all functionality), (4) What's deprecated (lib/shopify imports), (5) Migration steps: update imports from lib/shopify to lib/commerce, update function calls to use commerce.method() pattern, (6) Before/after code examples for common scenarios, (7) How to test migration (run existing code, check for deprecation warnings), (8) Breaking changes (none with backward compat), (9) Rollback steps if needed. Test the migration yourself: start with lib/shopify imports, add COMMERCE_PROVIDER=shopify, verify works, then gradually migrate imports to lib/commerce. | Restrictions: Keep guide practical and concise (under 300 lines), include runnable code examples, be honest about any limitations, provide troubleshooting section | Leverage: Reference backward compat bridge in lib/shopify/index.ts, review README and provider docs, test actual migration flow | Requirements: Implements requirement 9 (Backward Compatibility), requirement 10 (Provider Documentation) | Success: Migration guide is clear and actionable, existing Shopify users can migrate with confidence, no breaking changes documented, examples are accurate, troubleshooting helps with common issues | Instructions: Mark in-progress [-], write MIGRATION.md, test migration steps yourself, use log-implementation tool to document migration guide creation, mark complete [x]._

## Phase 7: Cleanup and Finalization

- [x] 22. Remove deprecated lib/shopify directory (optional cleanup phase)
  - Delete `lib/shopify/` directory after confirming all migrations complete
  - Verify no imports remain pointing to old location
  - Update any remaining documentation references
  - Purpose: Complete the migration by removing old code
  - _Leverage: Global search for "lib/shopify" imports_
  - _Requirements: Cleanup task_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: DevOps Engineer with expertise in code cleanup and refactoring | Task: Perform final cleanup by removing the deprecated Shopify directory. First, run a global search for 'from "lib/shopify"' or 'from \"lib/shopify\"' or 'import.*lib/shopify' to find any remaining imports. If any are found, update them to use lib/commerce instead. Once confirmed that zero imports remain, delete the entire lib/shopify/ directory. Run the build command (pnpm build) to ensure no broken imports. Search documentation (README, guides) for references to lib/shopify and update to lib/commerce. Update any code comments mentioning lib/shopify. This task should only be done after confirming the backward compat bridge is no longer needed (all code migrated). | Restrictions: Do NOT delete if ANY imports remain, verify build succeeds before committing, back up code before deletion, ensure provider implementation in lib/commerce/providers/shopify is NOT deleted | Leverage: Use grep/ripgrep to search for imports, run TypeScript compiler to check for errors, verify all tests still pass after deletion | Requirements: Final cleanup completing migration | Success: lib/shopify directory deleted, zero broken imports, build succeeds, tests pass, documentation updated, no references to old location remain | Instructions: Mark in-progress [-], search for imports, delete directory only if safe, verify build, use log-implementation tool to document cleanup, mark complete [x]._

- [x] 23. Add provider implementation guide for future custom providers
  - File: `lib/commerce/providers/README.md`
  - Document how to create a new provider
  - Explain interface requirements and best practices
  - Provide template/checklist for provider implementation
  - Link to Shopify and mock providers as examples
  - Purpose: Enable developers to integrate custom commerce backends
  - _Leverage: Existing provider implementations, interface definition_
  - _Requirements: 10.1, 10.2_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Developer Advocate specializing in platform extensibility and documentation | Task: Create a comprehensive guide for implementing custom commerce providers. Write lib/commerce/providers/README.md covering: (1) Overview of provider system, (2) CommerceProvider interface requirements (link to provider.interface.ts), (3) Step-by-step guide to creating a new provider (directory structure, implement interface, export default, register in config.ts), (4) Required methods with descriptions and expected behavior, (5) Best practices (error handling, caching, type safety, data reshaping), (6) Testing recommendations, (7) Example: walkthrough of mock provider implementation, (8) Checklist for provider implementation (interface methods, types, errors, env vars, README), (9) How to register new provider in lib/commerce/config.ts, (10) Debugging tips. Link to Shopify and mock providers as reference implementations. | Restrictions: Keep practical and tutorial-style, include code snippets, under 500 lines, use clear sections, make it beginner-friendly | Leverage: Review lib/commerce/provider.interface.ts, examine lib/commerce/providers/mock and shopify implementations, reference lib/commerce/config.ts for registration pattern | Requirements: Implements requirement 10 (Provider Documentation and Examples) | Success: Guide enables developers to create custom providers, clear step-by-step instructions, examples and best practices included, checklist ensures completeness, links to reference implementations | Instructions: Mark in-progress [-], write comprehensive guide, use log-implementation tool to document guide creation, mark complete [x]._

- [x] 24. Final validation and documentation review
  - Run full test suite (unit, integration, E2E)
  - Verify all documentation is accurate and up-to-date
  - Test with both mock and Shopify providers
  - Confirm backward compatibility for existing users
  - Update any outdated screenshots or examples
  - Purpose: Ensure everything works and is properly documented
  - _Leverage: All previous tasks, complete codebase_
  - _Requirements: All requirements (final validation)_
  - _Prompt: Implement the task for spec remove-shopify, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Senior QA Engineer and Technical Reviewer | Task: Perform final validation of the complete implementation. (1) Run all tests: unit tests (pnpm test or npm test), integration tests, E2E tests if available. Document pass/fail results. (2) Manual testing: test app with COMMERCE_PROVIDER=mock (browse products, add to cart, search), test with COMMERCE_PROVIDER=shopify if credentials available. (3) Review all documentation: README.md, MIGRATION.md, AUTHENTICATION_SETUP.md, provider READMEs, ensure accuracy, fix outdated info. (4) Check backward compatibility: test that old lib/shopify imports still work with deprecation warnings. (5) Verify env var setup: test with missing env vars, verify error messages are helpful. (6) Code review: check for any remaining TODOs, console.logs, or debug code. (7) Performance check: ensure no significant performance regression. Create a validation report with findings. | Restrictions: Do NOT make major changes, focus on validation and minor fixes, document all issues found, prioritize critical bugs over cosmetic issues | Leverage: Run full test suite, manually test both providers, review all docs created in previous tasks, check all requirements are met | Requirements: Final validation of all requirements | Success: All tests pass, both providers work correctly, documentation is accurate and complete, backward compatibility verified, no critical issues found, validation report confirms readiness | Instructions: Mark in-progress [-], perform comprehensive validation, create validation report, use log-implementation tool to document validation results and any fixes made, mark complete [x]._
