import {expect} from 'chai';

import * as trainService from './trainService';

describe('trainService', () => {

  it('should get train delay text', () => {
    // given
    const trips = {
      "-965636475352124471-1711031507-23": {
        "tripId": "-965636475352124471-1711031507-23",
        "trainName": "RE-5343",
        "arrival": "1711031702",
        "actualArrival": "1711031708",
        "departure": "1711031703",
        "actualDeparture": "1711031709",
        "arrivalPath": "Offenburg|Lahr(Schwarzw)|Orschweier|Ringsheim|Herbolzheim(Breisg)|Kenzingen|Riegel-Malterdingen|Emmendingen|Denzlingen|Freiburg(Breisgau) Hbf|Schallstadt|Bad Krozingen|Heitersheim|Müllheim(Baden)|Auggen|Schliengen|Bad Bellingen|Rheinweiler|Kleinkems|Istein|Efringen-Kirchen|Eimeldingen",
        "departurePath": "Weil am Rhein|Basel Bad Bf|Basel SBB"
      },
      "7381934264214712371-1711031534-23": {
        "tripId": "7381934264214712371-1711031534-23",
        "trainName": "RB-17031",
        "arrival": "1711031722",
        "actualArrival": "1711031722",
        "departure": "1711031723",
        "actualDeparture": "1711031723",
        "arrivalPath": "Offenburg|Friesenheim(Baden)|Lahr(Schwarzw)|Orschweier|Herbolzheim(Breisg)|Kenzingen|Riegel-Malterdingen|Emmendingen|Kollmarsreute|Denzlingen|Gundelfingen(Breisgau)|Freiburg(Breisgau) Hbf|Freiburg-St Georgen|Ebringen|Schallstadt|Bad Krozingen|Heitersheim|Buggingen|Müllheim(Baden)|Schliengen|Bad Bellingen|Efringen-Kirchen",
        "departurePath": "Weil am Rhein|Basel Bad Bf"
      },
      "8279354435299134760-1711031736-4": {
        "tripId": "8279354435299134760-1711031736-4",
        "trainName": "RE-5338",
        "arrival": "1711031754",
        "actualArrival": "",
        "departure": "1711031754",
        "actualDeparture": "",
        "arrivalPath": "Basel SBB|Basel Bad Bf|Weil am Rhein",
        "departurePath": "Eimeldingen|Efringen-Kirchen|Istein|Kleinkems|Rheinweiler|Bad Bellingen|Schliengen|Auggen|Müllheim(Baden)|Heitersheim|Bad Krozingen|Schallstadt|Freiburg(Breisgau) Hbf|Denzlingen|Emmendingen|Riegel-Malterdingen|Kenzingen|Herbolzheim(Breisg)|Ringsheim|Orschweier|Lahr(Schwarzw)|Offenburg"
      },
      "-305169380276765359-1711031726-3": {
        "tripId": "-305169380276765359-1711031726-3",
        "trainName": "RB-17044",
        "arrival": "1711031733",
        "actualArrival": "",
        "departure": "1711031733",
        "actualDeparture": "",
        "arrivalPath": "Basel Bad Bf|Weil am Rhein",
        "departurePath": "Eimeldingen|Efringen-Kirchen|Bad Bellingen|Müllheim(Baden)|Buggingen|Heitersheim|Bad Krozingen|Norsingen|Schallstadt|Ebringen|Freiburg-St Georgen|Freiburg(Breisgau) Hbf|Gundelfingen(Breisgau)|Denzlingen|Kollmarsreute|Emmendingen|Teningen-Mundingen|Köndringen|Riegel-Malterdingen|Kenzingen|Herbolzheim(Breisg)|Ringsheim|Orschweier|Lahr(Schwarzw)|Friesenheim(Baden)|Offenburg"
      }
    };

    // when
    const text = trainService.getDelayText(trips);

    // then
    console.log(text);
  });

  

});