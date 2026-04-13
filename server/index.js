import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Contact email transporter ──
// Development mode: logs emails to console
// To enable real email, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const useRealSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

function createTransporter() {
  if (useRealSmtp) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

const transporter = createTransporter();

// ── API: hello ──
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello World from Express! 🚀' });
});

// ── API: contact form POST ──
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const mailOptions = {
    from: process.env.SMTP_USER || 'contact-form@sherpalabs.tech',
    to: 'sherpa@sherpalabs.tech',
    replyTo: email,
    subject: `[SherpaLabs Contact] Message from ${name}`,
    html: `
      <div style="font-family: monospace; background: #0a0a0a; color: #e0e0e0; padding: 30px; border: 1px solid #222;">
        <h2>┌─── Contact Form Submission ───┐</h2>
        <br/>
        <p><strong style="color: #00ff41;">Name:</strong> ${escapeHtml(name)}</p>
        <p><strong style="color: #00ff41;">Email:</strong> ${escapeHtml(email)}</p>
        <p><strong style="color: #00ff41;">Message:</strong></p>
        <pre style="background: #111; padding: 16px; border: 1px solid #333; color: #ccc;">${escapeHtml(message)}</pre>
        <br/>
        <p style="color: #555; font-size: 12px;">— SherpaLabs Contact Form | ${new Date().toISOString()}</p>
      </div>
    `,
    text: `Contact Form Submission\n${'='.repeat(40)}\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n— SherpaLabs Contact Form | ${new Date().toISOString()}`,
  };

  try {
    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log('[Contact] Email sent to sherpa@sherpalabs.tech via SMTP');
    } else {
      // Development mode — log to console
      console.log('');
      console.log('╔══════════════════════════════════════════════════════════╗');
      console.log('║          CONTACT FORM SUBMISSION (DEV MODE)              ║');
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log(`║  Name:    ${name?.padEnd(50)}║`);
      console.log(`║  Email:   ${email?.padEnd(50)}║`);
      console.log(`║  Message: ${message?.substring(0, 40).padEnd(50)}║`);
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log(`║  Full message:                                          ║`);
      console.log(`║  ${message?.replace(/\n/g, '\n  ').padEnd(50).substring(0, 56)}`);
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log('║  → Would send to: sherpa@sherpalabs.tech               ║');
      console.log('║  → Configure SMTP_HOST/SMTP_USER/SMTP_PASS to enable    ║');
      console.log('╚══════════════════════════════════════════════════════════╝');
      console.log('');
    }
    res.json({ success: true, message: 'Message received.' });
  } catch (error) {
    console.error('[Contact] Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Serve built React app (static files) ──
app.use(express.static(distDir));

// ── SPA fallback ──
app.get('*', (_req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`┌─────────────────────────────────┐`);
  console.log(`│  SherpaLabs server running →   │`);
  console.log(`│  http://localhost:${PORT}               │`);
  console.log(`│  Mode: ${useRealSmtp ? 'SMTP 📧' : 'DEV (console log) 🖥️   '}             │`);
  console.log(`└─────────────────────────────────┘`);
});
