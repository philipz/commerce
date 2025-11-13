"use server";

import { TAGS } from "lib/constants";
import { getCommerce } from "@/lib/commerce";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { syncCartToUser } from "./cart-sync";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    const commerce = await getCommerce();
    await commerce.addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);

    // Sync to user's saved cart if authenticated
    const cart = await commerce.getCart();
    if (cart) {
      await syncCartToUser(cart);
    }
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const commerce = await getCommerce();
    const cart = await commerce.getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await commerce.removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);

      // Sync to user's saved cart if authenticated
      const updatedCart = await commerce.getCart();
      if (updatedCart) {
        await syncCartToUser(updatedCart);
      }
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const commerce = await getCommerce();
    const cart = await commerce.getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await commerce.removeFromCart([lineItem.id]);
      } else {
        await commerce.updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await commerce.addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);

    // Sync to user's saved cart if authenticated
    const updatedCart = await commerce.getCart();
    if (updatedCart) {
      await syncCartToUser(updatedCart);
    }
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const commerce = await getCommerce();
  let cart = await commerce.getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  const commerce = await getCommerce();
  let cart = await commerce.createCart();
  (await cookies()).set("cartId", cart.id!);
}
