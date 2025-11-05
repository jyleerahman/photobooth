import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

    // Generate the photo strip
    useEffect(() => {
        if (!canvasRef.current || selectedImages.length !== 4) return;

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

        generatePhotoStrip();
    }, [selectedImages, frameLayout, backgroundStyle]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        
        const link = document.createElement('a');
        link.download = `photobooth-${frameLayout}-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
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
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
            style={{
                backgroundColor: '#f5f5f5',
                backgroundImage: `url(${new URL('../font/newyorkstreet.jpg', import.meta.url).href})`,
                backgroundSize: '50% auto',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Film grain texture */}
            <div className="bodega-grain" />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-4" style={{ padding: '1.5rem' }}>
                {/* Header - MINIMAL GRAFFITI */}
                <div className="text-center flex-shrink-0">
                    <div 
                        className="text-black font-bold font-['Throwupz'] leading-none"
                        style={{ 
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            marginBottom: '0.5rem'
                        }}
                    >
                        YOUR PHOTOS
                    </div>
                    
                </div>

                {/* Photo Strip Preview - MINIMAL FRAMING */}
                <div className="flex justify-center flex-shrink flex-grow min-h-0" style={{ maxHeight: '80vh', width: '100%' }}>
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
                        onClick={handleRetake}
                        className="relative transition-all duration-200 hover:scale-105 border-0"
                        style={{
                            width: 'clamp(110px, 16vw, 160px)',
                            height: 'clamp(110px, 16vw, 160px)',
                            backgroundImage: `url(${new URL('../font/stop.png', import.meta.url).href})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                        }}
                    >
                        <span className="sr-only">RETAKE</span>
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
            </div>
        </div>
    );
};

export default Result;

