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
            className="fixed inset-0 w-screen h-screen overflow-hidden font-['SpaceMono']"
            style={{
                backgroundColor: '#0a0a0a'
            }}
        >
            {/* Gritty Film Effects */}
            <div className="bodega-scanlines" />
            <div className="bodega-vhs-effect" />
            <div className="bodega-grain" />

            {/* Dark overlay */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    pointerEvents: 'none'
                }}
            />

            <div style={{
                position: 'relative',
                zIndex: 1,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5vh 2vw'
            }}>
                {/* Header - RAW GRAFFITI STYLE */}
                <div style={{
                    backgroundColor: '#000',
                    border: '4px solid rgba(255,20,147,0.5)',
                    padding: '2vh 2.5vw',
                    marginBottom: '1.5vh',
                    flexShrink: 0,
                    boxShadow: '6px 6px 0 rgba(255,20,147,0.3), 10px 10px 20px rgba(0,0,0,0.8)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.8vh'
                    }}>
                        <div style={{
                            color: '#fff',
                            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                            fontWeight: 'bold',
                            letterSpacing: '3px',
                            textShadow: '3px 3px 0 #000, -1px -1px 0 #000',
                            textTransform: 'uppercase',
                            fontFamily: 'Graffiti, monospace'
                        }}>
                            ▶ PICK YA SHOTS
                        </div>
                        <div style={{
                            color: '#666',
                            fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                            letterSpacing: '1px',
                            textTransform: 'uppercase'
                        }}>
                            {new Date().toLocaleString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            })}
                        </div>
                    </div>
                    
                    <div style={{
                        color: '#fff',
                        fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                    }}>
                        CHOOSE {maxSelection} PHOTOS
                    </div>
                    
                    <div style={{
                        color: selectedImages.length === maxSelection ? '#00FF00' : '#FF1493',
                        fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
                        marginTop: '0.8vh',
                        letterSpacing: '2px',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 0 rgba(0,0,0,0.9)',
                        textTransform: 'uppercase'
                    }}>
                        {selectedImages.length}/{maxSelection} PICKED {selectedImages.length === maxSelection ? '✓' : ''}
                    </div>
                </div>

                {/* Image Grid - CHUNKY */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                    gap: '2vh',
                    flexGrow: 1,
                    flexShrink: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '1vh 0'
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
                                    border: isSelected ? '5px solid #FF1493' : '5px solid #222',
                                    backgroundColor: '#000',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: isSelected 
                                        ? '0 0 30px rgba(255, 20, 147, 0.6), 6px 6px 0 rgba(255, 20, 147, 0.4), inset 0 0 20px rgba(255, 20, 147, 0.1)' 
                                        : '0 4px 15px rgba(0,0,0,0.7)'
                                }}
                            >
                                {/* Label Bar - RAW */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#000',
                                    padding: '0.8vh 1.2vw',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    zIndex: 2,
                                    borderBottom: isSelected ? '3px solid #FF1493' : '3px solid #222'
                                }}>
                                    <span style={{
                                        color: '#666',
                                        fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
                                        letterSpacing: '1px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        #{String(index + 1).padStart(2, '0')}
                                    </span>
                                    {isSelected && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5vw'
                                        }}>
                                            <div style={{
                                                width: 'clamp(8px, 1.2vw, 10px)',
                                                height: 'clamp(8px, 1.2vw, 10px)',
                                                backgroundColor: '#FF1493',
                                                borderRadius: '50%',
                                                boxShadow: '0 0 10px rgba(255, 20, 147, 0.9)'
                                            }} />
                                            <span style={{
                                                color: '#FF1493',
                                                fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px',
                                                textShadow: '2px 2px 0 rgba(0,0,0,0.8)',
                                                textTransform: 'uppercase'
                                            }}>
                                                PICK #{selectionOrder + 1}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <img
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        opacity: isSelected ? 1 : 0.5,
                                        transition: 'opacity 0.2s ease',
                                        filter: isSelected 
                                            ? 'contrast(1.2) saturate(1.1) brightness(1.05)' 
                                            : 'contrast(1.1) saturate(0.8) brightness(0.9)',
                                        paddingTop: '38px'
                                    }}
                                />
                                
                                {/* Timestamp overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0.5vh',
                                    left: '0.5vw',
                                    backgroundColor: 'rgba(0,0,0,0.85)',
                                    color: '#888',
                                    padding: '0.3vh 0.8vw',
                                    fontSize: 'clamp(0.5rem, 1vw, 0.625rem)',
                                    letterSpacing: '1px',
                                    fontFamily: 'SpaceMono, monospace',
                                    border: '1px solid #333'
                                }}>
                                    {new Date(Date.now() - (images.length - index) * 6000).toLocaleString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit', 
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </div>

                                {/* Pink tint overlay for selected */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(255, 20, 147, 0.1)',
                                        pointerEvents: 'none',
                                        border: '2px solid rgba(255, 20, 147, 0.4)'
                                    }} />
                                )}

                                {/* Hover effect */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    pointerEvents: 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.3'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons - CHUNKY STYLE */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3vw',
                    marginTop: '1.5vh',
                    paddingBottom: '1.5vh',
                    flexShrink: 0
                }}>
                    <button
                        onClick={handleRetake}
                        style={{
                            padding: '1.5vh 3.5vw',
                            fontSize: 'clamp(0.8rem, 2.2vw, 1.1rem)',
                            cursor: 'pointer',
                            backgroundColor: '#000',
                            color: '#888',
                            border: '4px solid #333',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            fontFamily: 'Graffiti, monospace',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            boxShadow: '4px 4px 0 rgba(0,0,0,0.6), 8px 8px 15px rgba(0,0,0,0.7)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1a1a1a';
                            e.currentTarget.style.borderColor = '#555';
                            e.currentTarget.style.color = '#aaa';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.borderColor = '#333';
                            e.currentTarget.style.color = '#888';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        ◄ RETAKE
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        style={{
                            padding: '1.5vh 3.5vw',
                            fontSize: 'clamp(0.8rem, 2.2vw, 1.1rem)',
                            cursor: selectedImages.length === maxSelection ? 'pointer' : 'not-allowed',
                            backgroundColor: selectedImages.length === maxSelection ? '#FF1493' : '#1a1a1a',
                            color: selectedImages.length === maxSelection ? '#fff' : '#333',
                            border: selectedImages.length === maxSelection ? '4px solid #fff' : '4px solid #222',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            fontFamily: 'Graffiti, monospace',
                            textTransform: 'uppercase',
                            boxShadow: selectedImages.length === maxSelection 
                                ? '6px 6px 0 rgba(0,0,0,0.8), 0 0 30px rgba(255, 20, 147, 0.6), 10px 10px 20px rgba(0,0,0,0.7)' 
                                : '4px 4px 0 rgba(0,0,0,0.6), 8px 8px 15px rgba(0,0,0,0.7)',
                            opacity: selectedImages.length === maxSelection ? 1 : 0.4,
                            transition: 'all 0.2s',
                            textShadow: selectedImages.length === maxSelection ? '3px 3px 0 rgba(0,0,0,0.8)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#FF006E';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#FF1493';
                                e.currentTarget.style.transform = 'scale(1)';
                            }
                        }}
                    >
                        {selectedImages.length === maxSelection ? 'CONTINUE ►' : `PICK ${maxSelection - selectedImages.length} MORE`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;

