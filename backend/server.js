const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();

// --- CORS + parsers
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SendGrid (principal)
if (!process.env.SENDGRID_API_KEY) console.error('❌ Falta SENDGRID_API_KEY');
if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) console.error('❌ Falta EMAIL_FROM o EMAIL_TO');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Multer (usa /tmp en Render)
const uploadRoot = process.env.NODE_ENV === 'production'
  ? '/tmp/uploads'
  : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- Fallback SMTP (Brevo)
const fallbackEnabled = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const smtpTransport = fallbackEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      // Opcional: timeout para no colgarse
      socketTimeout: 20000,
      connectionTimeout: 20000,
    })
  : null;

// --- Endpoint principal
app.post('/send-email', upload.single('archivo'), async (req, res) => {
  const { nombre, email, idioma, paisEmisor, apostillado, retiroUtrecht, envioPostNL, tiempoEntrega, comentario } = req.body;
  const archivo = req.file;

  const cleanup = () => {
    if (archivo?.path) fs.unlink(archivo.path, () => {});
  };

  let body = `Nueva solicitud de cotización:\n\n`;
  if (nombre) body += `👤 Nombre: ${nombre}\n`;
  if (email) body += `📧 Correo: ${email}\n`;
  if (idioma) body += `🌍 Idioma: ${idioma === 'es-en' ? 'Español - Inglés' : 'Inglés - Español'}\n`;
  if (paisEmisor) body += `📍 País emisor: ${paisEmisor}\n`;
  if (apostillado) body += `📜 Apostillado: ${apostillado}\n`;
  if (retiroUtrecht) body += `🏢 Retiro en Utrecht: ${retiroUtrecht}\n`;
  if (retiroUtrecht !== 'Sí' && envioPostNL) body += `📮 Envío por PostNL: ${envioPostNL}\n`;
  if (tiempoEntrega) body += `⏳ Tiempo de entrega: ${tiempoEntrega}\n`;
  if (comentario) body += `📝 Comentario: ${comentario}\n`;

  const replyTo =
    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? { email, name: nombre || 'Contacto Web' }
      : undefined;

  const sgMsg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    replyTo,
    subject: 'Nueva Solicitud de Cotización',
    text: body,
    attachments: archivo
      ? [{
          content: fs.readFileSync(archivo.path).toString('base64'),
          filename: archivo.originalname,
          type: archivo.mimetype || 'application/octet-stream',
          disposition: 'attachment'
        }]
      : [],
  };

  // 1) Intento con SendGrid
  try {
    const [resp] = await sgMail.send(sgMsg);
    console.log('✅ SendGrid OK:', resp?.statusCode);
    cleanup();
    return res.status(200).json({ ok: true, via: 'sendgrid' });
  } catch (err) {
    const detail =
      (err?.response?.body?.errors && Array.isArray(err.response.body.errors)
        ? err.response.body.errors.map(e => e?.message).join(' | ')
        : null) ||
      err?.message ||
      'Unknown error';
    console.error('❌ SendGrid error:', err?.code, detail);
    if (err?.response?.body) console.error('Body:', JSON.stringify(err.response.body));
  }

  // 2) Fallback SMTP SIEMPRE cuando falle SendGrid
  if (fallbackEnabled && smtpTransport) {
    try {
      const mailOptions = {
        from: process.env.FALLBACK_FROM || process.env.SMTP_USER,
        to: process.env.EMAIL_TO,
        replyTo,
        subject: 'Nueva Solicitud de Cotización (fallback)',
        text: body,
        attachments: archivo
          ? [{ filename: archivo.originalname, path: archivo.path, contentType: archivo.mimetype }]
          : []
      };
      const info = await smtpTransport.sendMail(mailOptions);
      console.log('✅ Fallback SMTP OK:', info?.messageId || '');
      cleanup();
      return res.status(200).json({ ok: true, via: 'smtp' });
    } catch (e2) {
      console.error('❌ Fallback SMTP error:', e2?.message);
      cleanup();
      return res.status(500).json({ error: 'Error al enviar correo', fallback: e2?.message || 'fallback failed' });
    }
  }

  // Si no hay fallback configurado
  cleanup();
  return res.status(500).json({ error: 'Error al enviar correo', detail: 'Sin fallback SMTP configurado' });
});

// --- Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
