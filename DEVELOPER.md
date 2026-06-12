# Developer Documentation

Welcome to the TechNova Consulting platform developer guide. This document outlines the technology stack, project structure, environment configuration, and deployment procedures.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Ant Design (Admin Dashboard UI components)
- **Database**: PostgreSQL (Neon.tech or similar recommended)
- **ORM**: Prisma (v7.8.0)
- **Authentication**: JWT (jose library for edge-compatible token verification)
- **Animations**: Framer Motion
- **Rich Text Editor**: React Quill New
- **Icons**: Ant Design Icons (Wrapped for Client Component compatibility)

## Project Structure

```text
├── prisma/
│   └── schema.prisma        # Database schema definitions
├── public/                  # Static assets (images, fonts)
├── src/
│   ├── app/                 # Next.js App Router root
│   │   ├── (public)/        # Public-facing website pages (Home, About, Services, Blog, etc.)
│   │   ├── admin/           # Admin Dashboard pages and layout
│   │   └── api/             # Next.js API Routes
│   ├── components/          # Reusable UI components (Navbar, Footer, FadeInUp, AntdIcons)
│   ├── lib/                 # Utility libraries and configurations (e.g. Prisma client)
│   └── proxy.ts             # Middleware replacement for Edge proxy logic (JWT auth check)
├── .env.example             # Template for required environment variables
├── package.json             # Project dependencies and scripts
└── next.config.ts           # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js v20+
- `pnpm` (v10+ recommended)
- PostgreSQL database URL

### Local Setup

1. **Clone the repository** and install dependencies:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Copy the example environment file and fill in your actual credentials.
   ```bash
   cp .env.example .env
   ```
   **Required Variables**:
   - `DATABASE_URL`: Connection string for your PostgreSQL database.
   - `JWT_SECRET`: Secret key for JWT token generation and verification.
   - `CLOUDINARY_URL`: If you use Cloudinary for media storage.

3. **Database Initialization**:
   Push the schema to your database and generate the Prisma client.
   ```bash
   pnpm dlx prisma db push
   pnpm dlx prisma generate
   ```

4. **Start the Development Server**:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` to view the public site.
   Open `http://localhost:3000/admin/login` to access the admin dashboard. (Default Admin shortcut: `Ctrl + Shift + A`)

## Common Issues & Gotchas

1. **`createContext` is not a function Error**:
   Next.js App Router Server Components cannot render components that use React Context (`createContext`) or `forwardRef` without the `'use client'` directive. This typically happens when importing third-party UI libraries like `@ant-design/icons` in Server Components (e.g. `PublicFooter.tsx`, `about/page.tsx`).
   *Solution*: Import these components using our custom wrapper in `src/components/AntdIcons.tsx`.

2. **Edge Runtime Limits**:
   The project utilizes Edge-compatible configurations. Avoid importing Node.js native modules (`fs`, `net`, `pg`) directly into Middleware or Edge Runtime routes. `jose` is used for JWT verification instead of `jsonwebtoken` because it is Edge-compatible.

## Deployment Guide (Vercel)

TechNova Consulting is optimized for deployment on Vercel. 

### Step-by-Step Vercel Deployment

1. **Connect Repository**:
   Log into your Vercel account, click **Add New...** -> **Project**, and select this repository.

2. **Configure Environment Variables**:
   In the Vercel project settings during setup, expand the "Environment Variables" section and add all variables defined in your `.env` file (e.g., `DATABASE_URL`, `JWT_SECRET`). 

3. **Build Settings**:
   Vercel usually detects Next.js automatically. Verify the following:
   - **Framework Preset**: Next.js
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `pnpm install`

4. **Deploy**:
   Click the **Deploy** button. Vercel will install dependencies, generate the Prisma client, build the optimized application, and serve it globally.

### Database Migrations on Vercel
Since Vercel creates a serverless environment, you should manage your database schema via your CI/CD pipeline or manually via your local environment. Run `npx prisma db push` locally to apply schema changes to the production database, or configure a GitHub Action to run `prisma migrate deploy` upon merging to the `main` branch.
