const publicHolidays2026 = [
  "2026-01-01", "2026-02-17", "2026-02-18", "2026-03-21", "2026-04-03",
  "2026-05-01", "2026-05-27", "2026-05-31", "2026-06-01", "2026-08-09",
  "2026-08-10", "2026-11-08", "2026-11-09", "2026-12-25",
];

function generateHolidayInserts(holidays) {
  const rows = holidays.map(date => `('${date}')`);
  return `insert into holidays (holiday_date) values\n${rows.join(",\n")};`;
}

console.log(generateHolidayInserts(publicHolidays2026));

//bus times
const busSchedule = { /* paste your existing object here */ };

function generateInserts(schedule) {
  const rows = [];
  for (const dayType of Object.keys(schedule)) {
    for (const stopName of Object.keys(schedule[dayType])) {
      for (const rawTime of schedule[dayType][stopName]) {
        const dropoffOnly = rawTime.includes("Dropoff only");
        const time = rawTime.split(" ")[0].trim();
        rows.push(`('${stopName}', '${dayType}', '${time}', ${dropoffOnly})`);
      }
    }
  }
  return `insert into bus_timings (stop_name, day_type, time, dropoff_only) values\n${rows.join(",\n")};`;
}

console.log(generateInserts(busSchedule));