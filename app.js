require('dotenv').config();
const express = require('express');
const mailer = require('./mailer');
const app = express();

const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  const host = req.get('host');

  if (!allowedDomains.includes(host)) {
    res.status(422).send('Request from invalid domain');
    return;
  }

  let mailer = new Mailer();
  mailer.send(req.query.email, process.env.MAILGUN_TO, req.query.subject, html: req.query.body);
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>  console.log(`Server is listening on port ${port}.`));
module.exports = server;