# Deployment Guide: Student Placement Management Portal

This guide explains how to deploy the Student Placement Management Portal to free/starter cloud hosting:
- **Database**: Managed MySQL (on Railway / Aiven / TiDB / Render)
- **Backend API**: Spring Boot (on Render or Railway)
- **Frontend Portal**: React + Vite (on Vercel or Netlify)

---

## 🏗️ Deployment Architecture

```
[ Graduating Students & Officers ]
               │
               ▼
   [ Vercel / Netlify Frontend ]  (https://your-portal.vercel.app)
               │
               │ REST API Calls with JWT
               ▼
   [ Render / Railway Backend ]   (https://your-api.onrender.com)
               │
               │ JDBC Port 3306
               ▼
    [ Cloud MySQL Database ]
```

---

## Step 1: Push Code to GitHub

1. Initialize git in your project root if not already done:
```bash
cd "C:\Users\surek\.gemini\antigravity\scratch\placement-portal"
git init
git add .
git commit -m "Initial commit for placement portal"
```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `placement-portal`).
3. Link and push your code:
```bash
git remote add origin https://github.com/<your-username>/placement-portal.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Database & Backend to Railway (Option A - Fastest)

Railway provides both a managed MySQL database and a Java/Docker runner in the same project:

1. Go to [railway.app](https://railway.app) and sign up with GitHub.
2. Click **New Project** → **Provision MySQL**.
3. Railway generates a MySQL database. Click on the MySQL card and navigate to the **Variables** tab to view your credentials:
   - `MYSQL_URL`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
4. Click **New Service** → **GitHub Repo** → select your `placement-portal` repository.
5. In the service settings:
   - **Root Directory**: `backend`
   - **Build Command**: Leave default or `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/placement-portal-1.0.0.jar`
6. Under **Variables**, add:
   - `SPRING_DATASOURCE_URL`: `${{MySQL.MYSQL_URL}}`
   - `SPRING_DATASOURCE_USERNAME`: `${{MySQL.MYSQLUSER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
7. Click **Settings** → **Generate Domain** to get your public backend URL:
   - Example: `https://placement-portal-production.up.railway.app`

---

## Step 3: Deploy Backend to Render (Option B - Alternative)

1. Go to [render.com](https://render.com) and log in.
2. Set up a free MySQL instance on [Aiven.io](https://aiven.io) or [TiDB Cloud](https://tidbcloud.com) to obtain a connection string:
   - `jdbc:mysql://<host>:<port>/placement_portal?sslmode=require`
3. In Render, click **New +** → **Web Service** → Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` *(Uses the included `Dockerfile`)* or `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/placement-portal-1.0.0.jar`
5. Under **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/placement_portal?useSSL=true`
   - `SPRING_DATASOURCE_USERNAME`: `<your-db-username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-db-password>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
6. Click **Deploy Web Service**. You will receive your public API URL:
   - Example: `https://placement-backend.onrender.com`

---

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `placement-portal` GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-url/api` (e.g. `https://placement-backend.onrender.com/api` or `https://placement-portal-production.up.railway.app/api`)
6. Click **Deploy**.
7. In ~30 seconds, Vercel gives you your live production URL:
   - Example: `https://placement-portal.vercel.app`

*(The included `vercel.json` and `_redirects` files ensure React Router sub-paths like `/student/drives` resolve cleanly without 404s).*

---

## Step 5: Verify the Live Deployment

1. Open your live frontend URL (e.g. `https://placement-portal.vercel.app`).
2. Test login using the demo credentials:
   - **Officer**: `admin@example.com` / `Admin@123`
   - **Student**: `student@example.com` / `Student@123`
3. Try registering a new student, verifying drive eligibility, and submitting an application to verify end-to-end database connectivity.
