# Sitiawan Paramotor Club Website

A travel-style marketing website with online booking, image-rich homepage, admin CMS, and operator slot management.

## Local URLs

| Page | URL |
|------|-----|
| **Homepage** | http://localhost:3000 |
| Book a Flight | http://localhost:3000/book |
| Contact (on homepage) | http://localhost:3000/#contact |
| **CMS Login** | http://localhost:3000/admin/login |
| **Homepage CMS** | http://localhost:3000/admin/content |
| Reviews CMS | http://localhost:3000/admin/reviews |
| Operators | http://localhost:3000/admin/operators |
| Slot Assignments | http://localhost:3000/admin/slots |
| Bookings | http://localhost:3000/admin/bookings |

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Default admin credentials are created by the seed script (see `prisma/seed.ts`). **Change the admin password before going live.**

## Deploy to Railway (recommended — git push updates)

Railway fits this project because it uses **SQLite** and **local CMS uploads**, which need a **persistent disk** (not ephemeral serverless storage).

**Cost:** trial credits, then roughly **$5/month** at low traffic.

### 1. Push to GitHub

```bash
git init   # if not already a repo
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Ensure `.env` and `*.db` are **not** committed (see `.gitignore`).

### 2. Create Railway project

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select this repository.
3. Railway auto-detects Next.js and uses [`railway.toml`](railway.toml).

### 3. Add a persistent volume

1. In your Railway service → **Volumes** → **Add Volume**.
2. Mount path: `/data`
3. Size: 1 GB is enough to start.

This keeps your database and uploaded images across redeploys.

### 4. Set environment variables

In Railway → **Variables**:

| Variable | Value |
|----------|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `file:/data/dev.db` |
| `UPLOAD_DIR` | `/data/uploads` |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32` |

Copy [`.env.example`](.env.example) as a reference. Never paste secrets into the repo.

### 5. First deploy and database setup

After the first successful deploy:

1. Open Railway → **Settings** → run a one-time command in the **Shell**, or redeploy (start command runs `prisma db push` automatically).
2. Seed initial CMS data and admin user (first time only):

```bash
npm run db:seed
```

Run that in the Railway shell if tables are empty. The seed creates the admin account from `prisma/seed.ts`.

### 6. Push updates (ongoing workflow)

```bash
git add .
git commit -m "Your change"
git push origin main
```

Railway rebuilds and redeploys automatically (~2–5 minutes). Data on `/data` is preserved.

### 7. Custom domain and HTTPS

1. Railway → your service → **Settings** → **Networking** → **Custom Domain**.
2. Add your domain (e.g. `sitiawanparamotor.com`).
3. At your domain registrar, add the DNS record Railway shows (usually a **CNAME** to `*.up.railway.app`).
4. HTTPS is provisioned automatically (Let’s Encrypt). No extra config.

Allow up to 24–48 hours for DNS propagation (often much faster).

---

## Production security checklist

Before sharing the live URL:

- [ ] Set a strong **`SESSION_SECRET`** in Railway (not the dev default).
- [ ] **Change the admin password** — do not use the seed default in production.
- [ ] Confirm `/admin/*` redirects to login when logged out.
- [ ] Use **Logout** on shared devices after CMS sessions.

---

## Homepage Sections (all CMS-editable)

1. **Full-screen hero** — aerial paramotor image, club name, Book + Contact Us
2. **Why Try Paramotor Tandem** — image + title + text
3. **Safety** — full-width background image with overlay text
4. **Operators** — portrait photos with experience, background, certifications, bio
5. **Reviews** — guest testimonials with star ratings
6. **Pricing** — promotional package cards
7. **Contact** — email, phone, WhatsApp, address

## Image Optimization

- Next.js `<Image>` with AVIF/WebP auto-format
- Hero loads with `priority`; below-fold images lazy-load
- Upload images via CMS (max 5MB, JPEG/PNG/WebP)
- Local dev: `public/uploads/` · Production (Railway): `UPLOAD_DIR` on the `/data` volume

## CMS Features

- **Homepage CMS** — edit images, titles, and text per section
- **Operators** — photo upload, experience, background, certifications, homepage visibility
- **Reviews** — add/edit/hide guest reviews
- **Availability & Slots** — weekly schedule and operator slot assignments
- **Bookings** — view customer bookings with package details

## Tech Stack

- Next.js 13 (App Router)
- Prisma + SQLite
- Tailwind CSS + Cormorant Garamond display font
- TypeScript

## Future upgrade path

When traffic grows, consider migrating to **Vercel + Neon Postgres + cloud image storage** for better scale. The current Railway + volume setup is the fastest path for early-stage launch.
