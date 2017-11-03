import fetch from 'isomorphic-fetch';

export const getTrumpTweets = () => {

  return fetch('http://localhost:3001/timeline/realDonaldTrump', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  });

}
