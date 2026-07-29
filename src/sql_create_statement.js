/*FOR UPDATING SUPABASE
USE ONE AT A TIME
COMMENT THE ONE U DONT NEED BEFORE RUNNING
*/

//Update new public Holidyas
//https://data.gov.sg/collections/691/view look for Singapore Public Holidays (consolidated)
const YEAR = 2026; // change this one variable each time

const DATASET_ID = "d_8ef23381f9417e4d4254ee8b4dcdb176"; // public holidays 2020-2027

async function fetchHolidaysForYear(year) {
  const url = `https://data.gov.sg/api/action/datastore_search?resource_id=${DATASET_ID}&limit=100`;
  const res = await fetch(url);
  const json = await res.json();

  const records = json.result.records;
  const holidaysForYear = records
    .filter(r => r.date.startsWith(String(year)))
    .map(r => r.date);

  return holidaysForYear;
}

function generateHolidayRefreshSQL(holidays) {
  const rows = holidays.map(date => `('${date}')`);
  return `
delete from holidays;

insert into holidays (holiday_date) values
${rows.join(",\n")}
on conflict (holiday_date) do nothing;
`;
}

fetchHolidaysForYear(YEAR).then(holidays => {
  console.log(generateHolidayRefreshSQL(holidays));
});

//Update bus timings
//const busSchedule = { /* paste your NEW schedule object here */ };

/*function generateFullRefreshSQL(schedule) {
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
  return `
delete from bus_timings;

insert into bus_timings (stop_name, day_type, time, dropoff_only) values
${rows.join(",\n")};
`;
}

console.log(generateFullRefreshSQL(busSchedule));

*/