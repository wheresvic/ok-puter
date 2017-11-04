const responsiveVoice = window.responsiveVoice;
const voicelist = responsiveVoice.getVoices();
console.log(voicelist);
// const voice = "UK English Female";
// const voice = "French Female";
// const voice = "Deutsch Female";
// const voice = "Greek Female";
const voice = "Australian Female";
responsiveVoice.setDefaultVoice("French Female");

export const speak = (text) => {

  return new Promise((resolve, reject) => {
    try {

      if (!text) {
        console.log('no text provided');
        resolve(null);
      }

      console.log(text);

      const speech = new SpeechSynthesisUtterance();

      // Set the text and voice attributes.
      speech.text = text;
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;

      speech.onend = () => {
        resolve(text);
      };

      window
        .speechSynthesis
        .speak(speech);
      
      /*
      responsiveVoice.speak(text, voice, {
        rate: 1,
        onend: () => {
          resolve(text);
        }
      });
      */

    } catch (err) {
      reject(err);
    }

  });

}
