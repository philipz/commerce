"use server";

import { auth } from "@/auth";
import { Cart } from "lib/commerce/types";
import { saveOrder } from "./storage";
import { Order, OrderItem } from "./types";
import { getShippingAddresses, getBillingAddresses } from "./storage";

/**
 * Create an order from the current cart
 * This should be called when a checkout is completed
 */
export async function createOrderFromCart(cart: Cart): Promise<Order | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Get default addresses
  const shippingAddresses = await getShippingAddresses(userId);
  const billingAddresses = await getBillingAddresses(userId);

  const defaultShipping =
    shippingAddresses.find((a) => a.isDefault) || shippingAddresses[0];
  const defaultBilling =
    billingAddresses.find((a) => a.isDefault) || billingAddresses[0];

  if (!defaultShipping || !defaultBilling) {
    throw new Error("No shipping or billing address found");
  }

  // Convert cart items to order items
  const items: OrderItem[] = cart.lines.map((line) => ({
    productId: line.merchandise.product.id,
    productHandle: line.merchandise.product.handle,
    productTitle: line.merchandise.product.title,
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    quantity: line.quantity,
    price: line.cost.totalAmount.amount,
    image: line.merchandise.product.featuredImage?.url,
  }));

  // Create order
  const order: Order = {
    id: generateOrderId(),
    userId,
    orderNumber: generateOrderNumber(),
    status: "pending",
    items,
    subtotal: cart.cost.subtotalAmount.amount,
    tax: cart.cost.totalTaxAmount?.amount || "0",
    shipping: "0", // TODO: Calculate shipping
    total: cart.cost.totalAmount.amount,
    shippingAddress: defaultShipping,
    billingAddress: defaultBilling,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;
  const orders = await import("./storage").then((m) => m.getUserOrders(userId));
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  await saveOrder(order);
}

// Helper functions
function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateOrderNumber(): string {
  return `${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}
