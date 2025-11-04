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

        // Check if we've taken all 8 photos
        if (currentPhotoNumber >= totalPhotos) {
            setIsCapturing(false);
            setCountdown(5);
            // Navigate to selection page with captured images and frame layout
            setTimeout(() => {
                navigate('/select', { state: { images: capturedImages, frameLayout } });
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
            className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center"
            style={{ 
                backgroundImage: `url(${new URL('./font/newyorkbodega.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* VHS/Bodega Security Cam Effects */}
            <div className="bodega-scanlines" />
            <div className="bodega-vhs-effect" />
            <div className="bodega-grain" />
            {/* Single Active Camera Feed */}
            <div className="relative w-[80vw] h-[80vh] max-w-[1280px] max-h-[720px]">
                {/* Camera Label Bar - Enhanced Bodega Style */}
                <div className="absolute top-0 left-0 right-0 bg-black/90 z-20 py-2 px-4 border-b-2 border-[#FFD700]">
                    <div className="flex items-center justify-between">
                        <span className="text-[#00FF00] text-lg font-bold tracking-wider" style={{ 
                            fontFamily: 'Courier New, monospace',
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.8)'
                        }}>
                            🎥 BODEGA CAM {String(currentPhotoNumber + 1).padStart(2, '0')}
                        </span>
                        {isCapturing && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" style={{
                                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)'
                                }}></div>
                                <span className="text-red-600 text-sm font-bold" style={{ 
                                    fontFamily: 'Courier New, monospace',
                                    textShadow: '0 0 8px rgba(255, 0, 0, 0.8)'
                                }}>● REC</span>
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
                />

                {/* Countdown overlay */}
                {isCapturing && countdown > 0 && !showingCapturedImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                        <div 
                            className={`text-[200px] font-bold font-['SpaceMono'] ${
                                countdown <= 3 ? 'text-red-500' : 'text-white'
                            }`}
                            style={{ 
                                textShadow: '0 0 30px rgba(0,0,0,0.9)'
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

                {/* Bottom info bar - Enhanced Bodega Style */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/90 z-20 py-2 px-4 border-t-2 border-[#FFD700]">
                    <div className="flex items-center justify-between">
                        <span className="text-[#FFD700] text-xs font-bold" style={{ 
                            fontFamily: 'Courier New, monospace',
                            textShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
                        }}>
                            📅 {new Date().toLocaleString('en-US', { 
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
                            <span className="text-[#00FF00] text-xs font-bold" style={{ 
                                fontFamily: 'Courier New, monospace',
                                textShadow: '0 0 8px rgba(0, 255, 0, 0.6)'
                            }}>
                                FRAME {currentPhotoNumber + 1}/{totalPhotos}
                            </span>
                        )}
                        {!isCapturing && (
                            <span className="text-[#888] text-xs" style={{ 
                                fontFamily: 'Courier New, monospace'
                            }}>
                                🐈 BODEGA CAT PHOTOBOOTH
                            </span>
                        )}
                    </div>
                </div>

                {/* Control button - positioned over feed */}
                {!isCapturing && (
                    <div 
                        onClick={startAutomatedCapture}
                        className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 cursor-pointer hover:bg-black/70 transition-colors"
                    >
                        <div className="text-center">
                            <div className="text-white text-6xl font-bold mb-4 font-['SpaceMono']" >[ REC ]</div>
                            <div className="text-white/70 text-lg tracking-widest font-['SpaceMono']">PRESS TO START</div>
                        </div>
                    </div>
                )}

                {/* Stop button - small and unobtrusive */}
                {isCapturing && (
                    <button 
                        onClick={stopAutomatedCapture}
                        className="absolute top-20 right-4 z-30 py-2 px-4 text-sm cursor-pointer bg-red-600/80 text-white border-none rounded font-bold hover:bg-red-700 transition-colors font-['SpaceMono']"
                        style={{ fontFamily: 'SpaceMono, monospace' }}
                    >
                        ■ STOP
                    </button>
                )}
            </div>
        </div>
    );
};

export default Camera;