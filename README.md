# Photography Portfolio

A full-stack photography business app built with **Next.js 16**, **Supabase**, and **Resend**. It includes a public marketing site, session booking with email notifications, role-based authentication, private client galleries (magic link or login), and an admin panel for reservations and bulk media uploads.

**Version:** 0.2.0

---

## Features

### Public site
- **Homepage** — GSAP-powered animations (ScrollSmoother, ScrollTrigger), hero, showcase, pricing, and portfolio sections
- **Gallery** — Public portfolio grid with category filter, lazy-loaded images, and lightbox modal
- **About** — Photographer information and specialties
- **Responsive layout** — Desktop sidebar + top navbar; mobile bottom navigation

### Authentication & roles
- **Sign up / Sign in** — Supabase Auth with email and password
- **OAuth callback** — `/auth/callback` for Supabase redirect flows
- **Role-based access** — Roles stored in `profiles`:
  - **`client`** — Default for new users; book sessions and view own galleries
  - **`admin`** — Photographer; full admin panel access
- **Protected routes** — Middleware guards `/reservation` (login required) and `/admin/*` (admin only)
- **Session refresh** — Supabase SSR cookies refreshed on every matched request

### Reservations
- **Interactive calendar** — Pick an available date with `react-day-picker` (pending vs confirmed styling)
- **Booking form** — Name, email, optional notes; validated server-side
- **Duplicate date prevention** — Blocks double-booking for the same session date
- **Email notifications** — Photographer notified via Resend on each new booking
- **Admin approval flow** — Confirm pending bookings; client receives confirmation email (with rollback if email fails)
- **Rate limiting** — Booking API limited to 5 requests per 10 minutes per IP

### Client gallery
- **Public portfolio** — Static showcase images for visitors
- **Token-based access** — Clients open private galleries via `/gallery/sessions?token=...` (5-day link expiry)
- **Logged-in sessions** — Authenticated clients see a list of their sessions and open any gallery
- **Infinite scroll** — Paginated file loading (20 per page) with intersection observer
- **Thumbnails** — Server-generated 400px thumbs and 1200px compressed JPEGs (Sharp)
- **Signed URLs** — Batch-signed thumbnail URLs (24-hour expiry) for fast grid rendering
- **Downloads** — Single-file download, multi-select download, or full session ZIP
- **File types** — Images, videos, and other files grouped in the UI

### Admin panel (`/admin`)
- **Dashboard** (`/admin/dashboard`) — Reservation table with live stats (total, pending, confirmed, cancelled)
- **Approve / cancel** — Confirm bookings (sends client email) or cancel individual reservations
- **Clear all** — Remove all bookings with confirmation
- **Upload manager** (`/admin`) — Create client sessions, link users, copy shareable gallery links
- **Resumable uploads** — TUS uploads to Supabase Storage with server fallback on RLS errors
- **Thumbnail pipeline** — Auto-generate thumb + compressed variants after each upload
- **Rate limiting** — Upload API limited to 30 requests per minute per IP

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Database & Auth | Supabase (Postgres + Auth + Storage) |
| Email | Resend |
| Image processing | Sharp |
| Uploads | tus-js-client (resumable) + server multipart fallback |
| Archives | archiver (session ZIP downloads) |
| Animations | GSAP (ScrollSmoother, ScrollTrigger) |
| UI | Lucide React, SweetAlert2, react-day-picker |
| Testing | Vitest |

---

## Project structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── admin/              # Admin dashboard & upload manager
│   ├── auth/               # Login, register, OAuth callback
│   ├── gallery/            # Public portfolio & client sessions
│   ├── reservation/        # Booking flow
│   └── api/                # REST API endpoints
├── components/             # UI (auth, admin, gallery, reservation, ui)
├── context/                # AuthProvider (user, profile, roles)
├── hooks/                  # useAuth, useFetch, useMutation
├── lib/                    # Supabase, env, validators, rate limit, API helpers
├── services/               # Business logic (booking, gallery, admin, email, auth, client)
├── types/                  # Shared TypeScript types
├── utils/                  # Formatters, email templates, alerts, downloads
├── data/                   # Static portfolio data
└── __tests__/              # Vitest unit tests
middleware.ts               # Auth guards, rate limits, session refresh
supabase-auth-setup.sql     # Profiles table, RLS, auth triggers
```

### Storage layout (Supabase `sessions` bucket)

```
{session-slug}/
├── originals/     # Full-resolution uploads
├── thumbnails/    # 400px previews (images)
└── compressed/    # 1200px JPEG variants (images)
```

---

## Prerequisites

- **Node.js** 18+
- **npm**
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) API key (for booking emails)

---

## Supabase setup

### 1. Database tables

Run the SQL in your Supabase SQL Editor:

- Base schema: `bookings`, `client_sessions`
- Auth schema: [`supabase-auth-setup.sql`](supabase-auth-setup.sql) — `profiles` table, `user_id` columns, auto-profile trigger

### 2. Storage

Create a **`sessions`** bucket in Supabase Storage. Configure policies so admins can upload and clients can read via signed URLs (service role used server-side for gallery API).

### 3. Auth settings

In **Authentication → Providers → Email**:

- Enable **Email provider**
- Enable **Allow new users to sign up**
- Optionally disable **Confirm email** during development

### 4. Promote an admin user

After registering your photographer account:

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

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (webpack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run verify:version` | Verify app version matches `package.json` |

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/gallery` | Public | Portfolio showcase |
| `/gallery/sessions` | Client / Token | Client session list or private gallery |
| `/gallery/sessions?token=...` | Token | Private gallery via magic link |
| `/reservation` | Authenticated | Book a session |
| `/about` | Public | About page |
| `/auth/login` | Guest | Sign in |
| `/auth/register` | Guest | Create account |
| `/admin` | Admin | Upload manager |
| `/admin/dashboard` | Admin | Reservation dashboard |

---

## API endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/bookings` | Public | Booked dates (pending + confirmed) |
| `POST` | `/api/bookings` | Auth | Create booking |
| `GET` | `/api/gallery?token=&page=` | Token | Paginated session files + signed thumbnails |
| `GET` | `/api/gallery/download` | Token | Stream single original file |
| `GET` | `/api/gallery/download-zip` | Token | Download all originals as ZIP |
| `GET` | `/api/user-sessions` | Auth | Logged-in client's sessions |
| `GET` | `/api/admin/bookings` | Admin | List all bookings |
| `PATCH` | `/api/admin/bookings?id=` | Admin | Confirm booking + send client email |
| `DELETE` | `/api/admin/bookings` | Admin | Cancel booking or clear all |
| `GET` | `/api/admin/sessions` | Admin | List client sessions |
| `POST` | `/api/admin/sessions` | Admin | Create session |
| `POST` | `/api/admin/sessions/upload` | Admin | Server-side file upload (fallback) |
| `POST` | `/api/admin/create-client` | Admin | Create/link user to session |
| `POST` | `/api/admin/generate-thumbnail` | Admin | Generate thumb + compressed variants |

---

## User roles

```mermaid
flowchart LR
    Guest[Guest] -->|Sign up| Client[Client]
    Client -->|Book session| Reservation[/reservation]
    Client -->|View own sessions| Gallery[/gallery/sessions]
    Admin[Admin] --> Dashboard[/admin/dashboard]
    Admin --> Upload[/admin]
    Guest -->|Token link| TokenGallery["/gallery/sessions?token=..."]
```

| Role | Can access |
|------|------------|
| **Guest** | Home, gallery portfolio, about, auth pages |
| **Client** | Everything above + reservations, own photo sessions |
| **Admin** | Everything above + admin dashboard, upload manager, all bookings |

---

## Architecture

- **Service layer** — API routes delegate to `src/services/`; no business logic in route handlers
- **Centralized errors** — `AppError` + `handleApiError` in `src/lib/api-helpers.ts`
- **Request validation** — Dedicated validators in `src/lib/validators.ts` (email regex, required fields)
- **Env separation** — `publicEnv` for client; `getServerEnv()` for server-only secrets
- **Custom hooks** — `useAuth`, `useFetch`, `useMutation` for shared client logic
- **HTML email safety** — User content escaped; full HTML document structure for client compatibility
- **Rate limiting** — In-memory sliding window in middleware (bookings + uploads)

---

## Testing

Unit tests cover validators, email HTML escaping, formatters, and booking duplicate-date logic:

```bash
npm test
```

Tests live in `src/__tests__/`.

---

## Deployment

1. Set all environment variables in your hosting provider (e.g. Vercel).
2. Run `npm run build` and `npm test` locally before deploying.
3. Add your production domain to Supabase Auth redirect URLs (e.g. `https://yoursite.com/auth/callback`).
4. Verify a custom domain in Resend and set `RESEND_FROM_EMAIL` for client confirmation emails.
5. **ZIP downloads** — Large sessions may hit serverless timeouts (60s on Vercel free tier); consider Pro for 300s or very large galleries.

---

## License

Private project — all rights reserved.
