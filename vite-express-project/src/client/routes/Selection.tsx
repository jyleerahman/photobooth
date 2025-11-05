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
        // Navigate to result page with selected images and frame layout
        navigate('/result', { state: { selectedImages: selected, frameLayout } });
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

            <div className="relative z-10 h-screen flex flex-col px-12 py-8">
                {/* Header - GRAFFITI STYLE */}
                <div className="px-8 py-6 mb-8 flex-shrink-0">
                    <div className="text-black text-[clamp(6rem,5vw,3.5rem)] font-bold uppercase font-['Throwupz'] mb-2 leading-none"
                       >
                        SELECT {maxSelection} PHOTOS
                    </div>
                    
                

                    <div className="text-white text-[clamp(1rem,2vw,1.25rem)] font-bold uppercase tracking-wide font-['Coolvetica']">
                        TAP TO SELECT YOUR FAVORITES 
                    </div>

                    <div className="text-white text-[clamp(0.85rem,1.5vw,1rem)] tracking-[0.2em] -mb-10 font-['Coolvetica']">
                        {selectedImages.length}/{maxSelection}
                    </div>
                </div>

                {/* Image Grid - 3x3 LAYOUT */}
                <div className="grid grid-cols-3 gap-6 flex-grow flex-shrink min-h-0 overflow-y-auto py-2">
                    {images.map((image, index) => {
                        const isSelected = selectedImages.includes(index);
                        const selectionOrder = selectedImages.indexOf(index);
                        
                        return (
                            <div
                                key={index}
                                onClick={() => toggleImageSelection(index)}
                                className="relative cursor-pointer overflow-hidden transition-all duration-200"
                            >
                                <img
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    className={`w-full h-auto block transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
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

                {/* Action Buttons - MINIMAL BLACK BUTTONS */}
                <div className="flex justify-center gap-8 mt-8 pb-8 flex-shrink-0">
                    <button
                        onClick={handleRetake}
                        className="text-[clamp(1rem,2.5vw,1.25rem)] font-bold text-white px-12 py-3 border-4 border-black transition-all duration-200 hover:scale-105 uppercase tracking-[0.3em]"
                        style={{
                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                            backgroundColor: '#000',
                            boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
                            letterSpacing: '0.3em',
                            fontWeight: 700
                        }}
                    >
                        RETAKE
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        className={`text-[clamp(1rem,2.5vw,1.25rem)] font-bold px-12 py-3 border-4 transition-all duration-200 uppercase tracking-[0.3em] ${
                            selectedImages.length === maxSelection 
                                ? 'text-white border-black hover:scale-105 cursor-pointer' 
                                : 'text-gray-400 border-gray-400 cursor-not-allowed opacity-50'
                        }`}
                        style={{
                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                            backgroundColor: selectedImages.length === maxSelection ? '#000' : '#666',
                            boxShadow: selectedImages.length === maxSelection 
                                ? '6px 6px 0 rgba(0,0,0,0.2)' 
                                : '3px 3px 0 rgba(0,0,0,0.1)',
                            letterSpacing: '0.3em',
                            fontWeight: 700
                        }}
                    >
                        {selectedImages.length === maxSelection ? 'CONTINUE' : `SELECT ${maxSelection - selectedImages.length} MORE`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;

