# Requirements Document - Remove Shopify Dependencies

## Introduction

This specification defines the requirements for removing all Shopify dependencies from the Next.js Commerce application, transforming it into a platform-agnostic ecommerce template. The goal is to create an abstraction layer that allows the application to work with any commerce backend provider, not just Shopify.

**Purpose:** Enable developers to integrate their preferred commerce platform without being locked into Shopify's API, supporting the product vision of "Platform-agnostic design enabling integration with multiple commerce providers."

**Value:** This transformation will make the template truly flexible, allowing merchants and developers to choose any commerce backend (BigCommerce, Medusa, WooCommerce, custom solutions, etc.) while maintaining the same high-performance Next.js frontend.

## Alignment with Product Vision

This feature directly supports several core product principles and goals:

- **Platform Agnostic (Product Principle #3)**: "Don't lock users into a single commerce backend" - This is the primary alignment point
- **Developer Joy (Product Principle #2)**: Clear abstraction makes it easier to understand and customize the commerce integration
- **Extensible architecture for customization (Developer Experience Goal)**: Pluggable architecture enables easy provider swaps
- **Support ecosystem of commerce providers (Business Goal)**: Makes the template viable for non-Shopify merchants

The tech.md document already identifies "Shopify Coupling" as Known Gap #1, stating: "`lib/shopify` permeates the UI; replacing Shopify requires either an abstraction layer or rewriting data hooks."

## Requirements

### Requirement 1: Commerce Provider Abstraction Layer

**User Story:** As a developer, I want a provider-agnostic commerce interface, so that I can integrate any commerce backend without rewriting UI components.

#### Acceptance Criteria

1. WHEN any component or route needs product data THEN it SHALL import from a generic `lib/commerce` module instead of `lib/shopify`
2. WHEN the application starts THEN it SHALL validate required environment variables for the configured commerce provider
3. WHEN a commerce provider is configured THEN the system SHALL expose a consistent interface for: products, collections, cart, search, and revalidation
4. IF a method is not supported by a provider THEN the system SHALL throw a clear error indicating the missing capability
5. WHEN components call commerce methods THEN they SHALL receive standardized DTOs (`Product`, `Collection`, `Cart`, etc.) regardless of the underlying provider

### Requirement 2: Type-Safe Provider Interface

**User Story:** As a developer, I want TypeScript interfaces for all commerce operations, so that I can catch integration errors at compile time.

#### Acceptance Criteria

1. WHEN I implement a new commerce provider THEN TypeScript SHALL enforce all required methods are implemented
2. WHEN I use commerce methods THEN I SHALL receive proper type inference and autocomplete
3. WHEN data shapes change between providers THEN TypeScript SHALL catch mismatches before runtime
4. IF a provider's API response differs from expected types THEN the reshaping layer SHALL enforce type safety with validation

### Requirement 3: Shopify Implementation as Reference Provider

**User Story:** As a developer migrating from the current codebase, I want the existing Shopify logic preserved as a provider implementation, so that existing Shopify users can continue using the template without breaking changes.

#### Acceptance Criteria

1. WHEN the `COMMERCE_PROVIDER=shopify` environment variable is set THEN the system SHALL use the Shopify provider implementation
2. WHEN using the Shopify provider THEN all existing functionality SHALL work identically to the current implementation
3. WHEN the Shopify provider is active THEN it SHALL use the same environment variables: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_REVALIDATION_SECRET`
4. WHEN migrating existing Shopify code THEN it SHALL be moved from `lib/shopify/*` to `lib/commerce/providers/shopify/*` without functional changes

### Requirement 4: Mock/Demo Provider Implementation

**User Story:** As a developer evaluating the template, I want a mock provider with fake data, so that I can run the application locally without configuring a real commerce backend.

#### Acceptance Criteria

1. WHEN `COMMERCE_PROVIDER=mock` is set THEN the system SHALL serve mock product/cart data from static JSON files
2. WHEN using the mock provider THEN all UI flows (browsing, cart, search) SHALL function with realistic fake data
3. WHEN cart operations execute with mock provider THEN they SHALL simulate success/failure without external API calls
4. WHEN developers run `pnpm dev` without commerce credentials THEN the system SHALL default to mock provider with a clear console message

### Requirement 5: Environment Configuration for Provider Selection

**User Story:** As a developer, I want to configure which commerce provider to use via environment variables, so that I can easily switch between providers or deploy to different environments.

#### Acceptance Criteria

1. WHEN the application starts THEN it SHALL read `COMMERCE_PROVIDER` environment variable (defaults to `mock`)
2. IF `COMMERCE_PROVIDER` is set to an unknown value THEN the system SHALL throw a clear error listing available providers
3. WHEN a provider is loaded THEN the system SHALL validate required env vars for that specific provider
4. WHEN in development mode THEN the system SHALL log which provider is active and its configuration status

### Requirement 6: UI Components Must Be Provider-Agnostic

**User Story:** As a frontend developer, I want UI components to work with any provider, so that I don't need to rewrite components when changing commerce backends.

#### Acceptance Criteria

1. WHEN any component in `components/*` imports commerce functionality THEN it SHALL only import from `lib/commerce` (never directly from a provider)
2. WHEN cart components render THEN they SHALL use generic `Cart`, `CartItem` types from `lib/commerce/types`
3. WHEN product components render THEN they SHALL use generic `Product`, `ProductVariant` types from `lib/commerce/types`
4. IF a component currently has Shopify-specific logic THEN it SHALL be refactored to use generic commerce abstractions

### Requirement 7: Server Actions Must Be Provider-Independent

**User Story:** As a backend developer, I want server actions to work with any commerce provider, so that cart operations and data fetching are consistent across providers.

#### Acceptance Criteria

1. WHEN `components/cart/actions.ts` executes mutations THEN it SHALL call generic `commerce.addToCart()`, `commerce.updateCart()` methods
2. WHEN `app/api/revalidate/route.ts` is called THEN it SHALL invoke generic `commerce.revalidate()` regardless of provider
3. WHEN cart sync actions run THEN they SHALL work with provider-agnostic cart DTOs
4. WHEN server actions handle errors THEN they SHALL catch provider-specific errors and normalize them to generic error types

### Requirement 8: Search and Discovery Abstraction

**User Story:** As a user, I want search and product filtering to work consistently, so that I get the same UX regardless of which commerce backend powers the site.

#### Acceptance Criteria

1. WHEN search is performed THEN the system SHALL call generic `commerce.searchProducts(query, options)` method
2. WHEN collections are fetched THEN the system SHALL call generic `commerce.getCollection(handle)` method
3. WHEN filtering products THEN the abstraction SHALL support common filters (price, availability, tags) across providers
4. IF a provider doesn't support a filter THEN the system SHALL handle it gracefully (client-side fallback or clear message)

### Requirement 9: Backward Compatibility and Migration Path

**User Story:** As an existing Shopify user, I want to upgrade without breaking my deployment, so that I can adopt the new architecture without downtime.

#### Acceptance Criteria

1. WHEN `COMMERCE_PROVIDER` is not set AND Shopify env vars exist THEN the system SHALL default to Shopify provider with a deprecation warning
2. WHEN existing environment variables are used THEN they SHALL continue working without requiring immediate migration
3. WHEN documentation is updated THEN it SHALL include a migration guide for existing Shopify users
4. WHEN the new abstraction is released THEN existing Shopify deployments SHALL work by setting `COMMERCE_PROVIDER=shopify`

### Requirement 10: Provider Documentation and Examples

**User Story:** As a developer building a new provider, I want clear documentation and examples, so that I can implement a custom commerce integration efficiently.

#### Acceptance Criteria

1. WHEN reviewing the codebase THEN there SHALL be a `lib/commerce/providers/README.md` with provider interface documentation
2. WHEN implementing a new provider THEN developers SHALL have access to a provider template or example
3. WHEN provider methods are defined THEN they SHALL have JSDoc comments explaining parameters, return types, and expected behavior
4. WHEN the mock provider is reviewed THEN it SHALL serve as a reference implementation for other providers

## Non-Functional Requirements

### Code Architecture and Modularity

- **Single Responsibility Principle**:
  - `lib/commerce/index.ts` exports a single provider instance
  - Each provider implementation lives in its own directory (`lib/commerce/providers/[name]`)
  - Provider selection logic is isolated in a factory function

- **Modular Design**:
  - Providers implement a common `CommerceProvider` interface
  - Each provider encapsulates its own queries, mutations, and data reshaping
  - Providers are tree-shakeable (unused providers don't bloat the bundle)

- **Dependency Management**:
  - UI components depend only on `lib/commerce` types and methods
  - Provider implementations can have provider-specific dependencies (e.g., GraphQL clients)
  - No circular dependencies between commerce layer and UI layer

- **Clear Interfaces**:
  - `CommerceProvider` interface defines all required methods with TypeScript types
  - Data Transfer Objects (DTOs) are defined in `lib/commerce/types.ts`
  - Error types are standardized across providers

### Performance

- **Bundle Size**: Provider code SHALL be tree-shaken - unused providers SHALL NOT be included in production bundles
- **Caching**: The abstraction SHALL preserve Next.js caching capabilities (cache tags, revalidation)
- **Server Components**: Commerce operations SHALL continue to work in Server Components without client-side overhead
- **Response Times**: Provider abstraction overhead SHALL add <10ms to data fetch operations

### Security

- **Environment Variables**: Provider credentials SHALL never be exposed to the client bundle
- **Validation**: Provider implementations SHALL validate all inputs before making external API calls
- **Error Handling**: Provider errors SHALL NOT leak sensitive configuration details (API keys, internal URLs)
- **CSRF Protection**: Server actions SHALL maintain existing CSRF protections when using abstracted commerce methods

### Reliability

- **Error Boundaries**: Provider failures SHALL be caught and transformed into user-friendly error messages
- **Fallback Behavior**: If a provider method fails, the system SHALL degrade gracefully (e.g., show cached data or empty state)
- **Type Safety**: Runtime validation SHALL catch provider implementation bugs early
- **Logging**: Provider errors SHALL be logged with enough context for debugging without exposing credentials

### Usability

- **Developer Experience**:
  - Clear error messages when provider is misconfigured
  - Console logs indicating active provider in development mode
  - Autocomplete/IntelliSense support for all commerce methods

- **Documentation**:
  - Migration guide for existing Shopify users
  - Provider implementation guide for custom integrations
  - Architecture decision records (ADRs) explaining design choices

- **Testing**:
  - Mock provider enables UI testing without external dependencies
  - Provider interface enables easy mocking in unit tests
  - Integration tests can run against mock provider in CI

### Maintainability

- **Consistent Patterns**: All providers SHALL follow the same structure and naming conventions from `structure.md`
- **Version Compatibility**: Provider interface changes SHALL be backward-compatible or include migration scripts
- **Code Reuse**: Common provider utilities (error normalization, URL helpers) SHALL be extracted to shared modules
- **Documentation**: Each provider SHALL include a README explaining its specific requirements and limitations
