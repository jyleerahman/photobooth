import "./App.css";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>Photo Booth</div>
      <nav>
        <Link to="/frame">Start</Link>
      </nav>
    </>
  );
}

export default App;
