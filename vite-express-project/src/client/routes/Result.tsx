import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type FrameLayout = 'strip' | 'grid';

interface LocationState {
    selectedImages: string[];
    frameLayout: FrameLayout;
}

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const selectedImages = state?.selectedImages || [];
    const frameLayout = state?.frameLayout || 'strip';

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
            if (frameLayout === 'strip') {
                // Classic strip: 2 inches wide x 8 inches tall (at 300 DPI for print quality)
                const dpi = 300;
                const stripWidth = 2 * dpi;  // 600px
                const stripHeight = 8 * dpi; // 2400px
                
                canvas.width = stripWidth;
                canvas.height = stripHeight;

                // White background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, stripWidth, stripHeight);

                // Padding and spacing
                const padding = 0.15 * dpi; // 45px padding on sides
                const topBottomPadding = 0.2 * dpi; // 60px padding top/bottom
                const spacing = 0.1 * dpi; // 30px between photos

                const photoWidth = stripWidth - (2 * padding);
                const photoHeight = (stripHeight - (2 * topBottomPadding) - (3 * spacing)) / 4;

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
                const gridSize = 6 * dpi; // 1800px
                
                canvas.width = gridSize;
                canvas.height = gridSize;

                // White background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, gridSize, gridSize);

                // Padding and spacing
                const padding = 0.3 * dpi; // 90px padding
                const spacing = 0.15 * dpi; // 45px between photos

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
    }, [selectedImages, frameLayout]);

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

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${new URL('../font/nycstreet.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: 'SpaceMono, monospace'
            }}
        >
            {/* Dark overlay */}
            <div className="fixed inset-0 pointer-events-none" 
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9))'
                }}
            />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-[1vh]" style={{ padding: '2vh 2vw' }}>
                {/* Header */}
                <div className="text-center flex-shrink-0">
                    <div 
                        className="text-neon-pink font-bold font-['WhoopieSunday'] -rotate-1 leading-none"
                        style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '0.5vh' }}
                    >
                        YA PHOTO STRIP!
                    </div>
                    <div 
                        className="text-neon-cyan font-['Timegoing'] tracking-wide rotate-1"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}
                    >
                        {frameLayout === 'strip' ? 'classic strip format ✨' : 'square grid format ✨'}
                    </div>
                </div>

                {/* Photo Strip Preview - Constrained height */}
                <div className="flex justify-center flex-shrink flex-grow min-h-0" style={{ maxHeight: '70vh', width: '100%' }}>
                    <div 
                        className="bg-white shadow-2xl"
                        style={{
                            boxShadow: '0 0 40px rgba(255, 20, 147, 0.4), 0 10px 30px rgba(0, 0, 0, 0.7)',
                            transform: 'rotate(-1deg)',
                            maxHeight: '100%',
                            padding: 'clamp(8px, 1vh, 16px)'
                        }}
                    >
                        <canvas 
                            ref={canvasRef}
                            style={{
                                maxWidth: frameLayout === 'strip' ? 'min(25vw, 280px)' : 'min(40vw, 450px)',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex flex-wrap justify-center gap-[2vw] flex-shrink-0">
                    <button
                        onClick={handleDownload}
                        className="font-bold font-['SpaceMono'] uppercase tracking-wider cursor-pointer transition-all duration-300"
                        style={{
                            padding: '1vh 2vw',
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                            backgroundColor: '#000',
                            color: '#00FF00',
                            border: '2px solid #00FF00',
                            boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5)',
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ⬇ DOWNLOAD
                    </button>

                    <button
                        onClick={handleRetake}
                        className="font-bold font-['SpaceMono'] uppercase tracking-wider cursor-pointer transition-all duration-300"
                        style={{
                            padding: '1vh 2vw',
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                            backgroundColor: '#000',
                            color: '#FFD700',
                            border: '2px solid #FFD700',
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5)',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.5)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        📸 NEW PHOTOS
                    </button>

                    <button
                        onClick={handleStartOver}
                        className="font-bold font-['SpaceMono'] uppercase tracking-wider cursor-pointer transition-all duration-300"
                        style={{
                            padding: '1vh 2vw',
                            fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                            backgroundColor: '#000',
                            color: '#888',
                            border: '2px solid #444',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1a1a1a';
                            e.currentTarget.style.borderColor = '#666';
                            e.currentTarget.style.color = '#aaa';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.borderColor = '#444';
                            e.currentTarget.style.color = '#888';
                        }}
                    >
                        ◄ HOME
                    </button>
                </div>

                {/* Fun message - Compact */}
                <div className="text-center flex-shrink-0">
                    <div className="text-neon-gold tracking-wider font-['Timegoing'] opacity-80" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
                        ✨ THANKS FOR VISITING THE NYC PHOTO BOOTH! ✨
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;

