import { ref } from "vue";
import { ConfigEnv } from "./env.config";

const itineraryPointToString = (itineraryPoint: ItineraryPoint) => {
    let itineraryPointString = "";
    //loop through itinerary points and add to string if name is empty omit it
    if (itineraryPoint.name === "") {
        itineraryPointString = `${itineraryPoint.lon},${itineraryPoint.lat}`;
    } else {
        //url encode the name
        const name = encodeURIComponent(itineraryPoint.name);
        itineraryPointString = `${itineraryPoint.lon},${itineraryPoint.lat},${name}`;
    }
    return itineraryPointString;
}

export const fetchCircularRouteCSM = async (itineraryPoint: ItineraryPoint, duration: number, distance: number) => {
    const url = ref("");

    if(duration == -1){
        url.value = `https://www.cyclestreets.net/api/journey.json?key=${ConfigEnv.apiKey}&itinerarypoints=${itineraryPointToString(itineraryPoint)}&plan=leisure&distance=${distance}`;
    }
    if(distance == -1){
        url.value = `https://www.cyclestreets.net/api/journey.json?key=${ConfigEnv.apiKey}&itinerarypoints=${itineraryPointToString(itineraryPoint)}&plan=leisure&duration=${duration}`;
    }
    const response = await fetch(url.value);
    const data = await response.json();
    return data;
}
export const testRouteCSM = async (itineraryPoints: ItineraryPoint) => {
    const distance = 1000;
    const duration = -1;
    const data = await fetchCircularRouteCSM(itineraryPoints,duration, distance);
    return data;
};
