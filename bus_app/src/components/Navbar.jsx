import React, { useState } from "react";
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
                            <h2>TapestryBus</h2>
                        </div>
                        <ul className={isOpen ? "nav-link active" : "nav-link"}>
                            <li><a href="/Bus">Bus</a></li> {/*className="active"*/}
                            <li><a href="/Weather">Weather</a></li>
                            <li><a href="/About">About</a></li>
                        </ul>
                        <div className="icon" onClick={toggleMenu}>
                            <FaBars />
                        </div>
                    </nav>
                </div>
            </header>
            <section>
                <div className="container">
                    {/*<div className="content">
                        <h2>Responsive shit</h2>
                    </div>*/}
                </div>
            </section>
        </>
    );   
}  

export default Navbar;