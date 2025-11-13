/**
 * Options accepted when constructing a {@link CommerceError}.
 */
export type CommerceErrorOptions = {
  /**
    * Machine-readable error code (e.g., `CART_NOT_FOUND`).
    */
  code?: string;
  /**
    * HTTP status associated with the error.
    */
  status?: number;
  /**
    * Root cause reference to aid debugging.
    */
  cause?: unknown;
};

/**
 * Standardized error used across commerce providers.
 */
export class CommerceError extends Error {
  readonly code: string;
  readonly status: number;
  readonly cause?: unknown;

  constructor(message: string, options: CommerceErrorOptions = {}) {
    super(message);
    this.name = "CommerceError";
    this.code = options.code ?? "COMMERCE_ERROR";
    this.status = options.status ?? 500;
    this.cause = options.cause;
  }
}

/**
 * Type guard verifying an error is a {@link CommerceError}.
 */
export const isCommerceError = (error: unknown): error is CommerceError => {
  return error instanceof CommerceError;
};

/**
 * Convert unknown errors into a {@link CommerceError} so callers can rely on a
 * consistent shape for logging and user messaging.
 */
export function normalizeError(
  error: unknown,
  defaults: CommerceErrorOptions & { message?: string } = {},
): CommerceError {
  if (isCommerceError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new CommerceError(error.message || defaults.message || "Unknown commerce error", {
      code: defaults.code,
      status: defaults.status,
      cause: error,
    });
  }

  const message =
    typeof error === "string" ? error : defaults.message ?? "Unknown commerce error";

  return new CommerceError(message, {
    code: defaults.code,
    status: defaults.status,
    cause: error,
  });
}
