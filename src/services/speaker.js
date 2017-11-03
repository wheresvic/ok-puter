const responsiveVoice = window.responsiveVoice;
const voicelist = responsiveVoice.getVoices();
console.log(voicelist);
const voice = "UK English Female";
responsiveVoice.setDefaultVoice("French Female");

export const speak = (text) => {

  return new Promise((resolve, reject) => {
    try {

      if (!text) {
        console.log('no text provided');
        resolve(null);
      }

      console.log(text);

      /*
      const speech = new SpeechSynthesisUtterance();

      // Set the text and voice attributes.
      speech.text = text;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;

      speech.onend = () => {
        resolve(text);
      };

      window
        .speechSynthesis
        .speak(speech);
      */

      responsiveVoice.speak(text, voice, {
        onend: () => {
          resolve(text);
        }
      });
    } catch (err) {
      reject(err);
    }

  });

}
