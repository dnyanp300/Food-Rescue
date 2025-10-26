# 🚀 Frontend Deployment Guide - Render Static Site

## 📋 Prerequisites
- ✅ Backend deployed and working: https://food-rescue-backend-rgfd.onrender.com
- ✅ GitHub repository: https://github.com/dnyanp300/Food-Rescue
- ✅ Frontend code ready in `/frontend` directory

---

## 🎯 Step 1: Create Static Site on Render

### 1.1 Go to Render Dashboard
1. Visit: https://dashboard.render.com
2. Sign in to your account
3. Click **"New +"** button (top right)
4. Select **"Static Site"** from the dropdown

### 1.2 Connect Your Repository
1. **Connect GitHub**: Click "Connect GitHub" if not already connected
2. **Select Repository**: Choose `Food-Rescue` from the list
3. **Branch**: Select `main` (default)
4. **Root Directory**: Leave empty (we'll specify in build command)

---

## ⚙️ Step 2: Configure Build Settings

### 2.1 Basic Configuration
Fill in these fields:

**Name:** `food-rescue-frontend`
**Branch:** `main`
**Root Directory:** (leave empty)

### 2.2 Build Command
```bash
cd frontend && npm install && npm run build
```

### 2.3 Publish Directory
```
frontend/dist
```

### 2.4 Environment Variables
Click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://food-rescue-backend-rgfd.onrender.com/api/v1` |
| `VITE_FIREBASE_API_KEY` | `your_firebase_api_key` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `signinfood-d1616.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `signinfood-d1616` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `signinfood-d1616.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `your_sender_id` |
| `VITE_FIREBASE_APP_ID` | `your_app_id` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `your_measurement_id` |

---

## 🔧 Step 3: Get Firebase Configuration

### 3.1 Firebase Console Setup
1. Go to: https://console.firebase.google.com
2. Select your project: `signinfood-d1616`
3. Click the **gear icon** → **Project Settings**
4. Scroll down to **"Your apps"** section
5. Click **"Web app"** icon (`</>`) or **"Add app"** if none exists

### 3.2 Get Configuration Values
You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "signinfood-d1616.firebaseapp.com",
  projectId: "signinfood-d1616",
  storageBucket: "signinfood-d1616.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef...",
  measurementId: "G-XXXXXXXXXX"
};
```

### 3.3 Map to Environment Variables
Use these values in Render:

| Firebase Config | Render Environment Variable |
|-----------------|----------------------------|
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |
| `measurementId` | `VITE_FIREBASE_MEASUREMENT_ID` |

---

## 🚀 Step 4: Deploy

### 4.1 Create Static Site
1. Click **"Create Static Site"**
2. Render will start building your frontend
3. **Build Time**: 2-5 minutes (first time)

### 4.2 Monitor Build Process
1. Click on your new static site
2. Go to **"Logs"** tab
3. Watch for:
   - ✅ `npm install` completion
   - ✅ `npm run build` completion
   - ✅ Build success message

### 4.3 Get Your Frontend URL
After successful deployment, you'll get a URL like:
```
https://food-rescue-frontend.onrender.com
```

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Basic Functionality Test
1. **Visit your frontend URL**
2. **Check if it loads** (no console errors)
3. **Test navigation** between pages

### 5.2 Authentication Test
1. **Try email/password registration**
2. **Try email/password login**
3. **Try Google sign-in** (should work now!)

### 5.3 API Connection Test
1. **Check browser console** for API calls
2. **Verify backend communication** works
3. **Test all major features**:
   - Donor dashboard
   - NGO dashboard
   - Admin dashboard
   - Food posting/claiming

---

## 🔧 Step 6: Update CORS (If Needed)

### 6.1 Add Frontend URL to Backend CORS
If you get CORS errors, update your backend:

1. Go to: https://dashboard.render.com
2. Click your **backend service**
3. Go to **"Environment"** tab
4. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.onrender.com`

5. Update `backend/app/main.py`:
```python
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "https://food-rescue-backend-rgfd.onrender.com",
    os.getenv("FRONTEND_URL", "https://food-rescue-frontend.onrender.com"),  # Add this
]
```

6. Commit and push changes

---

## 📱 Step 7: Mobile/Responsive Testing

### 7.1 Test on Different Devices
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: iOS Safari, Android Chrome
- **Tablet**: iPad, Android tablet

### 7.2 Check Responsive Design
- **Navigation menu** works on mobile
- **Forms** are usable on small screens
- **Cards and layouts** adapt properly

---

## 🎉 Step 8: Final Verification

### 8.1 Complete Feature Checklist
- ✅ **Homepage loads**
- ✅ **User registration works**
- ✅ **User login works**
- ✅ **Google authentication works**
- ✅ **Donor can post food**
- ✅ **NGO can view available food**
- ✅ **NGO can claim food**
- ✅ **Admin dashboard accessible**
- ✅ **All API calls successful**

### 8.2 Performance Check
- **Page load speed** is reasonable
- **Images load** properly
- **No console errors**

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Build Fails
**Error**: `npm install` fails
**Solution**: Check `package.json` dependencies are correct

**Error**: `npm run build` fails
**Solution**: Check for TypeScript/ESLint errors locally first

#### CORS Errors
**Error**: `Access to fetch at '...' has been blocked by CORS policy`
**Solution**: Add frontend URL to backend CORS origins

#### Firebase Errors
**Error**: Firebase not initialized
**Solution**: Verify all `VITE_FIREBASE_*` environment variables are set

#### API Connection Issues
**Error**: API calls fail
**Solution**: Check `VITE_API_BASE_URL` is correct

---

## 📊 Final URLs

After successful deployment, you'll have:

- **Frontend**: `https://food-rescue-frontend.onrender.com`
- **Backend**: `https://food-rescue-backend-rgfd.onrender.com`
- **API Docs**: `https://food-rescue-backend-rgfd.onrender.com/docs`

---

## 🎯 Next Steps

1. **Share your app** with users
2. **Monitor performance** in Render dashboard
3. **Set up custom domain** (optional)
4. **Add analytics** (optional)
5. **Scale as needed**

---

## 📝 Summary

**What you'll accomplish:**
- ✅ Deploy React frontend to Render Static Site
- ✅ Configure environment variables
- ✅ Connect frontend to backend API
- ✅ Enable Google authentication
- ✅ Test full application flow
- ✅ Have a live, working food rescue platform!

**Total time**: 10-15 minutes
**Cost**: Free tier available

---

**Ready to deploy? Follow the steps above and you'll have a fully functional web application! 🚀**
