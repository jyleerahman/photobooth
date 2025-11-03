import "./App.css";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div className="text-[100px] font-bold font-['Timegoing']">New York City</div>
      <div className="text-[170px] font-bold font-['WhoopieSunday'] text-white">Photo Booth</div>
      <nav>
        <div className="text-6xl font-bold font-['Timegoing']"><Link to="/frame">Start</Link></div>
      </nav>
    </>
  );
}

export default App;
