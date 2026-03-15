# Deployment Guide - WATERTING CRM

## Backend (Railway)
1. Link your GitHub repository to Railway.
2. Set the **Root Directory** to `/` or `apps/api/`.
3. Set the **Dockerfile** path to `apps/api/Dockerfile`.
4. Add Environmental Variables:
   - `DATABASE_URL`: Your Railway Postgres connection string.
   - `JWT_ACCESS_SECRET`: Your long random secret
   - `JWT_REFRESH_SECRET`: Another long random secret

## Frontend (Cloudflare Pages)
1. Create a dynamic Next.js project on Cloudflare Dashboard.
2. Connect GitHub repository.
3. Configuration:
   - **Framework Preset**: Next.js
   - **Build Command**: `cd apps/web && npx @cloudflare/next-on-pages` (or standard build depending on static contents)
   - **Build Output Directory**: `apps/web/.next`
4. Add Environmental Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your backend Railway deployment.
