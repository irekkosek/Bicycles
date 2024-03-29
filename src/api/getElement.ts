import { ConfigEnv } from "./env.config";

export const fetchGeocodingResults = async (
  name: String,
  fields: string,
  limit: number
) => {
  const url = `https://api.cyclestreets.net/v2/geocoder?key=${ConfigEnv.apiKey}&q=${name}&limit=${limit}&fields=${fields}&bbox=-25,35,40,71&bounded=1`;
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data.features;
    })
    .catch((error) => {
      console.log(error);
    });
};
