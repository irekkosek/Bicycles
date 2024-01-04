import { ConfigEnv } from "./env.config";
import { ItineraryPoint } from ".";

//example url https://api.mapy.cz/v1/routing/route?apikey=eyJpIjoyNTcsImMiOjE2Njc0ODU2MjN9.c_UlvdpHGTI_Jb-TNMYlDYuIkCLJaUpi911RdlwPsAY&start=14.40094&start=50.0711&end=16.5990122&end=49.1718222&routeType=bike_road&lang=pl&format=geojson&avoidToll=false&waypoints=15.5903861%2C%2049.3967233&waypoints=16.4187328%2C%2049.3414642


// Planning Types
// Planning supports various types of planning, according to which it optimizes the proposed route:
// car – fast – searches for a fast car route
// car – fast with traffic – searches for a fast car route considering the current traffic conditions, congestion, etc. (only in the Czech Republic, without considering traffic outside the Czech Republic)
// car – short – searches for a short car route
// foot – fast – searches for a fast walking route
// bicycle – road – searches for a route for road bicycles, with asphalt surface, preferring cycle paths and bike trails
// bicycle – mountain – searches for a route for mountain bikes, preferring cycle paths and bike trails regardless of the surface

export enum routeType {
    carFast = "car_fast",
    carFastWithTraffic = "car_fast_traffic",
    carShort = "car_short",
    footFast = "foot_fast",
    bikeRoad = "bike_road",
    bikeMountain = "bike_mountain"
}

export enum langType {
    cz = "cz",
    en = "en",
    de = "de",
    pl = "pl",
    sk = "sk"
}

export enum formatTypeMC {
    geojson = "geojson",
    polyline = "polyline",
    polyline6 = "polyline6"
}
const itineraryPointsToStringMC = (itineraryPoints: ItineraryPoint[]) => {
    let itineraryPointsString = "";
    itineraryPoints.forEach((point) => {
            itineraryPointsString += `${point.lon},${point.lat};`;
    });
    return itineraryPointsString.slice(0, -1);
}
/**
 *   Return Values
 * 
 *   - length - Route length in meters
 *   - duration - Estimated time for passage in seconds
 *   - geometry	Route geometry suitable for map rendering (in the chosen format)
 * 
 *   endpoint documentation https://api.mapy.cz/v1/docs/routing/#/routing
 */
export const fetchRouteMC = async (itineraryPoints: ItineraryPoint[], route: routeType = routeType.bikeRoad, lang: langType = langType.en, outputFormat: formatTypeMC = formatTypeMC.geojson, avoidToll: boolean = false) => {
    // console.log(ConfigEnv.mapyCZApiKey)
    //url with params and interary points as string with start and end being the first and the last points and waypoints being the rest
    const url = `https://api.mapy.cz/v1/routing/route?apikey=${ConfigEnv.mapyCZApiKey}&start=${itineraryPoints[0].lon}&start=${itineraryPoints[0].lat}&end=${itineraryPoints[itineraryPoints.length - 1].lon}&end=${itineraryPoints[itineraryPoints.length - 1].lat}&routeType=${route}&lang=${lang}&format=${outputFormat}&avoidToll=${avoidToll}&waypoints=${itineraryPointsToStringMC(itineraryPoints.slice(1, -1))}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;

}

export const testRouteMC = async () => {
    const itineraryPoints: ItineraryPoint[] = [
        {
            lat: 50.29117904070245,
            lon: 18.680356029431803,
            name: "City Centre"
        },
        {
            lat: 50.29117904070245,
            lon: 18.680356029431803,
            name: "City Centre"
        },
        {
            lat: 50.29117904070245,
            lon: 18.680356029431803,
            name: "City Centre"
        }
    ];
    const route = routeType.bikeRoad;
    const lang = langType.en;
    const outputFormat = formatTypeMC.geojson;
    const avoidToll = false;
    const data = await fetchRouteMC(itineraryPoints, route, lang, outputFormat, avoidToll);
    console.log(data)
    return data.geometry;
}