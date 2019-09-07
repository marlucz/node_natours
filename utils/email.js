const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'Marcin Luczak <mbukacz@gmail.com>',
    subject: options.subbject,
    to: options.email,
    text: options.message
    // html:
  };

  // Actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
