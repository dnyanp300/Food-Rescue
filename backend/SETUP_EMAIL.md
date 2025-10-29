# Quick Email Setup

## Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select "Mail" and "Other (Custom name)"
4. Enter "Food Rescue Platform"
5. Click "Generate"
6. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

## Step 2: Create .env File

In the `backend/` folder, create a file named `.env` with this content:

```env
ENV=development
SECRET_KEY=generate-with-openssl-rand-hex-32

SMTP_MODE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USE_SSL=true
SMTP_USE_TLS=false
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Food Rescue Platform
SMTP_STRICT=false
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail
- `abcd efgh ijkl mnop` with your App Password (spaces optional)

## Step 3: Restart Server

Stop and restart your FastAPI server to load the new .env file.

## Step 4: Test

1. Register a user with your email
2. Request OTP: `POST /api/v1/auth/otp/request?email=your-email@gmail.com`
3. Check your email inbox
4. Use the code to verify

That's it! Emails should now send.
