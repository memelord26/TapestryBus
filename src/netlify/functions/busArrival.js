export async function handler(event) {
    const { busStopCode } = event.queryStringParameters;
    const response = await fetch(
        `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`,
        {
            headers: {
                AccountKey: process.env.LTA_ACCOUNT_KEY,
                accept: "accplication/json",
            },
        }
    );

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}