import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

function Bus() {
    //current time in 24hrs
    const [currentTime, setCurrentTime] = useState(new Date());
    const [openStops, setOpenStops] = useState({});
    //public holidays
    const [isHoliday, setIsHoliday] = useState(false);
    useEffect(() => {
        //update current time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        //public holiday
        const today = new Date();
        const todaystr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const publicHolidays2026 = [
            "2026-01-01",
            "2026-02-17",
            "2026-02-18",
            "2026-03-21",
            "2026-04-03",
            "2026-05-01",
            "2026-05-27",
            "2026-05-31",
            "2026-08-09",
            "2026-11-08",
            "2026-12-25",
        ];
        setIsHoliday(publicHolidays2026.includes(todaystr));
        console.log("Today is holiday:", todaystr, 'IsHoliday:', publicHolidays2026.includes(todaystr));
        return () => clearInterval(timer);
    }, []);
    const showTime = currentTime.getHours().toString().padStart(2, '0') + ":" + currentTime.getMinutes().toString().padStart(2, '0');

    //day of the week
    const dayOfWeek = currentTime.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const actualDayType = isWeekend ? "Weekend" : "Weekday";
    const scheduleType = (isWeekend || isHoliday) ? "Weekend" : "Weekday";

    //bus schedule
    const busSchedule = {
        Weekday: { 
            "Tapestry Condo": ["6:30", "6:45", "6:45", "7:00", "7:15", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "10:00 (Dropoff only)",
                "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30 (Dropoff only)",
                "17:00", "17:20", "17:40", "18:00", "18:20", "18:40", "19:00", "19:20", "19:40", "20:00", "20:20", "20:50", "21:15 (Dropoff only)"
            ], 
            "Tampines West - Exit A": ["6:35", "6:50", "7:05", "7:20", "7:35", "7:50", "8:05", "8:20", "8:35", "8:50", "9:05", "9:35",
                "11:35", "12:05", "12:35", "13:05", "13:35", "14:05",
                "17:05", "17:25", "17:45", "18:05", "18:25", "18:45", "19:05", "19:25", "19:45", "20:05", "20:25", "20:55"
            ],
            "OTH": ["11:38", "12:08", "12:38", "13:08", "13:38", "14:08",],
            "Tampines MRT - Exit B": ["06:40", "06:55", "07:10", "07:25", "07:40", "07:55", "08:10", "08:25", "08:40", "08:55", "09:10", "09:40",
                "11:40", "12:10", "12:40", "13:10", "13:40", "14:10",
                "17:10", "17:30", "17:50", "18:10", "18:30", "18:50", "19:10", "19:30", "19:50", "20:10", "20:30", "21:00"
            ] 
        },
        Weekend: { 
            "Tapestry Condo": ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30 (Dropoff only)",
                "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "14:45", "15:15", "15:30", "15:45", "16:00", "16:30",
                "17:45", "18:15", "18:45", "19:15", "19:45", "20:15", "20:45", "21:15 (Dropoff only)"
            ], 
            "Tampines West - Exit A": ["8:05", "8:35", "9:05", "9:35", "10:05",
                "11:05", "11:35", "12:05", "12:35", "13:05", "13:35", "14:05", "14:35", "14:50", "15:20", "15:35", "15:50", "16:05", "16:35",
                "17:50", "18:20", "18:50", "19:20", "19:50", "20:20", "20:50"
            ], 
            "OTH": ["8:08", "8:38", "9:08", "9:38", "10:08",
                "11:08", "11:38", "12:08", "12:38", "13:08", "13:38", "14:08", "14:38", "14:53", "15:23", "15:38", "15:53", "16:08", "16:38",
                "17:53", "18:23", "18:53", "19:23", "19:53", "20:23", "20:53"
            ],
            "Tampines MRT - Exit B": ["8:10", "8:40", "9:10", "9:40", "10:10",
                "11:10", "11:40", "12:10", "12:40", "13:10", "13:40", "14:10", "14:40", "14:55", "15:25", "15:40", "15:55 (Dropoff only)", "16:10", "16:40 (Dropoff only)",
                "17:55", "18:25", "18:55", "19:25", "19:55", "20:25", "20:55"
            ] 
        }
    };
    //show which timetable
    const currentSchedule = busSchedule[scheduleType];
    const toggleStop = (stopName) => {
        setOpenStops(prev => {
            if (prev[stopName]) {
                return { [stopName]: false };
            }
            return { [stopName]: true };
        })
    }
    //convert time to string to mins since midnight
    const timeToMins = (timeStr) => {
        const timeOnly = timeStr.split(" ")[0].split("(")[0].trim();
        const [hours, minutes] = timeOnly.split(":").map(Number);
        return hours * 60 + minutes;
    }
    //calculate mins till arrival
    const getMinsUntil = (timeStr) => {
        const busMins = timeToMins(timeStr);
        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
        let diff = busMins - currentMins;
        if (diff < 0) {
            return "Left";
        } else if (diff === 0) {
            return "Arr";
        } else {
            return `${diff} mins`;
        }
    }
    //sort times with upcoming buses first
    const sortTimes = (times) => {
        const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
        const upcoming = times.filter(time => timeToMins(time) >= currentMins);
        const passed = times.filter(time => timeToMins(time) < currentMins);
        return [...upcoming, ...passed];
    }
    
    return(
        <>
            <div className="content">
                <h2 align="center">{showTime}</h2>
                <h3 align="center">{actualDayType}{isHoliday && ' (Public Holiday)'}</h3>
                <div className="bus-stop-container">
                    {Object.entries(currentSchedule).map(([stopName, times]) => {
                        const sortedTimes = sortTimes(times);
                        return (
                            <div key={stopName} className="bus-stop">
                                <button className={`stop-header ${openStops[stopName] ? 'open' : ''}`} onClick={() => toggleStop(stopName)}>
                                    <h4>{stopName}</h4>
                                    {openStops[stopName] ? <ChevronDown size={40} /> : <ChevronRight size={40} />}
                                </button>
                                {openStops[stopName] && (
                                    <ul className="times-list">
                                        {sortedTimes.map((time, index) => (
                                            <li className={`times-li ${getMinsUntil(time) === "Left" ? 'left' : ''}`} key={index}>
                                                <span className="time-text">{time}</span>
                                                <span className="time-countdown">{getMinsUntil(time)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default Bus;