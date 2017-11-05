import fetch from 'isomorphic-fetch';

export const getRandomQuote = () => {

  return fetch('http://localhost:3001/quotes/random', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  });

}
