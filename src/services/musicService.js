import fetch from 'isomorphic-fetch';

export const donaldMusicAction = (command) => {
  const url = 'http://localhost:3001/music/' + command.action;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

}