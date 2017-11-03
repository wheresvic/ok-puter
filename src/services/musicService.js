import fetch from 'isomorphic-fetch';

export const donaldMusicAction = (command) => {

  return fetch('http://localhost:3001/music/' + command.action, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

}