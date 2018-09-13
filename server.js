require('dotenv').config();
const express = require('express');
const app = express();
const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey, domain });;
const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/', (req, res) => {
  const host = req.get('host');

  if (!allowedDomains.includes(host)) {
    res.status(422).send('Request from invalid domain');
    return;
  }

  const data = { 
    from: req.query.from, 
    to: process.env.MAILGUN_TO, 
    subject: req.query.subject, 
    html: req.query.body 
  };

  mailgun.messages().send(data).then(function (data) {
      res.status(500).json({ message: data });
    }, function (err) {
      res.status(500).json({ error: err });
    });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>  console.log(`Server is listening on port ${port}.`));
module.exports = server;