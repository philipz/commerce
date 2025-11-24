"use server";

import { auth } from "@/auth";
import { Cart } from "lib/commerce/types";
import {
  clearUserCart,
  getUserCart,
  saveUserCart,
} from "lib/user/cart-storage";

/**
 * Sync cart to user's saved cart (for authenticated users)
 */
export async function syncCartToUser(cart: Cart): Promise<void> {
  const session = await auth();

  if (session?.user?.id) {
    await saveUserCart(session.user.id, cart);
  }
}

/**
 * Load user's saved cart (for authenticated users)
 */
export async function loadUserCart(): Promise<Cart | null> {
  const session = await auth();

  if (session?.user?.id) {
    return getUserCart(session.user.id);
  }

  return null;
}

/**
 * Clear user's saved cart
 */
export async function clearSavedCart(): Promise<void> {
  const session = await auth();

  if (session?.user?.id) {
    await clearUserCart(session.user.id);
  }
}
