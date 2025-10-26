# Google Authentication Setup for Render

## Current Status

❌ **Google Auth is NOT working** - But your app won't crash!

You'll see this warning in the logs:
```
Warning: Firebase service account file not found at: app/firebase-service-account.json
Google authentication will not work. Please configure Firebase credentials.
```

Regular email/password authentication works fine. Only Google sign-in is affected.

---

## Why It's Not Working

The backend needs Firebase Admin SDK credentials to verify Google ID tokens. These credentials need to be uploaded to Render.

---

## How to Enable Google Auth on Render

### Option 1: Using Environment Variable (Recommended)

#### Step 1: Get Your Firebase Service Account Key

1. Go to https://console.firebase.google.com
2. Select your project
3. Go to **Settings** (gear icon) → **Project Settings**
4. Click on **Service Accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (it will be named something like `your-project-firebase-adminsdk-xxxxx.json`)

#### Step 2: Convert JSON to Environment Variable

On Windows PowerShell:
```powershell
# Read the JSON file
$jsonContent = Get-Content -Path "path\to\your\firebase-adminsdk-xxxxx.json" -Raw

# Convert to base64
$base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($jsonContent))

# Output the base64 string
Write-Host $base64
```

Or on Linux/Mac:
```bash
base64 -i firebase-adminsdk-xxxxx.json
```

#### Step 3: Add to Render Environment Variables

1. Go to https://dashboard.render.com
2. Select your backend service (food-rescue-backend)
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `FIREBASE_CREDENTIALS_BASE64`
   - **Value**: The base64 string you generated
6. Click **Save Changes**

#### Step 4: Update backend/app/main.py

Update the Firebase initialization to read from the base64 environment variable:

```python
# --- Firebase Admin Setup ---
try:
    import firebase_admin
    from firebase_admin import credentials
    import json
    import base64
    
    # Get Firebase credentials from environment variable
    firebase_creds_b64 = os.getenv("FIREBASE_CREDENTIALS_BASE64")
    
    if firebase_creds_b64:
        # Decode the base64 string
        creds_json = base64.b64decode(firebase_creds_b64)
        creds_dict = json.loads(creds_json)
        
        # Initialize Firebase with credentials
        cred = credentials.Certificate(creds_dict)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized successfully!")
    else:
        print("⚠️  FIREBASE_CREDENTIALS_BASE64 not set. Google auth disabled.")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    print("Google authentication will not be available.")
```

Then commit and push:
```bash
git add backend/app/main.py
git commit -m "Add base64 Firebase credentials support"
git push
```

---

### Option 2: Using Build Script

#### Step 1: Encode JSON to Base64

Use the same method as Option 1, Step 2.

#### Step 2: Add to Render

1. Go to Render → Your Backend Service
2. **Environment** tab
3. Add environment variable:
   - **Key**: `FIREBASE_CREDENTIALS`
   - **Value**: Paste the entire JSON content (not base64)

#### Step 3: Update Build Command

Change your build command on Render to:

```bash
pip install -r requirements.txt && echo "$FIREBASE_CREDENTIALS" > app/firebase-service-account.json
```

---

## After Adding Credentials

1. **Redeploy**: Render will auto-redeploy when you save environment variables
2. **Test**: Check the logs - you should see "✅ Firebase initialized successfully!"
3. **Try Google Auth**: Google sign-in should now work!

---

## Testing Google Auth

### Frontend Setup

Make sure your frontend `.env` has all Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Test the Flow

1. User clicks "Sign in with Google" on frontend
2. Google OAuth dialog appears
3. User signs in with Google
4. Frontend gets Google ID token
5. Frontend sends token to: `POST /api/v1/auth/google` with `{"token": "google_id_token"}`
6. Backend verifies token with Firebase Admin SDK
7. Backend creates/updates user in database
8. Backend returns JWT token
9. Frontend stores JWT and user is logged in!

---

## Quick Summary

**To Enable Google Auth:**
1. ✅ Get Firebase service account key from Firebase Console
2. ✅ Convert to base64 (or add as-is)
3. ✅ Add to Render environment variables
4. ✅ Update backend code to read from base64 variable
5. ✅ Push changes to GitHub
6. ✅ Wait for Render to redeploy
7. ✅ Test Google sign-in!

**Current Status:**
- ✅ Backend deployed and running
- ❌ Google auth disabled (missing credentials)
- ✅ Email/password auth working
- ✅ All other features working

---

## Don't Need Google Auth?

If you don't need Google authentication, everything else works perfectly:
- ✅ Email/password registration
- ✅ Email/password login
- ✅ JWT tokens
- ✅ All API endpoints
- ✅ All features

Google auth is optional!

