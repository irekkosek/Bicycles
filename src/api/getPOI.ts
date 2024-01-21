import { ConfigEnv } from "./env.config";

export const fetchPOI = async (
  lat: number,
  lon: number,
  radius: number,
  limit: number
) => {
  const poisTypes = ["restaurants", "viewpoints", "parks"];
  const pois = await Promise.all(
    poisTypes.map(async (type) => {
      const url = `https://api.cyclestreets.net/v2/pois.locations?key=${ConfigEnv.apiKey}&type=${type}&longitude=${lon}&latitude=${lat}&radius=${radius}&limit=${limit}&fields=id,latitude,longitude,name,osmTags`;
      const response = await fetch(url);
      const data = await response.json();
      return { features: data.features };
    })
  );
  return pois;
};

export const testPOI = async () => {
  const lat = 50.29117904070245;
  const lon = 18.680356029431803;
  const radius = 1;
  const limit = 10;
  const data = await fetchPOI(lat, lon, radius, limit);
  return data;
};
