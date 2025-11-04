import "./App.css";
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${new URL('./font/newyorkstreet.jpg', import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Gritty Film Grain Effects */}
      <div className="bodega-scanlines" />
      <div className="bodega-vhs-effect" />
      <div className="bodega-grain" />
      
      {/* Film Timestamp - Subtle */}
      <div className="bodega-timestamp">
        {time.toLocaleString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: '2-digit',
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false 
        })}
      </div>

      {/* Dark overlay for contrast */}
      <div className="fixed inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* RAW GRAFFITI TITLES */}
        <div className="mb-[3vh]">
          <div className="text-[clamp(2.5rem,10vw,7rem)] font-bold font-['Throwupz'] text-neon-gold leading-[0.85] tracking-tight"
            style={{
              textShadow: '6px 6px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 10px 10px 0 rgba(0,0,0,0.3)',
              WebkitTextStroke: '2px black',
              paintOrder: 'stroke fill'
            }}
          >
            NEW YORK
          </div>
          <div className="text-[clamp(4.5rem,18vw,12rem)] font-bold font-['Throwupz'] text-neon-pink leading-[0.75] -rotate-2 tracking-tighter"
            style={{
              textShadow: '8px 8px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 12px 12px 0 rgba(0,0,0,0.4)',
              WebkitTextStroke: '3px black',
              paintOrder: 'stroke fill',
              marginTop: '-0.5rem'
            }}
          >
            PHOTOBOOTH
          </div>
        </div>

        {/* Gritty tagline */}
        <div className="text-white text-[clamp(0.7rem,1.8vw,1rem)] font-['Graffiti'] mb-[2vh] tracking-[0.3em] opacity-80 uppercase"
          style={{
            textShadow: '3px 3px 0 rgba(0,0,0,0.9)',
            letterSpacing: '0.2em'
          }}
        >
          ▀▄ STREET CERTIFIED ▄▀
        </div>

        <nav className="mt-[3vh]">
          <Link to="/frame">
            <div className="inline-block relative group">
              {/* CHUNKY GRAFFITI BUTTON */}
              <div className="text-[clamp(2.5rem,10vw,5rem)] font-bold font-['Throwupz'] text-white px-[4vw] py-[2.5vh] border-[6px] border-black transition-all duration-200 group-hover:scale-105"
                style={{
                  textShadow: '5px 5px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 8px 8px 0 rgba(255,20,147,0.6)',
                  boxShadow: '8px 8px 0 rgba(255,20,147,0.8), 12px 12px 0 rgba(0,0,0,0.5), inset 0 0 40px rgba(255,20,147,0.2)',
                  background: 'linear-gradient(135deg, #FF1493 0%, #FF1493 100%)',
                  WebkitTextStroke: '2px black',
                  paintOrder: 'stroke fill',
                  letterSpacing: '0.05em'
                }}
              >
                START
              </div>
              
              {/* Spray paint drips effect */}
              <div className="absolute -bottom-2 left-[20%] w-2 h-8 bg-[#FF1493] opacity-60"
                style={{
                  clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)'
                }}
              />
              <div className="absolute -bottom-2 right-[30%] w-2 h-6 bg-[#FF1493] opacity-60"
                style={{
                  clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)'
                }}
              />
            </div>
          </Link>
        </nav>

        {/* Raw street cred */}
        <div className="mt-[3vh] text-gray-400 text-[clamp(0.55rem,1.3vw,0.75rem)] font-['SpaceMono'] opacity-60 tracking-[0.15em] uppercase"
          style={{
            textShadow: '2px 2px 0 rgba(0,0,0,0.8)'
          }}
        >
          ※ CASH ONLY ※ NO COPS ※ REAL SHIT ※
        </div>
      </div>
    </div>
  );
}

export default App;
