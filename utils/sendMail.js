const nodemailer = require("nodemailer");
async function sendMail({ to, subject, html }) {
  const email = {
    from: "info@myContact.com",
    to,
    subject,
    html,
  };
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c38b1c7cce76f2",
      pass: "4a9a2192fdb61b",
    },
  });
  await transport.sendMail(email);
}
module.exports = {
  sendMail,
};
