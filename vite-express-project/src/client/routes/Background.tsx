import { useEffect, useRef, useState, CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';
type BackgroundStyle = 'graffiti' | 'subway' | 'bodega' | 'white' | 'black' | 'neon';

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
            imageUrl: new URL('../font/subway-wall.jpg', import.meta.url).href
        },
        { 
            id: 'bodega', 
            name: 'BODEGA',
            imageUrl: new URL('../font/bodega-cat.jpg', import.meta.url).href
        },
        { 
            id: 'white', 
            name: 'WHITE',
            imageUrl: '' // Solid color, no image
        },
        { 
            id: 'black', 
            name: 'BLACK',
            imageUrl: '' // Solid color, no image
        },
        { 
            id: 'neon', 
            name: 'NEON LIGHTS',
            imageUrl: '' // Gradient, no image
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
        generatePreview(selectedBackground);
    }, [selectedImages, frameLayout, selectedBackground]);

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

            // Draw background
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                if (bgStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else if (bgStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else if (bgStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, catWidth, catHeight);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, catWidth, catHeight);
                } else if (bgOption.imageUrl) {
                    const bgImage = new Image();
                    bgImage.crossOrigin = "anonymous";
                    bgImage.src = bgOption.imageUrl;
                    await new Promise((resolve) => { 
                        bgImage.onload = resolve;
                        bgImage.onerror = resolve; // Continue even if bg fails
                    });
                    ctx.drawImage(bgImage, 0, 0, catWidth, catHeight);
                }
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

            // Draw background
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                if (bgStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else if (bgStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else if (bgStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, stripWidth, stripHeight);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, stripWidth, stripHeight);
                } else if (bgOption.imageUrl) {
                    const bgImage = new Image();
                    bgImage.crossOrigin = "anonymous";
                    bgImage.src = bgOption.imageUrl;
                    await new Promise((resolve) => { 
                        bgImage.onload = resolve;
                        bgImage.onerror = resolve;
                    });
                    ctx.drawImage(bgImage, 0, 0, stripWidth, stripHeight);
                }
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

            // Draw background
            const bgOption = backgrounds.find(bg => bg.id === bgStyle);
            if (bgOption) {
                if (bgStyle === 'white') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else if (bgStyle === 'black') {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else if (bgStyle === 'neon') {
                    const gradient = ctx.createLinearGradient(0, 0, gridSize, gridSize);
                    gradient.addColorStop(0, '#FF00FF');
                    gradient.addColorStop(0.25, '#00FFFF');
                    gradient.addColorStop(0.5, '#FF00FF');
                    gradient.addColorStop(0.75, '#FFFF00');
                    gradient.addColorStop(1, '#FF00FF');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, gridSize, gridSize);
                } else if (bgOption.imageUrl) {
                    const bgImage = new Image();
                    bgImage.crossOrigin = "anonymous";
                    bgImage.src = bgOption.imageUrl;
                    await new Promise((resolve) => { 
                        bgImage.onload = resolve;
                        bgImage.onerror = resolve;
                    });
                    ctx.drawImage(bgImage, 0, 0, gridSize, gridSize);
                }
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
        <div className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)]">
            <div className="bodega-grain" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 py-8">
                <header className="flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono']">
                    <span>SESSION 05 · BACKDROP LAB</span>
                    <span>PREVIEW UPDATES INSTANTLY</span>
                    <span>{selectedBackground.toUpperCase()} MODE</span>
                </header>

                <div className="text-center">
                    <div className="mx-auto text-white text-[clamp(2.1rem,4.5vw,4rem)] font-bold uppercase font-['WhoopieSunday'] leading-[0.9]"
                        style={{
                            textShadow: '6px 6px 0 rgba(0,0,0,0.85), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)',
                            WebkitTextStroke: '3px #0f0f0f',
                            color: 'var(--poster-neon)'
                        }}
                    >
                        CHOOSE BACKGROUND
                    </div>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.45em] text-[var(--poster-muted)] font-['SpaceMono']">
                        TAP A TILE TO TRY IT ON YOUR LAYOUT
                    </p>
                </div>

                <div className="flex flex-1 flex-col gap-8 overflow-hidden lg:flex-row">
                    <div className="flex flex-1 items-center justify-center overflow-hidden">
                        <div className="border-4 border-[var(--poster-ink)] bg-white p-5 shadow-[12px_12px_0_rgba(0,0,0,0.75)]">
                            <canvas 
                                ref={canvasRef}
                                style={{
                                    maxWidth: frameLayout === 'strip' ? '300px' : '480px',
                                    maxHeight: '62vh',
                                    width: 'auto',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-4 overflow-hidden sm:grid-cols-3">
                        {backgrounds.map((bg, index) => {
                            const isSelected = selectedBackground === bg.id;
                            const previewStyle: CSSProperties = bg.imageUrl
                                ? {
                                    backgroundImage: `url(${bg.imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }
                                : bg.id === 'white'
                                    ? { backgroundColor: '#ffffff' }
                                    : bg.id === 'black'
                                        ? { backgroundColor: '#101010', color: '#f9f9f9' }
                                        : { background: 'linear-gradient(135deg,#FF00FF 0%,#00FFFF 50%,#FFFF00 100%)', color: '#0f0f0f' };

                            return (
                                <button
                                    key={bg.id}
                                    onClick={() => handleSelectBackground(bg.id)}
                                    className={`group flex h-36 flex-col items-center justify-between border-4 border-[var(--poster-ink)] px-4 py-3 text-center shadow-[8px_8px_0_rgba(0,0,0,0.65)] transition-transform duration-200 ${isSelected ? '-translate-x-1 -translate-y-1 bg-white' : 'bg-[var(--poster-bg)] hover:-translate-x-1 hover:-translate-y-1'}`}
                                    style={previewStyle}
                                >
                                    <span className="text-[0.7rem] font-['SpaceMono'] uppercase tracking-[0.45em] opacity-70">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-['Coolvetica'] text-sm font-bold uppercase tracking-[0.3em]">
                                        {bg.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-center pb-4">
                    <button
                        onClick={handleContinue}
                        className="border-4 border-[var(--poster-ink)] bg-[var(--poster-neon)] px-12 py-5 text-base font-['WhoopieSunday'] uppercase tracking-[0.25em] text-[var(--poster-ink)] shadow-[12px_12px_0_rgba(0,0,0,0.8)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Background;

