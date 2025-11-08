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
        <div 
            className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#f5f5f5]"
        >
            {/* Film grain texture */}
            <div className="bodega-grain" />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4" style={{ padding: '1.5rem' }}>
                {/* Header - MINIMAL GRAFFITI */}
                <div className="text-center flex-shrink-0">
                    <div 
                        className="text-black font-bold font-['WhoopieSunday'] leading-tight"
                        style={{ 
                            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                            marginBottom: '0.5rem',
                            textShadow: '2px 2px 0 rgba(0,0,0,0.08)'
                        }}
                    >
                        YOUR PHOTOS
                    </div>
                    
                </div>

                {/* Photo Strip Preview - MINIMAL FRAMING */}
                <div className="flex justify-center flex-shrink flex-grow min-h-0 gap-6" style={{ maxHeight: '80vh', width: '100%' }}>
                    <div 
                        className="border-4 border-black"
                        style={{
                            boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
                            maxHeight: '100%'
                        }}
                    >
                        <canvas 
                            ref={canvasRef}
                            style={{
                                maxWidth: frameLayout === 'strip' ? '260px' : '450px',
                                maxHeight: '60vh',
                                width: 'auto',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </div>
                    
                    {/* QR Code and Share Section */}
                    {qrCodeDataUrl && shareUrl && (
                        <div className="flex flex-col items-center gap-4" style={{ maxWidth: '300px' }}>
                            <div className="text-center">
                                <div className="text-black text-lg font-bold uppercase font-['Coolvetica'] mb-2"
                                    style={{ fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif' }}>
                                    SCAN TO DOWNLOAD
                                </div>
                                <div className="bg-white p-4 rounded-lg border-4 border-black"
                                    style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}>
                                    <img src={qrCodeDataUrl} alt="QR Code" className="w-full max-w-[200px] h-auto" />
                                </div>
                                
                            </div>
                            
                            {/* Social Sharing Buttons */}
                            <div className="flex flex-col gap-3 mt-4 w-full">
                                <button
                                    onClick={handleShareX}
                                    className="relative transition-all duration-200 hover:scale-105 border-0"
                                    style={{
                                        width: '100%',
                                        minWidth: '200px',
                                        height: 'clamp(50px, 8vw, 70px)',
                                        backgroundImage: `url(${new URL('../font/greenplate.png', import.meta.url).href})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center font-['Coolvetica'] text-[clamp(1rem, 2vw, 1.2rem)] font-bold text-white uppercase tracking-[0.15rem]"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                            fontWeight: 700
                                        }}
                                    >
                                        SHARE ON X
                                    </div>
                                </button>
                                <button
                                    onClick={handleShareInstagram}
                                    className="relative transition-all duration-200 hover:scale-105 border-0"
                                    style={{
                                        width: '100%',
                                        minWidth: '200px',
                                        height: 'clamp(50px, 8vw, 70px)',
                                        backgroundImage: `url(${new URL('../font/greenplate.png', import.meta.url).href})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center font-['Coolvetica'] text-[clamp(1rem, 2vw, 1.2rem)] font-bold text-white uppercase tracking-[0.15rem]"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                            fontWeight: 700
                                        }}
                                    >
                                        SHARE ON IG
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {isUploading && (
                        <div className="flex items-center justify-center">
                            <div className="text-black font-bold uppercase font-['Coolvetica']"
                                style={{ fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif' }}>
                                Uploading...
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons - STREET SIGN BUTTONS */}
                <div className="flex flex-wrap justify-center gap-80 flex-shrink-0 items-center">
                    <button
                        onClick={handleDownload}
                        className="relative transition-all duration-200 hover:scale-105 border-0"
                        style={{
                            width: 'clamp(200px, 25vw, 300px)',
                            height: 'clamp(60px, 8vw, 90px)',
                            backgroundImage: `url(${new URL('../font/greenplate.png', import.meta.url).href})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center font-['Coolvetica'] text-[clamp(2rem,2.2vw,1.5rem)] font-bold text-white uppercase tracking-[0.2rem]"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            DOWNLOAD
                        </div>
                    </button>

                    <button
                        onClick={handleStartOver}
                        className="relative transition-all duration-200 hover:scale-105 border-0"
                        style={{
                            width: 'clamp(140px, 20vw, 200px)',
                            height: 'clamp(80px, 11vw, 120px)',
                            backgroundImage: `url(${new URL('../font/yellowarrow.png', import.meta.url).href})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center font-['Coolvetica'] text-[clamp(0.9rem,2vw,1.3rem)] font-bold text-black uppercase tracking-[0.2em]"
                            style={{
                                textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
                                fontWeight: 700
                            }}
                        >
                            
                        </div>
                    </button>
                </div>

                {/* Twitter Credit */}
                <div className="text-center mt-6 flex-shrink-0">
                    <a 
                        href="https://twitter.com/JyleeRahman" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black font-bold font-['Coolvetica'] text-sm hover:underline"
                        style={{ 
                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                        }}
                    >
                        @JyleeRahman
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Result;

