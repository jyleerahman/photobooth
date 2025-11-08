import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

interface LocationState {
    images: string[];
    frameLayout: FrameLayout;
}

const Selection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const images = state?.images || [];
    const frameLayout = state?.frameLayout || 'strip';
    
    const maxSelection = 4;

    // Redirect if no images are available
    useEffect(() => {
        if (!images || images.length === 0) {
            navigate('/camera');
        }
    }, [images, navigate]);

    const toggleImageSelection = (index: number) => {
        setSelectedImages(prev => {
            if (prev.includes(index)) {
                // Deselect
                return prev.filter(i => i !== index);
            } else {
                // Select only if we haven't reached the limit
                if (prev.length < maxSelection) {
                    return [...prev, index];
                }
                return prev;
            }
        });
    };

    const handleContinue = () => {
        const selected = selectedImages.map(index => images[index]);
        // Navigate to background selection page with selected images and frame layout
        navigate('/background', { state: { selectedImages: selected, frameLayout } });
    };

    const handleRetake = () => {
        navigate('/camera');
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)]">
            <div className="bodega-grain" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-6 px-6 py-8">
                <header className="flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono']">
                    <span>SESSION 04 · PICK FOUR</span>
                    <span>DOUBLE-TAP TO DESELECT</span>
                    <span>{selectedImages.length}/{maxSelection} LOCKED</span>
                </header>

                <div className="flex flex-col gap-2">
                    <div className="text-[clamp(2.5rem,5vw,4rem)] font-['WhoopieSunday'] uppercase leading-[0.9] text-white"
                        style={{
                            textShadow:
                                '6px 6px 0 rgba(0,0,0,0.85), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)',
                            WebkitTextStroke: '3px #0f0f0f',
                            color: 'var(--poster-neon)'
                        }}
                    >
                        SELECT YOUR FAVORITES
                    </div>
                    <p className="text-[0.7rem] uppercase tracking-[0.5em] text-[var(--poster-muted)] font-['SpaceMono']">
                        TAP A TILE TO MARK IT · FOUR MAX
                    </p>
                </div>

                {/* Image Grid */}
                <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden md:grid-cols-3" style={{ minHeight: '0' }}>
                    {images.map((image, index) => {
                        const isSelected = selectedImages.includes(index);
                        const selectionOrder = selectedImages.indexOf(index);
                        
                        return (
                            <div
                                key={index}
                                onClick={() => toggleImageSelection(index)}
                                className={`relative flex min-h-[160px] cursor-pointer overflow-hidden border-4 border-[var(--poster-ink)] bg-white shadow-[8px_8px_0_rgba(0,0,0,0.65)] transition-transform duration-200 ${isSelected ? '-translate-x-1 -translate-y-1' : ''}`}
                            >
                                <img
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    className={`h-full w-full object-cover transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                />
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-[var(--poster-neon)] text-[var(--poster-ink)] px-3 py-2 text-sm font-bold tracking-[0.3em] shadow-[4px_4px_0_rgba(0,0,0,0.6)]"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif'
                                        }}>
                                        {selectionOrder + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
 
                 {/* Action Buttons - STREET SIGN BUTTONS */}
                <div className="flex justify-center pb-4">
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        className={`relative border-4 border-[var(--poster-ink)] px-10 py-5 text-base font-['WhoopieSunday'] uppercase tracking-[0.2em] transition-transform duration-200 ${selectedImages.length === maxSelection ? 'bg-[var(--poster-neon)] shadow-[10px_10px_0_rgba(0,0,0,0.8)] hover:-translate-x-1 hover:-translate-y-1 cursor-pointer' : 'bg-[var(--poster-bg)] text-[var(--poster-muted)] shadow-[6px_6px_0_rgba(0,0,0,0.3)] cursor-not-allowed'}`}
                    >
                        {selectedImages.length === maxSelection ? 'CONTINUE' : `SELECT ${maxSelection - selectedImages.length} MORE`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;

