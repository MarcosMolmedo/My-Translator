const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

// Cargar variables de entorno
dotenv.config();

const app = express();

// CORS y body parsers
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ Falta SENDGRID_API_KEY en variables de entorno');
}
if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
  console.error('❌ Falta EMAIL_FROM o EMAIL_TO en variables de entorno');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ========= NUEVO: healthcheck para probar rápido =========
app.get('/health', (_req, res) => res.json({ ok: true }));

// ========= Multer (sube a disco). En Render conviene /tmp =========
const uploadRoot =
  process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadRoot),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// ========= Endpoint de envío de cotización =========
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
    comentario
  } = req.body;
  const archivo = req.file;

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

  // ========= NUEVO: replyTo para responder directo al cliente (y ayuda con DMARC)
  const replyTo =
    email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? { email, name: nombre || 'Contacto Web' }
      : undefined;

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM, // <- ESTE debe ser un remitente/identidad verificada en SendGrid
    replyTo,                      // <- opcional pero recomendado
    subject: 'Nueva Solicitud de Cotización',
    text: body,
    attachments: archivo
      ? [
          {
            content: fs.readFileSync(archivo.path).toString('base64'),
            filename: archivo.originalname,
            type: archivo.mimetype,
            disposition: 'attachment'
          }
        ]
      : []
  };

  try {
    const [resp] = await sgMail.send(msg);
    // Limpia el archivo temporal para no llenar disco
    if (archivo?.path) fs.unlink(archivo.path, () => {});
    console.log('✅ SendGrid OK:', resp?.statusCode);
    return res.status(200).json({ message: 'Correo enviado' });
  } catch (err) {
    // Limpia el archivo si falló
    if (archivo?.path) fs.unlink(archivo.path, () => {});

    // ========= NUEVO: detalle del error de SendGrid (¡clave!)
    const detail =
      (err?.response?.body?.errors &&
        Array.isArray(err.response.body.errors) &&
        err.response.body.errors.map((e) => e.message).join(' | ')) ||
      err?.message ||
      'Unknown error';

    console.error('❌ SendGrid error:', err?.code, detail);
    if (err?.response?.body) {
      console.error('Body:', JSON.stringify(err.response.body));
    }

    return res.status(500).json({ error: 'Error al enviar correo', detail });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
