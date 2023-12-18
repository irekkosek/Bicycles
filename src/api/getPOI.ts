// write function to fetch Points of Interets from the API
//https://api.cyclestreets.net/v2/pois.locations?type=cycleparking&longitude=0.11795&latitude=52.20530&radius=5&limit=3&fields=id,latitude,longitude,name,osmTags

import { ConfigEnv } from "./env.config";

export const fetchPOI = async ( lat: number, lon: number, radius: number, limit: number) => {
    const url = `https://api.cyclestreets.net/v2/pois.locations?key=${ConfigEnv.apiKey}&type=cycleparking&longitude=${lon}&latitude=${lat}&radius=${radius}&limit=${limit}&fields=id,latitude,longitude,name,osmTags`;
    console.log(url);
    // const response = await fetch(url)
    // await response.json().
    // then((data) => {
    //     console.log(JSON.parse(data).features[0]);
    // return data.features[0];
    // }).catch((error) => {
    //     console.log(error);
    // }
    // );
    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        console.log(data.features[0]);
        return data.features;
    }
    ).catch((error) => {
        console.log(error);
    }
    );
};