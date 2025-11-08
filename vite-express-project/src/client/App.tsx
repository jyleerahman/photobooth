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
          backgroundColor: '#f5f5f5',
          backgroundImage: `url(${new URL('./font/newyorkstreet.jpg', import.meta.url).href})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Film grain texture */}
        <div className="bodega-grain" />
        
        {/* Timestamp - minimal */}
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

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        {/* BLACK & WHITE ZINE TITLES */}
        <div className="mb-12">
          <div className="text-[clamp(3rem,12vw,9rem)] font-bold font-['Throwupz'] text-white leading-[0.85] tracking-tight"
            style={{
              textShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            NEW YORK
          </div>
          <div className="text-[clamp(5rem,20vw,14rem)] font-bold font-['Throwupz'] text-white leading-[0.7] -rotate-1 tracking-tighter"
            style={{
              textShadow: '6px 6px 0 rgba(0,0,0,0.3)',
              marginTop: '-1rem'
            }}
          >
            PHOTOBOOTH
          </div>
        </div>

        {/* Clean description */}
        <div className="text-white text-[clamp(0.75rem,1.8vw,1rem)] mb-8 max-w-md mx-auto leading-relaxed tracking-wide"
          style={{
            fontFamily: 'Coolvetica, Helvetica, Arial, sans-serif',
            fontWeight: 400,
            textShadow: '2px 2px 0 rgba(0,0,0,0.3)'
          }}
        >
          STREET-STYLE PHOTOGRAPHY BOOTH
        </div>

        <nav className="mt-8">
          <Link to="/frame">
            <div className="inline-block relative group">
              {/* ONE WAY SIGN BUTTON */}
              <div 
                className="relative transition-all duration-200 group-hover:scale-105"
                style={{
                  width: 'clamp(280px, 40vw, 450px)',
                  height: 'clamp(80px, 12vw, 140px)',
                  backgroundImage: `url(${new URL('./font/oneway.png', import.meta.url).href})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))'
                }}
              >
                <span className="sr-only">START</span>
              </div>
            </div>
          </Link>
        </nav>

       
      </div>
    </div>
  );
}

export default App;
