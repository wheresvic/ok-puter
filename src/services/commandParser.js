export const commands = {
  TRUMP_TWEETS: {
    key: 'TRUMP_TWEETS',
    values: ['trump tweets']
  },
  DONALD_PLAY_MUSIC: {
    key: 'DONALD_PLAY_MUSIC',
    values: ['play music'],
    action: 'play'
  },
  DONALD_STOP_MUSIC: {
    key: 'DONALD_STOP_MUSIC',
    values: ['stop music'],
    action: 'stop'
  },
  DONALD_PAUSE_MUSIC: {
    key: 'DONALD_PAUSE_MUSIC',
    values: ['pause music'],
    action: 'pause'
  },
  DONALD_MUSIC_VOLUME_UP: {
    key: 'DONALD_MUSIC_VOLUME_UP',
    values: ['music volume up'],
    action: 'volume-up'
  },
  DONALD_MUSIC_VOLUME_DOWN: {
    key: 'DONALD_MUSIC_VOLUME_DOWN',
    values: ['music volume down'],
    action: 'volume-down'
  },
  DONALD_MUSIC_SET_VOLUME: {
    key: 'DONALD_MUSIC_SET_VOLUME',
    values: ['music set volume'],
    action: 'set-volume'
  },

  DONALD_NEXT_SONG: {
    key: 'DONALD_NEXT_SONG',
    values: ['next song'],
    action: 'next'
  },
  DONALD_PREVIOUS_SONG: {
    key: 'DONALD_PREVIOUS_SONG',
    values: ['previous song'],
    action: 'previous'
  }
}

export const commandParser = (text) => {

  for (const command of Object.keys(commands)) {
    for (const value of commands[command].values) {
      const textLower = text.toLowerCase();
      if (textLower.includes(value)) {
        
        if (commands[command].key === 'DONALD_MUSIC_SET_VOLUME') {
          const index = textLower.indexOf(value);
          const remainingText = textLower.substr(index + value.length + 1);
          
          let number = parseInt(remainingText, 10);
          if (!Number.isInteger(number)) {
            number = 25;
          }
          
          commands[command].action = 'set-volume-' + number;
        }
        
        return commands[command];
      }
    }
  }

  return null;
}