# LeetCode Tracker

A web application to track LeetCode problems, daily challenges, and user statistics.

## Features

- **LeetCode Sync**: Import problem metadata from LeetCode.
- **Daily Challenge**: A deterministic daily challenge for all users.
- **Popular Categories**: Trending problems in categories like Arrays, DP, and more.
- **User Statistics**: Track solved problems, streaks, and difficulty distribution.
- **Google Auth**: Secure login via NextAuth and Google OAuth 2.0.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Prisma with SQLite
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-secret"
    GOOGLE_CLIENT_ID="your-google-id"
    GOOGLE_CLIENT_SECRET="your-google-secret"
    ```

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```

4.  **Sync Problems**:
    Run the sync script to populate the database with LeetCode problems:
    ```bash
    npx tsx scripts/sync-problems.ts
    ```

5.  **Recalculate Popularity**:
    Run the script to generate popular task lists:
    ```bash
    npx tsx scripts/recalculate-popularity.ts
    ```

6.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Maintenance Jobs

- **Daily Sync**: Set up a cron job to run `scripts/sync-problems.ts` daily.
- **Popularity Update**: Set up a cron job to run `scripts/recalculate-popularity.ts` every 12 hours.

## API Endpoints

- `GET /api/daily`: Get today's challenge.
- `GET /api/daily/:date`: Get challenge for a specific date.
- `GET /api/categories`: List all problem categories.
- `GET /api/categories/:tag/popular`: Get most popular problems for a tag.
- `GET /api/me/stats`: Get current user statistics.
- `POST /api/me/progress`: Update user progress for a problem.
- `GET /api/health`: Healthcheck endpoint.

## Deployment

The recommended deployment stack is **Vercel** + **Neon (Postgres)**.

### Step 1: Database Setup (Neon)
1. Create a project on [Neon](https://neon.tech/).
2. Copy the connection string (PostgreSQL).
3. Ensure it includes `sslmode=require`.

### Step 2: Authentication (Google)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth 2.0 credentials.
3. Add `https://your-domain.vercel.app/api/auth/callback/google` to authorized redirect URIs.

### Step 3: Deploy to Vercel
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Configure environment variables (see below).
4. Build settings: Standard Next.js defaults. Vercel will automatically run `prisma generate` if `prisma` is in `dependencies`.

### Environment Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon/Postgres connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_SECRET` | Secret for session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of your app | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxx` |
| `CRON_SECRET` | Secret for cron job endpoints | Random string |

### Step 4: Database Migrations
Run the initial migration on the production database:
```bash
DATABASE_URL="your_production_url" npx prisma migrate deploy
```

### Step 5: Cron Jobs
The application uses Vercel Cron Jobs (configured in `vercel.json`). They call:
- `/api/cron/sync`: Syncs problems from LeetCode (Daily at 00:00).
- `/api/cron/popularity`: Recalculates trending problems (Every 12 hours).

Ensure `CRON_SECRET` is set in Vercel and matched in your request header if calling manually (`Authorization: Bearer <secret>`).
