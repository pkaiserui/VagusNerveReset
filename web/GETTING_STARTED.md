# Getting Started - Vagus Nerve Reset Web App

## 🎉 What's Been Built

You now have a **complete Next.js foundation** for the Vagus Nerve Reset web app:

### ✅ Completed Features

1. **Project Setup**
   - Next.js 15 with TypeScript
   - Tailwind CSS v4 with custom color scheme
   - All dependencies installed

2. **Supabase Integration**
   - Client-side and server-side Supabase clients
   - Authentication middleware for protected routes
   - Type definitions matching database schema

3. **Authentication Pages**
   - `/login` - Sign in page with email/password and Google OAuth
   - `/signup` - Create account page with validation
   - `/auth/callback` - OAuth callback handler

4. **Landing Page** (`/`)
   - Hero section with clear value proposition
   - Features grid (6 key features)
   - Pricing section (Free vs Premium)
   - Footer with navigation

5. **Design System**
   - Custom color palette (calming teal, warm peach, gold accent)
   - Responsive design (mobile-first)
   - Reusable utility classes (`.card`, `.card-hover`)
   - Consistent spacing and shadows

---

## 🚀 Quick Start (3 Steps)

### Step 1: Add Your Supabase Credentials

Open `web/.env.local` and add your Supabase URL and anon key:

```bash
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Start the Development Server

```bash
cd web
npm run dev
```

### Step 3: Open in Browser

Visit: **http://localhost:3000**

You should see the beautiful landing page!

---

## 🧪 Test What's Working

### Test 1: View Landing Page
- ✅ Open http://localhost:3000
- Should see hero, features, pricing, footer

### Test 2: Try Sign Up
- ✅ Click "Get Started" or "Sign Up"
- Fill out email and password
- Should see "Check your email" confirmation

### Test 3: Try Sign In
- ✅ Go to /login
- Enter credentials
- Should redirect to /dashboard (will show error until we build dashboard)

---

## 📁 File Structure

```
web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ✅ Sign in page
│   │   └── signup/page.tsx         ✅ Sign up page
│   ├── auth/callback/route.ts      ✅ OAuth callback
│   ├── globals.css                 ✅ Custom styles
│   ├── layout.tsx                  ✅ Root layout
│   └── page.tsx                    ✅ Landing page
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ✅ Client-side Supabase
│   │   ├── server.ts               ✅ Server-side Supabase
│   │   └── middleware.ts           ✅ Auth middleware
│   ├── types.ts                    ✅ TypeScript types
│   └── utils.ts                    ✅ Utility functions
│
├── middleware.ts                   ✅ Route protection
├── .env.local                      ⚠️  NEEDS YOUR CREDENTIALS
├── .env.local.example              ✅ Template
└── README.md                       ✅ Documentation
```

---

## 📋 Next Steps (What to Build)

### Priority 1: Dashboard (Week 1)

Create `/dashboard/page.tsx` with:
- Today's progress (mood records, practices completed)
- Quick actions ("Log Mood", "Start Practice")
- Today's glimmer
- Current streak

**Files to create:**
- `app/dashboard/page.tsx`
- `components/DashboardStats.tsx`
- `components/PracticeCard.tsx`

### Priority 2: Mood Record Form (Week 1)

Create `/dashboard/mood-record/page.tsx` with:
- Mood score slider (1-10)
- Emotion picker (multi-select chips)
- Nervous system state selector
- Body tags
- Notes textarea

**Files to create:**
- `app/dashboard/mood-record/page.tsx`
- `components/MoodSlider.tsx`
- `components/EmotionPicker.tsx`

### Priority 3: Practices Pages (Week 2)

Create `/practices` with:
- List of all practices
- Individual practice detail pages
- Practice timer/guide
- State tracking (before/after)

**Files to create:**
- `app/practices/page.tsx`
- `app/practices/[id]/page.tsx`
- `components/PracticeTimer.tsx`

### Priority 4: Glimmers Page (Week 2)

Create `/glimmers/page.tsx` with:
- List of user's glimmers
- Add new glimmer form
- Pin/unpin functionality
- Premium limit (1 free, unlimited premium)

**Files to create:**
- `app/glimmers/page.tsx`
- `components/GlimmerCard.tsx`
- `components/AddGlimmerForm.tsx`

### Priority 5: Insights Page (Week 3)

Create `/insights/page.tsx` with:
- Mood trend line chart (Recharts)
- Practice completion heatmap
- Correlations display
- Time range selector (7d, 30d, 90d)

**Files to create:**
- `app/insights/page.tsx`
- `components/MoodChart.tsx`
- `components/HeatmapCalendar.tsx`

### Priority 6: Stripe Integration (Week 3)

Create premium purchase flow:
- Paywall component
- Stripe Checkout integration
- Webhook handler for payment confirmation
- Entitlement check

**Files to create:**
- `components/Paywall.tsx`
- `app/api/create-checkout-session/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `lib/stripe.ts`

### Priority 7: Settings & Export (Week 4)

Create `/settings/page.tsx` with:
- Account management
- Preferences (reminders, streaks)
- Data export (PDF/CSV)
- Delete account

**Files to create:**
- `app/settings/page.tsx`
- `app/api/export/route.ts`
- `components/ExportButton.tsx`

---

## 🎨 Design Guidelines

### Colors (Already configured in globals.css)

```css
--primary: #4A90A4        /* Soft teal - main actions */
--secondary: #F4A261      /* Warm peach - highlights */
--accent: #D4AF37         /* Gold - premium features */
--success: #6A994E        /* Muted green - confirmations */
--warning: #E76F51        /* Soft amber - warnings */
--error: #C1666B          /* Muted red - errors */
```

### Usage Examples

```tsx
// Primary button
<button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl">
  Click me
</button>

// Card with hover effect
<div className="card card-hover">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>

// Success message
<div className="p-3 rounded-lg bg-success/10 text-success">
  Success! Your data has been saved.
</div>
```

---

## 🐛 Troubleshooting

### Issue: "Module not found: Can't resolve '@/lib/...'"
**Solution**: TypeScript paths are configured. Restart VS Code or run `npm run dev` again.

### Issue: "Supabase error: Invalid API key"
**Solution**: Check your `.env.local` file. Make sure you copied the anon key (not the service role key).

### Issue: Auth doesn't work
**Solution**:
1. Make sure Supabase schema is loaded (`schema.sql` from `/supabase`)
2. Check Supabase dashboard → Authentication → URL Configuration
3. Add `http://localhost:3000/auth/callback` to redirect URLs

### Issue: Styles not applying
**Solution**: Tailwind v4 is new. If classes aren't working:
1. Check `postcss.config.mjs` has `@tailwindcss/postcss`
2. Restart dev server: `npm run dev`

---

## 📚 Learning Resources

### Next.js
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## ✅ Checklist for Next Session

Before building dashboard:
- [ ] Supabase credentials added to `.env.local`
- [ ] Dev server running (`npm run dev`)
- [ ] Landing page loads at http://localhost:3000
- [ ] Sign up flow works (email confirmation)
- [ ] Sign in redirects to /dashboard (shows 404 for now - that's expected!)

---

## 💡 Pro Tips

1. **Use the types**: `lib/types.ts` has all database types. Import and use them!
2. **Server vs Client**: Use `@/lib/supabase/server` in Server Components, `@/lib/supabase/client` in Client Components
3. **Protected Routes**: Middleware handles auth. Just build the pages, protection is automatic!
4. **Color Classes**: Use `text-primary`, `bg-success`, etc. directly in className
5. **Responsive**: Mobile-first! Use `md:` and `lg:` prefixes for larger screens

---

## 🎯 Success Metrics

After building all pages, you should have:
- [ ] Functional dashboard showing today's data
- [ ] Mood logging working end-to-end
- [ ] At least 3 practices implemented
- [ ] Glimmers CRUD (Create, Read, Update, Delete)
- [ ] Insights page with 1-2 charts
- [ ] Premium purchase flow (even if using test Stripe)
- [ ] Data export (at least CSV)

---

**You're off to a great start! The foundation is solid. Now let's build the features! 🚀**

Need help? Check:
1. `web/README.md` - Setup guide
2. `docs/PRD.md` - Product requirements
3. `docs/SCREEN_MAP.md` - Wireframes
4. `docs/COMPONENT_INVENTORY.md` - Design system
