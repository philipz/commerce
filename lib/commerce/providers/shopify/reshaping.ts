import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import type { Cart, Collection, Connection, Image, Product } from "lib/commerce/types";
import { removeEdgesAndNodes } from "lib/commerce/utils";
import type { ShopifyCart, ShopifyCollection, ShopifyProduct } from "./types";

/**
 * Reshapes Shopify cart response into generic Cart type.
 * Ensures totalTaxAmount is present and flattens line items.
 *
 * @param cart - Raw Shopify cart data
 * @returns Reshaped cart with flattened lines
 */
export const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

/**
 * Reshapes Shopify collection into generic Collection type.
 * Adds the frontend path based on collection handle.
 *
 * @param collection - Raw Shopify collection data
 * @returns Reshaped collection or undefined if input is null
 */
export const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

/**
 * Reshapes array of Shopify collections into generic Collection array.
 * Filters out null/undefined collections.
 *
 * @param collections - Array of raw Shopify collections
 * @returns Array of reshaped collections
 */
export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

/**
 * Reshapes Shopify image connection into array of images.
 * Generates alt text for images that don't have it.
 *
 * @param images - GraphQL connection of images
 * @param productTitle - Product title used for fallback alt text
 * @returns Array of images with alt text
 */
export const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

/**
 * Reshapes Shopify product into generic Product type.
 * Flattens variants and images, and optionally filters hidden products.
 *
 * @param product - Raw Shopify product data
 * @param filterHiddenProducts - Whether to filter products with HIDDEN_PRODUCT_TAG
 * @returns Reshaped product or undefined if filtered out
 */
export const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

/**
 * Reshapes array of Shopify products into generic Product array.
 * Filters out null/undefined products and hidden products.
 *
 * @param products - Array of raw Shopify products
 * @returns Array of reshaped products
 */
export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
