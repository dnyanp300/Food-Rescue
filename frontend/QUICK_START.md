# Quick Start - Google Sign-In Setup

## 🚀 Quick Setup (5 minutes)

### Option 1: Using Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create/Select Project**:
   - Click "Add project" or select existing
   - Enter project name (e.g., "food-rescue")
   - Continue (disable Google Analytics if you want)
   - Create project

3. **Enable Google Authentication**:
   - Click "Authentication" in left sidebar
   - Click "Get started"
   - Click "Sign-in method" tab
   - Click on "Google" provider
   - Toggle "Enable" to ON
   - Enter your email as project support email
   - Click "Save"

4. **Add Web App**:
   - Click gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"
   - Scroll to "Your apps" section
   - Click "Web app" icon (</>)
   - Register app with nickname (e.g., "FoodRescue")
   - Click "Register app"
   - Copy the config object

5. **Configure Your App**:
   - In your project, create `.env.local` file in the root directory
   - Add your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

6. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### Option 2: Direct Configuration

1. **Get Firebase Config**:
   - Follow steps 1-4 above
   - Copy your config values

2. **Update firebase.js directly**:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",  // Replace with your actual key
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## ✅ Verify Setup

1. **Check Console**: Look for Firebase warning (should be gone if configured)
2. **Try Login**: Click "Sign in with Google" button
3. **Expected Behavior**:
   - Popup opens with Google sign-in
   - After selecting account, redirects to dashboard
   - If error, see troubleshooting below

## 🔧 Backend Setup Required

The backend developer needs to implement this endpoint:

**Endpoint**: `POST /api/v1/auth/google`

**Request**:
```json
{
  "token": "google_id_token_from_frontend"
}
```

**Response**:
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "donor"
  }
}
```

## 🐛 Common Issues

### "Firebase is not configured" error
- Solution: Add Firebase config to `.env.local` or `firebase.js`
- Restart dev server

### "Popup closed" error
- Don't close the popup window
- Allow popups in your browser
- Try again

### Backend error (500/404)
- Backend endpoint not implemented yet
- Contact backend developer to implement `/api/v1/auth/google`

### CORS error
- Backend needs to allow requests from `http://localhost:5173`
- Contact backend developer

## 📝 Next Steps

1. ✅ Firebase configured
2. ⏳ Backend endpoint `/api/v1/auth/google` implemented
3. ✅ Test Google Sign-In button
4. ✅ Test full login flow

## 🆘 Need Help?

1. Check browser console for errors
2. Check browser network tab for failed requests
3. See `GOOGLE_SIGNIN_SETUP.md` for detailed troubleshooting
4. Check backend logs for API errors
