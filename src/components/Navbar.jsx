import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa6";

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header>
                <div className="container">
                    <nav>
                        <div className="logo">
                            <Link to="/"> 
                                <h2>TapestryBus</h2>
                            </Link>
                        </div>
                        <ul className={isOpen ? "nav-link active" : "nav-link"}>
                            <li><Link to="/bus" onClick={() => setIsOpen(false)}>Bus</Link></li> {/*className="active"*/}
                            <li><Link to="/weather" onClick={() => setIsOpen(false)}>Weather</Link></li>
                            <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                        </ul>
                        <div className="icon" onClick={toggleMenu}>
                            <FaBars />
                        </div>
                    </nav>
                </div>
            </header>
            {/*<section>
                <div className="container">
                    <div className="content">
                        <h2>Responsive shit</h2>
                    </div>
                </div>
            </section>*/}
        </>
    );   
}  

export default Navbar;