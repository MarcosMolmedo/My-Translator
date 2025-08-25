const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// CORS + parsers
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// Multer: usa /tmp en Render (disco efímero)
const uploadRoot =
  process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// --- Transport SMTP Brevo ---
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ Faltan variables SMTP_*');
}
const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS en 587
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// --- Endpoint principal ---
app.post('/send-email', upload.single('archivo'), async (req, res) => {
  const {
    nombre,
    email,
    idioma,
    paisEmisor,
    apostillado,
    retiroUtrecht,
    envioPostNL,
    tiempoEntrega,
    comentario,
  } = req.body;
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
      ? { name: nombre || 'Contacto Web', address: email }
      : undefined;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    replyTo,
    subject: 'Nueva Solicitud de Cotización',
    text: body,
    attachments: archivo
      ? [{ filename: archivo.originalname, path: archivo.path, contentType: archivo.mimetype }]
      : [],
  };

  try {
    const info = await smtpTransport.sendMail(mailOptions);
    console.log('✅ Brevo SMTP OK:', info?.messageId || '');
    cleanup();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Brevo SMTP error:', err?.message || err);
    cleanup();
    return res.status(500).json({ error: 'Error al enviar correo', detail: err?.message || 'unknown' });
  }
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

