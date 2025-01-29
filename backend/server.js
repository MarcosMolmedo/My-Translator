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


const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); 
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); 
    },
});
const upload = multer({ storage });


app.post('/send-email', upload.single('archivo'), async (req, res) => {
    const { nombre, email } = req.body;
    const archivo = req.file;

    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y correo electrónico son obligatorios' });
    }

   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Nueva Solicitud de Cotización',
        text: `Nombre: ${nombre}\nCorreo: ${email}`,
        attachments: archivo
            ? [
                {
                    filename: archivo.originalname,
                    path: archivo.path,
                },
            ]
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
