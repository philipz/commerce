import { auth } from "@/auth";
import { getCurrentUser, getUserOrders, getShippingAddresses } from "lib/user";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Account Overview",
  description: "View your account details and recent activity",
};

export default async function AccountPage() {
  const session = await auth();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const orders = await getUserOrders(user.id);
  const recentOrders = orders.slice(0, 3).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const addresses = await getShippingAddresses(user.id);
  const defaultAddress = addresses.find((a) => a.isDefault);

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>
        <div className="flex items-center gap-4">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={user.name || "User"}
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user.name || "No name set"}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            View all →
          </Link>
        </div>
        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800"
              >
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total}</p>
                  <p className="text-sm capitalize text-neutral-600 dark:text-neutral-400">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            No orders yet
          </p>
        )}
      </div>

      {/* Default Shipping Address */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Default Shipping Address</h2>
          <Link
            href="/account/addresses"
            className="text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            Manage →
          </Link>
        </div>
        {defaultAddress ? (
          <div className="text-sm">
            <p className="font-medium">{defaultAddress.name}</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {defaultAddress.addressLine1}
            </p>
            {defaultAddress.addressLine2 && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {defaultAddress.addressLine2}
              </p>
            )}
            <p className="text-neutral-600 dark:text-neutral-400">
              {defaultAddress.city}, {defaultAddress.state}{" "}
              {defaultAddress.postalCode}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {defaultAddress.country}
            </p>
          </div>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            No default address set
          </p>
        )}
      </div>
    </div>
  );
}
