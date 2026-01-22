# Vagus Nerve Reset - Web App

Next.js web application for the Vagus Nerve Reset wellness program.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `STRIPE_SECRET_KEY` - Your Stripe secret key (for payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
web/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/           # Main app dashboard
│   ├── practices/           # Practice pages
│   ├── insights/            # Analytics/charts
│   └── settings/            # User settings
├── components/              # Reusable React components
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Features Implemented

✅ Landing page with features and pricing
✅ Authentication (sign in, sign up)
✅ Supabase integration (client & server)
✅ Middleware for protected routes
✅ Custom color scheme (calm, wellness-focused)
✅ Responsive design (mobile-first)

## Next Steps

1. Build dashboard page (`/dashboard`)
2. Create mood record form
3. Build practices pages
4. Implement glimmers page
5. Create insights/charts page
6. Integrate Stripe for payments
7. Add data export functionality

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe (to be integrated)
- **Charts**: Recharts (to be integrated)
- **UI Components**: Radix UI (to be integrated)

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint
npm run lint
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Ensure environment variables are set

## Environment Variables

All environment variables are documented in `.env.local.example`.

**Important**: Never commit `.env.local` to version control.

## Contributing

This is part of the Vagus Nerve Reset project. See main README for contribution guidelines.

## License

Proprietary - All rights reserved.
