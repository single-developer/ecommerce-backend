const nodemailer = require(`nodemailer`);

const transporter = nodemailer.createTransport({
  host: `stmp.gmail.com`,
  service: `gmail`,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendEmail(mailOption) {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER_EMAIL,
      to: mailOption?.to,
      subject: mailOption?.subject,
      html: mailOption?.content,
      attachment: mailOption?.attachments,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = sendEmail;
