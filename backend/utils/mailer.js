const nodemailer = require('nodemailer');

let transporter;

const initMailer = async () => {
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log('INFO: Configured SMTP Mailer with external credentials');
    } else {
      // Generate test SMTP service account from ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
      console.log('INFO: Configured Ethereal Test Mailer (Check console for OTP links)');
    }
  } catch (error) {
    console.error('ERROR: Failed to initialize mailer', error);
  }
};

initMailer();

const sendOtpEmail = async (to, otp) => {
  if (!transporter) {
    console.log('WARNING: Mailer not initialized yet. Cannot send OTP.');
    return;
  }
  
  try {
    const info = await transporter.sendMail({
      from: '"SKYVEX Auth" <noreply@skyvex.com>',
      to: to,
      subject: "Your SKYVEX Login OTP",
      text: `Your One-Time Password is: ${otp}. It expires in 10 minutes.`,
      html: `<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
              <h2>Welcome to SKYVEX</h2>
              <p>Your login code is:</p>
              <h1 style="font-size: 40px; letter-spacing: 5px; color: #ffc200; background: #000; padding: 20px; border-radius: 8px;">${otp}</h1>
              <p>This code will expire in 10 minutes.</p>
             </div>`
    });

    console.log("INFO: Auth Email Sent to " + to);
    if (!process.env.SMTP_HOST) {
      console.log("=================================================");
      console.log("🔍 ETHEREAL PREVIEW URL FOR OTP: %s", nodemailer.getTestMessageUrl(info));
      console.log("=================================================");
    }
  } catch (err) {
    console.error("ERROR sending OTP email:", err);
  }
};

module.exports = { sendOtpEmail };
