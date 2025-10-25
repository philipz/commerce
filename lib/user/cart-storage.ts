import { promises as fs } from "fs";
import path from "path";
import { Cart } from "lib/shopify/types";

const DATA_DIR = path.join(process.cwd(), "data", "users");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }
}

export async function getUserCart(userId: string): Promise<Cart | null> {
  try {
    const filePath = path.join(DATA_DIR, `${userId}-cart.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export async function saveUserCart(userId: string, cart: Cart): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${userId}-cart.json`);
  await fs.writeFile(filePath, JSON.stringify(cart, null, 2), "utf-8");
}

export async function clearUserCart(userId: string): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, `${userId}-cart.json`);
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, ignore
  }
}
