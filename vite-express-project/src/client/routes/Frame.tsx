import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Frame() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="text-[5rem] font-bold font-['Timegoing']" 
            style={{
          color: '#FF1493',
          textShadow: `
            3px 3px 0 #000,
            -3px -3px 0 #000,
            3px -3px 0 #000,
            -3px 3px 0 #000,
            0 0 30px rgba(255, 20, 147, 0.6)
          `}}>Choose layout</div>
            <nav>
                <div><Link to="/camera">A</Link></div>
                <div><Link to="/camera">B</Link></div>
            </nav>

        </>
    );
}

export default Frame;
