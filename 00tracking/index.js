const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;


app.use(cookieParser());
app.use(express.static('public'));

const trackingInfo = {};

function track(req, res, next) {
  if (req.cookies && req.cookies.tracking === 'enabled') {
    const ua = req.get('user-agent');
    if (trackingInfo[ua]) {
      trackingInfo[ua]++;
    } else {
      trackingInfo[ua] = 1;
    }
  }
  next();
}

app.use(track);

app.get('/api/info', (req, res) => {
  res.json(trackingInfo);
});

app.get('/api/track', (req, res) => {
  res.cookie('tracking', 'enabled');
  res.send('Tracking is turned on.');
});

app.get('/api/untrack', (req, res) => {
  res.clearCookie('tracking');
  res.send('Tracking is turned off.');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

