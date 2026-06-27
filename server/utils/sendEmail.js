import nodemailer from 'nodemailer';

/**
 * Send an email using nodemailer
 * @param {Object} options - Options containing email destination, subject, and body text/html
 */
const sendEmail = async (options) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`[Mock Email] Sent email to ${options.email} with subject: "${options.subject}"`);
    return { messageId: 'mock-id-12345' };
  }

  // Create reusable transporter object using SMTP transport (defaults to Mailtrap configuration)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'SkillSphere'} <${process.env.FROM_EMAIL || 'noreply@skillsphere.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || null,
  };

  const info = await transporter.sendMail(message);

  console.log(`Email sent: ${info.messageId}`);
  return info;
};

export default sendEmail;
