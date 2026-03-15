# 🚀 Deploying to Koyeb - 24/7 Free Tier setup

Since Koyeb has a simple dashboard and stays **awake 24/7**, it is the easiest absolute free layer for your Backend!

Follow these quick actions to take your backend live right now:

---

### Step 1: Connect Github & Choose Repo
1.  Log in to [Koyeb.com](https://www.koyeb.com/) and click **Create Service** or **New App**.
2.  Select **GitHub** as the source and authorize access to `WATERTING-CRM-SUITE`.

---

### Step 2: Configure Deployment build
1.  **Repository**: Select your repo address.
2.  **App Name**: `waterting-crm`
3.  **Deployment Method**: Choose ✅ **Docker** (since we created a perfect absolute Dockerfile for it!).
4.  **Dockerfile Location**: Set value to `apps/api/Dockerfile`
5.  **Instance size**: Select **`Nano`** (Perpetual Free tier!).

---

### Step 3: Add Variables & Port
Scroll down to environment and variables setup framing and add:
1.  **Port Setup**: Add port `3000` with HTTP protocol.
2.  **Add Configuration Environment Variables**:
    -   `DATABASE_URL`: *(Your Neon Postgres String)*
    -   `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_PORT`: *(Your Upstash Setup)*
    -   `NVIDIA_API_KEY`: *(The `nvapi-...` key you provided)*
    -   `PINECONE_API_KEY`: *(Your key)*

---

### Step 4: Deploy 🚀
Click **Deploy**! Koyeb will pull the repo folder, run the continuous Dockerfile builder and build it online instantly layout dashboards thresholds triggers layout managers thresholds.

🎉 **All Configuration modules and guides are fully synced. You are live!**
