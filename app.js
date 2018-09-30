require('dotenv').config();
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js')({ apiKey, domain });;
const allowedDomains = process.env.ALLOWED_DOMAINS.split(',');

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
  if (!allowedDomains.includes(req.get('host'))) {
    res.status(422).send('Request from invalid domain');
    return;
  }

  const mailData = { 
    from: req.body.from,
    to: process.env.MAILGUN_TO, 
    subject: req.body.subject, 
    html: req.body.messageBody
  };

  mailgun.messages().send(mailData).then(function (data) {
      console.log('message sent...');
      console.log(data);
      res.status(200).json({ message: data });
    }, function (err) {
      console.log('Error!!!');
      console.log(err);
      res.status(500).json({ error: err });
    });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () =>  console.log(`Server is listening on port ${port}.`));
module.exports = server;