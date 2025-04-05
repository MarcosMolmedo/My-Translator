const express = require('express');
const multer = require('multer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configuración Multer
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.post('/send-email', upload.single('archivo'), async (req, res) => {
  const { nombre, email, idioma, paisEmisor, apostillado, retiroUtrecht, envioPostNL, tiempoEntrega, comentario } = req.body;
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

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    subject: 'Nueva Solicitud de Cotización',
    text: body,
    attachments: archivo ? [{
      content: fs.readFileSync(archivo.path).toString('base64'),
      filename: archivo.originalname,
      type: archivo.mimetype,
      disposition: 'attachment'
    }] : [],
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Correo enviado desde ${email}`);
    res.status(200).json({ message: 'Correo enviado' });
  } catch (err) {
    console.error('❌ Error al enviar correo:', err);
    res.status(500).json({ error: 'Error al enviar correo' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
