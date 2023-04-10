const fetch = require('node-fetch');
const fs = require('fs');

let currentVersion = null;
const webhookUrl = "YourWebHooksUrl";

function sendNotification(version) {
  const message = {
    content: '<@948916911293497344>, ROBLOX Update Notification',
    embeds: [
      {
        title: 'Version ' + version + ' is now available!',
        color: 0x0099ff,
        thumbnail: {
          url: 'https://images.drivereasy.com/wp-content/uploads/2021/07/2021-07-15_10-10-07.jpg',
        },
      },
    ],
  };

  fs.appendFile('database.txt', version + '\n', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Version added to database');
  });

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then(() => {
      console.log(`Sent notification for version ${version}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

function checkVersion() {
  fs.readFile('database.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const versions = data.split('\n').filter(Boolean);
    fetch('https://api.whatexploitsare.online/status')
      .then((response) => response.json())
      .then((data) => {
        const roblox = data.find((item) => item.hasOwnProperty('ROBLOX'));
        if (roblox && !versions.includes(roblox.ROBLOX.version)) {
          currentVersion = roblox.ROBLOX.version;
          sendNotification(currentVersion);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

checkVersion();
setInterval(checkVersion, 60 * 60 * 1000);
