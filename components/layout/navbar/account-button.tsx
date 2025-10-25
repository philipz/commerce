"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function AccountButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
        aria-label="Sign in"
      >
        <UserIcon className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-neutral-200 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserIcon className="h-5 w-5" />
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border border-neutral-200 bg-white shadow-lg focus:outline-none dark:border-neutral-800 dark:bg-black">
        <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p className="text-sm font-medium">{session.user.name || "User"}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            {session.user.email}
          </p>
        </div>

        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account"
                className={`${
                  active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                } block px-4 py-2 text-sm`}
              >
                Account Overview
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account/orders"
                className={`${
                  active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                } block px-4 py-2 text-sm`}
              >
                Orders
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account/addresses"
                className={`${
                  active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                } block px-4 py-2 text-sm`}
              >
                Addresses
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/account/preferences"
                className={`${
                  active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                } block px-4 py-2 text-sm`}
              >
                Preferences
              </Link>
            )}
          </Menu.Item>
        </div>

        <div className="border-t border-neutral-200 py-1 dark:border-neutral-800">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`${
                  active ? "bg-neutral-100 dark:bg-neutral-900" : ""
                } block w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
