import {expect} from 'chai';

import {commands, commandParser} from './commandParser';

describe('commandParser', () => {

  it('should get trump tweets', () => {
    // when
    const command = commandParser('trump tweets');

    // then
    expect(command.TRUMP_TWEETS).to.be.not.null;
  });

  it('should return null for unknown command', () => {
    // when
    const command = commandParser('rump tweets');

    // then
    expect(command).to.be.null;
  });
  
  it('should return set volume command', () => {
    // when
    const command = commandParser('donald music set volume 100');

    // then
    expect(command.action).to.equal('set-volume-100');
  });

  it('should return stop music command', () => {
    // when
    const command = commandParser('donald shut up');

    // then
    expect(command.action).to.equal('pause');
  });

});