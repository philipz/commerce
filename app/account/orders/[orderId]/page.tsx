import { getCurrentUser, getOrder } from "lib/user";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Order Details",
  description: "View order details",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const order = await getOrder(user.id, orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/account/orders"
          className="mb-4 inline-flex items-center text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
        >
          ← Back to Orders
        </Link>
        <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Order Status */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Order Status</h3>
            <p className="mt-1 text-sm capitalize text-neutral-600 dark:text-neutral-400">
              {order.status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${order.total}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <h3 className="mb-4 text-lg font-semibold">Items</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800"
            >
              {item.image && (
                <div className="h-20 w-20 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{item.productTitle}</p>
                {item.variantTitle !== "Default Title" && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.variantTitle}
                  </p>
                )}
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-medium">${item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Subtotal
            </span>
            <span>${order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              Shipping
            </span>
            <span>${order.shipping}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">Tax</span>
            <span>${order.tax}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 text-lg font-semibold dark:border-neutral-800">
            <span>Total</span>
            <span>${order.total}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
          <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>
          <div className="text-sm">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.shippingAddress.addressLine1}
            </p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {order.shippingAddress.addressLine2}
              </p>
            )}
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
          <h3 className="mb-4 text-lg font-semibold">Billing Address</h3>
          <div className="text-sm">
            <p className="font-medium">{order.billingAddress.name}</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.billingAddress.addressLine1}
            </p>
            {order.billingAddress.addressLine2 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {order.billingAddress.addressLine2}
              </p>
            )}
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.billingAddress.city}, {order.billingAddress.state}{" "}
              {order.billingAddress.postalCode}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {order.billingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
