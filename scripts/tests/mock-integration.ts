import mockProvider from "lib/commerce/providers/mock";

async function run() {
  const provider = mockProvider;

  const collections = await provider.getCollections();
  console.log("Collections loaded:", collections.length);

  const pages = await provider.getPages();
  console.log("Pages loaded:", pages.length);

  const products = await provider.getProducts({});
  console.log("Products loaded:", products.length);

  const targetCollection = collections.find((c) => c.handle === "featured");
  if (targetCollection) {
    const collectionProducts = await provider.getCollectionProducts({
      collection: targetCollection.handle,
    });
    console.log(
      `Products in collection '${targetCollection.handle}':`,
      collectionProducts.length,
    );
  }

  const product = products[0];
  if (!product) {
    throw new Error("No mock products available");
  }
  const recommendations = await provider.getProductRecommendations(product.id);
  console.log("Recommendations loaded:", recommendations.length);

  const cart = await provider.createCart();
  console.log("Created cart:", cart.id);

  const firstVariant = product.variants[0];
  if (!firstVariant) {
    throw new Error("No variants available on mock product");
  }
  const updatedCart = await provider.addToCart([
    { merchandiseId: firstVariant.id, quantity: 1 },
  ]);
  console.log("Cart after add:", updatedCart.totalQuantity);

  const line = updatedCart.lines[0];
  if (!line) {
    throw new Error("Unable to add line item to mock cart");
  }
  const cartAfterUpdate = await provider.updateCart([
    { id: line.id!, merchandiseId: line.merchandise.id, quantity: 2 },
  ]);
  console.log("Cart after update:", cartAfterUpdate.totalQuantity);

  const cartAfterRemove = await provider.removeFromCart([line.id!]);
  console.log("Cart after remove:", cartAfterRemove.totalQuantity);

  console.log("Mock provider integration smoke test completed.");
}

run().catch((err) => {
  console.error("Mock provider integration test failed:", err);
  process.exit(1);
});
