// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ===== Config =====
const IS_PROD = process.env.NODE_ENV === 'production';
const uploadRoot = IS_PROD ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

// Límite total de adjuntos (entre todos) en bytes
const MAX_TOTAL_MB = Number(process.env.MAX_TOTAL_MB || 20); // puedes ajustar por env
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

// Multer (Render usa /tmp)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Importante: NO ponemos fileSize aquí para no confundir "por archivo" vs "total".
// Controlamos el total más abajo.
const upload = multer({ storage });

// Aceptar hasta 5 archivos. Retrocompatible: 'archivos' (array) o 'archivo' (singular)
const acceptFiles = upload.fields([
  { name: 'archivos', maxCount: 5 },
  { name: 'archivo',  maxCount: 1 }
]);

// ===== SMTP Brevo =====
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ Faltan variables SMTP_*');
}
const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                // p.ej. smtp-relay.brevo.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// ===== Endpoint principal =====
app.post('/send-email', acceptFiles, async (req, res) => {
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

  // Unificar archivos
  const files = [
    ...(req.files?.archivos || []),
    ...(req.files?.archivo  || []),
  ];

  // Validaciones de cantidad
  if (files.length === 0) {
    return res.status(400).json({ error: 'Debes adjuntar al menos un archivo.' });
  }
  if (files.length > 5) {
    // Seguridad extra si el front intentara mandar más
    cleanupFiles(files);
    return res.status(400).json({ error: 'Puedes adjuntar hasta 5 archivos.' });
  }

  // Validación de tamaño total
  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    cleanupFiles(files);
    return res.status(413).json({
      error: `El peso total supera el límite permitido de ${MAX_TOTAL_MB} MB.`
    });
  }

  // Cuerpo del email
  let body = `Nueva solicitud de cotización:\n\n`;
  if (nombre) body += `👤 Nombre: ${nombre}\n`;
  if (email) body += `📧 Correo: ${email}\n`;
  if (idioma) body += `🌍 Idioma: ${idioma}\n`;
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

  const attachments = files.map(f => ({
    filename: f.originalname,
    path: f.path,
    contentType: f.mimetype
  }));

  try {
    const info = await smtpTransport.sendMail({
      from: process.env.EMAIL_FROM,  // p.ej. info@malvasioyohana.nl
      to: process.env.EMAIL_TO,      // destino interno
      replyTo,
      subject: 'Nueva Solicitud de Cotización',
      text: body,
      attachments
    });

    console.log('✅ Brevo SMTP OK:', info?.messageId || '');
    cleanupFiles(files);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Brevo SMTP error:', err?.message || err);
    cleanupFiles(files);
    return res.status(500).json({ error: 'Error al enviar correo', detail: err?.message || 'unknown' });
  }
});

function cleanupFiles(files) {
  files.forEach(f => f?.path && fs.unlink(f.path, () => {}));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));


