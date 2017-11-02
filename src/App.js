import React, {Component} from 'react';
import Chance from 'chance';
import moment from 'moment';

import './App.css';

import fetch from 'isomorphic-fetch';

import {commands, commandParser} from './services/commandParser';

import img from './voice-recognition.jpg';

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
      commands: [],
      voiceRecognitionStatus: 'voice recognition is off',
      voiceRecognitionStarted: false
    };
  }

  componentDidMount() {
    this.startRecognition();
  }

  handleStartRecognize = (e) => {
    e.preventDefault();

    this.startRecognition();
  }

  startRecognition = () => {

    recognition.onstart = () => {
      this.setState({voiceRecognitionStatus: 'voice recognition activated - try speaking into the microphone'});
    }

    recognition.onend = () => {
      this.setState({voiceRecognitionStatus: 'voice recognition ended'});

      const command = this.state.content;

      if (command) {
        this.setState({
          commands: [
            ...this.state.commands, {
              time: moment(),
              command
            }
          ],
          content: ''
        });

        const recognizedCommand = commandParser(command);

        if (recognizedCommand) {
          if (recognizedCommand.key === commands.TRUMP_TWEETS.key) {
            getTrumpTweets();
          } else {
            donaldMusicAction(recognizedCommand);
          }
        }
      }

      recognition.start();
    }

    recognition.onerror = (event) => {
      this.setState({voiceRecognitionStatus: 'error while doing voice recognition'});

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

    this.setState({voiceRecognitionStarted: true});

  }

  handleStopRecognition = (e) => {
    e.preventDefault();

    recognition.onend = () => {
      this.setState({voiceRecognitionStatus: 'voice recognition is off'});
    }

    recognition.stop();

    this.setState({voiceRecognitionStarted: false});

  }

  getTrumpTweetsClick = (e) => {
    e.preventDefault();
    getTrumpTweets();
  }

  render() {
    /*
    const renderedVoiceRecognitionStatuses = [];

    if (this.state.voiceRecognitionStatuses.length) {
      for (let i = this.state.voiceRecognitionStatuses.length - 1; i >= 0; --i) {
        renderedVoiceRecognitionStatuses.push(
          <p key={chance.guid()} className="text-center">
            {moment().format('HH:MM:ss')}
            - {this.state.voiceRecognitionStatuses[i]}
          </p>
        );
      }
    }
    */

    const renderedCommands = [];

    if (this.state.commands.length) {
      for (let i = this.state.commands.length - 1; i >= 0; --i) {
        const timeText = this.state.commands[i].time.utc();
        const command = this.state.commands[i].command;

        const key = timeText + command;
        renderedCommands.push(
          <div key={key} className="columns command fade-in">
            <div className="column col-4 command-time">
              {this
          .state
          .commands[i]
          .time
          .fromNow()}
            </div>
            <div className="column col-8">
              {command}
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        <div className="bg-secondary">
          <section
            className="container grid-xs"
            style={{
            paddingTop: '2rem',
            paddingBottom: '1rem'
          }}>
            <h1 className="text-center title mysurance">OkPuter</h1>
          </section>

        </div>
        <section className="container grid-xs main-content">
          {!this.state.voiceRecognitionStarted && <p className="text-center">
            <button className="btn btn-primary" onClick={this.handleStartRecognize}>Start voice recognition</button>
          </p>
}
          {this.state.voiceRecognitionStarted && <p className="text-center">
            <button className="btn btn-primary" onClick={this.handleStopRecognition}>Stop voice recognition</button>
          </p>
}
          {/*
          <p className="text-center">
            <button className="btn btn-primary" onClick={this.getTrumpTweetsClick}>Get trump tweets</button>
          </p>
          */}
        </section>
        <section className="container grid-xl">
          <div className="divider text-center" data-content="available commands"></div>
          <div className="available-commands">
          <div className="columns command-list-row">
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">trump tweets</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">play music</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">stop music</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">pause music</button>
            </div>
          </div>
          <div className="columns command-list-row">
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">music volume up</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">music volume down</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">music set volume</button>
            </div>
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">next song</button>
            </div>
          </div>
          <div className="columns command-list-row">
            <div className="column col-3 col-xs-12 text-center">
              <button className="btn">next song</button>
            </div>
          </div>
          </div>
        </section>

        <section className="container grid-xs main-content">
          <div
            className="divider text-center voice-recognition-status"
            data-content={this.state.voiceRecognitionStatus}></div>
          <div className="main-content-commands">
            {renderedCommands}
          </div>
        </section>
        <section className="container grid-xl app-content">
          <img className="centered img-responsive" src={img} alt="funny"/>
        </section>

        <footer className="bg-dark">
          <section className="grid-footer container grid-xs">
            <div className="mysurance logo">
              OkPuter
            </div>
            <div>
              We do not use any cookies nor store any personal information.
            </div>
            <div>
              Licensed under the&nbsp;
              <a href="https://github.com/victorparmar/ok-puter/blob/master/LICENSE">MIT License</a>.
            </div>
          </section>
        </footer>
      </div>
    );
  }
}

export default App;
