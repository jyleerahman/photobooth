import "./App.css";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="text-[clamp(2rem,8vw,5rem)] font-bold font-['Timegoing'] text-neon-gold -mb-[2vh]">
        New York City
      </div>
      <div className="text-[clamp(4rem,16vw,10rem)] font-bold font-['WhoopieSunday'] text-neon-pink leading-none">
        Photo Booth
      </div>
      <nav className="mt-[2vh]">
        <div className="text-[clamp(2rem,8vw,6rem)] font-bold font-['Timegoing'] text-neon-cyan">
          <Link to="/frame">Start</Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
