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
