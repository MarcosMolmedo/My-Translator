const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

// 🔥 Configuración correcta de CORS
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set API Key de SendGrid
sgMail.setApiKey(functions.config().sendgrid.apikey);

app.post("/send-email", async (req, res) => {
    try {
        const { nombre, email, comentario } = req.body;

        const msg = {
            to: "info@malvasioyohana.nl",
            from: "info@malvasioyohana.nl",
            subject: "Nueva Solicitud de Cotización",
            text: `Nombre: ${nombre}\nCorreo: ${email}\nComentario: ${comentario}`,
        };

        await sgMail.send(msg);
        res.status(200).json({ message: "Correo enviado exitosamente" });
    } catch (error) {
        console.error("❌ Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo" });
    }
});

exports.sendEmail = functions.https.onRequest(app);
