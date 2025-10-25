import {
  getBillingAddresses,
  getCurrentUser,
  getShippingAddresses,
} from "lib/user";

export const metadata = {
  title: "Saved Addresses",
  description: "Manage your shipping and billing addresses",
};

export default async function AddressesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const shippingAddresses = await getShippingAddresses(user.id);
  const billingAddresses = await getBillingAddresses(user.id);

  return (
    <div className="space-y-8">
      {/* Shipping Addresses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Shipping Addresses</h2>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Manage your shipping addresses
            </p>
          </div>
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
            Add Address
          </button>
        </div>

        {shippingAddresses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {shippingAddresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black"
              >
                {address.isDefault && (
                  <span className="mb-2 inline-block rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                    Default
                  </span>
                )}
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.addressLine1}
                </p>
                {address.addressLine2 && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {address.addressLine2}
                  </p>
                )}
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.country}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">
                    Edit
                  </button>
                  <button className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-black">
            <p className="text-neutral-600 dark:text-neutral-400">
              No shipping addresses saved
            </p>
          </div>
        )}
      </div>

      {/* Billing Addresses */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Billing Addresses</h2>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Manage your billing addresses
            </p>
          </div>
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
            Add Address
          </button>
        </div>

        {billingAddresses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {billingAddresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-black"
              >
                {address.isDefault && (
                  <span className="mb-2 inline-block rounded bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                    Default
                  </span>
                )}
                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.addressLine1}
                </p>
                {address.addressLine2 && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {address.addressLine2}
                  </p>
                )}
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {address.country}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="text-sm text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">
                    Edit
                  </button>
                  <button className="text-sm text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-black">
            <p className="text-neutral-600 dark:text-neutral-400">
              No billing addresses saved
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
