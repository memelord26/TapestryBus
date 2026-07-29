/*FOR UPDATING SUPABASE
USE ONE AT A TIME
COMMENT THE ONE U DONT NEED BEFORE RUNNING
*/

//Update new public Holidyas
//https://data.gov.sg/collections/691/view look for Singapore Public Holidays (consolidated)
/*const YEAR = 2026; // change this one variable each time

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
}); */

//Update bus timings
const busSchedule = {
  Weekday: {
    "Tapestry Condo": [
      "6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00", "8:15", "8:30",
      "8:45", "9:00", "9:30", "10:00 (Dropoff only)", "11:30", "12:00",
      "12:30", "13:00", "13:30", "14:00", "14:30 (Dropoff only)", "17:00",
      "17:20", "17:40", "18:00", "18:20", "18:40", "19:00", "19:20", "19:40",
      "20:00", "20:20", "20:50", "21:15 (Dropoff only)"
    ],
    "Tampines West - Exit A": [
      "6:35", "6:50", "7:05", "7:20", "7:35", "7:50", "8:05", "8:20", "8:35",
      "8:50", "9:05", "9:35", "11:35", "12:05", "12:35", "13:05", "13:35",
      "14:05", "17:05", "17:25", "17:45", "18:05", "18:25", "18:45", "19:05",
      "19:25", "19:45", "20:05", "20:25", "20:55"
    ],
    "OTH": [
      "11:38", "12:08", "12:38", "13:08", "13:38", "14:08"
    ],
    "Tampines MRT - Exit B": [
      "06:40", "06:55", "07:10", "07:25", "07:40", "07:55", "08:10", "08:25",
      "08:40", "08:55", "09:10", "09:40", "11:40", "12:10", "12:40", "13:10",
      "13:40", "14:10", "17:10", "17:30", "17:50", "18:10", "18:30", "18:50",
      "19:10", "19:30", "19:50", "20:10", "20:30", "21:00"
    ]
  },
  Weekend: {
    "Tapestry Condo": [
      "8:00", "8:30", "9:00", "9:30", "10:00", "10:30 (Dropoff only)",
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
      "14:45", "15:15", "15:30", "15:45", "16:00", "16:30", "17:45", "18:15",
      "18:45", "19:15", "19:45", "20:15", "20:45", "21:15 (Dropoff only)"
    ],
    "Tampines West - Exit A": [
      "8:05", "8:35", "9:05", "9:35", "10:05", "11:05", "11:35", "12:05",
      "12:35", "13:05", "13:35", "14:05", "14:35", "14:50", "15:20", "15:35",
      "15:50", "16:05", "16:35", "17:50", "18:20", "18:50", "19:20", "19:50",
      "20:20", "20:50"
    ],
    "OTH": [
      "8:08", "8:38", "9:08", "9:38", "10:08", "11:08", "11:38", "12:08",
      "12:38", "13:08", "13:38", "14:08", "14:38", "14:53", "15:23", "15:38",
      "15:53", "16:08", "16:38", "17:53", "18:23", "18:53", "19:23", "19:53",
      "20:23", "20:53"
    ],
    "Tampines MRT - Exit B": [
      "8:10", "8:40", "9:10", "9:40", "10:10", "11:10", "11:40", "12:10",
      "12:40", "13:10", "13:40", "14:10", "14:40", "14:55", "15:25", "15:40",
      "15:55 (Dropoff only)", "16:10", "16:40 (Dropoff only)", "17:55",
      "18:25", "18:55", "19:25", "19:55", "20:25", "20:55"
    ]
  }
};

function generateFullRefreshSQL(schedule) {
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