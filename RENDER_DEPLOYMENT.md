# Complete Guide: Deploy Food Rescue Platform to Render

## Overview
This guide will help you deploy both your FastAPI backend and React frontend to Render.com.

## Prerequisites
- ✅ GitHub repository pushed (already done!)
- ✅ Render.com account (sign up at https://render.com)
- ✅ Your project is secure (all secrets in environment variables)

---

## Part 1: Deploy Backend (FastAPI)

### Step 1: Create Web Service on Render

1. **Log in to Render**
   - Go to https://render.com
   - Sign up or log in with GitHub

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account (if not already connected)
   - Find your repository: `Food-Rescue`
   - Click "Connect"

### Step 2: Configure Backend Service

**Settings:**
- **Name**: `food-rescue-backend` (or any name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Advanced Settings → Environment Variables:**

Add these environment variables:

```env
SECRET_KEY=your_very_secret_key_here_generate_with_openssl_rand_hex_32
FIREBASE_SERVICE_ACCOUNT_PATH=app/firebase-service-account.json
PYTHON_VERSION=3.11
PORT=10000
```

**To generate SECRET_KEY:**
```bash
openssl rand -hex 32
```

### Step 3: Upload Firebase Service Account

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. On Render, go to your service → Environment
7. You have two options:
   - **Option A**: Upload as a file via Environment Variables (convert to base64)
   - **Option B**: Create the file in the build script

**Option B (Recommended):** Add this to your build command:
```bash
pip install -r requirements.txt && echo "$FIREBASE_CREDENTIALS" > app/firebase-service-account.json
```

Then add `FIREBASE_CREDENTIALS` as an environment variable with the full JSON content.

### Step 4: Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Once deployed, note your backend URL: `https://food-rescue-backend.onrender.com`

---

## Part 2: Deploy Frontend (React/Vite)

### Step 1: Create Static Site on Render

1. **Create New Static Site**
   - Click "New +"
   - Select "Static Site"
   - Connect repository: `Food-Rescue`
   - Branch: `main`

### Step 2: Configure Frontend Service

**Settings:**
- **Name**: `food-rescue-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

**Important:** Add these environment variables during build:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_BASE_URL=https://food-rescue-backend.onrender.com/api/v1
```

**Note:** Replace `food-rescue-backend.onrender.com` with your actual backend URL!

### Step 3: Deploy Frontend

1. Click "Create Static Site"
2. Wait for build to complete
3. Your frontend will be available at: `https://food-rescue-frontend.onrender.com`

---

## Part 3: Update Backend CORS Settings

After getting your frontend URL, update your backend CORS settings.

### Update `backend/app/main.py`:

```python
# Update origins to include your Render domains
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://food-rescue-frontend.onrender.com",  # Add this
    "http://food-rescue-frontend.onrender.com",   # And this
]
```

Then commit and push:
```bash
git add backend/app/main.py
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

---

## Part 4: Database Setup (Optional but Recommended)

Currently using SQLite (not suitable for production). Consider upgrading to PostgreSQL:

### Option 1: Use Render PostgreSQL (Recommended)

1. **Create PostgreSQL Database**
   - Click "New +"
   - Select "PostgreSQL"
   - Name: `food-rescue-db`
   - Region: Same as your backend
   - Click "Create Database"

2. **Update `backend/app/database.py`:**

```python
import os

# Get database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./test.db"

# SQLite-specific connection args
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
```

3. **Add DATABASE_URL to Backend Environment Variables:**
   - Go to your backend service on Render
   - Settings → Environment → Add:
     - Key: `DATABASE_URL`
     - Value: (Auto-provided by Render, found in your PostgreSQL service)

4. **Update requirements.txt if needed:**
   - If using PostgreSQL, add: `psycopg2-binary`
   - Or: `asyncpg` for async support

### Option 2: Keep SQLite (Not Recommended)
- ⚠️ SQLite data is ephemeral on Render
- Any deployment or restart will lose data
- Files are stored in `/tmp` which is cleared regularly

---

## Part 5: Get Firebase Credentials

### Firebase Web App Configuration:

1. Go to https://console.firebase.google.com
2. Select your project
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps"
5. Click the Web icon `</>`
6. Register app if not already registered
7. Copy the configuration values

**You'll need:**
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId` (if using Analytics)

---

## Part 6: Complete Deployment Checklist

### Backend Checklist:
- [ ] Web service created on Render
- [ ] Root directory set to `backend`
- [ ] Build command configured
- [ ] Start command configured
- [ ] Environment variables added (SECRET_KEY, etc.)
- [ ] Firebase service account uploaded
- [ ] Database configured (PostgreSQL recommended)
- [ ] CORS updated with frontend URL
- [ ] Backend deployed and accessible

### Frontend Checklist:
- [ ] Static site created on Render
- [ ] Build command configured (`npm install && npm run build`)
- [ ] Publish directory set to `frontend/dist`
- [ ] All Firebase environment variables added
- [ ] VITE_API_BASE_URL set to backend URL
- [ ] Frontend deployed and accessible
- [ ] Test login/registration
- [ ] Test API connectivity

---

## Troubleshooting

### Backend Issues:

**Error: "Module not found"**
- Solution: Add missing packages to `requirements.txt`

**Error: "Firebase service account not found"**
- Solution: Ensure FIREBASE_CREDENTIALS is set correctly
- Alternative: Create file in build script

**Error: "Database connection failed"**
- Solution: Check DATABASE_URL environment variable
- Verify PostgreSQL instance is running

### Frontend Issues:

**Error: "API calls failing"**
- Solution: Check VITE_API_BASE_URL is correct
- Check CORS settings on backend
- Verify backend URL is accessible

**Error: "Firebase not working"**
- Solution: Verify all Firebase environment variables are set
- Check Firebase console for API key validity

**Build Failed:**
- Check build logs for errors
- Ensure all environment variables are set
- Verify npm dependencies in package.json

---

## Step-by-Step Video Guide (Quick Reference)

1. **Deploy Backend:**
   - New → Web Service
   - Connect repo → Select `Food-Rescue`
   - Root: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables
   - Deploy

2. **Deploy Frontend:**
   - New → Static Site
   - Connect repo → Select `Food-Rescue`
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`
   - Add environment variables
   - Deploy

3. **Test Everything:**
   - Visit frontend URL
   - Try to register/login
   - Check backend API/docs
   - Test all features

---

## Final Steps After Deployment

1. **Update CORS in backend** with frontend URL
2. **Add custom domain** (optional, in Render settings)
3. **Set up monitoring** and alerts
4. **Configure auto-deploy** from GitHub (usually enabled by default)
5. **Test everything thoroughly**

---

## Estimated Costs

- **Backend (Web Service):** Free tier available (750 hours/month)
- **Frontend (Static Site):** Free
- **PostgreSQL:** Free tier available (90 days, then $7/month)
- **Total:** Free for 90 days, then ~$7/month

---

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check deployment logs on Render dashboard

**Good luck with your deployment! 🚀**

