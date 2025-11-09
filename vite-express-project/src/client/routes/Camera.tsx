import { useState, useCallback, useRef, useEffect } from "react";
import React from "react";
import Webcam from "react-webcam";
import { useNavigate, useLocation } from "react-router-dom";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

interface LocationState {
    frameLayout: FrameLayout;
}

const Camera = () => {
    const webcamRef = React.useRef<Webcam>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const frameLayout = state?.frameLayout || 'strip';
    
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [currentPhotoNumber, setCurrentPhotoNumber] = useState(0);
    const [showFlash, setShowFlash] = useState(false);
    const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);
    const [showingCapturedImage, setShowingCapturedImage] = useState(false);
    
    const totalPhotos = 4;

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
        setCountdown(5);
        setLastCapturedImage(null);
        setShowingCapturedImage(false);
    };

    const stopAutomatedCapture = () => {
        setIsCapturing(false);
        setCurrentPhotoNumber(0);
        setCountdown(5);
        setShowingCapturedImage(false);
    };

    useEffect(() => {
        if (!isCapturing) return;

        // Check if we've taken all 4 photos
        if (currentPhotoNumber >= totalPhotos) {
            setIsCapturing(false);
            setCountdown(5);
            // Navigate directly to background page with all captured images and frame layout
            setTimeout(() => {
                navigate('/background', { state: { selectedImages: capturedImages, frameLayout } });
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
            setCountdown(5); // Reset countdown for next photo
        }
    }, [isCapturing, countdown, currentPhotoNumber, capture, navigate, capturedImages, showingCapturedImage]);

    return (
        <div 
            className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)] flex items-center justify-center"
        >
            <div className="bodega-grain" />
            {/* Single Active Camera Feed */}
            <div className="relative w-[80vw] h-[72vh] max-w-[1100px] max-h-[640px] border-[6px] border-[var(--poster-ink)] bg-white shadow-[16px_16px_0_rgba(0,0,0,0.85)]">
                {/* Camera Label Bar - RAW STYLE */}
                <div className="absolute top-0 left-0 right-0 bg-[var(--poster-ink)] z-20 py-3 px-4 border-b-4 border-[var(--poster-ink)]">
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--poster-bg)] text-base font-bold tracking-[0.4em] uppercase font-['SpaceMono']" style={{ 
                            textShadow: 'none'
                        }}>
                            ▶ CAM {String(currentPhotoNumber + 1).padStart(2, '0')}
                        </span>
                        {isCapturing && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" style={{
                                    boxShadow: '0 0 15px rgba(255, 0, 0, 0.9)'
                                }}></div>
                                <span className="text-red-500 text-sm font-bold uppercase font-['SpaceMono']" style={{ 
                                    textShadow: '0 0 8px rgba(255, 0, 0, 0.7)'
                                }}>REC</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Webcam Feed */}
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                    style={{
                        filter: 'contrast(1.1) saturate(1) brightness(1)'
                    }}
                />

                {/* Countdown overlay - BOLD */}
                {isCapturing && countdown > 0 && !showingCapturedImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/45 z-10">
                        <div 
                            className={`text-[220px] font-bold font-['WhoopieSunday'] ${
                                countdown <= 3 ? 'text-[var(--poster-neon)]' : 'text-[var(--poster-neon)]'
                            }`}
                            style={{ 
                                textShadow: '8px 8px 0 rgba(0,0,0,0.9), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)',
                                WebkitTextStroke: '4px #0f0f0f',
                                paintOrder: 'stroke fill'
                            }}
                        >
                            {countdown}
                        </div>
                    </div>
                )}

                {/* Flash effect */}
                {showFlash && (
                    <div className="absolute inset-0 bg-white opacity-80 pointer-events-none z-10" />
                )}

                {/* Show captured image briefly */}
                {showingCapturedImage && lastCapturedImage && (
                    <img 
                        src={lastCapturedImage} 
                        alt="Just captured"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                )}

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-[var(--poster-ink)] z-20 py-3 px-4 border-t-4 border-[var(--poster-ink)]">
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--poster-bg)]/60 text-xs font-bold uppercase font-['SpaceMono']" style={{ 
                            textShadow: 'none'
                        }}>
                            {new Date().toLocaleString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit',
                                hour12: false 
                            })}
                        </span>
                        {isCapturing && (
                            <span className="text-[var(--poster-bg)] text-xs font-bold uppercase font-['SpaceMono']" style={{ 
                                textShadow: 'none'
                            }}>
                                {currentPhotoNumber + 1}/{totalPhotos}
                            </span>
                        )}
                        {!isCapturing && (
                            <span className="text-[var(--poster-bg)]/60 text-xs uppercase font-['SpaceMono']">
                                READY TO SHOOT
                            </span>
                        )}
                    </div>
                </div>

                {/* Control button - CHUNKY */}
                {!isCapturing && (
                    <div 
                        onClick={startAutomatedCapture}
                        className="absolute inset-0 flex items-center justify-center z-30 bg-[var(--poster-bg)]/85 cursor-pointer"
                    >
                        <div className="text-center">
                            <div className="text-[clamp(4rem,9vw,7rem)] font-bold mb-6 font-['WhoopieSunday'] uppercase"
                                style={{
                                    color: 'var(--poster-neon)',
                                    textShadow: '8px 8px 0 rgba(0,0,0,0.9), -3px -3px 0 rgba(0,0,0,0.85), 3px -3px 0 rgba(0,0,0,0.85), -3px 3px 0 rgba(0,0,0,0.85)',
                                    WebkitTextStroke: '4px #0f0f0f',
                                    paintOrder: 'stroke fill'
                                }}
                            >
                                START
                            </div>
                            <p className="text-xs uppercase tracking-[0.5em] text-[var(--poster-muted)] font-['SpaceMono']">
                                TAP ANYWHERE TO BEGIN
                            </p>
                        </div>
                    </div>
                )}

                {/* Stop button - BOLD */}
                {isCapturing && (
                    <button 
                        onClick={stopAutomatedCapture}
                        className="absolute top-20 right-4 z-30 py-3 px-6 text-base cursor-pointer bg-[var(--poster-ink)] text-[var(--poster-bg)] border-4 border-red-600 font-bold hover:bg-red-600 transition-colors font-['SpaceMono'] uppercase tracking-[0.4em] shadow-[8px_8px_0_rgba(0,0,0,0.8)]"
                        style={{ 
                            fontFamily: 'SpaceMono, monospace'
                        }}
                    >
                        ■ STOP
                    </button>
                )}
            </div>
        </div>
    );
};

export default Camera;