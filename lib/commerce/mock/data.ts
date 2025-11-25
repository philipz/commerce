import { Collection, Menu, Page, Product } from "../types";

export const mockMenu: Menu[] = [
    { title: "All", path: "/search" },
    { title: "Shirts", path: "/search/shirts" },
    { title: "Stickers", path: "/search/stickers" },
];

export const mockPages: Page[] = [
    {
        id: "1",
        title: "About Us",
        handle: "about",
        body: "<p>We are a mock store.</p>",
        bodySummary: "We are a mock store.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seo: { title: "About Us", description: "About our mock store" },
    },
    {
        id: "2",
        title: "Terms & Conditions",
        handle: "terms-conditions",
        body: "<p>Terms and conditions content.</p>",
        bodySummary: "Terms and conditions.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seo: { title: "Terms & Conditions", description: "Terms and conditions" },
    },
    {
        id: "3",
        title: "Privacy Policy",
        handle: "privacy-policy",
        body: "<p>Privacy policy content.</p>",
        bodySummary: "Privacy policy.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seo: { title: "Privacy Policy", description: "Privacy policy" },
    },
    {
        id: "4",
        title: "FAQ",
        handle: "faq",
        body: "<p>Frequently Asked Questions.</p>",
        bodySummary: "FAQ.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        seo: { title: "FAQ", description: "Frequently Asked Questions" },
    },
];

export const mockCollections: Collection[] = [
    {
        handle: "shirts",
        title: "Shirts",
        description: "Comfortable shirts",
        path: "/search/shirts",
        updatedAt: new Date().toISOString(),
        seo: { title: "Shirts", description: "Comfortable shirts" },
    },
    {
        handle: "stickers",
        title: "Stickers",
        description: "Cool stickers",
        path: "/search/stickers",
        updatedAt: new Date().toISOString(),
        seo: { title: "Stickers", description: "Cool stickers" },
    },
];

export const mockProducts: Product[] = [
    {
        id: "1",
        handle: "t-shirt-1",
        availableForSale: true,
        title: "Mock T-Shirt",
        description: "A comfortable cotton t-shirt.",
        descriptionHtml: "<p>A comfortable cotton t-shirt.</p>",
        options: [
            { id: "opt1", name: "Size", values: ["S", "M", "L"] },
            { id: "opt2", name: "Color", values: ["Black", "White"] },
        ],
        priceRange: {
            maxVariantPrice: { amount: "25.00", currencyCode: "USD" },
            minVariantPrice: { amount: "25.00", currencyCode: "USD" },
        },
        variants: [
            {
                id: "var1",
                title: "S / Black",
                availableForSale: true,
                selectedOptions: [
                    { name: "Size", value: "S" },
                    { name: "Color", value: "Black" },
                ],
                price: { amount: "25.00", currencyCode: "USD" },
            },
        ],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            altText: "Mock T-Shirt",
            width: 800,
            height: 600,
        },
        images: [
            {
                url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                altText: "Mock T-Shirt",
                width: 800,
                height: 600,
            },
        ],
        seo: { title: "Mock T-Shirt", description: "A comfortable cotton t-shirt." },
        tags: ["shirts"],
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        handle: "sticker-1",
        availableForSale: true,
        title: "Mock Sticker",
        description: "A cool sticker.",
        descriptionHtml: "<p>A cool sticker.</p>",
        options: [],
        priceRange: {
            maxVariantPrice: { amount: "5.00", currencyCode: "USD" },
            minVariantPrice: { amount: "5.00", currencyCode: "USD" },
        },
        variants: [
            {
                id: "var2",
                title: "Default Title",
                availableForSale: true,
                selectedOptions: [],
                price: { amount: "5.00", currencyCode: "USD" },
            },
        ],
        featuredImage: {
            url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            altText: "Mock Sticker",
            width: 800,
            height: 600,
        },
        images: [
            {
                url: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                altText: "Mock Sticker",
                width: 800,
                height: 600,
            },
        ],
        seo: { title: "Mock Sticker", description: "A cool sticker." },
        tags: ["stickers"],
        updatedAt: new Date().toISOString(),
    },
];
