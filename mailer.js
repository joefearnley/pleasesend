const Mailgun = require('mailgun-js');

module.exports = class Mailer {
  send(from, to, subject, body) {
    const mailgun = new Mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });

    const data = {
      from: from,
      to: to,
      subject: subject,
      html: body
    };

    mailgun.messages().send(data).then(function (data) {
        console.log(data);
      }, function (err) {
        console.log('Got an error trying to send email: ', err);
      });
  }
}