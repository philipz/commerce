import { describe, expect, it } from "vitest";
import {
  CommerceError,
  isCommerceError,
  normalizeError,
} from "../errors";

describe("CommerceError", () => {
  it("captures message, code, and status defaults", () => {
    const error = new CommerceError("boom");
    expect(error.message).toBe("boom");
    expect(error.code).toBe("COMMERCE_ERROR");
    expect(error.status).toBe(500);
  });

  it("respects custom options", () => {
    const cause = new Error("cause");
    const error = new CommerceError("boom", {
      code: "CUSTOM",
      status: 400,
      cause,
    });
    expect(error.code).toBe("CUSTOM");
    expect(error.status).toBe(400);
    expect(error.cause).toBe(cause);
  });
});

describe("isCommerceError", () => {
  it("detects CommerceError instances", () => {
    const error = new CommerceError("boom");
    expect(isCommerceError(error)).toBe(true);
    expect(isCommerceError(new Error("nope"))).toBe(false);
  });
});

describe("normalizeError", () => {
  it("returns same error when already CommerceError", () => {
    const original = new CommerceError("boom");
    const normalized = normalizeError(original);
    expect(normalized).toBe(original);
  });

  it("wraps unknown errors with defaults", () => {
    const normalized = normalizeError(new Error("oops"), {
      code: "WRAPPED",
      status: 418,
    });
    expect(normalized.code).toBe("WRAPPED");
    expect(normalized.status).toBe(418);
  });

  it("wraps strings into CommerceError", () => {
    const normalized = normalizeError("string failure");
    expect(normalized.message).toContain("string failure");
    expect(isCommerceError(normalized)).toBe(true);
  });
});
