# Mock Commerce Provider

This document outlines the purpose, usage, and limitations of the Mock Commerce Provider. It is designed for local development and testing, allowing the application to run without requiring a connection to a real commerce backend like Shopify.

## 1. Purpose and Use Cases

The Mock Commerce Provider serves the following primary purposes:

-   **Local Development:** Quickly spin up the application for UI development without needing API keys or a running backend.
-   **Frontend Testing:** Facilitate isolated testing of frontend components and user flows.
-   **Demonstration:** Provide a functional demo environment out-of-the-box.
-   **Offline Work:** Enable developers to work on the application without an internet connection.

## 2. How to Enable

To enable the Mock Commerce Provider, set the `COMMERCE_PROVIDER` environment variable to `mock` in your `.env` file:

```dotenv
COMMERCE_PROVIDER=mock
```

If `COMMERCE_PROVIDER` is not explicitly set, it defaults to `mock`.

## 3. Mock Data Overview

The mock provider comes with a set of pre-generated data fixtures located in `lib/commerce/providers/mock/data.ts`. This includes:

-   **Products:** At least 12 diverse products (e.g., T-shirts, Hoodies, Accessories) with multiple variants (sizes, colors), placeholder images, realistic pricing, SEO metadata, and tags.
-   **Collections:** 5+ collections (e.g., "Featured", "New Arrivals", "Sale") with descriptions and SEO.
-   **Cart:** A pre-populated mock cart with 2-3 sample items.
-   **Pages:** Sample content pages (e.g., "About", "Returns", "FAQ").
-   **Menus:** Navigation menu data.

All mock data strictly adheres to the generic commerce types defined in `lib/commerce/types.ts`.

## 4. How to Customize Mock Data

You can easily customize the mock data by editing the `lib/commerce/providers/mock/data.ts` file. This allows you to:

-   Add, modify, or remove products, collections, pages, and menu items.
-   Adjust product variants, images, and pricing.
-   Change the initial state of the mock cart.

**Example: Adding a new product**

```typescript
// lib/commerce/providers/mock/data.ts
export const mockProducts: Product[] = [
  // ... existing products
  {
    id: 'mock-product-13',
    handle: 'new-mock-product',
    availableForSale: true,
    title: 'New Mock Product',
    description: 'This is a brand new mock product.',
    descriptionHtml: '<p>This is a brand new mock product.</p>',
    options: [],
    priceRange: { maxVariantPrice: { amount: '29.99', currencyCode: 'USD' }, minVariantPrice: { amount: '29.99', currencyCode: 'USD' } },
    variants: [
      { id: 'mock-variant-13-1', title: 'Default', availableForSale: true, selectedOptions: [], price: { amount: '29.99', currencyCode: 'USD' } },
    ],
    featuredImage: { url: '/placeholder-image.jpg', altText: 'New Product', width: 600, height: 600 },
    images: [{ url: '/placeholder-image.jpg', altText: 'New Product', width: 600, height: 600 }],
    seo: { title: 'New Mock Product', description: 'A fresh addition to our mock catalog.' },
    tags: ['new', 'mock'],
    updatedAt: new Date().toISOString(),
  },
];
```

## 5. Limitations

While powerful for development, the Mock Commerce Provider has some inherent limitations:

-   **No Persistence:** Cart state and any modifications to mock data are not persisted across application restarts.
-   **Simplified Logic:** Search, filtering, and recommendations are implemented with simplified in-memory logic, not reflecting complex backend algorithms.
-   **No Real Checkout:** The checkout process is simulated and does not integrate with a payment gateway.
-   **No Webhooks:** The `revalidate` method is a no-op and does not handle actual webhook events.

## 6. Troubleshooting

-   **Provider not loading:** Ensure `COMMERCE_PROVIDER=mock` is correctly set in your `.env` file and that your environment variables are loaded correctly.
-   **Data not showing:** Verify that `lib/commerce/providers/mock/data.ts` is correctly structured and exported, and that your components are fetching data using `getCommerce()`.

## 7. Comparison with Real Providers

The Mock Provider is a local, in-memory implementation. Real providers (like Shopify) connect to external APIs, handle persistent data, complex business logic, and secure transactions. The abstraction layer ensures that your application code remains consistent regardless of the underlying provider.