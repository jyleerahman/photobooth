import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Frame() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>Choose layout</div>
            <nav>
                <div><Link to="/camera">A</Link></div>
                <div><Link to="/camera">B</Link></div>
            </nav>

        </>
    );
}

export default Frame;
