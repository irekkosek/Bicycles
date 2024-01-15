import { ConfigEnv } from "./env.config";
import L from "leaflet";

//example url https://www.cyclestreets.net/api/journey.json?key=registeredapikey&reporterrors=1&itinerarypoints=0.11795,52.20530,City+Centre|0.13140,52.22105,Mulberry+Close|0.14732,52.19965,Thoday+Street&plan=quietest

// itinerarypoints - String of waypoints: longitude,latitude|… or longitude,latitude,name|…
// Each waypoint is separated by a | character and the name is optional. There can be at most 30 waypoints. Each of the waypoint stages is calculated serially so keep them to a minimum for the quickest response time. There is no need for longitudes and latitudes to have more than five decimal places because this gives accuracy to approximately 1 metre on the Earth's surface. Note that there is an overall limit of around 2000 characters for a URL.
// Adjacent waypoints that are closer than 4 metres when resolved onto the cycle network are treated as duplicates and ignored.

//new type for itinerary points
export type ItineraryPoint = {
  lat: number;
  lon: number;
  name: string; //can
};

// plan string
// The type of route, which can be one of the values: balanced, fastest, quietest. There is also shortest but see the notes below.
// balanced: We recommend this to be the default route type in your interface - it aims to give practical routes that balance speed and pleasantness, suitable for most riders.
// fastest: This route type will tend to favour busier roads that suit more confident riders.
// quietest: The route type will produce more pleasant, but often less direct, routes.
// shortest: In general we do not recommend including this in your interface unless you have a need for it, as this will not give particularly practical routes. These will be literally the shortest route, with only land ownership rights causing any deviation from this. It will suggest, for instance, dismounting and walking down the opposite direction of a one-way street, and will gladly route over the top of a hill when that is the shortest distance.

export enum planType {
  balanced = "balanced",
  fastest = "fastest",
  quietest = "quietest",
  shortest = "shortest",
  leisure = "leisure",
}

//function to convert itinerary points to string
const itineraryPointsToString = (itineraryPoints: ItineraryPoint[]) => {
  let itineraryPointsString = "";
  //loop through itinerary points and add to string if name is empty omit it
  itineraryPoints.forEach((point) => {
    if (point.name === "") {
      itineraryPointsString += `${point.lon},${point.lat}|`;
    } else {
      //url encode the name
      const name = encodeURIComponent(point.name);
      itineraryPointsString += `${point.lon},${point.lat},${name}|`;
    }
  });
  return itineraryPointsString.slice(0, -1);
};
/**
 *
 * @param itineraryPoints
 * @param plan
 * @returns Return values, in detail https://www.cyclestreets.net/api/v1/journey/#jpReturn
 *
 */

const convertToGeoJSON = (data: any) => {
  const mappedData = data.marker[0]["@attributes"].coordinates
    .split(" ")
    .map((point: string) => {
      const [lon, lat] = point.split(",");
      return [parseFloat(lon), parseFloat(lat)];
    });
  const convertedToGeoJSON = {
    geometry: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: mappedData,
      },
      properties: {},
    },
  };

  return convertedToGeoJSON;
};

export const fetchLoopRouteCSM = async (
  itineraryPoint: string,
  params: string
) => {
  const url = `https://www.cyclestreets.net/api/journey.json?key=${ConfigEnv.apiKey}&reporterrors=1&itinerarypoints=${itineraryPoint}&plan=leisure&${params}`;

  const response = await fetch(url);
  const data = await response.json();

  return convertToGeoJSON(data);
};

export const fetchRouteCSM = async (
  itineraryPoints: ItineraryPoint[],
  plan: planType
) => {
  const url = `https://www.cyclestreets.net/api/journey.json?key=${
    ConfigEnv.apiKey
  }&reporterrors=1&itinerarypoints=${itineraryPointsToString(
    itineraryPoints
  )}&plan=${plan}`;
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

export const testRouteCSM = async () => {
  const itineraryPoints: ItineraryPoint[] = [
    {
      lat: 52.2053,
      lon: 0.11795,
      name: "City Centre",
    },
    {
      lat: 52.22105,
      lon: 0.1314,
      name: "Mulberry Close",
    },
    {
      lat: 52.19965,
      lon: 0.14732,
      name: "Thoday Street",
    },
  ];
  const plan = planType.balanced;
  const data = await fetchRouteCSM(itineraryPoints, plan);
  console.log(data);
  console.log(
    "L.marker((waypoint['@attributes'].longitude, waypoint['@attributes'].latitude)):"
  );
  data.waypoint.forEach((waypoint: any) => {
    console.log(
      L.marker(
        (waypoint["@attributes"].longitude, waypoint["@attributes"].latitude)
      )
    );
  });
  return data;
};
