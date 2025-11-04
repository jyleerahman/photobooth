import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center font-['SpaceMono'] overflow-auto"
            style={{
                backgroundImage: `url(${new URL('../font/newyorkstreet.jpg', import.meta.url).href})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#0a0a0a'
            }}
        >
            {/* Gritty Film Effects */}
            <div className="bodega-scanlines" />
            <div className="bodega-vhs-effect" />
            <div className="bodega-grain" />
            
            {/* Dark overlay */}
            <div className="fixed inset-0 pointer-events-none" 
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
                }}
            />

            <div className="relative z-10 w-full max-w-6xl px-3 sm:px-6 py-4 sm:py-6">
                {/* Header - RAW GRAFFITI */}
                <div className="text-center mb-6 sm:mb-8">
                    <div 
                        className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold font-['Throwupz'] mb-1 -rotate-2 leading-tight tracking-tight"
                        style={{
                            textShadow: '6px 6px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 10px 10px 0 rgba(255,20,147,0.4)',
                            WebkitTextStroke: '2px black',
                            paintOrder: 'stroke fill'
                        }}
                    >
                        PICK YA LAYOUT
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm font-['Graffiti'] tracking-[0.2em] opacity-70 uppercase mt-2"
                        style={{
                            textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                        }}
                    >
                        ※ CHOOSE WISELY ※
                    </div>
                </div>

                {/* Frame options */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center max-w-6xl mx-auto">
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        className="cursor-pointer p-5 sm:p-7 transition-all duration-200 relative -rotate-1 hover:scale-105 w-full max-w-xs"
                        style={{
                            background: 'rgba(0,0,0,0.7)',
                            border: '4px solid rgba(255,20,147,0.3)',
                            boxShadow: '6px 6px 0 rgba(255,20,147,0.5), 10px 10px 20px rgba(0,0,0,0.7)'
                        }}
                    >
                        {/* CHUNKY number tag */}
                        <div className="absolute -top-4 -left-3 bg-[#FF1493] text-black text-2xl sm:text-3xl font-bold font-['Throwupz'] px-4 sm:px-5 py-1 -rotate-12 border-4 border-black z-10"
                            style={{
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.8), 0 0 20px rgba(255, 20, 147, 0.8)',
                                textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
                            }}>
                            01
                        </div>

                        <div className="text-white text-2xl sm:text-3xl font-bold font-['Graffiti'] mb-4 sm:mb-5 mt-2 text-center tracking-wider uppercase"
                            style={{
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000'
                            }}
                        >
                            CLASSIC STRIP
                        </div>

                        {/* Visual representation of strip layout */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-32 sm:w-36 bg-black p-3 sm:p-4 flex flex-col gap-2 rotate-2 border-4 border-white"
                                style={{
                                    boxShadow: '5px 5px 0 rgba(255, 215, 0, 0.7), 10px 10px 20px rgba(0, 0, 0, 0.8)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 sm:h-18 bg-gray-700 flex items-center justify-center text-white text-sm font-bold tracking-wide font-['SpaceMono'] border-2 border-gray-500"
                                        style={{
                                            textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                                        }}
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Option 2: Grid Layout */}
                    <div
                        onClick={() => selectFrame('grid')}
                        className="cursor-pointer p-5 sm:p-7 transition-all duration-200 relative rotate-1 hover:scale-105 w-full max-w-xs"
                        style={{
                            background: 'rgba(0,0,0,0.7)',
                            border: '4px solid rgba(0,255,255,0.3)',
                            boxShadow: '6px 6px 0 rgba(0,255,255,0.5), 10px 10px 20px rgba(0,0,0,0.7)'
                        }}
                    >
                        {/* CHUNKY number tag */}
                        <div className="absolute -top-4 -right-3 bg-[#00FFFF] text-black text-2xl sm:text-3xl font-bold font-['Throwupz'] px-4 sm:px-5 py-1 rotate-12 border-4 border-black z-10"
                            style={{
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.8), 0 0 20px rgba(0, 255, 255, 0.8)',
                                textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
                            }}>
                            02
                        </div>

                        <div className="text-white text-2xl sm:text-3xl font-bold font-['Graffiti'] mb-4 sm:mb-5 mt-2 text-center tracking-wider uppercase"
                            style={{
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000'
                            }}
                        >
                            SQUARE GRID
                        </div>

                        {/* Visual representation of grid layout */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-black p-4 sm:p-5 grid grid-cols-2 gap-2 -rotate-2 border-4 border-white"
                                style={{
                                    boxShadow: '5px 5px 0 rgba(0, 255, 255, 0.7), 10px 10px 20px rgba(0, 0, 0, 0.8)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-700 flex items-center justify-center text-white text-sm font-bold tracking-wide font-['SpaceMono'] border-2 border-gray-500"
                                        style={{
                                            textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                                        }}
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Option 3: Bodega Cat Layout */}
                    <div
                        onClick={() => selectFrame('bodega-cat')}
                        className="cursor-pointer p-5 sm:p-7 transition-all duration-200 relative -rotate-1 hover:scale-105 w-full max-w-xs"
                        style={{
                            background: 'rgba(0,0,0,0.7)',
                            border: '4px solid rgba(255,215,0,0.3)',
                            boxShadow: '6px 6px 0 rgba(255,215,0,0.5), 10px 10px 20px rgba(0,0,0,0.7)'
                        }}
                    >
                        {/* CHUNKY number tag */}
                        <div className="absolute -top-4 -left-3 bg-[#FFD700] text-black text-2xl sm:text-3xl font-bold font-['Throwupz'] px-4 sm:px-5 py-1 rotate-6 border-4 border-black z-10"
                            style={{
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.8), 0 0 20px rgba(255, 215, 0, 0.8)',
                                textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
                            }}>
                            03
                        </div>

                        <div className="text-white text-2xl sm:text-3xl font-bold font-['Graffiti'] mb-4 sm:mb-5 mt-2 text-center tracking-wider uppercase"
                            style={{
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000'
                            }}
                        >
                            SPECIAL 🐈
                        </div>

                        {/* Visual representation of bodega cat layout */}
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-48 h-48 sm:w-56 sm:h-56 bg-black p-4 sm:p-5 flex flex-col gap-2 rotate-2 border-4 border-white"
                                style={{
                                    boxShadow: '5px 5px 0 rgba(255, 215, 0, 0.7), 10px 10px 20px rgba(0, 0, 0, 0.8)'
                                }}>
                                {/* Big photo on top */}
                                <div className="h-32 sm:h-36 bg-gray-700 flex items-center justify-center text-white text-sm font-bold tracking-wide font-['SpaceMono'] relative border-2 border-gray-500"
                                    style={{
                                        textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
                                    }}
                                >
                                    #1
                                    <div className="absolute top-1 right-1 text-xl">😺</div>
                                </div>
                                {/* Three small photos on bottom */}
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                    {[2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-gray-700 flex items-center justify-center text-white text-xs font-bold tracking-wide font-['SpaceMono'] border-2 border-gray-500"
                                            style={{
                                                textShadow: '1px 1px 0 rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            #{i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-white text-center mt-6 sm:mt-8 text-sm sm:text-base tracking-[0.2em] font-['Graffiti'] opacity-70 uppercase"
                    style={{
                        textShadow: '2px 2px 0 rgba(0,0,0,0.9)'
                    }}
                >
                    ▼ TAP TO CHOOSE ▼
                </div>
            </div>
        </div>
    );
}

export default Frame;
