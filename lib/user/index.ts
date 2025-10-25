import { auth } from "@/auth";
import {
  deleteBillingAddress,
  deleteShippingAddress,
  getBillingAddresses,
  getOrder,
  getShippingAddresses,
  getUserOrders,
  getUserPreferences,
  getUserProfile,
  saveBillingAddress,
  saveOrder,
  saveShippingAddress,
  saveUserPreferences,
  saveUserProfile,
} from "./storage";
import {
  BillingAddress,
  Order,
  ShippingAddress,
  UserPreferences,
  UserProfile,
} from "./types";

export * from "./types";

// Get current user from session
export async function getCurrentUser(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  let profile = await getUserProfile(session.user.id);

  // Create profile if it doesn't exist
  if (!profile) {
    profile = {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name || null,
      image: session.user.image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveUserProfile(profile);
  }

  return profile;
}

// User preferences with defaults
export async function getCurrentUserPreferences(): Promise<UserPreferences> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  let preferences = await getUserPreferences(user.id);

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = {
      userId: user.id,
      emailNotifications: true,
      orderUpdates: true,
      marketingEmails: false,
      currency: "USD",
      language: "en",
    };
    await saveUserPreferences(preferences);
  }

  return preferences;
}

// Export storage functions
export {
  deleteBillingAddress,
  deleteShippingAddress,
  getBillingAddresses,
  getOrder,
  getShippingAddresses,
  getUserOrders,
  getUserPreferences,
  saveBillingAddress,
  saveOrder,
  saveShippingAddress,
  saveUserPreferences,
};
