
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, '');

    if (!emailUser || !emailPass) {
      throw new Error('EMAIL_USER or EMAIL_PASS is missing');
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    console.log('Checking Gmail SMTP connection...');

    await transporter.verify();

    console.log('Gmail SMTP connection successful!');

    const result = await transporter.sendMail({
      from: `"Awadh Hotels" <${emailUser}>`,
      to: emailUser,
      subject: 'Awadh Hotels - Email Test',
      text: 'Your Gmail SMTP configuration is working successfully.',
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', result.messageId);

  } catch (error) {
    console.error('EMAIL TEST FAILED');
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
  }
}

testEmail();
