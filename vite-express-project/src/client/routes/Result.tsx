import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "qrcode";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

interface LocationState {
    selectedImages: string[];
    frameLayout: FrameLayout;
    backgroundStyle?: string;
}

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hasUploadedRef = useRef(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const selectedImages = state?.selectedImages || [];
    const frameLayout = state?.frameLayout || 'strip';
    const backgroundStyle = state?.backgroundStyle || 'graffiti';

    // Helper function to get background image URL
    const getBackgroundImageUrl = (style: string): string => {
        const backgrounds: Record<string, string> = {
            'graffiti': new URL('../font/graffiti-wall.jpg', import.meta.url).href,
            'subway': new URL('../font/newyork-subway.jpg', import.meta.url).href,
            'bodega': new URL('../font/newyorkbodega.jpg', import.meta.url).href,
        };
        return backgrounds[style] || backgrounds['graffiti'];
    };

    // Redirect if no images are available
    useEffect(() => {
        if (!selectedImages || selectedImages.length !== 4) {
            navigate('/');
        }
    }, [selectedImages, navigate]);

    // Upload photo to server and generate share URL
    const uploadPhoto = useCallback(async () => {
        if (!canvasRef.current || hasUploadedRef.current || isUploading) return;
        
        hasUploadedRef.current = true;
        setIsUploading(true);
        try {
            const canvas = canvasRef.current;
            const imageData = canvas.toDataURL('image/png');
            
            const response = await fetch('/api/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData,
                    format: 'png'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to upload photo');
            }
            
            const data = await response.json();
            setShareUrl(data.shareUrl);
            
            // Generate QR code
            const qrCode = await QRCode.toDataURL(data.shareUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            setQrCodeDataUrl(qrCode);
        } catch (error) {
            console.error('Error uploading photo:', error);
            hasUploadedRef.current = false; // Reset on error so it can retry
        } finally {
            setIsUploading(false);
        }
    }, []);

    // Generate the photo strip
    useEffect(() => {
        if (!canvasRef.current || selectedImages.length !== 4) return;

        // Reset upload ref when inputs change
        hasUploadedRef.current = false;
        setShareUrl(null);
        setQrCodeDataUrl(null);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const generatePhotoStrip = async () => {
            if (frameLayout === 'bodega-cat') {
                // Bodega Cat layout: One big photo on top, 3 small photos on bottom
                const dpi = 300;
                const catWidth = 6 * dpi;  // 1800px - square
                const catHeight = 6 * dpi; // 1800px
                
                canvas.width = catWidth;
                canvas.height = catHeight;

                // Draw background
                if (backgroundStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else if (backgroundStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else if (backgroundStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, catWidth, catHeight);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else {
                    const bgImage = new Image();
                    bgImage.crossOrigin = "anonymous";
                    bgImage.src = getBackgroundImageUrl(backgroundStyle);
                    await new Promise((resolve) => { 
                        bgImage.onload = resolve;
                        bgImage.onerror = () => {
                            // Fallback to white if image fails
                            ctx.fillStyle = 'white';
                            ctx.fillRect(0, 0, catWidth, catHeight);
                            resolve(null);
                        };
                    });
                    if (bgImage.complete && bgImage.naturalWidth > 0) {
                        ctx.drawImage(bgImage, 0, 0, catWidth, catHeight);
                    }
                }

                // Padding
                const padding = 0.5 * dpi; // 150px padding
                const spacing = 0.2 * dpi; // 60px between photos

                // Big photo dimensions (top 60% of space)
                const bigPhotoWidth = catWidth - (2 * padding);
                const bigPhotoHeight = (catHeight - (2 * padding) - spacing) * 0.6;

                // Small photos dimensions (bottom 40% of space, split into 3)
                const smallPhotoHeight = (catHeight - (2 * padding) - spacing) * 0.4;
                const smallPhotoWidth = (catWidth - (2 * padding) - (2 * spacing)) / 3;

                // Draw big photo (first selected image)
                const bigImg = new Image();
                bigImg.src = selectedImages[0];
                await new Promise((resolve) => {
                    bigImg.onload = resolve;
                });

                const bigImgAspect = bigImg.width / bigImg.height;
                const bigBoxAspect = bigPhotoWidth / bigPhotoHeight;
                
                let bigSourceX, bigSourceY, bigSourceWidth, bigSourceHeight;
                
                if (bigImgAspect > bigBoxAspect) {
                    bigSourceHeight = bigImg.height;
                    bigSourceWidth = bigImg.height * bigBoxAspect;
                    bigSourceX = (bigImg.width - bigSourceWidth) / 2;
                    bigSourceY = 0;
                } else {
                    bigSourceWidth = bigImg.width;
                    bigSourceHeight = bigImg.width / bigBoxAspect;
                    bigSourceX = 0;
                    bigSourceY = (bigImg.height - bigSourceHeight) / 2;
                }
                
                ctx.drawImage(
                    bigImg,
                    bigSourceX, bigSourceY, bigSourceWidth, bigSourceHeight,
                    padding, padding, bigPhotoWidth, bigPhotoHeight
                );

                // Draw 3 small photos (remaining selected images)
                for (let i = 0; i < 3; i++) {
                    const smallImg = new Image();
                    smallImg.src = selectedImages[i + 1];
                    await new Promise((resolve) => {
                        smallImg.onload = resolve;
                    });

                    const x = padding + (i * (smallPhotoWidth + spacing));
                    const y = padding + bigPhotoHeight + spacing;

                    const smallImgAspect = smallImg.width / smallImg.height;
                    const smallBoxAspect = smallPhotoWidth / smallPhotoHeight;
                    
                    let smallSourceX, smallSourceY, smallSourceWidth, smallSourceHeight;
                    
                    if (smallImgAspect > smallBoxAspect) {
                        smallSourceHeight = smallImg.height;
                        smallSourceWidth = smallImg.height * smallBoxAspect;
                        smallSourceX = (smallImg.width - smallSourceWidth) / 2;
                        smallSourceY = 0;
                    } else {
                        smallSourceWidth = smallImg.width;
                        smallSourceHeight = smallImg.width / smallBoxAspect;
                        smallSourceX = 0;
                        smallSourceY = (smallImg.height - smallSourceHeight) / 2;
                    }
                    
                    ctx.drawImage(
                        smallImg,
                        smallSourceX, smallSourceY, smallSourceWidth, smallSourceHeight,
                        x, y, smallPhotoWidth, smallPhotoHeight
                    );
                }

                // Add "BODEGA CAT APPROVED" stamp in corner
                ctx.save();
                ctx.font = `bold ${0.15 * dpi}px Arial`;
                ctx.fillStyle = '#FFD700';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.textAlign = 'right';
                ctx.rotate(-0.1);
                const stampText = '🐈 BODEGA CAT';
                ctx.strokeText(stampText, catWidth - padding - 20, catHeight - padding - 20);
                ctx.fillText(stampText, catWidth - padding - 20, catHeight - padding - 20);
                ctx.restore();
            } else if (frameLayout === 'strip') {
                // Classic strip: 2 inches wide x 6 inches tall (at 300 DPI for print quality)
                const dpi = 300;
                const stripWidth = 2 * dpi;  // 600px
                const stripHeight = 6 * dpi; // 1800px
                
                canvas.width = stripWidth;
                canvas.height = stripHeight;

                // Draw background
                if (backgroundStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else if (backgroundStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else if (backgroundStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, stripWidth, stripHeight);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else {
                    const bgImageStrip = new Image();
                    bgImageStrip.crossOrigin = "anonymous";
                    bgImageStrip.src = getBackgroundImageUrl(backgroundStyle);
                    await new Promise((resolve) => { 
                        bgImageStrip.onload = resolve;
                        bgImageStrip.onerror = () => {
                            // Fallback to white if image fails
                            ctx.fillStyle = 'white';
                            ctx.fillRect(0, 0, stripWidth, stripHeight);
                            resolve(null);
                        };
                    });
                    if (bgImageStrip.complete && bgImageStrip.naturalWidth > 0) {
                        ctx.drawImage(bgImageStrip, 0, 0, stripWidth, stripHeight);
                    }
                }

                // Padding and spacing
                const photoWidth = 1.7 * dpi; // 510px - fixed photo width
                const photoHeight = photoWidth * (3/4); // 1.275" - 4:3 aspect ratio (landscape)
                const padding = (stripWidth - photoWidth) / 2; // Center horizontally
                const spacing = 0.1 * dpi; // 30px between photos
                const topBottomPadding = (stripHeight - (4 * photoHeight) - (3 * spacing)) / 2; // Center vertically

                // Draw each photo with aspect ratio preserved (cover fit)
                for (let i = 0; i < 4; i++) {
                    const img = new Image();
                    img.src = selectedImages[i];
                    await new Promise((resolve) => {
                        img.onload = resolve;
                    });

                    const y = topBottomPadding + (i * (photoHeight + spacing));
                    
                    // Calculate aspect ratios
                    const imgAspect = img.width / img.height;
                    const boxAspect = photoWidth / photoHeight;
                    
                    let sourceX, sourceY, sourceWidth, sourceHeight;
                    
                    if (imgAspect > boxAspect) {
                        // Image is wider - crop sides
                        sourceHeight = img.height;
                        sourceWidth = img.height * boxAspect;
                        sourceX = (img.width - sourceWidth) / 2;
                        sourceY = 0;
                    } else {
                        // Image is taller - crop top/bottom
                        sourceWidth = img.width;
                        sourceHeight = img.width / boxAspect;
                        sourceX = 0;
                        sourceY = (img.height - sourceHeight) / 2;
                    }
                    
                    ctx.drawImage(
                        img,
                        sourceX, sourceY, sourceWidth, sourceHeight,
                        padding, y, photoWidth, photoHeight
                    );
                }
            } else {
                // Grid layout: Square format (6 inches x 6 inches at 300 DPI)
                const dpi = 300;
                const gridSize = 8 * dpi; // 1800px
                
                canvas.width = gridSize;
                canvas.height = gridSize;

                // Draw background
                if (backgroundStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else if (backgroundStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else if (backgroundStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, gridSize, gridSize);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else {
                    const bgImageGrid = new Image();
                    bgImageGrid.crossOrigin = "anonymous";
                    bgImageGrid.src = getBackgroundImageUrl(backgroundStyle);
                    await new Promise((resolve) => { 
                        bgImageGrid.onload = resolve;
                        bgImageGrid.onerror = () => {
                            // Fallback to white if image fails
                            ctx.fillStyle = 'white';
                            ctx.fillRect(0, 0, gridSize, gridSize);
                            resolve(null);
                        };
                    });
                    if (bgImageGrid.complete && bgImageGrid.naturalWidth > 0) {
                        ctx.drawImage(bgImageGrid, 0, 0, gridSize, gridSize);
                    }
                }

                // Padding and spacing
                const padding = 0.5 * dpi; // 150px padding
                const spacing = 0.2 * dpi; // 60px between photos

                const availableSpace = gridSize - (2 * padding) - spacing;
                const photoSize = availableSpace / 2;

                // Draw 2x2 grid with aspect ratio preserved (cover fit)
                for (let i = 0; i < 4; i++) {
                    const img = new Image();
                    img.src = selectedImages[i];
                    await new Promise((resolve) => {
                        img.onload = resolve;
                    });

                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    const x = padding + (col * (photoSize + spacing));
                    const y = padding + (row * (photoSize + spacing));

                    // Calculate aspect ratios for square crop
                    const imgAspect = img.width / img.height;
                    
                    let sourceX, sourceY, sourceSize;
                    
                    if (imgAspect > 1) {
                        // Image is wider - crop sides to make square
                        sourceSize = img.height;
                        sourceX = (img.width - sourceSize) / 2;
                        sourceY = 0;
                    } else {
                        // Image is taller - crop top/bottom to make square
                        sourceSize = img.width;
                        sourceX = 0;
                        sourceY = (img.height - sourceSize) / 2;
                    }
                    
                    ctx.drawImage(
                        img,
                        sourceX, sourceY, sourceSize, sourceSize,
                        x, y, photoSize, photoSize
                    );
                }
            }
        };

        generatePhotoStrip().then(() => {
            // Upload photo after canvas is generated
            uploadPhoto();
        });
    }, [selectedImages, frameLayout, backgroundStyle, uploadPhoto]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        
        const link = document.createElement('a');
        link.download = `photobooth-${frameLayout}-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    const handleShareX = async () => {
        if (!canvasRef.current) return;
        
        try {
            // Convert canvas to blob
            canvasRef.current.toBlob(async (blob) => {
                if (!blob) return;
                
                // Try copying to clipboard first (best for desktop browsers)
                if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        
                        // Open Twitter with pre-filled text
                        const text = encodeURIComponent('Check out my NYC Photobooth photo! 📸 (Ctrl+V to paste your photo into this tweet.)');
                        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                        
                        // Show brief message
                        setTimeout(() => {
                            alert('Image copied to clipboard! Paste it (Ctrl+V / Cmd+V) into your tweet.');
                        }, 500);
                        return;
                    } catch (clipboardError) {
                        // Clipboard failed, try next method
                        console.log('Clipboard copy failed:', clipboardError);
                    }
                }
                
                // Try Web Share API (works on mobile and some desktop browsers)
                const file = new File([blob], 'photobooth-photo.png', { type: 'image/png' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'Check out my NYC Photobooth photo! 📸',
                            text: 'Check out my NYC Photobooth photo! 📸',
                            files: [file]
                        });
                        return;
                    } catch (err) {
                        // User cancelled or error, fall through to fallback
                        console.log('Web Share cancelled or failed:', err);
                    }
                }
                
                // Fallback: Download the image and open Twitter
                const link = document.createElement('a');
                link.download = `photobooth-${Date.now()}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                
                // Open Twitter with pre-filled text
                const text = encodeURIComponent('Check out my NYC Photobooth photo! 📸 Just downloaded it!');
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
            }, 'image/png');
        } catch (error) {
            console.error('Error sharing to X:', error);
            // Ultimate fallback: just share the URL
            if (shareUrl) {
                const text = encodeURIComponent('Check out my NYC Photobooth photo! 📸');
                const url = encodeURIComponent(shareUrl);
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
            }
        }
    };

    const handleShareInstagram = async () => {
        if (!canvasRef.current) return;
        
        try {
            // Convert canvas to blob
            canvasRef.current.toBlob(async (blob) => {
                if (!blob) return;
                
                // Try copying to clipboard first (best for desktop browsers)
                if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                    try {
                        const item = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([item]);
                        
                        // Open Instagram in a new tab
                        window.open('https://www.instagram.com', '_blank');
                        
                        // Show message with instructions
                        setTimeout(() => {
                            alert('Image copied to clipboard! Instagram opened in a new tab.\n\n1. Click the "+" button to create a new post\n2. Press Ctrl+V (or Cmd+V on Mac) to paste your photo\n3. Add your caption and share!');
                        }, 500);
                        return;
                    } catch (clipboardError) {
                        // Clipboard failed, try next method
                        console.log('Clipboard copy failed:', clipboardError);
                    }
                }
                
                // Try Web Share API (works on mobile and some desktop browsers)
                const file = new File([blob], 'photobooth-photo.png', { type: 'image/png' });
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: 'My NYC Photobooth Photo',
                            text: 'Check out my NYC Photobooth photo!',
                            files: [file]
                        });
                        return;
                    } catch (err) {
                        // User cancelled or error, fall through to fallback
                        console.log('Web Share cancelled or failed:', err);
                    }
                }
                
                // Fallback: Download the image and open Instagram
                const link = document.createElement('a');
                link.download = `photobooth-${Date.now()}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                
                // Open Instagram in a new tab
                window.open('https://www.instagram.com', '_blank');
                
                setTimeout(() => {
                    alert('Photo downloaded! Instagram opened in a new tab.\n\n1. Click the "+" button to create a new post\n2. Click "Select from Computer" and choose the downloaded photo\n3. Add your caption and share!');
                }, 500);
            }, 'image/png');
        } catch (error) {
            console.error('Error sharing to Instagram:', error);
            // Ultimate fallback: copy link
            if (shareUrl) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(() => {
                        alert('Link copied! Open Instagram and paste it in your story or post.');
                    }).catch(() => {
                        prompt('Copy this link to share on Instagram:', shareUrl);
                    });
                } else {
                    prompt('Copy this link to share on Instagram:', shareUrl);
                }
            }
        }
    };

    const handleStartOver = () => {
        navigate('/');
    };

    const handleRetake = () => {
        navigate('/frame');
    };

    const getLayoutName = () => {
        if (frameLayout === 'bodega-cat') return '※ SPECIAL EDITION ※';
        if (frameLayout === 'grid') return '※ GRID FORMAT ※';
        return '※ CLASSIC STRIP ※';
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)]">
            <div className="bodega-grain" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 py-8">
                <header className="flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono']">
                    <span>SESSION 06 · FINAL PRINT</span>
                    <span>{getLayoutName()}</span>
                    <span>NYC PHOTO LAB</span>
                </header>

                <div className="text-center">
                    <div className="mx-auto text-white text-[clamp(2.5rem,5.5vw,4.2rem)] font-bold uppercase font-['WhoopieSunday'] leading-[0.9]"
                        style={{
                            textShadow: '6px 6px 0 rgba(0,0,0,0.85), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)',
                            WebkitTextStroke: '3px #0f0f0f',
                            color: 'var(--poster-neon)'
                        }}
                    >
                        YOUR PHOTO STRIP
                    </div>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.45em] text-[var(--poster-muted)] font-['SpaceMono']">
                        DOWNLOAD · SHARE · PRINT
                    </p>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-6 lg:flex-row">
                    <div className="flex w-full flex-1 items-center justify-center">
                        <div className="border-4 border-[var(--poster-ink)] bg-white p-4 shadow-[12px_12px_0_rgba(0,0,0,0.75)]" style={{ maxHeight: '60vh' }}>
                            <canvas 
                                ref={canvasRef}
                                style={{
                                    maxWidth: frameLayout === 'strip' ? '200px' : '360px',
                                    maxHeight: '55vh',
                                    width: 'auto',
                                    height: '100%',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex w-full flex-1 flex-col items-center gap-4">
                        {qrCodeDataUrl && shareUrl ? (
                            <div className="flex w-full max-w-sm flex-col items-center gap-3 border-4 border-[var(--poster-ink)] bg-white p-4 shadow-[10px_10px_0_rgba(0,0,0,0.7)]" style={{ maxHeight: '60vh' }}>
                                <span className="text-black text-sm font-bold uppercase tracking-[0.4em] font-['SpaceMono']">
                                    SCAN TO DOWNLOAD
                                </span>
                                <div className="bg-white p-3 border-4 border-[var(--poster-ink)]">
                                    <img src={qrCodeDataUrl} alt="QR Code" className="h-32 w-32 object-contain" />
                                </div>
                                <div className="text-center text-[0.65rem] uppercase tracking-[0.4em] text-[var(--poster-muted)] font-['SpaceMono']">
                                    OR SHARE IT STRAIGHT AWAY
                                </div>
                                <div className="flex w-full flex-col gap-2">
                                    <button
                                        onClick={handleShareX}
                                        className="border-4 border-[var(--poster-ink)] bg-[var(--poster-neon)] px-6 py-3 text-sm font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[8px_8px_0_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                                    >
                                        SHARE ON X
                                    </button>
                                    <button
                                        onClick={handleShareInstagram}
                                        className="border-4 border-[var(--poster-ink)] bg-[var(--poster-neon)] px-6 py-3 text-sm font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[8px_8px_0_rgba(0,0,0,0.7)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                                    >
                                        SHARE ON IG
                                    </button>
                                </div>
                                <div className="w-full break-words text-center text-[0.65rem] font-['SpaceMono'] uppercase tracking-[0.3em] text-[var(--poster-muted)]">
                                    {shareUrl}
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full max-w-sm items-center justify-center border-4 border-[var(--poster-ink)] bg-white p-4 text-center font-['Coolvetica'] text-sm uppercase tracking-[0.3em] text-[var(--poster-muted)] shadow-[10px_10px_0_rgba(0,0,0,0.6)]" style={{ maxHeight: '60vh' }}>
                                {isUploading ? 'UPLOADING YOUR PRINT…' : 'PREPARING YOUR SHARE LINK…'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 pb-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="border-4 border-[var(--poster-ink)] bg-[var(--poster-neon)] px-10 py-4 text-base font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[12px_12px_0_rgba(0,0,0,0.8)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                        >
                            DOWNLOAD
                        </button>
                        <button
                            onClick={handleRetake}
                            className="border-4 border-[var(--poster-ink)] bg-[var(--poster-bg)] px-8 py-3 text-base font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[10px_10px_0_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                        >
                            RETAKE
                        </button>
                        <button
                            onClick={handleStartOver}
                            className="border-4 border-[var(--poster-ink)] bg-white px-8 py-3 text-base font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[10px_10px_0_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                        >
                            START OVER
                        </button>
                    </div>

                    <a 
                        href="https://twitter.com/JyleeRahman" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono'] hover:text-[var(--poster-ink)]"
                    >
                        @JyleeRahman
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Result;

