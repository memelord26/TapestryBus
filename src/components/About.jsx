import React from "react";

function About() {
    return(
        <>
            <div className="content">
                <h1>About</h1>
                <p>This app was created to help residents of Tapestry Condo in Tampines, Singapore keep track of the shuttle bus schedule. It provides real-time updates on bus arrival times and allows users to view the schedule for different days of the week. Do note that this is an individual project so there may be mistakes here and there.</p>
                <br />
                <p>Note: This schedule is based on the one released on 1st Dec 2025</p>
                <br />
                <p className="content-notes">Tap the image to see the full version</p>
                <a href={`${import.meta.env.BASE_URL}schedule/bus_dec2025.jpeg`} target="_blank" rel="noopener noreferrer">
                    <img src={`${import.meta.env.BASE_URL}schedule/bus_dec2025.jpeg`} alt="Dec'25 Bus Schedule"  style={{width: '200px'}}/>
                </a>
            </div>
        </>
    );
}

export default About;