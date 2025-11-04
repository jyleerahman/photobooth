import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center font-['SpaceMono'] overflow-auto"
            style={{
                backgroundImage: `url(${new URL('../font/newyorkbodega.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Dark overlay */}
            <div className="fixed inset-0 pointer-events-none" 
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85))'
                }}
            />

            <div className="relative z-10 w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <div 
                        className="text-neon-pink text-3xl sm:text-4xl lg:text-5xl font-bold font-['WhoopieSunday'] mb-1 -rotate-2 leading-tight"
                    >
                        PICK YA LAYOUT
                    </div>
                    <div 
                        className="text-neon-cyan text-sm sm:text-base lg:text-lg font-['Timegoing'] tracking-wide rotate-1"
                    >
                        choose your strip style ↓
                    </div>
                </div>

                {/* Frame options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 justify-items-center max-w-4xl mx-auto">
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        className="cursor-pointer p-4 sm:p-6 transition-all duration-300 relative -rotate-1 hover:scale-105 w-full max-w-xs"
                    >
                        {/* Spray paint number tag */}
                        <div className="absolute -top-3 left-3 bg-[#FF1493] text-black text-xl sm:text-2xl font-bold font-['WhoopieSunday'] px-3 sm:px-4 py-0.5 -rotate-6 border-2 border-black z-10"
                            style={{
                                boxShadow: '0 0 15px rgba(255, 20, 147, 0.7), 0 3px 8px rgba(0, 0, 0, 0.5)'
                            }}>
                            01
                        </div>

                        <div className="text-neon-gold text-xl sm:text-2xl font-bold font-['Graffiti'] mb-3 sm:mb-4 mt-1 text-center tracking-wide">
                            CLASSIC STRIP
                        </div>

                        {/* Visual representation of strip layout */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-28 sm:w-32 bg-white p-2.5 sm:p-3 flex flex-col gap-2 rotate-2"
                                style={{
                                    boxShadow: '4px 4px 0 rgba(255, 215, 0, 0.6), 8px 8px 15px rgba(0, 0, 0, 0.5)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-14 sm:h-16 bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold tracking-wide font-['SpaceMono']"
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-neon-cyan text-xs sm:text-sm text-center mb-1.5 tracking-wide font-bold font-['SpaceMono']">
                            2×6" VERTICAL
                        </div>

                        <div className="text-gray-400 text-xs text-center leading-relaxed font-['SpaceMono']">
                            old school booth vibes<br/>
                            4 pics stacked up
                        </div>
                    </div>

                    {/* Option 2: Grid Layout */}
                    <div
                        onClick={() => selectFrame('grid')}
                        className="cursor-pointer p-4 sm:p-6 transition-all duration-300 relative rotate-1 hover:scale-105 w-full max-w-xs"
                    >
                        {/* Spray paint number tag */}
                        <div className="absolute -top-3 right-3 bg-[#00FFFF] text-black text-xl sm:text-2xl font-bold font-['WhoopieSunday'] px-3 sm:px-4 py-0.5 rotate-6 border-2 border-black z-10"
                            style={{
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.7), 0 3px 8px rgba(0, 0, 0, 0.5)'
                            }}>
                            02
                        </div>

                        <div className="text-neon-pink text-xl sm:text-2xl font-bold font-['Graffiti'] mb-3 sm:mb-4 mt-1 text-center tracking-wide">
                            SQUARE GRID
                        </div>

                        {/* Visual representation of grid layout */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white p-3 sm:p-4 grid grid-cols-2 gap-2 -rotate-2"
                                style={{
                                    boxShadow: '4px 4px 0 rgba(0, 255, 255, 0.6), 8px 8px 15px rgba(0, 0, 0, 0.5)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold tracking-wide font-['SpaceMono']"
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-neon-gold text-xs sm:text-sm text-center mb-1.5 tracking-wide font-bold font-['SpaceMono']">
                            4×6" GRID
                        </div>

                        <div className="text-gray-400 text-xs text-center leading-relaxed font-['SpaceMono']">
                            modern square layout<br/>
                            2×2 grid style
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-neon-gold text-center mt-4 sm:mt-6 text-xs sm:text-sm tracking-wider font-['Timegoing'] opacity-80">
                    ↑ TAP TO PICK & START ↑
                </div>
            </div>
        </div>
    );
}

export default Frame;
