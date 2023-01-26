const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;


app.use(cookieParser());
app.use(express.static('public'));

function protect(req, res, next) {
  if (req.cookies && req.cookies.loggedInUser === 'admin') {
    next();
  } else {
    res.status(401).json({error: 'Unauthorized'});
  }
}


app.get('/api/secret', protect, (req, res) => {
  res.send('<h1>The secret is 42.</h1>');
});


app.get('/api/info', (req, res) => {
  console.log('cookies:', req.cookies);
  res.send(`<h1>cookies: ${JSON.stringify(req.cookies)}</h1>`);
});

app.get('/api/login', (req, res) => {
  const {user, password} = req.query;
  console.log('credentials:', user, password);
  if (user === 'admin' && password === 'secret') {
    res.cookie('loggedInUser', user);
    res.redirect('/loggedin.html');
  } else {
    res.send(`<h1>Login attempt has failed.</h1>`);
  }
});

app.get('/api/logout', (req, res) => {
  res.clearCookie('loggedInUser');
  res.send(`<h1>You are logged out.</h1>`);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

