const https = require('https');

const urls = [
  'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-birds-in-spring-morning-2444.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3'
];

async function check() {
  for (const url of urls) {
    await new Promise(resolve => {
      https.get(url, (res) => {
        console.log(`${res.statusCode} ${url}`);
        resolve();
      });
    });
  }
}
check();
