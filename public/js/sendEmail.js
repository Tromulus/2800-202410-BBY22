const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const sgMail = require('@sendgrid/mail');
const axios = require('axios');
//sgMail.setApiKey(process.env.SG_APIKEY);

const apiKey = process.env.APIKEY;



// type can be "reset-password, marketing, order-notification, etc"
// const sendEmail = async (email, subject, type, payload, template)=>{
//   const url = 'https://api.elasticemail.com/v4/emails';

//     // Path to the EJS template
//     const templatePath = path.join(__dirname, '../../views/' + template);
//     // Render the HTML for the email using EJS
//     ejs.renderFile(templatePath, payload, (err, html) => {
//       if (err) {
//         console.error('Error rendering email template:', err);
//         return err;
//       }
     
//       const data = {
//         "recipients": [
//             {
//             "email": "lizhi.2496@gmail.com"
//             }
//          ],
//         "content": {
//             "body": [
//             {
//                 "type": "HTML",
//                 "charset": "utf-8",
//                 "content": html
//             }
//          ],
//           "subject": "Reset Password",
//            "from": "lizhi.2496@gmail.com"
//         }
//       };

//       const config = {
//         headers: {
//         'X-ElasticEmail-ApiKey': apiKey,
//         'Content-Type': 'application/json'
//     }
// };

// try {
//     const response = axios.post(url, data, config);
//     console.log('Email sent successfully:', response.data);
// } catch (error) {
//     console.error('Failed to send email:', error.response.data);
// }
// }
// )}

//       const msg = {
//         // need an email here
//         from: "lizhi.2496@gmail.com", // this is a verified/personal email for this API, please don't abuse. 
//         to: "lizhi.2496@gmail.com",
//         subject: subject,
//         html: html,
//       };
//       sgMail
//         .send(msg)
//         .then(() => {
//           console.log('Email sent')
//         })
//         .catch((error) => {
//           console.error(error)
//         })
//     });
// }

const sendEmailviaSMTP = async (email, subject, type, payload, template) => {
  try {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Path to the EJS template
    const templatePath = path.join(__dirname, '../../views/' + template);

    // Render the HTML for the email using EJS
    ejs.renderFile(templatePath, payload, (err, html) => {
      if (err) {
        console.error('Error rendering email template:', err);
        return err;
      }

      const mailOptions = {
        // need an email here
        from: '"Zhi Li" <lizhi.2496@gmail.com>',
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

module.exports = {
    sendEmail: sendEmailviaSMTP
};