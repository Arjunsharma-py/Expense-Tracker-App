const nodemailer = require("nodemailer");
const config = require("config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "donatedotin@gmail.com",
    pass: config.get("pass"),
  },
});

exports.emailing = async (email, subject, html) => {
  const mail = await transporter.sendMail({
    from: "donatedotin@gmail.com",
    to: email,
    subject: subject,
    html: html,
  });
  return mail;
};
