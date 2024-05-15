const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Path to the EJS template
    const templatePath = path.join(__dirname, template);

    // Render the HTML for the email using EJS
    ejs.renderFile(templatePath, payload, (err, html) => {
      if (err) {
        console.error('Error rendering email template:', err);
        return err;
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: html,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Failed to send email:', error);
          return error;
        } else {
          console.log('Email sent:', info);
          return info;
        }
      });
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return error;
  }
};

module.exports = sendEmail;