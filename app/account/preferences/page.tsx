import { getCurrentUser, getCurrentUserPreferences } from "lib/user";

export const metadata = {
  title: "Preferences",
  description: "Manage your account preferences",
};

export default async function PreferencesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const preferences = await getCurrentUserPreferences();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferences</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <h3 className="mb-4 text-lg font-semibold">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Receive emails about your order status
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked={preferences.orderUpdates}
              className="h-5 w-5 rounded border-neutral-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">General Notifications</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Receive general account notifications
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked={preferences.emailNotifications}
              className="h-5 w-5 rounded border-neutral-300"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Receive promotional offers and updates
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked={preferences.marketingEmails}
              className="h-5 w-5 rounded border-neutral-300"
            />
          </div>
        </div>
      </div>

      {/* Regional Preferences */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
        <h3 className="mb-4 text-lg font-semibold">Regional Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Currency</label>
            <select
              defaultValue={preferences.currency}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Language</label>
            <select
              defaultValue={preferences.language}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
