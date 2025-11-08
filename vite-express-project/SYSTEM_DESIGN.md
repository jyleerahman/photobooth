# NYC Photobooth - System Design Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [API Design](#api-design)
7. [Storage Architecture](#storage-architecture)
8. [User Flow](#user-flow)
9. [Security Considerations](#security-considerations)
10. [Deployment Architecture](#deployment-architecture)
11. [Scalability & Performance](#scalability--performance)
12. [Future Enhancements](#future-enhancements)

---

## System Overview

**NYC Photobooth** is a web-based photobooth application that allows users to capture, customize, and share photo strips with a New York City street-style aesthetic. The system provides an interactive experience where users can:

- Capture 4 photos via webcam
- Select from multiple frame layouts (Strip, Grid, Special/Bodega Cat)
- Choose background styles (Graffiti, Subway, Bodega, Solid colors, Neon)
- Generate high-quality photo compositions at print resolution (300 DPI)
- Share photos via QR codes, download links, and social media integration

### Key Features
- **Real-time webcam capture** with countdown timer
- **Canvas-based image processing** for high-quality composition
- **Multiple layout options** (vertical strip, grid, special layout)
- **Background customization** with image overlays and gradients
- **Share functionality** via QR codes and direct download links
- **Social media integration** (Twitter/X, Instagram)
- **Mobile-responsive design** with NYC street art aesthetic

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React App  │  │ react-webcam │  │ HTML5 Canvas │       │
│  │  (SPA)       │  │  (Library)   │  │   (Native)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                   │             │
│         └─────────────────┼───────────────────┘             │
│                           │                                 │
│                    HTTP/REST API                            │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            │ HTTPS
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Express.js Server                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Static     │  │   Photo      │  │   QR Code    │       │
│  │   Files      │  │   Upload     │  │   Generator  │       │
│  │   Server     │  │   Handler    │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                   │             │
│         └─────────────────┼───────────────────┘             │
│                           │                                 │
│                    File System                              │
│                    /public/photos                           │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Pattern
- **Monolithic Architecture**: Single application combining frontend and backend
- **Server-Side Rendering**: Express serves both API and static assets
- **Client-Side Routing**: React Router for SPA navigation
- **File-Based Storage**: Photos stored directly on filesystem

---

## Technology Stack

### Frontend
- **Framework**: React 19.1.0 with TypeScript
- **Routing**: React Router 7.9.5
- **Build Tool**: Vite 6.3.3
- **Styling**: Tailwind CSS 4.1.16
- **Libraries**:
  - **Webcam**: react-webcam 7.2.0 (React wrapper for MediaDevices API)
  - **QR Codes**: qrcode 1.5.4
- **Native Browser APIs**:
  - **Canvas API**: HTML5 Canvas for image composition and rendering
  - **MediaDevices API**: Webcam access (via react-webcam)
  - **Clipboard API**: Image copying for social sharing
  - **Web Share API**: Native sharing on mobile devices

### Backend
- **Runtime**: Bun (alternative: Node.js)
- **Framework**: Express.js 5.1.0
- **Integration**: vite-express (serves Vite-built assets)
- **File Operations**: Node.js fs/promises

### Deployment
- **Platforms**: Render
- **Storage**: Persistent disk mount (Render) or local filesystem
- **Process Manager**: Built-in Express server

---

## Component Architecture

### Frontend Components

```
App (Root)
│
├── Landing Page (/)
│   └── Navigation to Frame Selection
│
├── Frame Selection (/frame)
│   └── Choose Layout: Strip | Grid | Bodega-Cat
│
├── Camera (/camera)
│   ├── Webcam Component
│   ├── Countdown Timer
│   ├── Capture Logic (4 photos)
│   └── Navigation to Background Selection
│
├── Background Selection (/background)
│   ├── Preview Canvas
│   ├── Background Options (6 styles)
│   └── Navigation to Result
│
└── Result (/result)
    ├── Final Canvas Composition
    ├── QR Code Generation
    ├── Share Buttons (X, Instagram)
    ├── Download Functionality
    └── Retake/Start Over
```

### Component Responsibilities

#### 1. **App.tsx** - Landing Page
- Branding and introduction
- Entry point navigation
- Visual presentation with NYC theme

#### 2. **Frame.tsx** - Layout Selection
- Present 3 layout options
- Pass selected layout via React Router state

#### 3. **Camera.tsx** - Photo Capture
- Webcam initialization and management (via react-webcam library)
- Automated capture sequence (4 photos, 5-second countdown)
- Flash effect and visual feedback
- Store captured images as base64 data URLs

#### 4. **Background.tsx** - Background Customization
- Real-time preview generation (30% scale for performance)
- 6 background options:
  - Image backgrounds: Graffiti, Subway, Bodega
  - Solid colors: White, Black
  - Gradient: Neon
- Canvas API preview rendering (native HTML5 Canvas)

#### 5. **Result.tsx** - Final Composition & Sharing
- Full-resolution canvas composition (300 DPI) using native Canvas API
- Photo upload to server
- QR code generation for share URL (qrcode library)
- Social media sharing (native Clipboard API, Web Share API)
- Download functionality

### Backend Components

#### 1. **Server (main.ts)**
- Express application setup
- Static file serving
- API endpoints
- File system operations

#### 2. **API Endpoints**
- `POST /api/photos` - Upload photo (base64 → file)
- `GET /api/photos/:id` - Download photo
- `GET /share/:id` - Share page (HTML with photo)

---

## Data Flow

### Photo Capture Flow

```
User Action → Camera Component
    ↓
Webcam.getScreenshot() → Base64 Data URL
    ↓
Stored in React State (capturedImages[])
    ↓
Navigation to Background Selection (via Router state)
    ↓
Background Preview Generation (Canvas, 30% scale)
    ↓
User Selects Background
    ↓
Navigation to Result (via Router state)
    ↓
Full Resolution Composition (Canvas, 300 DPI)
    ↓
Canvas.toDataURL() → Base64 PNG
    ↓
POST /api/photos
    ↓
Server: Base64 → Buffer → File System
    ↓
Return: { photoId, shareUrl, downloadUrl }
    ↓
QR Code Generation (Client-side)
    ↓
Display Share Options
```

### Image Processing Flow

```
Input: 4 Base64 Image Data URLs
    ↓
HTML5 Canvas Context Creation (native browser API)
    ↓
Background Rendering:
    - Load background image (if applicable)
    - Draw solid color/gradient (if applicable)
    ↓
For each photo:
    - Load Image object from base64
    - Calculate aspect ratio
    - Crop to fit layout (center crop)
    - Draw to canvas at specified position
    ↓
Final Canvas (300 DPI)
    ↓
Export: canvas.toDataURL('image/png')
```

### Sharing Flow

```
User Clicks Share Button
    ↓
Canvas → Blob Conversion
    ↓
Try Clipboard API (desktop)
    ↓
If successful:
    - Copy to clipboard
    - Open social media with pre-filled text
    ↓
Else: Try Web Share API (mobile)
    ↓
If successful:
    - Native share dialog
    ↓
Else: Fallback
    - Download file
    - Open social media
```

---

## API Design

### POST /api/photos

**Request:**
```json
{
  "imageData": "data:image/png;base64,iVBORw0KG...",
  "format": "png"
}
```

**Response:**
```json
{
  "photoId": "a1b2c3d4e5f6g7h8",
  "shareUrl": "https://photobooth.example.com/share/a1b2c3d4e5f6g7h8",
  "downloadUrl": "https://photobooth.example.com/api/photos/a1b2c3d4e5f6g7h8"
}
```

**Process:**
1. Extract base64 data (remove data URL prefix)
2. Convert to Buffer
3. Generate unique ID (crypto.randomBytes(8).toString('hex'))
4. Save to filesystem: `{photoId}.{extension}`
5. Return URLs

**Error Handling:**
- 400: No image data provided
- 500: File system error

---

### GET /api/photos/:id

**Response:**
- Content-Type: `image/png` or `image/jpeg`
- Content-Disposition: `attachment; filename="photobooth-{id}.{ext}"`
- Body: Binary image data

**Process:**
1. Check for file: `{id}.png`
2. If not found, check: `{id}.jpg`
3. Read file and stream response
4. Set appropriate headers

**Error Handling:**
- 404: Photo not found

---

### GET /share/:id

**Response:**
- HTML page with embedded photo
- Download button
- Mobile-optimized interface

**Process:**
1. Verify photo exists
2. Read image file
3. Convert to base64 data URL
4. Generate HTML with embedded image
5. Include download link and instructions

**Features:**
- Auto-download attempt on iOS
- Long-press image support
- Responsive design

---

## Storage Architecture

### File System Structure

```
/public/
├── photos/
│   ├── {photoId1}.png
│   ├── {photoId2}.jpg
│   └── ...
├── vite.svg
└── (other static assets)
```

### Storage Strategy

**Development:**
- Local filesystem: `public/photos/`

**Production (Render):**
- Persistent disk mount: `/opt/render/project/src/vite-express-project/public/photos`
- Falls back to standard path if mount doesn't exist
- Disk size: 1 GB (configurable)

**Photo Naming:**
- Format: `{8-byte hex}.{extension}`
- Extension: `.png` or `.jpg` (based on format parameter)
- Example: `a1b2c3d4e5f6g7h8.png`

### Storage Considerations

**Current Limitations:**
- No database for metadata
- No cleanup mechanism for old photos
- File-based only (no CDN integration)

**Scalability:**
- Filesystem storage doesn't scale horizontally
- Consider object storage (S3, Cloudflare R2) for production at scale

---

## User Flow

### Complete User Journey

```
1. Landing Page (/)
   ↓
   User clicks "START" (One Way sign button)
   
2. Frame Selection (/frame)
   ↓
   User selects layout:
   - Strip (vertical, 4 photos)
   - Grid (2x2 square)
   - Special (Bodega Cat - 1 big + 3 small)
   
3. Camera (/camera)
   ↓
   User clicks "START"
   ↓
   Automated sequence:
   - 5-second countdown
   - Capture photo
   - Flash effect
   - Show captured image (1 second)
   - Repeat 4 times
   ↓
   Auto-navigate to Background Selection
   
4. Background Selection (/background)
   ↓
   User sees preview (30% scale)
   ↓
   User selects background:
   - Graffiti Wall
   - Subway Station
   - Bodega
   - White
   - Black
   - Neon Lights
   ↓
   Preview updates in real-time
   ↓
   User clicks "CONTINUE"
   
5. Result (/result)
   ↓
   Full-resolution composition generated (300 DPI)
   ↓
   Photo uploaded to server automatically
   ↓
   Share URL and QR code generated
   ↓
   User options:
   - Download photo
   - Share on X (Twitter)
   - Share on Instagram
   - Retake photos
   - Start over
```

### State Management

**React Router State:**
- Frame layout passed via `location.state`
- Captured images passed via `location.state`
- Background style passed via `location.state`

**Local Component State:**
- Webcam stream management
- Countdown timer state
- Canvas rendering state
- Upload status

---

## Security Considerations

### Current Security Measures

1. **File Upload Validation:**
   - Base64 data validation
   - Image format verification
   - File size limits (50MB JSON limit)

2. **Unique Photo IDs:**
   - Cryptographically secure random generation
   - 8-byte hex IDs (16 characters)
   - Prevents enumeration attacks

3. **Path Traversal Prevention:**
   - File paths constructed from photo ID only
   - No user-provided paths

### Security Gaps & Recommendations

1. **No Authentication:**
   - Photos are publicly accessible via ID
   - Recommendation: Add optional authentication for private photos

2. **No Rate Limiting:**
   - Vulnerable to DoS via uploads
   - Recommendation: Implement rate limiting (e.g., express-rate-limit)

3. **No File Size Validation:**
   - Current: 50MB JSON limit (not image-specific)
   - Recommendation: Validate actual image dimensions and file size

4. **CORS:**
   - Not explicitly configured
   - Recommendation: Configure CORS for production domains

5. **Input Sanitization:**
   - Photo IDs validated but could add stricter validation
   - Recommendation: Validate hex format strictly

6. **Storage Cleanup:**
   - No automatic cleanup of old photos
   - Recommendation: Implement TTL or cleanup job

---

## Deployment Architecture

### Railway Deployment

**Configuration (railway.json):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "bun run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Process:**
1. Nixpacks detects Bun runtime
2. Builds application
3. Runs `bun run start`
4. Express server listens on `$PORT`

### Render Deployment

**Configuration (render.yaml):**
```yaml
services:
  - type: web
    name: photobooth
    env: bun
    rootDir: vite-express-project
    buildCommand: bun install && bun run build
    startCommand: bun run start
    disk:
      name: photobooth-disk
      mountPath: /opt/render/project/src/vite-express-project/public/photos
      sizeGB: 1
```

**Features:**
- Persistent disk for photos
- Automatic HTTPS
- Environment variable support
- Health checks

### Build Process

```
1. Install Dependencies
   bun install
   
2. Build Frontend
   vite build
   → Output: dist/ (static assets)
   
3. Start Server
   NODE_ENV=production tsx src/server/main.ts
   → ViteExpress serves dist/ and handles API
```

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

---

## Scalability & Performance

### Current Performance Characteristics

**Strengths:**
- Client-side image processing (reduces server load)
- Native Canvas API rendering (efficient, no external dependencies)
- Static asset serving (fast)
- Single-page application (smooth navigation)

**Limitations:**
- Single server instance (no horizontal scaling)
- File system storage (doesn't scale across instances)
- No caching layer
- No CDN for static assets
- Large base64 payloads in API requests

### Performance Optimizations

1. **Preview Generation:**
   - Background preview at 30% scale (faster rendering)
   - Full resolution only for final export

2. **Image Format:**
   - PNG for transparency
   - JPEG option available (smaller files)

3. **Canvas Optimization:**
   - Efficient image cropping and scaling
   - Single-pass rendering

### Scalability Recommendations

**Short-term:**
1. **Object Storage Migration:**
   - Move photos to S3/R2/Cloudflare R2
   - Enables horizontal scaling
   - Better reliability

2. **CDN Integration:**
   - Serve static assets via CDN
   - Cache photo downloads

3. **Database for Metadata:**
   - Store photo metadata (creation date, size, etc.)
   - Enable search and management
   - Track usage statistics

**Medium-term:**
1. **Horizontal Scaling:**
   - Stateless API servers
   - Load balancer
   - Shared storage (object storage)

2. **Caching:**
   - Redis for session state (if adding auth)
   - CDN for static assets
   - Cache photo URLs

3. **Queue System:**
   - Background job processing for heavy operations
   - Async photo processing
   - Thumbnail generation

**Long-term:**
1. **Microservices:**
   - Separate photo processing service
   - Separate storage service
   - API gateway

2. **Image Optimization:**
   - Automatic format conversion (WebP)
   - Multiple resolution versions
   - Progressive JPEG support

3. **Analytics:**
   - Usage tracking
   - Performance monitoring
   - Error tracking

---

## Future Enhancements

### Feature Enhancements

1. **Additional Layouts:**
   - Customizable grid sizes
   - Portrait orientation options
   - Video strips

2. **Enhanced Customization:**
   - Filters and effects
   - Text overlays
   - Stickers and emojis
   - Custom background uploads

3. **Social Features:**
   - Photo galleries
   - User accounts
   - Favorite photos
   - Sharing collections

4. **Mobile App:**
   - Native iOS/Android apps
   - Push notifications
   - Offline mode

### Technical Enhancements

1. **Authentication & Authorization:**
   - User accounts
   - Private photo options
   - Sharing permissions

2. **Admin Dashboard:**
   - Photo management
   - Usage statistics
   - System monitoring

3. **API Improvements:**
   - RESTful API documentation
   - Rate limiting
   - API versioning
   - Webhook support

4. **Monitoring & Observability:**
   - Error tracking (Sentry)
   - Performance monitoring
   - Log aggregation
   - Health checks

5. **Testing:**
   - Unit tests
   - Integration tests
   - E2E tests
   - Performance tests

---

## Conclusion

The NYC Photobooth system is a well-architected web application that provides an engaging user experience for creating and sharing photo strips. The current architecture is suitable for small to medium-scale deployments, with clear paths for scaling as usage grows.

**Key Strengths:**
- Simple, monolithic architecture (easy to deploy and maintain)
- Client-side processing (efficient use of resources)
- Modern tech stack (React, TypeScript, Express)
- Multiple deployment options (Railway, Render)

**Areas for Improvement:**
- Storage scalability (move to object storage)
- Security enhancements (rate limiting, authentication)
- Performance optimizations (CDN, caching)
- Monitoring and observability

The system design provides a solid foundation for future growth and enhancement.

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** System Design Analysis

