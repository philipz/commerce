import { getCurrentUser, getUserOrders } from "lib/user";
import Link from "next/link";

export const metadata = {
  title: "Order History",
  description: "View your order history",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const orders = await getUserOrders(user.id);
  const sortedOrders = orders.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order History</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          View and track your orders
        </p>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${order.total}</p>
                  <p className="text-sm capitalize text-neutral-600 dark:text-neutral-400">
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {item.image && (
                      <div className="h-16 w-16 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-900">
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

              <div className="mt-4 flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <Link
                  href={`/account/orders/${order.id}`}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-black">
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            No orders yet
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
