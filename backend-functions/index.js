const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors");

const corsHandler = cors({ origin: true });

const transporter = nodemailer.createTransport({
  host: "mailout.hostnet.nl",
  port: 587,
  secure: false,
  auth: {
    user: "info@malvasioyohana.nl",
    pass: "Yohana1984$", // Podés mover esto a funciones de entorno más adelante
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Método no permitido");
    }

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

    let emailBody = `Nueva solicitud de cotización:\n\n`;
    if (nombre) emailBody += `👤 Nombre: ${nombre}\n`;
    if (email) emailBody += `📧 Correo Electrónico: ${email}\n`;
    if (idioma) emailBody += `🌍 Idioma de traducción: ${idioma}\n`;
    if (paisEmisor) emailBody += `📍 País Emisor del Documento: ${paisEmisor}\n`;
    if (apostillado) emailBody += `📜 Documento Apostillado: ${apostillado}\n`;
    if (retiroUtrecht) emailBody += `🏢 Retiro en Utrecht Terwijde: ${retiroUtrecht}\n`;
    if (retiroUtrecht !== "Sí" && envioPostNL)
      emailBody += `🚚 Envío por PostNL: ${envioPostNL}\n`;
    if (tiempoEntrega) emailBody += `⏳ Tiempo de Entrega: ${tiempoEntrega}\n`;
    if (comentario) emailBody += `📝 Comentario del cliente: ${comentario}\n`;

    const mailOptions = {
      from: "info@malvasioyohana.nl",
      to: "info@malvasioyohana.nl",
      subject: "Nueva Solicitud de Cotización",
      text: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Correo enviado por ${nombre} (${email})`);
      res.status(200).json({ message: "Correo enviado exitosamente" });
    } catch (error) {
      console.error("❌ Error al enviar el correo:", error);
      res.status(500).json({ error: "Error al enviar el correo" });
    }
  });
});
