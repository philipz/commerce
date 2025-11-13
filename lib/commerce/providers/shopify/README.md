# Shopify Commerce Provider

This document provides comprehensive instructions for setting up and configuring the Shopify Commerce Provider. This provider integrates your application with a Shopify store using the Storefront API and handles cache revalidation via webhooks.

## 1. Overview and Purpose

The Shopify Commerce Provider enables your application to fetch product data, manage carts, and handle content directly from a Shopify store. It acts as a concrete implementation of the `CommerceProvider` interface, ensuring that your application's UI and business logic remain decoupled from Shopify-specific details.

## 2. Required Environment Variables

To use the Shopify provider, you must set the following environment variables in your `.env` file:

-   `COMMERCE_PROVIDER=shopify`
    -   **Purpose:** Specifies that the Shopify provider should be used.
-   `SHOPIFY_STORE_DOMAIN`
    -   **Purpose:** The domain of your Shopify store (e.g., `your-store-name.myshopify.com`).
    -   **Format:** Must start with `https://`.
-   `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
    -   **Purpose:** A private app storefront access token for authenticating requests to the Shopify Storefront API.
    -   **Obtaining:** See [Shopify Storefront API Setup](#3-shopify-storefront-api-setup).
-   `SHOPIFY_REVALIDATION_SECRET` (Optional but highly recommended)
    -   **Purpose:** A secret token used to secure webhook requests for cache revalidation. This prevents unauthorized revalidation of your cache.
    -   **Obtaining:** Generate a strong, random string (e.g., using `openssl rand -base64 32`).

**Example `.env` configuration:**

```dotenv
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN="https://your-store-name.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="shpat_YOUR_STOREFRONT_ACCESS_TOKEN"
SHOPIFY_REVALIDATION_SECRET="YOUR_STRONG_RANDOM_SECRET"
```

## 3. Shopify Storefront API Setup

To obtain the `SHOPIFY_STOREFRONT_ACCESS_TOKEN`:

1.  **Log in to your Shopify admin:** Go to `https://your-store-name.myshopify.com/admin`.
2.  **Navigate to Apps:** In the left sidebar, go to `Apps`.
3.  **Develop apps for your store:** Click on `Develop apps for your store`.
4.  **Create a custom app:** Click `Create an app`, give it a name (e.g., "My Storefront App"), and select a developer.
5.  **Configure Storefront API scopes:** After creating the app, go to the `Configuration` tab.
    -   Find the `Storefront API integration` section.
    -   Click `Configure`.
    -   Grant the necessary permissions. For a typical storefront, you'll need at least:
        -   `read_products`
        -   `read_product_listings`
        -   `read_collections`
        -   `read_collection_listings`
        -   `read_content` (for pages and blogs)
        -   `unauthenticated_read_checkouts` (for cart operations)
        -   `unauthenticated_write_checkouts` (for cart operations)
    -   Save your changes.
6.  **Install the app:** Go back to the `API credentials` tab and click `Install app`.
7.  **Reveal token:** After installation, your `Storefront access token` will be displayed. Copy this token and set it as `SHOPIFY_STOREFRONT_ACCESS_TOKEN` in your `.env` file.

## 4. Webhook Configuration for Cache Revalidation

To ensure your application's cache is always up-to-date with changes in Shopify, you need to configure webhooks. These webhooks will trigger the `revalidate` endpoint in your application.

1.  **In your Shopify admin, navigate to Webhooks:** Go to `Settings > Notifications > Webhooks`.
2.  **Create a new webhook:** Click `Create webhook`.
3.  **Configure the webhook details:**
    -   **Event:** Select the events that should trigger revalidation. Recommended events include:
        -   `Product creation`
        -   `Product deletion`
        -   `Product update`
        -   `Collection creation`
        -   `Collection deletion`
        -   `Collection update`
        -   `Page creation`
        -   `Page deletion`
        -   `Page update`
    -   **Format:** `JSON`
    -   **URL:** This will be your application's revalidation endpoint. For example, `https://your-app-domain.com/api/revalidate`.
    -   **Webhook API version:** Use the latest stable version.
    -   **Secret:** Enter the `SHOPIFY_REVALIDATION_SECRET` you generated earlier. This is crucial for securing your webhook.
4.  **Save the webhook.** Repeat for all relevant events.

## 5. Caching Behavior

The Shopify provider leverages Next.js's caching mechanisms to optimize performance. It uses:

-   **`'use cache'` directive:** For server components and data fetching functions.
-   **Cache Tags:** Specific tags (e.g., `products`, `collections`, `carts`) are used to granularly revalidate cached data when webhooks are received.
-   **Cache Life:** Data is cached for a specified duration, with revalidation triggered by webhooks or on-demand.

## 6. Troubleshooting

-   **Invalid Credentials:** Double-check `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Ensure the token has the correct Storefront API permissions.
-   **GraphQL Errors:** Review your Shopify app's Storefront API permissions. If a query fails, it might be due to insufficient permissions.
-   **Webhook Failures:**
    -   Verify the webhook URL is correct and accessible from Shopify.
    -   Ensure `SHOPIFY_REVALIDATION_SECRET` matches exactly in both your `.env` file and Shopify webhook configuration.
    -   Check Shopify's webhook logs for delivery failures.
-   **Data not updating:** Confirm that webhooks are configured for the relevant events and that your `SHOPIFY_REVALIDATION_SECRET` is correct.

## 7. Limitations

-   **Storefront API Restrictions:** The Shopify Storefront API has limitations compared to the Admin API. Certain operations (e.g., managing orders, customer accounts beyond basic profile) are not available.
-   **Rate Limits:** Be mindful of Shopify Storefront API rate limits. Implement proper error handling and retry mechanisms if you anticipate high traffic.

For more detailed information on Shopify's APIs and webhooks, refer to the official [Shopify Developer Documentation](https://shopify.dev/).
