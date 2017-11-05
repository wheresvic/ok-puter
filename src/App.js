import React, {Component} from 'react';
import Chance from 'chance';
import moment from 'moment';

import './App.css';

// import fetch from 'isomorphic-fetch';

import {commands, commandParser} from './services/commandParser';
import {speak} from './services/speaker';
import {getTrumpTweets} from './services/tweetService';
import {donaldMusicAction} from './services/musicService';
import * as trainService from './services/trainService';

import img from './voice-recognition.jpg';

const chance = new Chance();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const CommandEntry = (props) => {
  return (
    <div className="columns command fade-in">
      <div className="column col-4 command-time">
        {props.time}
      </div>
      <div className="column col-8">
        {props.command}
      </div>
    </div>
  );
}

class MusicSetVolumeModal extends Component {
  constructor(props) {
    super(props);
  }

  onCancelClick = (e) => {
    this
      .props
      .doCancel();
  }

  onSendClick = (e) => {
    this
      .props
      .doSend('30');
  }

  render() {
    return (
      <div
        className={"modal modal-sm " + (this.props.isActive
        ? 'active'
        : '')}>
        <div className="modal-overlay"></div>
        <div className="modal-container">
          <div className="modal-header">
            {/*<button className="btn btn-clear float-right"></button>*/}
            <div className="modal-title h5">Command params</div>
          </div>
          <div className="modal-body">
            <div className="content">
              blah blah
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={this.onCancelClick}>Cancel</button>
            <button className="btn btn-primary mx-1" onClick={this.onSendClick}>Send</button>
          </div>
        </div>
      </div>
    );
  }
}

const resetModal = () => {
  return {isActive: false, onCancelClick: null, onSendClick: null, content: null};
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: '',
      commands: [],
      voiceRecognitionStatus: 'voice recognition is off',
      voiceRecognitionStarted: false,
      commandOutput: '',
      commandOutputTime: null,
      modalMusicSetVolume: {
        isActive: false,
        doCancel: () => {
          this.setState({
            modalMusicSetVolume: {
              ...this.state.modalMusicSetVolume,
              isActive: false
            }
          });
        },
        doSend: (level) => {
          this.setState({
            modalMusicSetVolume: {
              ...this.state.modalMusicSetVolume,
              isActive: false
            }
          });

          const command = commands
            .DONALD_MUSIC_SET_VOLUME
            .applyParam(level);
          this.doDonaldMusicAction(command);
        }
      }
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
            this.doGetTrumpTweets();
          } else if (recognizedCommand.key === commands.DONALD_TRAIN_DELAYS.key) {
            this.doGetTrainDelays(recognizedCommand);
          } else {
            this.doDonaldMusicAction(recognizedCommand);
          }
        }
      }

      recognition.start();
    }

    /*
    recognition.onerror = (event) => {
      this.setState({voiceRecognitionStatus: 'error while doing voice recognition'});

      console.error(event);
    }
    */

    recognition.onresult = (event) => {

      // event is a SpeechRecognitionEvent object. It holds all the lines we have
      // captured so far. We only need the current one.
      var current = event.resultIndex;

      // Get a transcript of what was said.
      var transcript = event.results[current][0].transcript;

      // Add the current transcript to the contents of our Note.
      const newContent = this.state.content + transcript;
      this.setState({content: newContent});

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
    this.doGetTrumpTweets();
  }

  doDonaldMusicAction = (command) => {
    donaldMusicAction(command).then(response => {
      console.log(response);

      this.setState({commandOutput: `${response.url} - ${response.status}`, commandOutputTime: moment()});

    }).catch(err => {
      console.error(err);
      this.setState({
        commandOutput: err + '',
        commandOutputTime: moment()
      });
    });
  }

  doGetTrumpTweets = () => {
    getTrumpTweets().then(tweets => {
      console.log(tweets);

      const rand = chance.natural({min: 0, max: tweets.length});
      return speak(tweets[rand].text);

    }).then(text => {
      this.setState({commandOutput: text, commandOutputTime: moment()});
    }).catch(err => {
      console.error(err);
      this.setState({
        commandOutput: err + '',
        commandOutputTime: moment()
      });
    });
  }

  doDonaldMusicSetVolume = () => {
    this.setState({
      modalMusicSetVolume: {
        ...this.state.modalMusicSetVolume,
        isActive: true
      }
    });
  }

  doGetTrainDelays = (command) => {
    const now = moment();
    const date = now.format('YYMMDD');
    const hour = now.format('HH');

    trainService
      .getTrainDelays(command.action, date, hour)
      .then(trips => {
        return trainService.getDelayText(trips);
      })
      .then(text => {
        this.setState({commandOutput: text, commandOutputTime: moment()});
        return speak(text);
      })
      .catch(err => {
        this.setState({
          commandOutput: err + '',
          commandOutputTime: moment()
        });
        console.error(err);
      });
  }

  render() {

    const renderedCommands = [];

    if (this.state.commands.length) {
      for (let i = this.state.commands.length - 1; i >= 0; --i) {
        const timeText = this
          .state
          .commands[i]
          .time
          .utc();
        const command = this.state.commands[i].command;

        const key = timeText + command;
        renderedCommands.push(<CommandEntry
          key={key}
          time={this
          .state
          .commands[i]
          .time
          .fromNow()}
          command={command}/>);
      }
    }

    const renderedVoiceRecognitionButton = this.state.voiceRecognitionStarted
      ? (
        <button className="btn btn-primary" onClick={this.handleStopRecognition}>Stop voice recognition</button>
      )
      : (
        <button className="btn btn-primary" onClick={this.handleStartRecognize}>Start voice recognition</button>
      );

    const renderedCommandOutput = this.state.commandOutput
      ? (
        <code className="fade-in">{this.state.commandOutput}</code>
      )
      : null;

    const commandOutputTimeStr = this.state.commandOutputTime
      ? this
        .state
        .commandOutputTime
        .fromNow()
      : 'command output';

    return (
      <div>
        <MusicSetVolumeModal
          isActive={this.state.modalMusicSetVolume.isActive}
          doCancel={this.state.modalMusicSetVolume.doCancel}
          doSend={this.state.modalMusicSetVolume.doSend}/>
        <div className="bg-secondary">
          <section
            className="container grid-xs"
            style={{
            paddingTop: '2rem',
            paddingBottom: '1rem'
          }}>
            <h1 className="text-center title mysurance">Ok Puter</h1>
          </section>

        </div>
        <section className="container grid-xs main-content">
          <p className="text-center">
            {renderedVoiceRecognitionButton}
          </p>
        </section>
        <section className="container grid-xl">
          <div className="divider text-center" data-content="available commands"></div>
          <div className="available-commands">
            <div className="columns command-list-row">
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button className="btn" onClick={this.doGetTrumpTweets}>trump tweets</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_PLAY_MUSIC)}>play music</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_STOP_MUSIC)}>stop music</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_PAUSE_MUSIC)}>pause music</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_MUSIC_VOLUME_UP)}>music volume up</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_MUSIC_VOLUME_DOWN)}>music volume down</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button className="btn" onClick={this.doDonaldMusicSetVolume}>music set volume &lt;[0-100]&gt;</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_NEXT_SONG)}>next song</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_PREVIOUS_SONG)}>previous song</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_DELETE_SONG)}>delete song</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doDonaldMusicAction
                  .bind(this, commands.DONALD_SEEK_SONG)}>seek song</button>
              </div>
              <div className="column col-3 col-md-4 col-sm-12 text-center">
                <button
                  className="btn"
                  onClick={this
                  .doGetTrainDelays
                  .bind(this, commands.DONALD_TRAIN_DELAYS)}>Get train delays for haltingen</button>
              </div>

            </div>
          </div>
          <div
            className="divider text-center voice-recognition-status"
            data-content={commandOutputTimeStr}></div>
          <div className="app-content text-center">
            {renderedCommandOutput}
          </div>
        </section>

        <section className="container grid-xs">
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
              Ok Puter
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
