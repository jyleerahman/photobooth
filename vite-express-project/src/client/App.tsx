import "./App.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--poster-bg)] text-[var(--poster-ink)]">
      <div className="bodega-grain" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-6">
        <header className="flex flex-wrap items-center justify-between gap-4 text-[0.65rem] uppercase tracking-[0.35em] font-['SpaceMono'] text-[var(--poster-muted)]">
          <span>NYC PHOTOBOOTH EDITION</span>
          <span>{time.toLocaleDateString('en-US')}</span>
          <span>{time.toLocaleTimeString('en-US', { hour12: false })} EST</span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-10 px-2 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.6em] text-[var(--poster-muted)] font-['SpaceMono']">
            HEADCASE ISSUE · 2025
          </p>
          <div
            className="mx-auto flex flex-col items-center gap-4 text-center"
          >
            <span
              className="block text-[clamp(3.5rem,10vw,7rem)] leading-[0.85] uppercase font-['WhoopieSunday']"
              style={{
                color: 'var(--poster-neon)',
                WebkitTextStroke: '4px #0f0f0f',
                textShadow:
                  '6px 6px 0 rgba(0,0,0,0.9), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)'
              }}
            >
              TOTAL
            </span>
            <span
              className="block text-[clamp(3.5rem,10vw,7rem)] leading-[0.85] uppercase font-['WhoopieSunday']"
              style={{
                color: 'var(--poster-neon)',
                WebkitTextStroke: '4px #0f0f0f',
                textShadow:
                  '6px 6px 0 rgba(0,0,0,0.9), -3px -3px 0 rgba(0,0,0,0.8), 3px -3px 0 rgba(0,0,0,0.8), -3px 3px 0 rgba(0,0,0,0.8)'
              }}
            >
              PHOTOBOOTH
            </span>
          </div>
          <div className="max-w-xl text-center text-sm leading-relaxed tracking-wider uppercase text-[var(--poster-ink)] font-['Coolvetica']">
            WHY DO YOU PAY FOR PHOTO BOOTH WHEN YOU CAN JUST SET UP YOUR OWN AND PRINT THE IMAGES YOURSELF?
          </div>

          <div className="flex flex-col items-center gap-6 text-xs uppercase tracking-[0.3em] text-[var(--poster-muted)] font-['SpaceMono']">
            <div className="flex items-center gap-4">
              <span>SESSION NO. 131</span>
              <span>LIVE PRINT LAB</span>
              <span>NYC</span>
            </div>

            <Link to="/frame" className="group">
              <div className="relative border-4 border-[var(--poster-ink)] bg-[var(--poster-neon)] px-10 py-5 shadow-[10px_10px_0_rgba(0,0,0,0.85)] transition-transform duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1">
                <span className="block text-base font-['WhoopieSunday'] uppercase tracking-[0.2em] text-[var(--poster-ink)]">
                  LET'S SHOOT
                </span>
              </div>
            </Link>
          </div>
        </main>

        <footer className="mt-auto flex flex-wrap justify-between gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-[var(--poster-muted)] font-['SpaceMono']">
          <span>© 2025 STREET PRINTS</span>
          <span>DESIGNED IN HOUSE</span>
          <span>FOLLOW @JyleeRahman</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
