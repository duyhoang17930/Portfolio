import { Router, type Router as RouterType } from 'express';
import nodemailer from 'nodemailer';

const router: RouterType = Router();

// Create transporter
const createTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.warn('Gmail credentials not configured. Contact emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });
};

// Send contact email (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const transporter = createTransporter();
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_USER;

    if (transporter && toEmail) {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: toEmail,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Failed to send contact email:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
