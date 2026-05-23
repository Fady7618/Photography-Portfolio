# Photography Portfolio

A full-stack photography portfolio and client management app built with **Next.js 16**, **Supabase**, and **Resend**. It includes a public showcase site, session booking, role-based authentication, a client gallery with token access, and an admin panel for reservations and media uploads.

---

## Features

### Public site
- **Homepage** — GSAP-powered animations, hero, showcase, pricing, and portfolio sections
- **Gallery** — Public portfolio grid with lazy-loaded images and skeleton loading
- **About** — Photographer information page
- **Responsive layout** — Desktop sidebar + mobile bottom navigation

### Authentication & roles
- **Sign up / Sign in** — Supabase Auth with email and password
- **Role-based access** — Two roles stored in `profiles`:
  - **`client`** — Default role for new users
  - **`admin`** — Photographer; full access to admin panel
- **Protected routes** — Middleware guards `/reservation` (login required) and `/admin/*` (admin only)
- **Dynamic navbar & sidebar** — Shows user menu when logged in; admin dashboard link for admins only

### Reservations
- **Interactive calendar** — Pick an available date with `react-day-picker`
- **Booking form** — Name, email, and optional notes
- **Duplicate date prevention** — Blocks double-booking of the same session date
- **Email notifications** — Photographer receives an email via Resend on each new booking
- **SweetAlert feedback** — Themed success and error alerts on booking actions

### Client gallery
- **Public portfolio** — Showcase photos for visitors
- **Token-based access** — Clients open private galleries via `/gallery?token=...`
- **Logged-in client sessions** — Authenticated clients see only their own uploaded sessions
- **Download support** — Clients can download their photos and videos

### Admin panel (`/admin`)
- **Dashboard** (`/admin/dashboard`) — View all reservations with stats (total, pending, confirmed, cancelled)
- **Cancel booking** — Cancel individual reservations
- **Clear all** — Remove all bookings (with confirmation)
- **Upload manager** (`/admin`) — Create client sessions, upload photos/videos to Supabase Storage, and copy shareable gallery links

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database & Auth | Supabase (Postgres + Auth + Storage) |
| Email | Resend |
| Animations | GSAP, Framer Motion |
| UI | Lucide React, SweetAlert2, react-day-picker |

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin dashboard & upload manager
│   ├── auth/               # Login, register, OAuth callback
│   ├── gallery/            # Public & client gallery page
│   ├── reservation/        # Booking flow
│   └── api/                # REST API endpoints
├── components/             # UI components (auth, admin, gallery, reservation, ui)
├── hooks/                  # useAuth, useFetch, useMutation
├── lib/                    # Supabase clients, env, validators, API helpers
├── services/               # Business logic (booking, gallery, admin, email, auth)
├── types/                  # Shared TypeScript types
├── utils/                  # Formatters, alerts, download helpers
└── data/                   # Static portfolio data
middleware.ts               # Route protection & session refresh
supabase-auth-setup.sql     # Profiles table, RLS, auth triggers
```

---

## Prerequisites

- **Node.js** 18+
- **npm**
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) API key (for booking emails)

## Supabase setup

### 1. Database tables

Run the SQL in your Supabase SQL Editor:

- Base schema: bookings, client_sessions (from your initial project setup)
- Auth schema: [`supabase-auth-setup.sql`](supabase-auth-setup.sql) — profiles table, `user_id` columns, auto-profile trigger

### 2. Storage

Create a **`sessions`** bucket in Supabase Storage for client photo and video uploads. Configure policies so admins can upload and clients can read their own files.

### 3. Auth settings

In **Authentication → Providers → Email**:

- Enable **Email provider**
- Enable **Allow new users to sign up**
- Optionally disable **Confirm email** during development to avoid rate limits

### 4. Promote an admin user

After registering your photographer account, run in the SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Getting started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run verify:version` | Verify app version matches `package.json` |

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/gallery` | Public / Client | Portfolio or client sessions |
| `/gallery?token=...` | Token | Private client gallery |
| `/reservation` | Authenticated | Book a session |
| `/about` | Public | About page |
| `/auth/login` | Guest | Sign in |
| `/auth/register` | Guest | Create account |
| `/admin` | Admin | Upload manager |
| `/admin/dashboard` | Admin | Reservation dashboard |

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | List booked dates |
| `POST` | `/api/bookings` | Create a booking (authenticated) |
| `GET` | `/api/gallery?token=...` | Fetch client session files |
| `GET` | `/api/user-sessions` | Logged-in client's sessions |
| `GET` | `/api/admin/bookings` | All bookings (admin) |
| `DELETE` | `/api/admin/bookings` | Cancel or clear bookings (admin) |

---

## User roles

```mermaid
flowchart LR
    Guest[Guest] -->|Sign up| Client[Client]
    Client -->|Book session| Reservation[/reservation]
    Client -->|View own sessions| Gallery[/gallery]
    Admin[Admin] --> Dashboard[/admin/dashboard]
    Admin --> Upload[/admin]
    Guest -->|Token link| TokenGallery["/gallery?token=..."]
```

| Role | Can access |
|------|------------|
| **Guest** | Home, gallery portfolio, about, auth pages |
| **Client** | Everything above + reservations, own photo sessions |
| **Admin** | Everything above + admin dashboard, upload manager, all bookings |

---

## Architecture notes

- **Service layer** — API routes delegate to services in `src/services/` (no business logic in route handlers)
- **Centralized errors** — `AppError` and `handleApiError` in `src/lib/api-helpers.ts`
- **Env separation** — `publicEnv` for client-safe vars; `getServerEnv()` for server-only secrets
- **Custom hooks** — `useAuth`, `useFetch`, `useMutation` for shared client logic
- **Alerts** — Themed SweetAlert2 wrapper in `src/utils/alert.ts`

---

## Deployment

1. Set all environment variables in your hosting provider (e.g. Vercel).
2. Run `npm run build` locally to verify the build passes.
3. Ensure Supabase Auth redirect URLs include your production domain (e.g. `https://yoursite.com/auth/callback`).

---

## License

Private project — all rights reserved.
