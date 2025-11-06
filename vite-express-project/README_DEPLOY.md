# Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Railway will automatically detect the configuration and deploy
5. Your app will be live at `https://your-app-name.railway.app`

**Note:** Photos are stored in the filesystem. For production, consider using cloud storage (S3, etc.) for persistence.

### Option 2: Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Build Command:** `bun install && bun run build`
   - **Start Command:** `bun run start`
   - **Environment:** Node
5. Add a disk volume for photos (optional, see render.yaml)
6. Deploy!

### Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in the project directory
3. Follow the prompts
4. Deploy with `fly deploy`

## Environment Variables

No environment variables required for basic setup. The app will:
- Use PORT from environment (or default to 3000)
- Store photos in `public/photos/` directory

## Important Notes

- **Photo Storage:** Photos are stored on the server filesystem. On platforms like Railway/Render, this means photos will be lost if the server restarts (ephemeral storage). For production, consider:
  - Using cloud storage (AWS S3, Cloudinary, etc.)
  - Or using persistent volumes (Render offers this)
  
- **HTTPS:** Make sure your deployment platform provides HTTPS (Railway and Render do this automatically)

- **CORS:** If you need to access from different domains, you may need to configure CORS in the server.

## Testing After Deployment

1. Visit your deployed URL
2. Take a photo
3. Check that the QR code shows the correct domain
4. Scan the QR code on your phone to test the download flow

