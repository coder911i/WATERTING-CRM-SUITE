# 🚀 Deploying to Fly.io - Manual Steps

Because using Fly.io require interactive browser login setups inside your local machine shell directly, follow these 3 steps to go live today:

---

### Step 1: Install Flyctl (NVIDIA NIM endpoints support)
Open your terminal (PowerShell or Command Prompt) and run:
`powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`

---

### Step 2: Login to Fly.io
Run this command. It will open a chrome browser view automatically to authorize your account node:
`fly auth login`

---

### Step 3: Launch and Deploy 🚀
Change directory to the backend API folder and execute:
1.  **Change directory**: 
    `cd apps/api`
2.  **Launch deployment setup**:
    `fly launch`
    *(Accept defaults when prompted, and create a strong unique app-name if asked)*
3.  **Set Secrets (Variables)**:
    `fly secrets set DATABASE_URL="Your_Neon_Postgres_Connection_String" REDIS_HOST="Upstash_Host" REDIS_PORT="Upstash_Port" REDIS_PASSWORD="Upstash_Password" NVIDIA_API_KEY="nvapi-..." PINECONE_API_KEY="Your_Key" JWT_SECRET="Any_Random_String"`
4.  **Finalize Deploy**:
    `fly deploy`

---

All your configuration files (`Dockerfile` and `fly.toml`) have been generated safely for execution layout dashboards!
