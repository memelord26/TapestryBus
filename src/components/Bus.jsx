import React, { useState, useEffect } from "react";

function Bus() {
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const showTime = currentTime.getHours().toString().padStart(2, '0') + ":" + currentTime.getMinutes().toString().padStart(2, '0');
    return(
        <>
            <div className="content">
                <h2 align="center">{showTime}</h2>
            </div>
        </>
    );
}

export default Bus;