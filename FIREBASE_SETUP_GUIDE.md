# Firebase Configuration Setup Guide

## Frontend Environment Variables

Create a file `frontend/.env.local` with the following content:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Firebase Configuration for signinfood-d1616 project
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=signinfood-d1616.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=signinfood-d1616
VITE_FIREBASE_STORAGE_BUCKET=signinfood-d1616.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=117107343046174006484
VITE_FIREBASE_APP_ID=your-firebase-app-id-here
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id-here
```

## Backend Environment Variables

Create a file `backend/.env` with the following content:

```
SECRET_KEY=your-secret-key-here-change-this-in-production
FIREBASE_SERVICE_ACCOUNT_PATH=app/firebase-service-account.json
FRONTEND_URL=http://localhost:5173
```

## How to Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `signinfood-d1616`
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" and select Web
6. Copy the configuration values to your `.env.local` file

## Firebase Authentication Setup

1. In Firebase Console, go to Authentication
2. Go to Sign-in method tab
3. Enable "Google" provider
4. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain (for deployment)

## Testing the Setup

1. Start the backend: `cd backend && python -m uvicorn app.main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Try logging in with email/password
4. Try Google sign-in

## Troubleshooting

- If Google sign-in fails, check browser console for errors
- Make sure Firebase project has Google authentication enabled
- Verify environment variables are loaded correctly
- Check that CORS is properly configured in backend
