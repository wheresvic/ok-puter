
// const stations = require('../data/germany-train-stations.json');
import stations from  '../data/germany-train-stations.json';

export const getStations = () => {
  return stations.result;
}

export const searchStation = (query) => {
  for (const station of stations.result) {
    if (station.name.search(query) !== -1) {
      return station;
    }
  }
}