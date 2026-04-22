const https = require('https');

const urls = [
  'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Rain
  'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3', // Space
  'https://assets.mixkit.co/active_storage/sfx/1330/1330-preview.mp3', // Fireplace
  'https://assets.mixkit.co/active_storage/sfx/2444/2444-preview.mp3', // Forest
  'https://assets.mixkit.co/active_storage/sfx/1196/1196-preview.mp3'  // Ocean
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
