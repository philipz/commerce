import { promises as fs } from "fs";
import path from "path";
import {
  BillingAddress,
  Order,
  ShippingAddress,
  UserPreferences,
  UserProfile,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "users");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }
}

// Generic file read/write utilities
async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// User Profile
export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const filePath = path.join(DATA_DIR, `${userId}-profile.json`);
  return readJsonFile<UserProfile>(filePath);
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const filePath = path.join(DATA_DIR, `${profile.id}-profile.json`);
  await writeJsonFile(filePath, profile);
}

// Shipping Addresses
export async function getShippingAddresses(
  userId: string,
): Promise<ShippingAddress[]> {
  const filePath = path.join(DATA_DIR, `${userId}-shipping.json`);
  const addresses = await readJsonFile<ShippingAddress[]>(filePath);
  return addresses || [];
}

export async function saveShippingAddress(
  address: ShippingAddress,
): Promise<void> {
  const addresses = await getShippingAddresses(address.userId);
  const index = addresses.findIndex((a) => a.id === address.id);

  if (index >= 0) {
    addresses[index] = address;
  } else {
    addresses.push(address);
  }

  const filePath = path.join(DATA_DIR, `${address.userId}-shipping.json`);
  await writeJsonFile(filePath, addresses);
}

export async function deleteShippingAddress(
  userId: string,
  addressId: string,
): Promise<void> {
  const addresses = await getShippingAddresses(userId);
  const filtered = addresses.filter((a) => a.id !== addressId);

  const filePath = path.join(DATA_DIR, `${userId}-shipping.json`);
  await writeJsonFile(filePath, filtered);
}

// Billing Addresses
export async function getBillingAddresses(
  userId: string,
): Promise<BillingAddress[]> {
  const filePath = path.join(DATA_DIR, `${userId}-billing.json`);
  const addresses = await readJsonFile<BillingAddress[]>(filePath);
  return addresses || [];
}

export async function saveBillingAddress(
  address: BillingAddress,
): Promise<void> {
  const addresses = await getBillingAddresses(address.userId);
  const index = addresses.findIndex((a) => a.id === address.id);

  if (index >= 0) {
    addresses[index] = address;
  } else {
    addresses.push(address);
  }

  const filePath = path.join(DATA_DIR, `${address.userId}-billing.json`);
  await writeJsonFile(filePath, addresses);
}

export async function deleteBillingAddress(
  userId: string,
  addressId: string,
): Promise<void> {
  const addresses = await getBillingAddresses(userId);
  const filtered = addresses.filter((a) => a.id !== addressId);

  const filePath = path.join(DATA_DIR, `${userId}-billing.json`);
  await writeJsonFile(filePath, filtered);
}

// User Preferences
export async function getUserPreferences(
  userId: string,
): Promise<UserPreferences | null> {
  const filePath = path.join(DATA_DIR, `${userId}-preferences.json`);
  return readJsonFile<UserPreferences>(filePath);
}

export async function saveUserPreferences(
  preferences: UserPreferences,
): Promise<void> {
  const filePath = path.join(
    DATA_DIR,
    `${preferences.userId}-preferences.json`,
  );
  await writeJsonFile(filePath, preferences);
}

// Orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const filePath = path.join(DATA_DIR, `${userId}-orders.json`);
  const orders = await readJsonFile<Order[]>(filePath);
  return orders || [];
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await getUserOrders(order.userId);
  const index = orders.findIndex((o) => o.id === order.id);

  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }

  const filePath = path.join(DATA_DIR, `${order.userId}-orders.json`);
  await writeJsonFile(filePath, orders);
}

export async function getOrder(
  userId: string,
  orderId: string,
): Promise<Order | null> {
  const orders = await getUserOrders(userId);
  return orders.find((o) => o.id === orderId) || null;
}
