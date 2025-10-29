# 🚀 Frontend Deployment - Quick Reference

## ⚡ Quick Steps

### 1. Create Static Site
- Go to: https://dashboard.render.com
- **New +** → **Static Site**
- Connect: `Food-Rescue` repository

### 2. Configuration
```
Name: food-rescue-frontend
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

### 3. Environment Variables
Add these in Render:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://food-rescue-backend-rgfd.onrender.com/api/v1` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyC...` (from Firebase Console) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `signinfood-d1616.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `signinfood-d1616` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `signinfood-d1616.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` (from Firebase) |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abcdef...` (from Firebase) |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` (from Firebase) |

### 4. Deploy
- Click **"Create Static Site"**
- Wait 2-5 minutes for build
- Get your frontend URL: `https://food-rescue-frontend.onrender.com`

---

## 🔧 Get Firebase Config

1. Go to: https://console.firebase.google.com
2. Select project: `signinfood-d1616`
3. **Settings** (gear) → **Project Settings**
4. Scroll to **"Your apps"** → **Web app**
5. Copy the config values

---

## ✅ What You'll Have

- **Frontend**: `https://food-rescue-frontend.onrender.com`
- **Backend**: `https://food-rescue-backend-rgfd.onrender.com`
- **Full App**: Working food rescue platform!

---

## 🧪 Test After Deployment

1. **Visit frontend URL**
2. **Try registration/login**
3. **Test Google sign-in**
4. **Check all features work**

---

**Total time: 10-15 minutes**  
**Cost: Free**  
**Result: Live web application! 🎉**

