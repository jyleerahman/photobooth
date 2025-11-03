import { useState, useCallback, useRef, useEffect } from "react";
import React from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const Camera = () => {
    const webcamRef = React.useRef<Webcam>(null);
    const navigate = useNavigate();
    
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [currentPhotoNumber, setCurrentPhotoNumber] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);
    const [showingCapturedImage, setShowingCapturedImage] = useState(false);
    
    const totalPhotos = 8;

    // Function to play camera shutter sound using Web Audio API
    const playShutterSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Create a sharp click sound
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log("Audio play failed:", e);
        }
    }, []);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                // Play shutter sound
                playShutterSound();
                
                // Show flash effect
                setShowFlash(true);
                setTimeout(() => setShowFlash(false), 200);
                
                // Store the image
                setCapturedImages(prev => [...prev, imageSrc]);
                setLastCapturedImage(imageSrc);
                setShowingCapturedImage(true);
                
                // Show captured image for 1 second before continuing
                setTimeout(() => {
                    setShowingCapturedImage(false);
                    setLastCapturedImage(null);
                }, 1000);
            }
        }
    }, [webcamRef, playShutterSound]);

    const startAutomatedCapture = () => {
        setIsCapturing(true);
        setCurrentPhotoNumber(0);
        setCapturedImages([]);
        setCountdown(10);
        setLastCapturedImage(null);
        setShowingCapturedImage(false);
    };

    const stopAutomatedCapture = () => {
        setIsCapturing(false);
        setCurrentPhotoNumber(0);
        setCountdown(10);
        setShowingCapturedImage(false);
    };

    useEffect(() => {
        if (!isCapturing) return;

        // Check if we've taken all 8 photos
        if (currentPhotoNumber >= totalPhotos) {
            setIsCapturing(false);
            setCountdown(10);
            // Navigate to selection page with captured images
            setTimeout(() => {
                navigate('/select', { state: { images: capturedImages } });
            }, 500);
            return;
        }

        // Don't countdown while showing captured image
        if (showingCapturedImage) return;

        // Countdown timer
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        // Take photo when countdown reaches 0
        if (countdown === 0) {
            capture();
            setCurrentPhotoNumber(prev => prev + 1);
            setCountdown(10); // Reset countdown for next photo
        }
    }, [isCapturing, countdown, currentPhotoNumber, capture, navigate, capturedImages, showingCapturedImage]);

    return (
        <>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(5px)'
            }}>
                <h1 style={{ color: 'white', marginBottom: '20px' }}>Photo Booth</h1>
                
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* Webcam */}
                    <Webcam
                        audio={false}
                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={videoConstraints}
                        style={{ 
                            display: showingCapturedImage ? 'none' : 'block',
                            borderRadius: '8px'
                        }}
                    />
                    
                    {/* Show last captured image for 1 second */}
                    {showingCapturedImage && lastCapturedImage && (
                        <img 
                            src={lastCapturedImage} 
                            alt="Just captured"
                            style={{ 
                                width: '1280px',
                                height: '720px',
                                borderRadius: '8px',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                    
                    {/* Flash effect */}
                    {showFlash && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'white',
                            opacity: 0.8,
                            pointerEvents: 'none',
                            borderRadius: '8px'
                        }} />
                    )}
                    
                    {/* Countdown display in top-right corner */}
                    {isCapturing && !showingCapturedImage && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            fontSize: '80px',
                            color: countdown <= 3 ? '#ff4444' : 'white',
                            textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.9)',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            padding: '10px 30px',
                            borderRadius: '10px',
                            minWidth: '120px',
                            textAlign: 'center'
                        }}>
                            {countdown > 0 ? countdown : '📸'}
                        </div>
                    )}
                    
                    {/* Photo counter */}
                    {isCapturing && (
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '24px',
                            color: 'white',
                            textShadow: '0 0 10px rgba(0,0,0,0.9)',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: '10px 20px',
                            borderRadius: '8px'
                        }}>
                            Photo {currentPhotoNumber + 1} of {totalPhotos}
                        </div>
                    )}
                </div>

                {/* Control buttons */}
                <div style={{ marginTop: '20px' }}>
                    {!isCapturing ? (
                        <button 
                            onClick={startAutomatedCapture}
                            style={{ 
                                padding: '20px 40px', 
                                fontSize: '24px',
                                cursor: 'pointer',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            Start Photo Session
                        </button>
                    ) : (
                        <button 
                            onClick={stopAutomatedCapture}
                            style={{ 
                                padding: '15px 30px', 
                                fontSize: '18px',
                                cursor: 'pointer',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            Cancel Session
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Camera;