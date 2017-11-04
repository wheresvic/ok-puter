import fetch from 'isomorphic-fetch';
import moment from 'moment';

export const getTrainDelays = (evaNo, date, hour) => {
  const url = `http://localhost:3001/train/delays/${evaNo}/${date}/${hour}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  });
}

export const getDelayText = (trips) => {
  let text = '';
  const dateTimeFormat = 'YYMMDDHHmm';

  for (const tripId of Object.keys(trips)) {
    const trip = trips[tripId];

    if (trip.actualDeparture) {
      let finalDestination = '';

      if (trip.departurePath) {
        const destinations = trip
          .departurePath
          .split('|');

        if (destinations.length) {
          finalDestination = destinations[destinations.length - 1];
        }
      }

      const departureTime = moment(trip.departure, dateTimeFormat);
      const actualDepartureTime = moment(trip.actualDeparture, dateTimeFormat);

      const textDepartureTime = moment(departureTime).format('H:mm');

      const duration = moment.duration(actualDepartureTime.diff(departureTime));
      const minutes = duration.asMinutes();

      text += `${trip.trainName} leaving from Haltingen departing at ${textDepartureTime}` + (finalDestination
        ? ' going to ' + finalDestination
        : '') + ` is delayed by ${minutes} minutes. `;
    }
  }

  if (text === '') {
    text = 'No delays for Haltingen.';
  } else {
    text = 'Oh no ' + text;
  }

  return text;
};