// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Brevo = require('@getbrevo/brevo');

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ===== Configuración general =====
const IS_PROD = process.env.NODE_ENV === 'production';
const uploadRoot = IS_PROD ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const MAX_TOTAL_MB = Number(process.env.MAX_TOTAL_MB || 20);
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

// Multer (Render usa /tmp)
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Aceptar hasta 5 archivos
const acceptFiles = upload.fields([
  { name: 'archivos', maxCount: 5 },
  { name: 'archivo',  maxCount: 1 }
]);

// ===== Brevo API =====
if (!process.env.BREVO_API_KEY) {
  console.error('❌ Falta BREVO_API_KEY en el archivo .env');
}
const brevo = new Brevo.TransactionalEmailsApi();
brevo.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

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

  const files = [
    ...(req.files?.archivos || []),
    ...(req.files?.archivo || []),
  ];

  if (files.length === 0) {
    return res.status(400).json({ error: 'Debes adjuntar al menos un archivo.' });
  }
  if (files.length > 5) {
    cleanupFiles(files);
    return res.status(400).json({ error: 'Puedes adjuntar hasta 5 archivos.' });
  }

  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    cleanupFiles(files);
    return res.status(413).json({ error: `El peso total supera ${MAX_TOTAL_MB} MB.` });
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
      ? { email, name: nombre || 'Contacto Web' }
      : undefined;

  const attachments = files.map(f => ({
    name: f.originalname,
    content: fs.readFileSync(f.path).toString('base64'),
  }));

  try {
    const sendEmail = {
      sender: { email: process.env.EMAIL_FROM },
      to: [{ email: process.env.EMAIL_TO }],
      replyTo,
      subject: 'Nueva Solicitud de Cotización',
      textContent: body,
      attachment: attachments,
    };

    await brevo.sendTransacEmail(sendEmail);
    console.log('✅ Brevo API OK: correo enviado correctamente');

    cleanupFiles(files);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('❌ Error Brevo API:', err?.message || err);
    cleanupFiles(files);
    return res.status(500).json({ error: 'Error al enviar correo', detail: err?.message || 'unknown' });
  }
});

function cleanupFiles(files) {
  files.forEach(f => f?.path && fs.unlink(f.path, () => {}));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));


