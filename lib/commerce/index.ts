import * as mock from "./mock";
import * as shopify from "./shopify";

const provider = process.env.COMMERCE_PROVIDER === "mock" ? mock : shopify;

export const {
    createCart,
    addToCart,
    removeFromCart,
    updateCart,
    getCart,
    getCollection,
    getCollectionProducts,
    getCollections,
    getMenu,
    getPage,
    getPages,
    getProduct,
    getProductRecommendations,
    getProducts,
    revalidate,
} = provider;
