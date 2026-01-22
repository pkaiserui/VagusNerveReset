# Vercel Deployment Setup

## Environment Variables

Add the following environment variable in your Vercel project settings:

```
NEXT_PUBLIC_SITE_URL=https://vagus-nerve-reset-bosqy6iq1-peter-kaisers-projects-8d026b00.vercel.app
```

This ensures that email confirmation links and OAuth redirects use your production URL instead of localhost.

## Supabase Configuration

You also need to configure the redirect URLs in your Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to **Redirect URLs**:
   ```
   https://vagus-nerve-reset-bosqy6iq1-peter-kaisers-projects-8d026b00.vercel.app/auth/callback
   ```
5. Update **Site URL** to your Vercel URL:
   ```
   https://vagus-nerve-reset-bosqy6iq1-peter-kaisers-projects-8d026b00.vercel.app
   ```

This ensures that:
- Email confirmation links redirect to your production site
- OAuth callbacks work correctly
- Password reset links use the correct URL

## Updating the URL

If your Vercel deployment URL changes, update both:
1. The `NEXT_PUBLIC_SITE_URL` environment variable in Vercel
2. The redirect URLs in Supabase dashboard
