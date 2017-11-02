import React, {Component} from 'react';
import Chance from 'chance';

import './App.css';

import fetch from 'isomorphic-fetch';

import {commands, commandParser} from './services/commandParser';

const chance = new Chance();

const responsiveVoice = window.responsiveVoice;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const speak = (text) => {

  return new Promise((resolve, reject) => {

    if (!text) {
      console.log('no text provided');
      resolve();
    }

    console.log(text);

    const speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => {
      resolve();
    };

    window
      .speechSynthesis
      .speak(speech);

  });

}

const getTrumpTweets = () => {

  return fetch('http://localhost:3001/timeline/realDonaldTrump', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  }).then(tweets => {
    console.log(tweets);

    const rand = chance.natural({min: 0, max: tweets.length});
    return speak(tweets[rand].text);

  }).catch(err => {
    console.error(err);
  });

}

const donaldMusicAction = (command) => {

  return fetch('http://localhost:3001/music/' + command.action, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(err => {
    console.error(err);
  });

}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: '',
      command: ''
    };
  }

  componentDidMount() {}

  recognize = (e) => {
    e.preventDefault();

    recognition.onstart = function () {
      console.log('Voice recognition activated. Try speaking into the microphone.');
    }

    recognition.onend = () => {
      console.log('Voice recognition ended.');

      const command = this.state.content;

      this.setState({command, content: ''});

      const recognizedCommand = commandParser(command);

      if (recognizedCommand) {
        if (recognizedCommand.key === commands.TRUMP_TWEETS.key) {
          getTrumpTweets();
        } else {
          donaldMusicAction(recognizedCommand);
        }

      }

      recognition.start();
    }

    recognition.onerror = function (event) {
      console.error('something bad happened :(');
      console.error(event);
    }

    recognition.onresult = (event) => {

      // event is a SpeechRecognitionEvent object. It holds all the lines we have
      // captured so far. We only need the current one.
      var current = event.resultIndex;

      // Get a transcript of what was said.
      var transcript = event.results[current][0].transcript;

      // Add the current transcript to the contents of our Note.
      this.setState({
        content: this.state.content += transcript
      });

    }

    recognition.start();

  }

  getTrumpTweetsClick = (e) => {
    e.preventDefault();
    getTrumpTweets();
  }

  render() {
    return (
      <section className="container grid-xs">
        <div>
          <button onClick={this.recognize}>Start voice recognition</button>
        </div>
        <div>
          <button onClick={this.getTrumpTweetsClick}>Get trump tweets</button>
        </div>
        <div>
          {this.state.command}
        </div>

      </section>

    );
  }
}

export default App;
