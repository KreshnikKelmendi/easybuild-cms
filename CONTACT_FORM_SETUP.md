# Contact Form Email Setup Guide

This guide explains how to set up the contact form to send emails using Gmail.

## Prerequisites

1. A Gmail account (`noreplyeasybuild@gmail.com`)
2. 2-Step Verification enabled on your Gmail account
3. An App Password generated for this application

## Setup Steps

### 1. Enable 2-Step Verification

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### 2. Generate App Password

1. In your Google Account Security settings, find "App passwords"
2. Click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter a name like "EasyBuild Contact Form"
5. Click "Generate"
6. Copy the generated 16-character password

### 3. Environment Configuration

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following environment variable:

```env
GMAIL_APP_PASSWORD=your_16_character_app_password_here
```

**Important**: Replace `your_16_character_app_password_here` with the actual app password generated in step 2.

### 4. Email Configuration

The contact form is configured to:
- **From**: `noreplyeasybuild@gmail.com` (your noreply email)
- **To**: `kreshnik.kelmendi1994@gmail.com` (your email to receive messages)

If you need to change these email addresses, update them in:
- `src/app/api/contact/route.ts` (lines 30 and 35)

### 5. Testing

1. Start your development server: `npm run dev`
2. Navigate to the contact page
3. Fill out and submit the contact form
4. Check your email (`kreshnik.kelmendi1994@gmail.com`) for the message

## Security Notes

- Never commit your `.env.local` file to version control
- The app password is more secure than using your regular Gmail password
- App passwords can be revoked at any time from your Google Account settings

## Troubleshooting

### Common Issues

1. **"Invalid login" error**: Make sure you're using the app password, not your regular Gmail password
2. **"Less secure app access" error**: This means 2-Step Verification isn't enabled or you're not using an app password
3. **Emails not sending**: Check that the `GMAIL_APP_PASSWORD` environment variable is set correctly

### Gmail Settings

If you continue to have issues:
1. Check that "Less secure app access" is disabled (it should be for security)
2. Ensure you're using the correct app password
3. Verify that 2-Step Verification is enabled

## Support

If you encounter issues after following this guide, check:
1. Your Gmail account settings
2. The environment variable configuration
3. The browser console for any error messages
4. The server logs for API errors
