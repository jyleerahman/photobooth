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
        <div 
            className="fixed inset-0 w-screen h-screen overflow-auto"
            style={{
                backgroundImage: `url(${new URL('../font/nycstreet.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: 'SpaceMono, monospace'
            }}
        >
            {/* Scanline overlay for gritty feel */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
                    pointerEvents: 'none',
                    zIndex: 100
                }}
            />

            {/* Dark overlay for readability */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    pointerEvents: 'none'
                }}
            />

            <div style={{
                position: 'relative',
                zIndex: 1,
                padding: '30px 20px',
                minHeight: '100vh'
            }}>
                {/* Header - Security Cam Style */}
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '2px solid #333',
                    padding: '20px',
                    marginBottom: '30px',
                    maxWidth: '1400px',
                    margin: '0 auto 30px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            color: '#00FF00',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
                        }}>
                            [ FOOTAGE REVIEW ]
                        </div>
                        <div style={{
                            color: '#888',
                            fontSize: '14px',
                            letterSpacing: '1px'
                        }}>
                            {new Date().toLocaleString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            })}
                        </div>
                    </div>
                    
                    <div style={{
                        color: '#FFD700',
                        fontSize: '16px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        SELECT {maxSelection} FRAMES FOR PRINT
                    </div>
                    
                    <div style={{
                        color: selectedImages.length === maxSelection ? '#00FF00' : '#FF4444',
                        fontSize: '14px',
                        marginTop: '8px',
                        letterSpacing: '1px'
                    }}>
                        STATUS: {selectedImages.length}/{maxSelection} SELECTED {selectedImages.length === maxSelection ? '✓' : ''}
                    </div>
                </div>

                {/* Image Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px',
                    maxWidth: '1400px',
                    margin: '0 auto 40px'
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
                                    border: isSelected ? '3px solid #00FF00' : '3px solid #333',
                                    backgroundColor: '#000',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                    boxShadow: isSelected 
                                        ? '0 0 25px rgba(0, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1)' 
                                        : '0 4px 10px rgba(0,0,0,0.5)'
                                }}
                            >
                                {/* Camera Label Bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0,0,0,0.9)',
                                    padding: '8px 12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    zIndex: 2,
                                    borderBottom: '1px solid #333'
                                }}>
                                    <span style={{
                                        color: '#888',
                                        fontSize: '11px',
                                        letterSpacing: '1px'
                                    }}>
                                        CAM {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {isSelected && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: '#00FF00',
                                                borderRadius: '50%',
                                                boxShadow: '0 0 8px rgba(0, 255, 0, 0.8)'
                                            }} />
                                            <span style={{
                                                color: '#00FF00',
                                                fontSize: '11px',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px'
                                            }}>
                                                SELECTED #{selectionOrder + 1}
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
                                        opacity: isSelected ? 1 : 0.6,
                                        transition: 'opacity 0.2s ease',
                                        filter: 'contrast(1.1) saturate(0.9)',
                                        paddingTop: '32px'
                                    }}
                                />
                                
                                {/* Timestamp overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    left: '8px',
                                    backgroundColor: 'rgba(0,0,0,0.85)',
                                    color: '#888',
                                    padding: '4px 10px',
                                    fontSize: '10px',
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

                                {/* Green tint overlay for selected */}
                                {isSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 255, 0, 0.08)',
                                        pointerEvents: 'none',
                                        border: '1px solid rgba(0, 255, 0, 0.3)'
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

                {/* Action Buttons - Control Panel Style */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '40px',
                    maxWidth: '1400px',
                    margin: '40px auto 0',
                    paddingBottom: '30px'
                }}>
                    <button
                        onClick={handleRetake}
                        style={{
                            padding: '18px 45px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#000',
                            color: '#888',
                            border: '2px solid #444',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            fontFamily: 'SpaceMono, monospace',
                            textTransform: 'uppercase',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
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
                        ◄ RETAKE
                    </button>
                    
                    <button
                        onClick={handleContinue}
                        disabled={selectedImages.length !== maxSelection}
                        style={{
                            padding: '18px 45px',
                            fontSize: '16px',
                            cursor: selectedImages.length === maxSelection ? 'pointer' : 'not-allowed',
                            backgroundColor: selectedImages.length === maxSelection ? '#000' : '#0a0a0a',
                            color: selectedImages.length === maxSelection ? '#00FF00' : '#333',
                            border: selectedImages.length === maxSelection ? '2px solid #00FF00' : '2px solid #222',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            fontFamily: 'SpaceMono, monospace',
                            textTransform: 'uppercase',
                            boxShadow: selectedImages.length === maxSelection 
                                ? '0 0 20px rgba(0, 255, 0, 0.3), 0 4px 10px rgba(0,0,0,0.5)' 
                                : '0 4px 10px rgba(0,0,0,0.5)',
                            opacity: selectedImages.length === maxSelection ? 1 : 0.4,
                            transition: 'all 0.2s',
                            textShadow: selectedImages.length === maxSelection ? '0 0 10px rgba(0, 255, 0, 0.5)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#0a0a0a';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5), 0 4px 10px rgba(0,0,0,0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedImages.length === maxSelection) {
                                e.currentTarget.style.backgroundColor = '#000';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3), 0 4px 10px rgba(0,0,0,0.5)';
                            }
                        }}
                    >
                        {selectedImages.length === maxSelection ? 'CONTINUE ►' : `SELECT ${maxSelection - selectedImages.length} MORE`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Selection;

