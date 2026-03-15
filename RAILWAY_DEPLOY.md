# 🚀 Deploying to Railway.app - Complete Step Guide

Since you decided to use Railway, it is the absolute easiest dashboard for container deployment layout dashboards triggers layout managers.

Follow these quick actions to take your backend live right now:

---

### Step 1: Connect Github & Choose Repo
1.  Log in to [Railway.app](https://railway.app/) and click **New Project** -> **Deploy from GitHub**.
2.  Authorize access to `WATERTING-CRM-SUITE`.
3.  Choose your repository triggers thresholds fully dashboard configurations triggers thresholds.

---

### Step 2: Configure Monorepo Paths (Crucial)
Inside the Railway dashboard for the service node:
1.  Go to **Settings** -> **General** thresholds trigger setup.
2.  Set **Root Directory** to `apps/api`
3.  Set **Build Command**: `npx prisma generate && npm run build` (or Railway will auto-detect from package.json Node setups configs triggers layout nodes).
4.  Optionally, to use the Dockerfile layout: change **Builder** from Nixpacks to **Dockerfile** (Since we already created the perfect Dockerfile layout inside `apps/api/Dockerfile`).

---

### Step 3: Add Variables & Port
Go to the **Variables** tab for your backend service layout dashboards and add:
-   `DATABASE_URL`: *(Your Neon connection string)*
-   `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`: *(Upstash constants dashboards setup)*
-   `NVIDIA_API_KEY`: *(Your key)*
-   `PINECONE_API_KEY`: *(Your key)*
-   `PINECONE_ENVIRONMENT`: *(e.g., us-east-1)*
-   `JWT_SECRET`: *(Any strong random string)*

---

### Step 4: Deploy 🚀
Railway will build the image online securely and provide a public domain (e.g., `your-api.up.railway.app`) thresholds triggers triggered layouts dashboards!

🎉 **You are fully set!**
