import { auth } from "@/auth";
import { getCart } from "lib/shopify";
import { createOrderFromCart } from "lib/user/order-actions";
import { clearSavedCart } from "components/cart/cart-sync";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current cart
    const cart = await getCart();

    if (!cart || cart.lines.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create order from cart
    const order = await createOrderFromCart(cart);

    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    // Clear saved cart
    await clearSavedCart();

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Error completing order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to complete order",
      },
      { status: 500 },
    );
  }
}
