# GolfGives — Golf Charity Subscription Platform

> Play. Win. Give.

A full-stack subscription platform combining **golf performance tracking**, **monthly prize draws**, and **charitable giving**. Built as a sample assignment for the Digital Heroes Full-Stack Development Trainee Selection Process.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel |

---

## Features

### User
- Signup / Login with Supabase Auth
- Choose subscription plan (Monthly £20 / Yearly £200)
- Select a charity + set contribution percentage (min 10%)
- Enter up to 5 Stableford golf scores (1–45, rolling — newest replaces oldest)
- Auto-entered into monthly prize draws
- View winnings and upload proof for verification

### Draw Engine
- **Random draw** — standard lottery-style number generation
- **Algorithmic draw** — weighted by most/least frequent user scores
- Simulate before publishing
- Jackpot rolls over if no 5-match winner
- Prize pool split: 5-match 40% · 4-match 35% · 3-match 25%

### Admin Panel
- User management — view all users, subscription status
- Draw management — create, simulate, publish draws
- Charity management — add, edit, delete, feature charities
- Winner verification — approve/reject proof submissions

### Public Pages
- Homepage with hero, stats, pricing, featured charity
- Charities directory with events
- How It Works page

---

## Project Structure

```
golf-charity-platform/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── login/page.tsx            # Login
│   ├── signup/page.tsx           # Signup (2-step)
│   ├── how-it-works/page.tsx     # Public explainer
│   ├── charities/page.tsx        # Charity directory
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard sidebar layout
│   │   ├── page.tsx              # Overview
│   │   ├── scores/page.tsx       # Score entry & management
│   │   ├── charity/page.tsx      # Charity selection
│   │   └── draws/page.tsx        # Draws & winnings
│   ├── admin/
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Analytics overview
│   │   ├── users/page.tsx        # User management
│   │   ├── draws/page.tsx        # Draw management
│   │   ├── charities/page.tsx    # Charity management
│   │   └── winners/page.tsx      # Winner verification
│   └── api/
│       ├── auth/signout/route.ts # Sign out
│       └── draws/route.ts        # Draw engine API
├── components/
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server + Admin Supabase client
│   ├── draw-engine.ts            # Draw logic (random + algorithmic)
│   └── utils.ts                  # cn, formatCurrency, formatDate
├── types/
│   └── index.ts                  # All TypeScript types
├── supabase/
│   └── schema.sql                # Full DB schema + RLS + trigger
├── proxy.ts                      # Route protection middleware
└── .env.local                    # Environment variables (not committed)
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Shivanshu002/digital.git
cd digital
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Wait for provisioning to complete

### 3. Run the database schema

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Copy the contents of `supabase/schema.sql`
3. Paste and click **Run**

### 4. Create storage bucket

1. Supabase → **Storage** → **New Bucket**
2. Name: `winner-proofs`
3. Set to **Public** → **Create**

### 5. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from Supabase → **Settings** → **API**.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Seed Data (Recommended)

Run this in Supabase SQL Editor to add charities:

```sql
INSERT INTO charities (name, description, website, is_featured) VALUES
('Cancer Research UK', 'The world''s leading cancer research charity.', 'https://www.cancerresearchuk.org', true),
('British Heart Foundation', 'Fighting heart and circulatory diseases.', 'https://www.bhf.org.uk', false),
('Macmillan Cancer Support', 'Supporting people living with cancer.', 'https://www.macmillan.org.uk', false),
('Age UK', 'Helping older people love later life.', 'https://www.ageuk.org.uk', false);
```

---

## Create Admin User

1. Sign up on the platform normally
2. Run this in Supabase SQL Editor (replace with your email):

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

3. Access the admin panel at `/admin`

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Add all environment variables from `.env.local`
4. Deploy

> Use a **new Vercel account** and a **new Supabase project** for deployment as per PRD requirements.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles extending Supabase auth |
| `charities` | Charity listings |
| `charity_events` | Events linked to charities |
| `golf_scores` | Rolling 5 Stableford scores per user |
| `draws` | Monthly draw records |
| `draw_entries` | User entries per draw |
| `winners` | Winners with verification status |

---

## Test Credentials

After setup, create accounts via `/signup`:

| Role | How to get |
|------|-----------|
| User | Sign up at `/signup` |
| Admin | Sign up then run `UPDATE profiles SET role = 'admin' WHERE email = '...'` |

---

## PRD Checklist

- [x] User signup & login
- [x] Subscription flow (monthly and yearly)
- [x] Score entry — 5-score rolling logic
- [x] Draw system logic and simulation
- [x] Charity selection and contribution calculation
- [x] Winner verification flow
- [x] User Dashboard — all modules functional
- [x] Admin Panel — full control and usability
- [x] Responsive design on mobile and desktop
- [x] Error handling and edge cases

---

Built by [Digital Heroes](https://digitalheroes.co.in) · Sample Assignment
