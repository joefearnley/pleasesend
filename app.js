require('dotenv').config();
const express = require('express');
const app = express();
const Mailgun = require('mailgun-js');
const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  const host = req.get('host');
  console.log(allowedDomains);

  if (!allowedDomains.includes(host)) {
    res.status(422).send('Request from invalid domain');
    return;
  }

  const mailgun = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  });

  const data = {
    from: req.query.email,
    to: process.env.MAILGUN_TO,
    subject: req.query.subject,
    html: req.query.body
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.log('Got an error trying to send email: ', error);
      return;
    }
    console.log('Mail successfully sent!');
  });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>  console.log(`Server is listening on port ${port}.`));
module.exports = server;