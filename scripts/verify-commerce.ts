import {
  addToCart,
  createCart,
  getCart,
  getCollection,
  getCollections,
  getMenu,
  getPage,
  getPages,
  getProduct,
  getProducts,
  removeFromCart,
  updateCart,
} from "../lib/commerce";

async function verifyCommerce() {
  console.log("Starting commerce library verification...");

  try {
    // 1. Products
    console.log("\n--- Products ---");
    const products = await getProducts({});
    console.log(`Fetched ${products.length} products.`);
    if (products.length > 0) {
      const firstProduct = products[0];
      if (firstProduct) {
        console.log(
          `First product: ${firstProduct.title} (${firstProduct.handle})`,
        );

        const productDetail = await getProduct(firstProduct.handle);
        console.log(`Fetched product detail: ${productDetail?.title}`);
      }
    }

    // 2. Collections
    console.log("\n--- Collections ---");
    const collections = await getCollections();
    console.log(`Fetched ${collections.length} collections.`);
    if (collections.length > 0) {
      const firstCollection = collections[0];
      console.log(
        `First collection: ${firstCollection.title} (${firstCollection.handle})`,
      );

      const collectionDetail = await getCollection(firstCollection.handle);
      console.log(`Fetched collection detail: ${collectionDetail?.title}`);
    }

    // 3. Cart Flow
    console.log("\n--- Cart Flow ---");

    // Create Cart
    const cart = await createCart();
    console.log(`Created cart: ${cart.id}`);

    if (products.length > 0 && products[0].variants.length > 0) {
      const variantId = products[0].variants[0].id;

      // Add to Cart
      console.log(`Adding variant ${variantId} to cart...`);
      const cartWithItem = await addToCart(cart.id, [
        { merchandiseId: variantId, quantity: 1 },
      ]);
      console.log(`Cart line items: ${cartWithItem.lines.length}`);
      console.log(
        `Cart subtotal: ${cartWithItem.cost.subtotalAmount.amount} ${cartWithItem.cost.subtotalAmount.currencyCode}`,
      );

      if (cartWithItem.lines.length > 0) {
        const lineId = cartWithItem.lines[0].id; // Note: In our mock, we generate a random ID for the line

        // Update Cart
        console.log(`Updating line item quantity...`);
        // We need to find the line item ID from the cart response since our mock generates it
        // In a real scenario, we'd use the ID returned.
        // For this test, we'll assume the first line is the one we just added.

        // Re-fetch cart to be sure (though addToCart returns it)
        const fetchedCart = await getCart(cart.id);
        if (fetchedCart && fetchedCart.lines.length > 0) {
          const lineToUpdate = fetchedCart.lines[0];
          console.log(`Updating line ${lineToUpdate.id}...`);
          const updatedCart = await updateCart(cart.id, [
            {
              id: lineToUpdate.id,
              merchandiseId: variantId,
              quantity: 2,
            },
          ]);
          console.log(
            `Updated cart subtotal: ${updatedCart.cost.subtotalAmount.amount}`,
          );

          // Remove from Cart
          console.log(`Removing item from cart...`);
          const emptyCart = await removeFromCart(cart.id, [lineToUpdate.id]);
          console.log(
            `Cart line items after removal: ${emptyCart.lines.length}`,
          );
        }
      }
    }

    // 4. Menu
    console.log("\n--- Menu ---");
    const menu = await getMenu("next-js-frontend-header-menu");
    console.log(`Fetched menu with ${menu.length} items.`);

    // 5. Pages
    console.log("\n--- Pages ---");
    const pages = await getPages();
    console.log(`Fetched ${pages.length} pages.`);
    if (pages.length > 0) {
      const page = await getPage(pages[0].handle);
      console.log(`Fetched page: ${page.title}`);
    }

    console.log("\nVerification completed successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

verifyCommerce();
