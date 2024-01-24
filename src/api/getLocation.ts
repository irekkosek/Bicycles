import { Geolocation } from '@capacitor/geolocation';
export const fetchCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
};
