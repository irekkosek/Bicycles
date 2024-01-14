import { ConfigEnv } from "./env.config";

export const fetchNearestPoint = async ( lon: number, lat: number) => {
    const url = `https://api.cyclestreets.net/v2/nearestpoint?key=${ConfigEnv.apiKey}&lonlat=${lon},${lat}
    `;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};