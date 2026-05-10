const nodemailer = require('nodemailer');

const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = process.env;

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error('Email transporter error:', error);
  } else {
    // eslint-disable-next-line no-console
    console.log('Email transporter is ready');
  }
});

async function sendVerificationEmail(to, code, name) {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject: '✉️ Verify your Traveloop account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Welcome to Traveloop! 🎉</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Hi ${name || 'there'},</p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Thanks for registering at Traveloop. Please verify your email address using the code below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; display: inline-block;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
              <p style="font-size: 32px; font-weight: bold; color: #007bff; margin: 0; letter-spacing: 5px;">${code}</p>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">Enter this code on the verification page. This code will expire in 15 minutes.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">If you did not create an account, you can safely ignore this email.</p>
          
          <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 Traveloop. All rights reserved.</p>
          </footer>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // eslint-disable-next-line no-console
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to send email to ${to}:`, err);
    throw err;
  }
}

module.exports = { sendVerificationEmail };

