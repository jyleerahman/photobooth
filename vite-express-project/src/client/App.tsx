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
        backgroundImage: `url(${new URL('./font/newyorkbodega.jpg', import.meta.url).href})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* VHS/Bodega Effects */}
      <div className="bodega-scanlines" />
      <div className="bodega-vhs-effect" />
      <div className="bodega-grain" />
      
      {/* Bodega Security Cam Timestamp */}
      <div className="bodega-timestamp">
        🎥 BODEGA CAM 01 • {time.toLocaleString('en-US', { 
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
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85))'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Bodega Sign Style */}
        <div className="mb-[3vh]">
          <div className="text-[clamp(2rem,8vw,5rem)] font-bold font-['Timegoing'] text-neon-gold leading-none"
            style={{
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4), 3px 3px 0 rgba(0,0,0,0.8)'
            }}
          >
            New York City
          </div>
          <div className="text-[clamp(4rem,16vw,10rem)] font-bold font-['WhoopieSunday'] text-neon-pink leading-none -rotate-1"
            style={{
              textShadow: '0 0 30px rgba(255, 20, 147, 0.9), 0 0 60px rgba(255, 20, 147, 0.5), 4px 4px 0 rgba(0,0,0,0.9)'
            }}
          >
            Photo Booth
          </div>
        </div>

        {/* Bodega-style notice */}
        <div className="text-neon-cyan text-[clamp(0.8rem,2vw,1.2rem)] font-['SpaceMono'] mb-[2vh] tracking-wider opacity-90"
          style={{
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 2px 2px 0 rgba(0,0,0,0.8)'
          }}
        >
          ★ OPEN 24/7 • NO PURCHASE NECESSARY ★
        </div>

        <nav className="mt-[2vh]">
          <Link to="/frame">
            <div className="inline-block relative group">
              {/* Neon button effect */}
              <div className="text-[clamp(2rem,8vw,4rem)] font-bold font-['Timegoing'] text-neon-cyan px-[3vw] py-[2vh] border-4 border-neon-cyan transition-all duration-300 group-hover:scale-105"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.7)'
                }}
              >
                → START ←
              </div>
              
              {/* Bodega sticker style decorations */}
              <div className="absolute -top-2 -right-2 bg-[#FF1493] text-black text-[clamp(0.8rem,2vw,1.2rem)] font-bold px-3 py-1 rotate-12 font-['WhoopieSunday']"
                style={{
                  boxShadow: '0 0 15px rgba(255, 20, 147, 0.8)'
                }}
              >
                FREE!
              </div>
            </div>
          </Link>
        </nav>

        {/* Bodega Details */}
        <div className="mt-[3vh] text-neon-gold text-[clamp(0.6rem,1.5vw,0.9rem)] font-['SpaceMono'] opacity-75 tracking-wide"
          style={{
            textShadow: '0 0 10px rgba(255, 215, 0, 0.6), 1px 1px 0 rgba(0,0,0,0.8)'
          }}
        >
          🐈 BODEGA CAT APPROVED • ATM INSIDE • WE ACCEPT EBT
        </div>
      </div>
    </div>
  );
}

export default App;
