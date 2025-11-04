import "./App.css";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="text-[5rem] font-bold font-['Timegoing'] text-neon-gold -mb-10">
        New York City
      </div>
      <div className="text-[10rem] font-bold font-['WhoopieSunday'] text-neon-pink">
        Photo Booth
      </div>
      <nav>
        <div className="text-6xl font-bold font-['Timegoing'] text-neon-cyan">
          <Link to="/frame">Start</Link>
        </div>
      </nav>
    </div>
    </>
  );
}

export default App;
