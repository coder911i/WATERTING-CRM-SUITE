# 🚀 Deploying to Render.com

Render is a fantastic 100% Free tier provider that offers simple Node.js containerization. Since we set up your monorepo perfectly, and use Workspace commands, it's really easy to get running.

---

### Step 1: Create Account & Connect Github
1. Log in to [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select your `WATERTING-CRM-SUITE` repository.

---

### Step 2: Configure Monorepo Build Settings
Inside the Render dashboard for your service setup:

1. **Name**: `waterting-api`
2. **Runtime**: `Node`
3. **Build Command**: 
   ```bash
   npm run build --workspace=api
   ```
4. **Start Command**:
   ```bash
   node apps/api/dist/main.js
   ```

*(Keep the Root Directory blank, leave that as `/` so Render reads the complete workspace lockfile).*

---

### Step 3: Add Variables
Scroll down to the **Advanced** section and add these:

*   `DATABASE_URL`: *(Your Neon string)*
*   `NVIDIA_API_KEY`: *(Your key)*
*   `JWT_SECRET`: `waterting_super_secure_production_secret_key_2026`
*   `REDIS_HOST`: *(Your Upstash host)*
*   `REDIS_PORT`: `6379`
*   `REDIS_PASSWORD`: *(Password)*
*   `PINECONE_API_KEY`: *(Key)*
*   `PINECONE_ENVIRONMENT`: `us-east-1`

---

### Step 4: Deploy 🚀
Click **Create Web Service**. 

Render will build node, trigger `prisma generate` and start up with a green live URL! 

*(Note: Free tiers on Render sleep if inactive for 15m. Simply visiting the link wakes it right back up into service).*
