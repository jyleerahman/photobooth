import "./App.css";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div 
      className="text-[100px] font-bold font-['Timegoing']"
      style={{
        color: '#FFD700',
        textShadow: `
          2px 2px 0 #000,
          -2px -2px 0 #000,
          2px -2px 0 #000,
          -2px 2px 0 #000,
          0 0 20px rgba(255, 215, 0, 0.5)
        `
      }}
    >
      New York City
    </div>
      <div 
        className="text-[170px] font-bold font-['WhoopieSunday']"
        style={{
          color: '#FF1493',
          textShadow: `
            3px 3px 0 #000,
            -3px -3px 0 #000,
            3px -3px 0 #000,
            -3px 3px 0 #000,
            0 0 30px rgba(255, 20, 147, 0.6)
          `
        }}
      >
        Photo Booth
      </div>
      <nav>
        <div 
          className="text-6xl font-bold font-['Timegoing']"
          style={{
            color: '#00FFFF',
            textShadow: `
              2px 2px 0 #000,
              -2px -2px 0 #000,
              2px -2px 0 #000,
              -2px 2px 0 #000,
              0 0 20px rgba(0, 255, 255, 0.5)
            `
          }}
        >
          <Link to="/frame">Start</Link>
        </div>
      </nav>
    </>
  );
}

export default App;
