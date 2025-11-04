import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        // Navigate to camera with selected layout
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div 
            className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center"
            style={{
                backgroundImage: `url(${new URL('../font/newyorkbodega.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                fontFamily: 'SpaceMono, monospace'
            }}
        >
            {/* Dark overlay with slight color tint */}
            <div 
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85))',
                    pointerEvents: 'none'
                }}
            />

            <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '1200px',
                width: '100%',
                padding: '40px'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px'
                }}>
                    <div 
                        className="text-neon-pink"
                        style={{
                            fontSize: '72px',
                            fontWeight: 'bold',
                            fontFamily: 'Throwupz, sans-serif',
                            marginBottom: '10px',
                            transform: 'rotate(-2deg)',
                            lineHeight: '1'
                        }}
                    >
                        PICK YA LAYOUT
                    </div>
                    <div 
                        className="text-neon-cyan"
                        style={{
                            fontSize: '24px',
                            fontFamily: 'Graffiti, sans-serif',
                            letterSpacing: '1px',
                            transform: 'rotate(1deg)'
                        }}
                    >
                        choose your strip style ↓
                    </div>
                </div>

                {/* Frame options */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '40px',
                    justifyContent: 'center'
                }}>
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        style={{
                            cursor: 'pointer',
                            padding: '35px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            transform: 'rotate(-1deg)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'rotate(-1deg) scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'rotate(-1deg) scale(1)';
                        }}
                    >
                        {/* Spray paint number tag */}
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            left: '20px',
                            backgroundColor: '#FF1493',
                            color: '#000',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            fontFamily: 'Throwupz, sans-serif',
                            padding: '5px 20px',
                            transform: 'rotate(-5deg)',
                            boxShadow: '0 0 20px rgba(255, 20, 147, 0.7), 0 4px 10px rgba(0, 0, 0, 0.5)',
                            border: '2px solid #000',
                            zIndex: 10
                        }}>
                            01
                        </div>

                        <div 
                            className="text-neon-gold"
                            style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                marginBottom: '25px',
                                marginTop: '10px',
                                fontFamily: 'Graffiti, sans-serif',
                                textAlign: 'center',
                                letterSpacing: '1px'
                            }}
                        >
                            CLASSIC STRIP
                        </div>

                        {/* Visual representation of strip layout */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                width: '160px',
                                backgroundColor: '#fff',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                boxShadow: '5px 5px 0 rgba(255, 215, 0, 0.6), 10px 10px 20px rgba(0, 0, 0, 0.5)',
                                transform: 'rotate(2deg)'
                            }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            height: '85px',
                                            backgroundColor: '#ddd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#555',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            letterSpacing: '1px',
                                            fontFamily: 'SpaceMono, monospace'
                                        }}
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div 
                            className="text-neon-cyan"
                            style={{
                                fontSize: '16px',
                                textAlign: 'center',
                                marginBottom: '10px',
                                letterSpacing: '1px',
                                fontFamily: 'SpaceMono, monospace',
                                fontWeight: 'bold'
                            }}
                        >
                            2×6" VERTICAL
                        </div>

                        <div style={{
                            color: '#aaa',
                            fontSize: '13px',
                            textAlign: 'center',
                            lineHeight: '1.5',
                            fontFamily: 'SpaceMono, monospace'
                        }}>
                            old school booth vibes<br/>
                            4 pics stacked up
                        </div>
                    </div>

                    {/* Option 2: Grid Layout */}
                    <div
                        onClick={() => selectFrame('grid')}
                        style={{
                            cursor: 'pointer',
                            padding: '35px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            transform: 'rotate(1deg)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'rotate(1deg) scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'rotate(1deg) scale(1)';
                        }}
                    >
                        {/* Spray paint number tag */}
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            right: '20px',
                            backgroundColor: '#00FFFF',
                            color: '#000',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            fontFamily: 'Throwupz, sans-serif',
                            padding: '5px 20px',
                            transform: 'rotate(5deg)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.7), 0 4px 10px rgba(0, 0, 0, 0.5)',
                            border: '2px solid #000',
                            zIndex: 10
                        }}>
                            02
                        </div>

                        <div 
                            className="text-neon-pink"
                            style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                marginBottom: '25px',
                                marginTop: '10px',
                                fontFamily: 'Graffiti, sans-serif',
                                textAlign: 'center',
                                letterSpacing: '1px'
                            }}
                        >
                            SQUARE GRID
                        </div>

                        {/* Visual representation of grid layout */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '25px'
                        }}>
                            <div style={{
                                width: '260px',
                                height: '260px',
                                backgroundColor: '#fff',
                                padding: '18px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                boxShadow: '5px 5px 0 rgba(0, 255, 255, 0.6), 10px 10px 20px rgba(0, 0, 0, 0.5)',
                                transform: 'rotate(-2deg)'
                            }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor: '#ddd',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#555',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            letterSpacing: '1px',
                                            fontFamily: 'SpaceMono, monospace'
                                        }}
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div 
                            className="text-neon-gold"
                            style={{
                                fontSize: '16px',
                                textAlign: 'center',
                                marginBottom: '10px',
                                letterSpacing: '1px',
                                fontFamily: 'SpaceMono, monospace',
                                fontWeight: 'bold'
                            }}
                        >
                            4×6" GRID
                        </div>

                        <div style={{
                            color: '#aaa',
                            fontSize: '13px',
                            textAlign: 'center',
                            lineHeight: '1.5',
                            fontFamily: 'SpaceMono, monospace'
                        }}>
                            modern square layout<br/>
                            2×2 grid style
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div 
                    className="text-neon-gold"
                    style={{
                        textAlign: 'center',
                        marginTop: '50px',
                        fontSize: '18px',
                        letterSpacing: '2px',
                        fontFamily: 'Graffiti, sans-serif',
                        opacity: 0.8
                    }}
                >
                    ↑ TAP TO PICK & START ↑
                </div>
            </div>
        </div>
    );
}

export default Frame;
