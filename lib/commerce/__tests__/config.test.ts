import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { CommerceError } from "../errors";
import { getCommerceProvider, validateProviderEnv } from "../config";

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.COMMERCE_PROVIDER;
  delete process.env.SHOPIFY_STORE_DOMAIN;
  delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
});

afterAll(() => {
  process.env = originalEnv;
});

describe("getCommerceProvider", () => {
  it("returns the mock provider by default", async () => {
    const provider = await getCommerceProvider();
    expect(provider.name).toBe("mock");
  });

  it("throws when provider name is unsupported", async () => {
    process.env.COMMERCE_PROVIDER = "unknown";
    await expect(getCommerceProvider()).rejects.toBeInstanceOf(CommerceError);
  });
});

describe("validateProviderEnv", () => {
  it("throws a CommerceError when required env vars are missing", () => {
    expect(() =>
      validateProviderEnv("shopify", ["MISSING_ENV"]),
    ).toThrowError(CommerceError);
  });

  it("passes when all required env vars are present", () => {
    process.env.TEST_ENV = "value";
    expect(() =>
      validateProviderEnv("mock", ["TEST_ENV"]),
    ).not.toThrow();
  });
});
