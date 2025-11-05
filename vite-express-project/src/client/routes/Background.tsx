import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';
type BackgroundStyle = 'graffiti' | 'subway' | 'bodega';

interface LocationState {
    selectedImages: string[];
    frameLayout: FrameLayout;
}

interface BackgroundOption {
    id: BackgroundStyle;
    name: string;
    imageUrl: string;
}

const Background = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    
    const selectedImages = state?.selectedImages || [];
    const frameLayout = state?.frameLayout || 'strip';
    
    const [hoveredBackground, setHoveredBackground] = useState<BackgroundStyle | null>(null);
    const [selectedBackground, setSelectedBackground] = useState<BackgroundStyle>('graffiti');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Background options
    const backgrounds: BackgroundOption[] = [
        { 
            id: 'graffiti', 
            name: 'GRAFFITI WALL',
            imageUrl: new URL('../font/graffiti-wall.jpg', import.meta.url).href
        },
        { 
            id: 'subway', 
            name: 'SUBWAY STATION',
            imageUrl: new URL('../font/newyork-subway.jpg', import.meta.url).href
        },
        { 
            id: 'bodega', 
            name: 'BODEGA',
            imageUrl: new URL('../font/newyorkbodega.jpg', import.meta.url).href
        },
    ];

    // Redirect if no images
    useEffect(() => {
        if (!selectedImages || selectedImages.length !== 4) {
            navigate('/');
        }
    }, [selectedImages, navigate]);

    // Generate preview whenever background changes
    useEffect(() => {
        const currentBg = hoveredBackground || selectedBackground;
        generatePreview(currentBg);
    }, [selectedImages, frameLayout, hoveredBackground, selectedBackground]);

    const generatePreview = async (bgStyle: BackgroundStyle) => {
        if (!canvasRef.current || selectedImages.length !== 4) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use smaller preview size for performance
        const scale = 0.3; // 30% of full size
        
        if (frameLayout === 'bodega-cat') {
            const dpi = 300 * scale;
            const catWidth = 6 * dpi;
            const catHeight = 6 * dpi;
            
            canvas.width = catWidth;
            canvas.height = catHeight;

            // Draw background image
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                const bgImage = new Image();
                bgImage.crossOrigin = "anonymous";
                bgImage.src = bgOption.imageUrl;
                await new Promise((resolve) => { 
                    bgImage.onload = resolve;
                    bgImage.onerror = resolve; // Continue even if bg fails
                });
                ctx.drawImage(bgImage, 0, 0, catWidth, catHeight);
            }

            const padding = 0.3 * dpi;
            const spacing = 0.15 * dpi;
            const bigPhotoWidth = catWidth - (2 * padding);
            const bigPhotoHeight = (catHeight - (2 * padding) - spacing) * 0.6;
            const smallPhotoHeight = (catHeight - (2 * padding) - spacing) * 0.4;
            const smallPhotoWidth = (catWidth - (2 * padding) - (2 * spacing)) / 3;

            // Draw big photo
            const bigImg = new Image();
            bigImg.src = selectedImages[0];
            await new Promise((resolve) => { bigImg.onload = resolve; });

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

            // Draw 3 small photos
            for (let i = 0; i < 3; i++) {
                const smallImg = new Image();
                smallImg.src = selectedImages[i + 1];
                await new Promise((resolve) => { smallImg.onload = resolve; });

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
        } else if (frameLayout === 'strip') {
            const dpi = 300 * scale;
            const stripWidth = 2 * dpi;
            const stripHeight = 8 * dpi;
            
            canvas.width = stripWidth;
            canvas.height = stripHeight;

            // Draw background image
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                const bgImage = new Image();
                bgImage.crossOrigin = "anonymous";
                bgImage.src = bgOption.imageUrl;
                await new Promise((resolve) => { 
                    bgImage.onload = resolve;
                    bgImage.onerror = resolve;
                });
                ctx.drawImage(bgImage, 0, 0, stripWidth, stripHeight);
            }

            const padding = 0.15 * dpi;
            const topBottomPadding = 0.2 * dpi;
            const spacing = 0.1 * dpi;
            const photoWidth = stripWidth - (2 * padding);
            const photoHeight = (stripHeight - (2 * topBottomPadding) - (3 * spacing)) / 4;

            for (let i = 0; i < 4; i++) {
                const img = new Image();
                img.src = selectedImages[i];
                await new Promise((resolve) => { img.onload = resolve; });

                const y = topBottomPadding + (i * (photoHeight + spacing));
                const imgAspect = img.width / img.height;
                const boxAspect = photoWidth / photoHeight;
                let sourceX, sourceY, sourceWidth, sourceHeight;
                
                if (imgAspect > boxAspect) {
                    sourceHeight = img.height;
                    sourceWidth = img.height * boxAspect;
                    sourceX = (img.width - sourceWidth) / 2;
                    sourceY = 0;
                } else {
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
            // Grid layout
            const dpi = 300 * scale;
            const gridSize = 6 * dpi;
            
            canvas.width = gridSize;
            canvas.height = gridSize;

            // Draw background image
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                const bgImage = new Image();
                bgImage.crossOrigin = "anonymous";
                bgImage.src = bgOption.imageUrl;
                await new Promise((resolve) => { 
                    bgImage.onload = resolve;
                    bgImage.onerror = resolve;
                });
                ctx.drawImage(bgImage, 0, 0, gridSize, gridSize);
            }

            const padding = 0.3 * dpi;
            const spacing = 0.15 * dpi;
            const availableSpace = gridSize - (2 * padding) - spacing;
            const photoSize = availableSpace / 2;

            for (let i = 0; i < 4; i++) {
                const img = new Image();
                img.src = selectedImages[i];
                await new Promise((resolve) => { img.onload = resolve; });

                const row = Math.floor(i / 2);
                const col = i % 2;
                const x = padding + (col * (photoSize + spacing));
                const y = padding + (row * (photoSize + spacing));

                const imgAspect = img.width / img.height;
                let sourceX, sourceY, sourceSize;
                
                if (imgAspect > 1) {
                    sourceSize = img.height;
                    sourceX = (img.width - sourceSize) / 2;
                    sourceY = 0;
                } else {
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

    const handleSelectBackground = (bgStyle: BackgroundStyle) => {
        setSelectedBackground(bgStyle);
    };

    const handleContinue = () => {
        navigate('/result', { 
            state: { 
                selectedImages, 
                frameLayout,
                backgroundStyle: selectedBackground
            } 
        });
    };

    return (
        <div 
            className="fixed inset-0 w-screen h-screen overflow-hidden"
            style={{
                backgroundColor: '#f5f5f5',
                backgroundImage: `url(${new URL('../font/newyorkstreet.jpg', import.meta.url).href})`,
                backgroundSize: '50% auto',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="bodega-grain" />

            <div className="relative z-10 h-screen flex flex-col px-8 py-6">
                {/* Header */}
                <div className="px-4 py-4 mb-4 flex-shrink-0">
                    <div className="text-black text-[clamp(2.5rem,4vw,3.5rem)] font-bold uppercase font-['Throwupz'] mb-1 leading-none">
                        CHOOSE BACKGROUND
                    </div>
                    <div className="text-white text-[clamp(0.9rem,1.5vw,1.25rem)] font-bold uppercase tracking-wide font-['Coolvetica']">
                        HOVER TO PREVIEW YOUR PHOTOS
                    </div>
                </div>

                <div className="flex gap-6 flex-1 min-h-0 px-4">
                    {/* Preview on the left */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <div 
                            className="bg-white border-4 border-black p-4"
                            style={{
                                boxShadow: '8px 8px 0 rgba(0,0,0,0.2)',
                            }}
                        >
                            <canvas 
                                ref={canvasRef}
                                style={{
                                    maxWidth: frameLayout === 'strip' ? '200px' : '350px',
                                    maxHeight: '70vh',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>

                    {/* Background options on the right */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="grid grid-cols-1 gap-6 flex-1 min-h-0 content-start overflow-y-auto">
                            {backgrounds.map((bg, index) => (
                                <div
                                    key={bg.id}
                                    onClick={() => handleSelectBackground(bg.id)}
                                    onMouseEnter={() => setHoveredBackground(bg.id)}
                                    onMouseLeave={() => setHoveredBackground(null)}
                                    className="cursor-pointer p-6 transition-all duration-200 hover:scale-105"
                                    style={{
                                        backgroundColor: '#fff',
                                        border: selectedBackground === bg.id ? '4px solid #000' : '3px solid #000',
                                        boxShadow: selectedBackground === bg.id 
                                            ? '10px 10px 0 rgba(0,0,0,0.3)' 
                                            : '6px 6px 0 rgba(0,0,0,0.15)',
                                        height: 'fit-content'
                                    }}
                                >
                                    {/* Number */}
                                    <div className="text-black text-4xl font-bold mb-3"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                            fontWeight: 900
                                        }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    {/* Name */}
                                    <div className="text-black text-xl font-bold mb-4 uppercase tracking-wide"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                            fontWeight: 700
                                        }}
                                    >
                                        {bg.name}
                                    </div>

                                    {/* Preview thumbnail */}
                                    <div 
                                        className="w-full h-32 border-2 border-black bg-cover bg-center"
                                        style={{ 
                                            backgroundImage: `url(${bg.imageUrl})`
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Continue button */}
                <div className="flex justify-center mt-4 pb-4 flex-shrink-0">
                    <button
                        onClick={handleContinue}
                        className="relative transition-all duration-200 hover:scale-105 border-0"
                        style={{
                            width: 'clamp(140px, 20vw, 200px)',
                            height: 'clamp(80px, 11vw, 120px)',
                            backgroundImage: `url(${new URL('../font/oneway.png', import.meta.url).href})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                        }}
                    >
                        <span className="sr-only">CONTINUE</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Background;

