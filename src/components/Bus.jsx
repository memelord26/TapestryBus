import { supabase } from "../supabaseClient";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

function Bus() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openStops, setOpenStops] = useState({});
  const [isHoliday, setIsHoliday] = useState(false);
  const [scheduleData, setScheduleData] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [liveTimings, setLiveTimings] = useState({});

  const TARGET_SERVICE = "298";

  useEffect(() => {
    async function fetchData() {
      const { data: timings, error: timingsError } = await supabase
        .from("bus_timings")
        .select("*");
      const { data: holidayRows, error: holidayError } = await supabase
        .from("holidays")
        .select("holiday_date");

      if (timingsError) console.error(timingsError);
      if (holidayError) console.error(holidayError);

      const grouped = {};
      timings?.forEach(({ day_type, stop_name, time, dropoff_only }) => {
        if (!grouped[day_type]) grouped[day_type] = {};
        if (!grouped[day_type][stop_name]) grouped[day_type][stop_name] = [];
        grouped[day_type][stop_name].push(
          dropoff_only ? `${time} (Dropoff only)` : time
        );
      });
      setScheduleData(grouped);
      setHolidays(holidayRows?.map(h => h.holiday_date) || []);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const today = new Date();
    const todaystr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setIsHoliday(holidays.includes(todaystr));
    return () => clearInterval(timer);
  }, [holidays]);

  const dayOfWeek = currentTime.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const actualDayType = isWeekend ? "Weekend" : "Weekday";
    const scheduleType = (isWeekend || isHoliday) ? "Weekend" : "Weekday";
    const currentSchedule = scheduleData[scheduleType] || {};

    const showTime = currentTime.getHours().toString().padStart(2, '0') + ":" + currentTime.getMinutes().toString().padStart(2, '0');

    //bus stops order
    const stopOrder = [
        "Tapestry Condo",
        "Tampines West - Exit A",
        "OTH",
        "Tampines MRT - Exit B",
        "Blk 875B",
        "Opp Tampines Stn/Int",
        "Blk 945"
    ];

    const sortedStopEntries = Object.entries(currentSchedule).sort(
        ([a], [b]) => stopOrder.indexOf(a) - stopOrder.indexOf(b)
    );

    //live bus code num
    const liveStops = {
        "Blk 875B": "75041",
        "Opp Tampines Stn/Int": "76149",
        "Blk 945": "76111",
    };

    const toggleStop = (stopName) => {
        setOpenStops(prev => {
            const isOpening = !prev[stopName];
            if (isOpening && liveStops[stopName]) {
            fetchLiveArrival(stopName, liveStops[stopName]);
            }
            return isOpening ? { [stopName]: true } : { [stopName]: false };
        });
    };

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
    //live bus timings
    const fetchLiveArrival = async (stopName, busStopCode) => {
        const res = await fetch(`/.netlify/functions/busArrival?busStopCode=${busStopCode}`);
        const data = await res.json();
        const filtered = data.Services?.filter(service => service.ServiceNo === TARGET_SERVICE) || [];
        setLiveTimings(prev => ({ ...prev, [stopName]: filtered }));
    };
    
    return(
        <>
            <div className="content">
                <h2 align="center">{showTime}</h2>
                <h3 align="center">{actualDayType}{isHoliday && ' (Public Holiday)'}</h3>
                <div className="bus-stop-container">
                    {sortedStopEntries.map(([stopName, times]) => {
                        const sortedTimes = sortTimes(times);
                        return (
                            <div key={stopName} className="bus-stop">
                                <button className={`stop-header ${openStops[stopName] ? 'open' : ''}`} onClick={() => toggleStop(stopName)}>
                                    <h4>{stopName}</h4>
                                    {openStops[stopName] ? <ChevronDown size={40} /> : <ChevronRight size={40} />}
                                </button>
                                {openStops[stopName] && (
                                    <ul className="times-list">
                                        {liveStops[stopName] ? (
                                        liveTimings[stopName]?.length > 0 ? (
                                            liveTimings[stopName].map(service => (
                                                <li key={service.ServiceNo} className="times-li">
                                                    <span className="time-text">Bus {service.ServiceNo}</span>
                                                    <span className="time-countdown">
                                                    {Math.max(0, Math.round((new Date(service.NextBus.EstimatedArrival) - new Date()) / 60000))} mins{" | "}
                                                    {Math.max(0, Math.round((new Date(service.NextBus2.EstimatedArrival) - new Date()) / 60000))} mins
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="times-li">No buses currently running</li>
                                        )
                                        ) : (
                                        sortedTimes.map((time, index) => (
                                            <li className={`times-li ${getMinsUntil(time) === "Left" ? 'left' : ''}`} key={index}>
                                            <span className="time-text">{time}</span>
                                            <span className="time-countdown">{getMinsUntil(time)}</span>
                                            </li>
                                        ))
                                        )}
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