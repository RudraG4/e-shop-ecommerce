import nodemailer from "nodemailer";
import templates from "./templates.js";

const transportOption = {
  pool: true,
  host: process.env.MAILER_SMTP_HOST,
  port: process.env.MAILER_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.MAILER_ACC_UNAME,
    pass: process.env.MAILER_ACC_PWD,
  },
};

const From = `${process.env.MAILER_FNAME} <${process.env.MAILER_EMAIL}>`;

class Mailer {
  static transporter;
  static account;

  static async init() {
    try {
      if (!Mailer.transporter) {
        Mailer.transporter = nodemailer.createTransport(transportOption);
      }
    } catch (err) {
      console.error("Failed to create a testing account. " + err.message);
    }
  }

  static async sendMail(to, subject, body) {
    try {
      if (!to || !subject || !body) {
        return null;
      }
      const mailOptions = {
        from: From,
        to,
        subject,
        text: body,
        html: `<p>${body}</p>`,
      };
      let info = await Mailer.transporter.sendMail(mailOptions);
      return info;
    } catch (err) {
      console.error("Error occurred. " + err.message);
    }
  }

  static async sendTemplatedMail(to, template, data) {
    try {
      if (!to) {
        return null;
      }
      const templateInfo = templates[template];
      if (templateInfo) {
        let info = await Mailer.transporter.sendMail({
          from: `${process.env.MAILER_FNAME} <${process.env.MAILER_EMAIL}>`,
          to,
          subject: templateInfo.subject(data),
          text: templateInfo.body(data),
          html: templateInfo.html(data),
        });
        return info;
      }
    } catch (err) {
      console.error("Error occurred. " + err.message);
    }
  }
}

export default Mailer;
