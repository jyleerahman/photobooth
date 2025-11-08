import { useNavigate } from "react-router-dom";

type FrameLayout = 'strip' | 'grid' | 'bodega-cat';

function Frame() {
    const navigate = useNavigate();

    const selectFrame = (layout: FrameLayout) => {
        navigate('/camera', { state: { frameLayout: layout } });
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)]">
            <div className="bodega-grain" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-8 px-6 py-8">
                <header className="flex flex-wrap items-center justify-between gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono']">
                    <span>SESSION 02 · FORMAT LAB</span>
                    <span>SELECT FOUR FRAMES</span>
                    <span>NYC PHOTO DIVISION</span>
                </header>

                <div className="text-center">
                    <div
                        className="text-white text-[clamp(2.4rem,5vw,4.5rem)] font-bold uppercase font-['WhoopieSunday'] leading-[0.9]"
                        style={{
                            textShadow:
                                '6px 6px 0 rgba(0,0,0,0.85), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)',
                            WebkitTextStroke: '3px #0f0f0f',
                            color: 'var(--poster-neon)'
                        }}
                    >
                        CHOOSE
                        <br />
                        YOUR LAYOUT
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.5em] text-[var(--poster-muted)] font-['SpaceMono']">
                        TAP A CARD TO LOCK IT IN
                    </p>
                </div>

                {/* Frame options */}
                <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden md:grid-cols-3">
                    {/* Option 1: Strip Layout */}
                    <div
                        onClick={() => selectFrame('strip')}
                        className="cursor-pointer border-4 border-[var(--poster-ink)] bg-white p-6 shadow-[10px_10px_0_rgba(0,0,0,0.75)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                    >
                        {/* Minimal number */}
                        <div className="text-[var(--poster-ink)] text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            01
                        </div>

                        <div className="text-[var(--poster-ink)] text-lg font-bold mb-4 uppercase tracking-[0.3em]"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            STRIP
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-28 bg-white p-3 flex flex-col gap-2 border-2 border-[var(--poster-ink)]">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-[var(--poster-bg)] border border-[var(--poster-ink)]/30 flex items-center justify-center text-[var(--poster-muted)] text-xs font-bold"
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
                        className="cursor-pointer border-4 border-[var(--poster-ink)] bg-white p-6 shadow-[10px_10px_0_rgba(0,0,0,0.75)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                    >
                        {/* Minimal number */}
                        <div className="text-[var(--poster-ink)] text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            02
                        </div>

                        <div className="text-[var(--poster-ink)] text-lg font-bold mb-4 uppercase tracking-[0.3em]"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            GRID
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-40 h-40 bg-white p-4 grid grid-cols-2 gap-2 border-2 border-[var(--poster-ink)]">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-[var(--poster-bg)] border border-[var(--poster-ink)]/30 flex items-center justify-center text-[var(--poster-muted)] text-xs font-bold"
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
                        className="cursor-pointer border-4 border-[var(--poster-ink)] bg-white p-6 shadow-[10px_10px_0_rgba(0,0,0,0.75)] transition-transform duration-200 hover:-translate-x-1 hover:-translate-y-1"
                    >
                        {/* Minimal number */}
                        <div className="text-[var(--poster-ink)] text-5xl font-bold mb-3"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 900
                            }}>
                            03
                        </div>

                        <div className="text-[var(--poster-ink)] text-lg font-bold mb-4 uppercase tracking-[0.3em]"
                            style={{
                                fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
                                fontWeight: 700
                            }}
                        >
                            SPECIAL
                        </div>

                        {/* Visual representation */}
                        <div className="flex justify-center">
                            <div className="w-40 h-40 bg-white p-4 flex flex-col gap-2 border-2 border-[var(--poster-ink)]">
                                {/* Big photo on top */}
                                <div className="h-32 bg-[var(--poster-bg)] border border-[var(--poster-ink)]/30 flex items-center justify-center text-[var(--poster-muted)] text-xs font-bold"
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
                                            className="bg-[var(--poster-bg)] border border-[var(--poster-ink)]/30 flex items-center justify-center text-[var(--poster-muted)] text-xs font-bold"
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
                <div className="mt-2 text-center text-[0.6rem] uppercase tracking-[0.5em] text-[var(--poster-muted)] font-['SpaceMono']">
                    ↑ TAP TO SELECT ↑
                </div>
            </div>
        </div>
    );
}

export default Frame;
