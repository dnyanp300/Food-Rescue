# Email OTP Setup Guide

This guide will help you set up real email OTP functionality for the Food Rescue Platform.

## Prerequisites

- A Gmail account (or any SMTP-compatible email service)
- Python dependencies already installed

## Step 1: Configure Gmail App Password

Gmail requires an "App Password" for SMTP authentication (not your regular password).

### Steps:

1. **Go to your Google Account settings:**
   - Visit: https://myaccount.google.com/
   - Click on "Security" in the left sidebar

2. **Enable 2-Step Verification (if not already enabled):**
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the prompts to enable it

3. **Generate an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Food Rescue Platform" as the name
   - Click "Generate"
   - **Copy the 16-character password** (without spaces)

## Step 2: Create .env File

1. **Copy the example file:**
   ```bash
   cd backend
   copy .env.example .env
   ```
   (Or manually create `.env` file)

2. **Edit `.env` file** in the `backend/` directory with your Gmail credentials:
   ```
   ENV=development
   SECRET_KEY=your_secret_key_here
   
   SMTP_MODE=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USE_SSL=true
   SMTP_USE_TLS=false
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   SMTP_FROM_EMAIL=your-email@gmail.com
   SMTP_FROM_NAME=Food Rescue Platform
   SMTP_STRICT=false
   ```

3. **Replace the following:**
   - `your-email@gmail.com` with your Gmail address
   - `xxxx xxxx xxxx xxxx` with the 16-character App Password (you can include or remove spaces)
   - `your_secret_key_here` with a secure random string (generate with: `openssl rand -hex 32`)

## Step 3: Alternative Email Providers

If you prefer not to use Gmail, here are configurations for other providers:

### Outlook/Hotmail:
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USE_SSL=false
SMTP_USE_TLS=true
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
```

### Yahoo:
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_USE_SSL=true
SMTP_USE_TLS=false
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
```

### Custom SMTP Server:
```
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USE_SSL=false
SMTP_USE_TLS=true
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
```

## Step 4: Restart the Backend

After creating/updating the `.env` file, restart your FastAPI server:

```bash
# Stop the current server (Ctrl+C or kill the process)
# Then restart:
.venv\Scripts\python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

## Step 5: Test Email OTP

1. **Register a user first** (OTP requires an existing user):
   ```
   POST /api/v1/auth/register
   {
     "email": "test@example.com",
     "password": "SecurePass123!",
     "name": "Test User",
     "role": "donor",
     "location": "Test City"
   }
   ```

2. **Request OTP:**
   ```
   POST /api/v1/auth/otp/request?email=test@example.com
   ```

3. **Check your email** - you should receive an OTP code

4. **Verify OTP:**
   ```
   POST /api/v1/auth/otp/verify
   {
     "email": "test@example.com",
     "code": "123456"
   }
   ```

## Troubleshooting

### Emails not sending?

1. **Check SMTP credentials:**
   - Verify your Gmail address is correct
   - Make sure you're using an App Password, not your regular password
   - Check that 2-Step Verification is enabled

2. **Check .env file:**
   - Make sure `.env` is in the `backend/` directory
   - Verify all SMTP variables are set correctly
   - Ensure no extra spaces or quotes

3. **Check server logs:**
   - Look for error messages in the FastAPI console
   - Errors will be logged if `SMTP_STRICT=false`
   - If `SMTP_STRICT=true`, the API will return an error

4. **Test connection:**
   - Try the console mode first: `SMTP_MODE=console`
   - This will print emails to the console to verify the flow works

### Still having issues?

- Make sure `python-dotenv` is installed: `pip install python-dotenv`
- Verify firewall isn't blocking SMTP ports (465 or 587)
- Try a different email provider
- Check Gmail account security settings

## Production Deployment

For production:
1. Set `ENV=production`
2. Set `SMTP_STRICT=true` to ensure emails are actually sent
3. Use environment variables from your hosting platform (Render, Heroku, etc.)
4. Consider using a dedicated email service (SendGrid, Mailgun, AWS SES) for better deliverability
