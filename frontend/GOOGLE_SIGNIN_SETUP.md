# Google Sign-In Setup Guide

## Steps to Enable Google Sign-In

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Click on "Authentication" in the left sidebar
4. Click "Get Started"
5. Enable "Google" as a sign-in provider
6. Click on "Web setup" or "Web app" section
7. Copy your Firebase config

### Step 2: Configure Firebase in Your App

1. Open `src/firebase.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Configure Authorized Domains

1. In Firebase Console, go to Authentication → Settings
2. Scroll to "Authorized domains"
3. Add your domain (e.g., `localhost` for development)
4. Save changes

### Step 4: Backend Setup (Backend developer needs to implement)

The backend needs to have a Google authentication endpoint at:
- **POST** `http://localhost:8000/api/v1/auth/google`

The endpoint should:
1. Accept a Google ID token
2. Verify the token with Google
3. Create or find the user in your database
4. Return JWT token and user data

Expected request:
```json
{
  "token": "google_id_token_here"
}
```

Expected response:
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

### Step 5: Test the Integration

1. Make sure your backend server is running
2. Start your frontend: `npm run dev`
3. Click "Sign in with Google" button
4. Select your Google account
5. You should be redirected to the dashboard

## Troubleshooting

### Error: "Firebase: Error (auth/popup-closed-by-user)"
- User closed the popup window
- Solution: Try again and don't close the popup

### Error: "Invalid API Key"
- Your Firebase config is incorrect
- Solution: Check your firebase.js configuration

### Error: "Request failed"
- Backend endpoint not working
- Solution: Check backend logs and ensure the endpoint is implemented

### CORS Errors
- Backend not configured for CORS
- Solution: Backend developer needs to add CORS middleware

## Environment Variables (Recommended)

For production, use environment variables:

1. Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

## Security Notes

1. Never commit your Firebase config with real keys to public repositories
2. Use environment variables for sensitive data
3. Configure Firebase security rules properly
4. Regularly rotate API keys
