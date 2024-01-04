import { ConfigEnv } from "./env.config";

export type ItineraryPoint = {
    lat: number;
    lon: number;
    name: string; //can 
};


const itineraryPointToString = (itineraryPoint: ItineraryPoint) => {
    let itineraryPointString = "";
    //loop through itinerary points and add to string if name is empty omit it
        if (itineraryPoint.name === "") {
            itineraryPointString += `${itineraryPoint.lon},${itineraryPoint.lat}|`;
        } else {
            //url encode the name
            const name = encodeURIComponent(itineraryPoint.name);
            itineraryPointString += `${itineraryPoint.lon},${itineraryPoint.lat},${name}|`;
        }
    return itineraryPointString.slice(0, -1);
}

export const fetchCircularRouteCSMDuration = async (itineraryPoint: ItineraryPoint, duration: number) => {
    const url = `https://www.cyclestreets.net/api/journey.json?key=${ConfigEnv.apiKey}&itinerarypoints=${itineraryPointToString(itineraryPoint)}&plan=leisure&duration=${duration}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export const fetchCircularRouteCSMDistance = async (itineraryPoint: ItineraryPoint, distance: number) => {
    const url = `https://www.cyclestreets.net/api/journey.json?key=${ConfigEnv.apiKey}&itinerarypoints=${itineraryPointToString(itineraryPoint)}&plan=leisure&distance=${distance}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export const testRouteCSM = async () => {
    const itineraryPoints: ItineraryPoint =
    {
        lat: 52.20530,
        lon: 0.11795,
        name: "City Centre"
    };
    const distance = 1000;
    const data = await fetchCircularRouteCSMDuration(itineraryPoints, distance);
    console.log(data)
    console.log("L.marker((waypoint['@attributes'].longitude, waypoint['@attributes'].latitude)):")
    return data;
};