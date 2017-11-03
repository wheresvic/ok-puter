import {expect} from 'chai';

import * as dbDeService from './dbDeService';

describe('dbDeService', () => {

  it('should get all stations', () => {
    // when
    const stations = dbDeService.getStations();

    // then
    expect(stations.length).to.equal(5364);
  });
  
  it('should search for a station', () => {
    // when
    const station = dbDeService.searchStation(/Freiburg \(Breisgau\) Hbf/i);

    // then
    expect(station.number).to.equal(1893);
  });

});