import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
            style={{
                backgroundColor: '#f5f5f5'
            }}
        >
            {/* Film grain */}
            <div className="bodega-grain" />

            <div className="relative z-10 w-full max-w-6xl px-6 py-4" style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}>
                {/* Header - MINIMAL */}
                <div className="text-center mb-6">
                    <div 
                        className="text-black text-5xl sm:text-6xl lg:text-7xl font-bold font-['WhoopieSunday'] mb-2 leading-tight tracking-tight"
                        style={{
                            textShadow: '2px 2px 0 rgba(0,0,0,0.08)'
                        }}
                    >
                        CHOOSE LAYOUT
                    </div>
                    <div className="text-gray-600 text-sm sm:text-base tracking-[0.2em] uppercase mt-4"
                        style={{
                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            letterSpacing: '0.2em'
                        }}
                    >
                        SELECT YOUR FORMAT
                    </div>
                </div>

                {/* Frame options */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-items-center max-w-6xl mx-auto">
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        className="cursor-pointer p-6 transition-all duration-200 hover:scale-105 w-full max-w-xs"
                        style={{
                            backgroundColor: '#fff',
                            border: '3px solid #000',
                            boxShadow: '8px 8px 0 rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Minimal number */}
                        <div className="text-black text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            01
                        </div>

                        <div className="text-black text-lg font-bold mb-4 uppercase tracking-wide"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            STRIP
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-32 bg-white p-3 flex flex-col gap-2 border-2 border-black">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif'
                                        }}
                                    >
                                        {i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Option 2: Grid Layout */}
                    <div
                        onClick={() => selectFrame('grid')}
                        className="cursor-pointer p-6 transition-all duration-200 hover:scale-105 w-full max-w-xs"
                        style={{
                            backgroundColor: '#fff',
                            border: '3px solid #000',
                            boxShadow: '8px 8px 0 rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Minimal number */}
                        <div className="text-black text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            02
                        </div>

                        <div className="text-black text-lg font-bold mb-4 uppercase tracking-wide"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            GRID
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-white p-4 grid grid-cols-2 gap-2 border-2 border-black">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-200 border border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold"
                                        style={{
                                            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif'
                                        }}
                                    >
                                        {i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Option 3: Special Layout */}
                    <div
                        onClick={() => selectFrame('bodega-cat')}
                        className="cursor-pointer p-6 transition-all duration-200 hover:scale-105 w-full max-w-xs"
                        style={{
                            backgroundColor: '#fff',
                            border: '3px solid #000',
                            boxShadow: '8px 8px 0 rgba(0,0,0,0.15)'
                        }}
                    >
                        {/* Minimal number */}
                        <div className="text-black text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            03
                        </div>

                        <div className="text-black text-lg font-bold mb-4 uppercase tracking-wide"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            SPECIAL
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-white p-4 flex flex-col gap-2 border-2 border-black">
                                {/* Big photo on top */}
                                <div className="h-32 bg-gray-200 border border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold"
                                    style={{
                                        fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif'
                                    }}
                                >
                                    1
                                </div>
                                {/* Three small photos on bottom */}
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    {[2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-200 border border-gray-400 flex items-center justify-center text-gray-600 text-xs font-bold"
                                            style={{
                                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif'
                                            }}
                                        >
                                            {i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-gray-500 text-center mt-6 text-sm tracking-[0.2em] uppercase"
                    style={{
                        fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        letterSpacing: '0.2em'
                    }}
                >
                    ↑ TAP TO SELECT ↑
                </div>
            </div>
        </div>
    );
}

export default Frame;
