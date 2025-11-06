# Deploying to Render

## Step-by-Step Guide

### 1. Push to GitHub
Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for Render deployment"
git push
```

### 2. Create Render Account
- Go to [render.com](https://render.com)
- Sign up/login (GitHub login recommended)

### 3. Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository (`photobooth`)

### 4. Configure Service Settings

**Basic Settings:**
- **Name:** `photobooth` (or any name you like)
- **Environment:** `Node`
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)

**Build & Deploy:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`

**Environment Variables:**
- Add: `NODE_ENV` = `production`
- PORT will be automatically set by Render (don't set it manually)

**Advanced Settings:**
- **Disk:** 
  - Click "Add Disk"
  - Name: `photobooth-disk`
  - Mount Path: `/opt/render/project/src/vite-express-project/public/photos`
  - Size: 1 GB (or more if needed)
  - ⚠️ **Important:** This keeps photos persistent across deployments

### 5. Deploy
- Click **"Create Web Service"**
- Render will start building and deploying
- Wait 5-10 minutes for first deployment

### 6. Get Your URL
- Once deployed, you'll get a URL like: `https://photobooth.onrender.com`
- This URL will be used in QR codes automatically

## Alternative: Using render.yaml (Blueprint)

If you want to use the `render.yaml` file:

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repo
3. Render will automatically detect `render.yaml` and configure everything
4. Review settings and click **"Apply"**

## Troubleshooting

**Build fails:**
- Check build logs in Render dashboard
- Make sure all dependencies are in `package.json`
- Verify Node.js version (Render should auto-detect, but you can set it to Node 18+ if needed)

**Photos not persisting:**
- Make sure disk is mounted correctly
- Check disk mount path matches in server code
- Photos directory should be: `public/photos/`

**Port issues:**
- Render sets PORT automatically - don't override it
- Server code already handles `process.env.PORT`

**QR codes show wrong URL:**
- After first deployment, take a new photo
- QR codes will use the Render URL automatically

## Notes

- **Free tier:** Render free tier spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- **Photos:** With disk mounted, photos persist across deployments
- **HTTPS:** Automatically enabled on Render
- **Custom domain:** You can add your own domain in Render settings

## Testing

1. Visit your Render URL
2. Take a photo
3. Check QR code shows the Render domain
4. Scan QR code on phone to test download

