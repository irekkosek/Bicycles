import { ConfigEnv } from "./env.config";

export const fetchElement = async ( name: String, fields: string, limit: number) => {
    const url = `https://api.cyclestreets.net/v2/geocoder?key=${ConfigEnv.apiKey}&q=${name}&limit=${limit}&fields=${fields}`;
    // const response = await fetch(url)
    // await response.json().
    // then((data) => {
    //     console.log(JSON.parse(data).features[0]);
    // return data.features[0];
    // }).catch((error) => {
    //     console.log(error);
    // }
    // );
    return(fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        console.log(data.features[0]);
        return data.features;
    }
    ).catch((error) => {
        console.log(error);
    }
    ));
};