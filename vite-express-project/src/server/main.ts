import express from "express";
import ViteExpress from "vite-express";
import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' })); // For base64 image uploads

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../../public')));

// Create photos directory if it doesn't exist
const photosDir = path.join(__dirname, '../../public/photos');
if (!existsSync(photosDir)) {
  mkdir(photosDir, { recursive: true }).catch(console.error);
}

// Helper function to get base URL
const getBaseUrl = (req: express.Request): string => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Upload photo endpoint
app.post("/api/photos", async (req, res) => {
  try {
    const { imageData, format = 'png' } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Generate unique ID
    const photoId = crypto.randomBytes(8).toString('hex');
    
    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save file
    const extension = format === 'jpeg' ? 'jpg' : 'png';
    const filename = `${photoId}.${extension}`;
    const filepath = path.join(photosDir, filename);
    
    await writeFile(filepath, buffer);
    
    // Return shareable URL
    const baseUrl = getBaseUrl(req);
    const shareUrl = `${baseUrl}/share/${photoId}`;
    
    res.json({ 
      photoId,
      shareUrl,
      downloadUrl: `${baseUrl}/api/photos/${photoId}`
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// Download photo endpoint
app.get("/api/photos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try both png and jpg
    let filepath = path.join(photosDir, `${id}.png`);
    if (!existsSync(filepath)) {
      filepath = path.join(photosDir, `${id}.jpg`);
    }
    
    if (!existsSync(filepath)) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    const file = await readFile(filepath);
    const extension = filepath.endsWith('.jpg') ? 'jpg' : 'png';
    res.setHeader('Content-Type', `image/${extension}`);
    res.setHeader('Content-Disposition', `attachment; filename="photobooth-${id}.${extension}"`);
    res.send(file);
  } catch (error) {
    console.error('Error downloading photo:', error);
    res.status(500).json({ error: 'Failed to download photo' });
  }
});

// Share page endpoint (serves HTML with photo and download)
app.get("/share/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const baseUrl = getBaseUrl(req);
    const shareUrl = `${baseUrl}/share/${id}`;
    const downloadUrl = `${baseUrl}/api/photos/${id}`;
    
    // Check if photo exists
    let filepath = path.join(photosDir, `${id}.png`);
    if (!existsSync(filepath)) {
      filepath = path.join(photosDir, `${id}.jpg`);
    }
    
    if (!existsSync(filepath)) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Photo Not Found</title>
        </head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px;">
          <h1>Photo Not Found</h1>
          <p>This photo may have been deleted or the link is invalid.</p>
        </body>
        </html>
      `);
    }
    
    // Read the image to get its data URL for display
    const imageBuffer = await readFile(filepath);
    const imageBase64 = imageBuffer.toString('base64');
    const extension = filepath.endsWith('.jpg') ? 'jpg' : 'png';
    const imageDataUrl = `data:image/${extension};base64,${imageBase64}`;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <title>Your Photo - NYC Photobooth</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            -webkit-tap-highlight-color: transparent;
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 20px;
            max-width: 100%;
            width: 100%;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: clamp(24px, 5vw, 32px);
          }
          p {
            color: #666;
            margin-bottom: 20px;
            font-size: clamp(14px, 3vw, 18px);
          }
          .photo-container {
            margin: 20px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            background: #f5f5f5;
          }
          .photo-container img {
            display: block;
            width: 100%;
            height: auto;
            max-width: 100%;
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: default;
          }
          .download-btn {
            display: inline-block;
            background: #000;
            color: white;
            padding: 18px 40px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
            transition: background 0.3s, transform 0.1s;
            -webkit-tap-highlight-color: rgba(0,0,0,0.1);
            cursor: pointer;
            border: none;
            width: 100%;
            max-width: 300px;
          }
          .download-btn:active {
            transform: scale(0.98);
            background: #333;
          }
          .download-btn:hover {
            background: #333;
          }
          .instructions {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
            line-height: 1.6;
          }
          .instructions strong {
            color: #333;
            display: block;
            margin-bottom: 8px;
          }
          @media (max-width: 600px) {
            .container {
              padding: 15px;
              border-radius: 15px;
            }
            .download-btn {
              padding: 16px 30px;
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📸 Your Photo!</h1>
          <p>Tap the button below to download</p>
          <div class="photo-container">
            <img src="${imageDataUrl}" alt="Your Photobooth Photo" id="photo" />
          </div>
          <a href="${downloadUrl}" class="download-btn" download="photobooth-${id}.${extension}" id="downloadBtn">
            Download Photo
          </a>
          <div class="instructions">
            <strong>💡 Tip:</strong>
            You can also long-press the image above and select "Save Image" or "Add to Photos"
          </div>
        </div>
        <script>
          // Auto-download on mobile Safari (iOS) - some browsers block this, so we try
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // For iOS, try to trigger download after a short delay
          if (isIOS) {
            setTimeout(() => {
              const btn = document.getElementById('downloadBtn');
              if (btn) {
                btn.click();
              }
            }, 500);
          }
          
          // Make image long-pressable on mobile
          const photo = document.getElementById('photo');
          if (photo) {
            photo.addEventListener('contextmenu', function(e) {
              // Allow right-click/long-press menu
              return true;
            });
            
            // On mobile, make it clear the image is interactive
            if (isMobile) {
              photo.style.cursor = 'pointer';
              photo.addEventListener('click', function() {
                document.getElementById('downloadBtn').click();
              });
            }
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating share page:', error);
    res.status(500).send('Error generating share page');
  }
});

const PORT = process.env.PORT || 3000;

ViteExpress.listen(app, parseInt(PORT.toString()), () =>
  console.log(`Server is listening on port ${PORT}...`),
);
