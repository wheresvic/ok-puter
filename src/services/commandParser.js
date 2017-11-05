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
    values: ['pause music', 'shut up'],
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
    action: 'set-volume',
    applyParam: (level) => {
      commands.DONALD_MUSIC_SET_VOLUME.action = 'set-volume-' + level;
      return commands.DONALD_MUSIC_SET_VOLUME;
    }
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
  },
  DONALD_DELETE_SONG: {
    key: 'DONALD_DELETE_SONG',
    values: ['delete song'],
    action: 'delete-current'
  },
  DONALD_SEEK_SONG: {
    key: 'DONALD_SEEK_SONG',
    values: ['seek song', 'forward song'],
    action: 'seek-by-30'
  },
  DONALD_TRAIN_DELAYS: {
    key: 'DONALD_TRAIN_DELAYS',
    values: ['train delay'],
    action: 8002546
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
          
          commands[command].applyParam(number);

          // commands[command].action = 'set-volume-' + number;
        }
        
        return commands[command];
      }
    }
  }

  return null;
}
