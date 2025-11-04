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
                    <div className="text-white text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase font-['Throwupz'] mb-2 leading-none"
                        style={{
                            textShadow: '4px 4px 0 rgba(0,0,0,0.3)'
                        }}>
                        SELECT {maxSelection} PHOTOS
                    </div>
                    
                    <div className="text-white text-[clamp(0.85rem,1.5vw,1rem)] tracking-[0.2em]"
                        style={{
                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                            textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
                        }}>
                        {selectedImages.length}/{maxSelection}
                    </div>
                </div>

                {/* Image Grid - MINIMAL */}
                <div className="grid gap-6 flex-grow flex-shrink min-h-0 overflow-y-auto py-2"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))'
                    }}>
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
                                    className={`w-full h-auto block transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-60'}`}
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

                {/* Action Buttons - GRAFFITI STYLE */}
                <div className="flex justify-center gap-16 mt-8 pb-8 flex-shrink-0">
                    <button
                        onClick={handleRetake}
                        className="text-orange-500 font-bold fuppercase transition-all duration-200 hover:scale-110 bg-transparent border-0"
                        style={{
                            fontFamily: 'Graffiti, sans-serif',
                            fontSize: '35px',
                            textShadow: '5px 5px 0 rgba(0,0,0,0.6)',
                            background: 'none'
                        }}
                    >
                        RETAKE
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        className={`font-bold uppercase transition-all duration-200 bg-transparent border-0 ${
                            selectedImages.length === maxSelection 
                                ? 'text-orange-500 cursor-pointer hover:scale-110' 
                                : 'text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                        style={{
                            fontFamily: 'Graffiti, sans-serif',
                            fontSize: '35px',
                            textShadow: selectedImages.length === maxSelection 
                                ? '5px 5px 0 rgba(0,0,0,0.6)' 
                                : '2px 2px 0 rgba(0,0,0,0.2)',
                            background: 'none'
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

