import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center font-['SpaceMono'] overflow-hidden"
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

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-[2vw] py-[2vh] gap-[2vh]">
                {/* Header */}
                <div className="text-center flex-shrink-0">
                    <div 
                        className="text-neon-pink text-[clamp(1.5rem,4vw,3rem)] font-bold font-['WhoopieSunday'] mb-[0.5vh] -rotate-2 leading-tight"
                    >
                        PICK YA LAYOUT
                    </div>
                    <div 
                        className="text-neon-cyan text-[clamp(0.75rem,2vw,1rem)] font-['Timegoing'] tracking-wide rotate-1"
                    >
                        choose your strip style ↓
                    </div>
                </div>

                {/* Frame options */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[2vw] justify-items-center w-full max-w-[90vw] flex-grow flex-shrink min-h-0">
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        className="cursor-pointer p-[2vh] transition-all duration-300 relative -rotate-1 hover:scale-105 w-full max-w-[40vw] lg:max-w-[35vw] flex flex-col items-center"
                    >
                        {/* Spray paint number tag */}
                        <div className="absolute top-0 left-[5%] bg-[#FF1493] text-black text-[clamp(1rem,2vw,1.5rem)] font-bold font-['WhoopieSunday'] px-[1vw] py-[0.3vh] -rotate-6 border-2 border-black z-10"
                            style={{
                                boxShadow: '0 0 15px rgba(255, 20, 147, 0.7), 0 3px 8px rgba(0, 0, 0, 0.5)'
                            }}>
                            01
                        </div>

                        <div className="text-neon-gold text-[clamp(1rem,2.5vw,1.5rem)] font-bold font-['Graffiti'] mb-[1vh] mt-[2vh] text-center tracking-wide">
                            CLASSIC STRIP
                        </div>

                        {/* Visual representation of strip layout */}
                        <div className="flex justify-center mb-[1vh]">
                            <div className="w-[15vw] max-w-[120px] bg-white p-[1vh] flex flex-col gap-[0.5vh] rotate-2"
                                style={{
                                    boxShadow: '4px 4px 0 rgba(255, 215, 0, 0.6), 8px 8px 15px rgba(0, 0, 0, 0.5)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[8vh] bg-gray-300 flex items-center justify-center text-gray-600 text-[clamp(0.6rem,1.5vw,0.8rem)] font-bold tracking-wide font-['SpaceMono']"
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
                        className="cursor-pointer p-[2vh] transition-all duration-300 relative rotate-1 hover:scale-105 w-full max-w-[40vw] lg:max-w-[35vw] flex flex-col items-center"
                    >
                        {/* Spray paint number tag */}
                        <div className="absolute top-0 right-[5%] bg-[#00FFFF] text-black text-[clamp(1rem,2vw,1.5rem)] font-bold font-['WhoopieSunday'] px-[1vw] py-[0.3vh] rotate-6 border-2 border-black z-10"
                            style={{
                                boxShadow: '0 0 15px rgba(0, 255, 255, 0.7), 0 3px 8px rgba(0, 0, 0, 0.5)'
                            }}>
                            02
                        </div>

                        <div className="text-neon-pink text-[clamp(1rem,2.5vw,1.5rem)] font-bold font-['Graffiti'] mb-[1vh] mt-[2vh] text-center tracking-wide">
                            SQUARE GRID
                        </div>

                        {/* Visual representation of grid layout */}
                        <div className="flex justify-center mb-[1vh]">
                            <div className="w-[25vw] h-[25vw] max-w-[200px] max-h-[200px] bg-white p-[1vh] grid grid-cols-2 gap-[0.5vh] -rotate-2"
                                style={{
                                    boxShadow: '4px 4px 0 rgba(0, 255, 255, 0.6), 8px 8px 15px rgba(0, 0, 0, 0.5)'
                                }}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-300 flex items-center justify-center text-gray-600 text-[clamp(0.6rem,1.5vw,0.8rem)] font-bold tracking-wide font-['SpaceMono']"
                                    >
                                        #{i}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-neon-gold text-center text-[clamp(0.6rem,1.5vw,0.9rem)] tracking-wider font-['Timegoing'] opacity-80 flex-shrink-0">
                    ↑ TAP TO PICK & START ↑
                </div>
            </div>
        </div>
    );
}

export default Frame;
