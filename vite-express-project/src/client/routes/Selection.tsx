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
            {/* Film grain texture */}
            <div className="bodega-grain" />

            <div className="relative z-10 h-screen flex flex-col px-8 py-6">
                {/* Header - GRAFFITI STYLE */}
                <div className="px-4 py-4 mb-4 flex-shrink-0">
                    <div className="text-black text-[clamp(2.5rem,4vw,3.5rem)] font-bold uppercase font-['Throwupz'] mb-1 leading-none"
                       >
                        SELECT {maxSelection} PHOTOS
                    </div>
                    
                

                    <div className="text-white text-[clamp(0.9rem,1.5vw,1.25rem)] font-bold uppercase tracking-wide font-['Coolvetica']">
                        TAP TO SELECT YOUR FAVORITES 
                    </div>

                    <div className="text-white text-[clamp(0.75rem,1.2vw,1rem)] tracking-[0.2em] font-['Coolvetica']">
                        {selectedImages.length}/{maxSelection}
                    </div>
                </div>

                {/* Image Grid - 3 COLUMNS x 2 ROWS for 6 photos */}
                <div className="grid grid-cols-3 gap-4 px-4" style={{ 
                    gridAutoRows: 'minmax(0, 1fr)',
                    height: 'calc(100vh - 280px)' 
                }}>
                    {images.map((image, index) => {
                        const isSelected = selectedImages.includes(index);
                        const selectionOrder = selectedImages.indexOf(index);
                        
                        return (
                            <div
                                key={index}
                                onClick={() => toggleImageSelection(index)}
                                className="relative cursor-pointer overflow-hidden transition-all duration-200 w-full h-full"
                            >
                                <img
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    className={`w-full h-full object-cover block transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                />
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 bg-black text-white px-3 py-2 text-sm font-bold tracking-wider"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                            boxShadow: '3px 3px 0 rgba(0,0,0,0.2)'
                                        }}>
                                        {selectionOrder + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons - STREET SIGN BUTTONS */}
                <div className="flex justify-center mb-4 pb-4 flex-shrink-0">
                    {selectedImages.length === maxSelection && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Selection;

