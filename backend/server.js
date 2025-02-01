const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Verificar si la carpeta "uploads/" existe, si no, crearla automáticamente
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 📌 Configuración de Multer para manejar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// 📌 Ruta para manejar el formulario y enviar el correo
app.post('/send-email', upload.single('archivo'), async (req, res) => {
    const { nombre, email, idioma, paisEmisor, apostillado, retiroUtrecht, envioPostNL, tiempoEntrega, comentario } = req.body;
    const archivo = req.file;

    // 📌 Construcción del cuerpo del correo dinámicamente
    let emailBody = `Nueva solicitud de cotización:\n\n`;
    if (nombre) emailBody += `👤 Nombre: ${nombre}\n`;
    if (email) emailBody += `📧 Correo Electrónico: ${email}\n`;
    if (idioma) emailBody += `🌍 Idioma de traducción: ${idioma === "es-en" ? "Español - Inglés" : "Inglés - Español"}\n`;
    if (paisEmisor) emailBody += `📍 País Emisor del Documento: ${paisEmisor}\n`;
    if (apostillado) emailBody += `📜 Documento Apostillado: ${apostillado}\n`;
    if (retiroUtrecht) emailBody += `📦 Retiro en Utrecht Terwijde: ${retiroUtrecht}\n`;

    // 📌 Solo incluir "Envío por PostNL" si el usuario NO elige retirar en Utrecht
    if (retiroUtrecht !== "Sí" && envioPostNL) {
        emailBody += `🚚 Envío por PostNL: ${envioPostNL}\n`;
    }

    if (tiempoEntrega) emailBody += `⏳ Tiempo de Entrega: ${tiempoEntrega}\n`;

    // 📌 Agregar comentario si el usuario escribió algo
    if (comentario) emailBody += `📝 Comentario del cliente: ${comentario}\n`;

    // 📌 Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 📌 Configurar el correo con toda la información
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Nueva Solicitud de Cotización',
        text: emailBody,
        attachments: archivo
            ? [{ filename: archivo.originalname, path: archivo.path }]
            : [],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Correo enviado por ${nombre} (${email})`);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('❌ Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
});

// 📌 Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
