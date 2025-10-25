# Google OAuth Authentication Setup Guide

This guide explains how to set up Google OpenID authentication for the Next.js Commerce application.

## Features

The authentication system provides:

- **Google OAuth Login** - Sign in with Google account
- **User Profile Management** - View and manage user information
- **Saved Addresses** - Store shipping and billing addresses
- **Order History** - Track past orders
- **User Preferences** - Manage notification and regional settings
- **Persistent Cart** - Cart syncs across devices for logged-in users

## Setup Instructions

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`

### 2. Configure Environment Variables

Create a `.env.local` file in the project root (or add to your existing `.env`):

```env
# NextAuth Configuration
AUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"  # Change for production

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Generate AUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 3. Install Dependencies

Dependencies are already installed via `pnpm add next-auth@beta`.

### 4. Start the Development Server

```bash
pnpm dev
```

## Usage

### User Features

#### Login

- Click the user icon in the navbar
- Choose "Sign in with Google"
- Authenticate with your Google account
- You'll be redirected to your account page

#### Account Management

Navigate to `/account` to access:

- **Overview**: View profile, recent orders, and default address
- **Orders**: View all order history and details
- **Addresses**: Manage shipping and billing addresses
- **Preferences**: Configure notifications and regional settings

#### Cart Persistence

- Cart automatically syncs across devices when logged in
- Cart state is preserved when switching between devices
- Cart clears when order is completed

### Developer Features

#### Protected Routes

Routes under `/account/*` are automatically protected. Users must be logged in to access them.

#### User Data Storage

User data is stored in JSON files under `/data/users/`:

- `{userId}-profile.json` - User profile
- `{userId}-cart.json` - Saved cart
- `{userId}-orders.json` - Order history
- `{userId}-shipping.json` - Shipping addresses
- `{userId}-billing.json` - Billing addresses
- `{userId}-preferences.json` - User preferences

#### Server Actions

Use these server actions in your components:

```typescript
import { getCurrentUser, saveShippingAddress } from "lib/user";
import { syncCartToUser } from "components/cart/cart-sync";

// Get current authenticated user
const user = await getCurrentUser();

// Save shipping address
await saveShippingAddress(address);

// Sync cart to user storage
await syncCartToUser(cart);
```

#### Creating Orders

Call the order completion API when checkout succeeds:

```typescript
const response = await fetch("/api/orders/complete", {
  method: "POST",
});
const { order } = await response.json();
```

## File Structure

```
commerce/
├── auth.ts                          # NextAuth configuration
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth API route
│   │   └── orders/
│   │       └── complete/route.ts       # Order completion endpoint
│   ├── login/page.tsx               # Login page
│   └── account/                     # Account management pages
│       ├── layout.tsx
│       ├── page.tsx                 # Account overview
│       ├── orders/
│       ├── addresses/
│       └── preferences/
├── components/
│   ├── auth/
│   │   └── session-provider.tsx    # Client-side session provider
│   ├── layout/navbar/
│   │   └── account-button.tsx      # Account dropdown menu
│   └── cart/
│       ├── cart-sync.ts            # Cart sync server actions
│       └── actions.ts              # Cart actions with sync
└── lib/user/
    ├── types.ts                    # TypeScript types
    ├── storage.ts                  # File-based storage
    ├── cart-storage.ts             # Cart persistence
    ├── order-actions.ts            # Order management
    └── index.ts                    # Public API
```

## Security Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Use HTTPS in production** - Required for OAuth
3. **Keep AUTH_SECRET secure** - Regenerate if compromised
4. **Review OAuth scopes** - Only request necessary permissions
5. **Validate user data** - Always validate on the server side

## Troubleshooting

### "Configuration mismatch" error

- Verify `NEXTAUTH_URL` matches your application URL
- Check OAuth redirect URIs in Google Console

### "Invalid client" error

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure OAuth credentials are for the correct project

### Session not persisting

- Verify `AUTH_SECRET` is set
- Clear browser cookies and try again
- Check that cookies are enabled

### Cart not syncing

- Ensure user is logged in
- Check `/data/users/` directory exists and is writable
- Verify `syncCartToUser` is called in cart actions

## Production Deployment

1. Update `NEXTAUTH_URL` to your production URL
2. Add production redirect URI to Google Console
3. Ensure `/data/users/` directory is persistent (use database in production)
4. Consider migrating from file storage to database for scalability
5. Set up proper backup for user data

## Future Enhancements

Consider these improvements for production:

1. **Database Integration** - Replace file storage with PostgreSQL/MongoDB
2. **Email Verification** - Add email verification step
3. **Password Reset** - Add password reset flow (if adding email/password auth)
4. **Two-Factor Authentication** - Add 2FA for enhanced security
5. **Social Login Options** - Add Facebook, Apple, or other providers
6. **Profile Pictures** - Allow users to upload custom avatars
7. **Webhook Integration** - Integrate with Shopify webhooks for real-time order updates
