import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LocationState {
    images: string[];
}

const Selection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const images = state?.images || [];
    
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
        // TODO: Navigate to next page with selected images
        console.log('Selected images:', selected);
        // For now, just log. You can add navigation to frame page later
        navigate('/frame', { state: { selectedImages: selected } });
    };

    const handleRetake = () => {
        navigate('/camera');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(5px)',
            padding: '40px 20px',
            color: 'white'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '10px',
                    fontSize: '36px'
                }}>
                    Select Your Favorite 4 Photos
                </h1>
                
                <p style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '20px',
                    color: '#888'
                }}>
                    {selectedImages.length} of {maxSelection} selected
                </p>

                {/* Image Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {images.map((image, index) => {
                        const isSelected = selectedImages.includes(index);
                        const selectionOrder = selectedImages.indexOf(index);
                        
                        return (
                            <div
                                key={index}
                                onClick={() => toggleImageSelection(index)}
                                style={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: isSelected ? '4px solid #4CAF50' : '4px solid transparent',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                    boxShadow: isSelected 
                                        ? '0 0 20px rgba(76, 175, 80, 0.5)' 
                                        : '0 4px 6px rgba(0,0,0,0.3)'
                                }}
                            >
                                <img
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        opacity: isSelected ? 1 : 0.7,
                                        transition: 'opacity 0.2s ease'
                                    }}
                                />
                                
                                {/* Selection badge */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                    }}>
                                        {selectionOrder + 1}
                                    </div>
                                )}
                                
                                {/* Photo number */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '10px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '5px 12px',
                                    borderRadius: '5px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}>
                                    Photo {index + 1}
                                </div>

                                {/* Checkmark overlay for selected */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                        pointerEvents: 'none'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '40px'
                }}>
                    <button
                        onClick={handleRetake}
                        style={{
                            padding: '15px 40px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#777'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#666'}
                    >
                        Retake Photos
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        style={{
                            padding: '15px 40px',
                            fontSize: '18px',
                            cursor: selectedImages.length === maxSelection ? 'pointer' : 'not-allowed',
                            backgroundColor: selectedImages.length === maxSelection ? '#4CAF50' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                            opacity: selectedImages.length === maxSelection ? 1 : 0.5,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#45a049';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#4CAF50';
                            }
                        }}
                    >
                        Continue {selectedImages.length === maxSelection ? '→' : `(${selectedImages.length}/${maxSelection})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;

