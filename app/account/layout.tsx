import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = [
    { href: "/account", label: "Overview" },
    { href: "/account/orders", label: "Orders" },
    { href: "/account/addresses", label: "Addresses" },
    { href: "/account/preferences", label: "Preferences" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage your orders, addresses, and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar Navigation */}
        <nav className="md:col-span-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-4 py-2 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
