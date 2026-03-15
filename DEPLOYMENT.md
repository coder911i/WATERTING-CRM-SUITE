# 🚀 Step-by-Step Deployment Guide - WATERTING CRM Suite

This guide fully details how to deploy your **Next.js Frontend** to **Cloudflare Pages** and your **NestJS Backend** to **Railway.app** (to run standard Node API processes).

---

## 📋 Prerequisites
Before you begin, make sure you have created free accounts with:
1.  **Cloudflare**: For Frontend (`apps/web`)
2.  **Railway.app** or **Render.com**: For Backend (`apps/api`)
3.  **Neon.tech**: For PostgreSQL (You already have a working DB URL!)
4.  **Upstash.com**: For Serverless Redis

---

## 🛠️ Step 1: Database Setup (Postgres on Neon)
1.  Log into **Neon.tech** and retrieve your `DATABASE_URL`.
    -   *Example format*: `postgresql://[user]:[password]@[host]/neondb?sslmode=require`
2.  Save this connection string safely; we will add it to the Backend Environment variables later.

---

## 🛠️ Step 2: Cache Setup (Redis on Upstash)
Since Cloudflare and Railway run serverless or containerized, **Upstash** is the easiest way to provision Redis.
1.  Create a **Global Redis Database** on Upstash with TLS enabled.
2.  Retrieve your `REDIS_URL` and `REDIS_PASSWORD` from the dashboard layout.
    -   *Format*: `redis://root:[password]@[host]:[port]`

---

## 🚏 Step 3: Backend Deployment (Railway.app)
Because NestJS requires a standard Node.js runtime and full Prisma Client builds, Railway is the simplest deployment target.

### 1. Create a New Project
1.  Go to [Railway.app](https://railway.app/) and click **New Project**.
2.  Select **Deploy from GitHub Repository** and authorize access to `WATERTING-CRM-SUITE`.

### 2. Configure Monorepo Paths
1.  Select the **`apps/api`** directory as the root.
2.  Set **Build Command**: `cd apps/api && npm run build` (or Railway automatically detects and compiles from node config!).
3.  Set **Start Command**: `cd apps/api && npm run start:prod` (or let it execute `node dist/main`).

### 3. Add Environment Variables (Crucial)
Inside the Railway app Dashboard for your Service, click **Variables** and add:
-   `DATABASE_URL`: *(Your Neon connection string)*
-   `REDIS_HOST`: *(Upstash host string)*
-   `REDIS_PORT`: *(Upstash port)*
-   `REDIS_PASSWORD`: *(Upstash password)*
-   `NVIDIA_API_KEY`: *(Your `nvapi-...` key that you provided)*
-   `PINECONE_API_KEY`: *(Your key)*
-   `PINECONE_ENVIRONMENT`: *(e.g., us-east-1)*
-   `JWT_SECRET`: *(Generate a random string for auth)*

### 4. Deploy 🚀
Railway will build the image, run `prisma generate`, and host it on a public subdomain like `your-backend.up.railway.app`.

---

## 🌐 Step 4: Frontend Deployment (Cloudflare Pages)
Cloudflare Pages fetches directly from GitHub layout triggers on absolute branches.

### 1. Connect Github
1.  Navigate to your **Cloudflare Dashboard** -> **Workers & Pages**.
2.  Click **Create Application** -> **Pages** -> **Connect to Git**.
3.  Choose `WATERTING-CRM-SUITE` from GitHub.

### 2. Configure build Framework
1.  **Project Name**: `waterting-web`
2.  **Production Branch**: `main`
3.  **Framework Preset**: Select **`Next.js`**
4.  **Build Command**: `cd apps/web && npm run build` (Wait! Verify folder setup accurately on build page).
5.  **Build Output Directory**: `.next` (Cloudflare will handle default output accurately).

### 3. Add Environment Variables
Add these values in the Cloudflare deployment frame layout before clicking "Save and Deploy":
-   `NEXT_PUBLIC_API_URL`: `https://your-backend.up.railway.app` *(The URL Railway generated in Step 3)*

### 4. Deploy 🚀
Cloudflare will build and assign a free `.pages.dev` subdomain automatically.

---

## 🔗 Step 5: Connecting the Two
Once both are live, you may experience **CORS (Cross-Origin Resource Sharing)** blocks if you don't allow Cloudflare's domain to access Railway.

*   To fix, ensure your NestJS `main.ts` inside `apps/api` allows CORS layout:
    ```typescript
    app.enableCors({ origin: 'https://[your-cloudflare-page].pages.dev' });
    ```
    *(I have pre-configured `app.enableCors()` with wildcard allowances for smooth deployment testing nodes!)*

---

### 🎉 All Agents Running on NVIDIA NIM!
The agents are fully updated to run `nvidia/llama-3.1-nemotron-70b-instruct` layout dashboards. 

Type **"Check URLs"** once deployed to simulate visual verification triggers!
