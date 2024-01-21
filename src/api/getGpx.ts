// You can then request the GPX file, via a standard GET request. E.g. for itinerary no. 90413366 with the balanced strategy, the URLs would be:

// https://www.cyclestreets.net/journey/90413366/cyclestreets90413366balanced.gpx
// https://www.cyclestreets.net/journey/90413366/cyclestreets90413366balanced.kml
export const fetchGpx = async (url: string) => {
  const response = await fetch(url);
  return response;
};
