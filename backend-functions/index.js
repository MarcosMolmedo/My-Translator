const functionsV1 = require("firebase-functions/v1");
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const nodemailer = require("nodemailer");
const cors = require("cors");
const Busboy = require("busboy");
const path = require("path");
const { BrevoClient } = require("@getbrevo/brevo");

/* ========================================
   CONFIGURACIÓN GENERAL
======================================== */

const corsHandler = cors({ origin: true });

const googlePlacesApiKey = defineSecret(
  "GOOGLE_PLACES_API_KEY"
);

const smtpPassword = defineSecret("SMTP_PASSWORD");

const brevoApiKey = defineSecret("BREVO_API_KEY");

const EMAIL_USER = "info@malvasioyohana.nl";
const EMAIL_RECIPIENT = "info@malvasioyohana.nl";

const MAX_FILES = 5;
const MAX_TOTAL_MB = 20;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
];

/* ========================================
   BUSBOY — FORMULARIO MULTIPART EN FIREBASE
======================================== */


const processMultipartForm = (req) =>
  new Promise((resolve, reject) => {
    busboy.on("finish", () => {
  resolve({
    fields,
    files,
  });
});

busboy.on("error", (error) => {
  reject(error);
});

if (req.rawBody) {
  busboy.end(req.rawBody);
} else {
  req.pipe(busboy);
}

    const fields = {};
    const files = [];
    const filePromises = [];

    let totalBytes = 0;
    let fileLimitReached = false;
    let invalidFile = null;

    const busboy = Busboy({
      headers: req.headers,

      limits: {
        files: MAX_FILES,
        fileSize: MAX_TOTAL_BYTES,
        fields: 30,
      },
    });

    busboy.on("field", (fieldName, value) => {
      fields[fieldName] = value;
    });

    busboy.on(
      "file",
      (fieldName, fileStream, fileInfo) => {
        const {
          filename = "",
          mimeType = "application/octet-stream",
        } = fileInfo;

        if (
          fieldName !== "archivos" &&
          fieldName !== "archivo"
        ) {
          fileStream.resume();
          return;
        }

        const extension = path
          .extname(filename)
          .toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          invalidFile = filename;
          fileStream.resume();
          return;
        }

        const chunks = [];
        let fileSize = 0;
        let individualLimitReached = false;

        const filePromise = new Promise(
          (resolveFile, rejectFile) => {
            fileStream.on("data", (chunk) => {
              fileSize += chunk.length;
              totalBytes += chunk.length;

              if (totalBytes > MAX_TOTAL_BYTES) {
                rejectFile(
                  new Error("TOTAL_FILE_SIZE_LIMIT")
                );
                fileStream.resume();
                return;
              }

              chunks.push(chunk);
            });

            fileStream.on("limit", () => {
              individualLimitReached = true;
              fileLimitReached = true;
            });

            fileStream.on("end", () => {
              if (individualLimitReached) {
                resolveFile();
                return;
              }

              files.push({
                fieldname: fieldName,
                originalname: filename,
                mimetype: mimeType,
                size: fileSize,
                buffer: Buffer.concat(chunks),
              });

              resolveFile();
            });

            fileStream.on("error", rejectFile);
          }
        );

        filePromises.push(filePromise);
      }
    );

    busboy.on("filesLimit", () => {
      fileLimitReached = true;
    });

    busboy.on("error", reject);

    busboy.on("finish", async () => {
      try {
        await Promise.all(filePromises);

        if (invalidFile) {
          reject(
            new Error(
              `Formato no permitido: ${invalidFile}`
            )
          );
          return;
        }

        if (fileLimitReached) {
          reject(new Error("FILE_LIMIT"));
          return;
        }

        resolve({
          fields,
          files,
        });
      } catch (error) {
        reject(error);
      }
    });

    busboy.end(req.rawBody);
  });
/* ========================================
   FUNCIONES AUXILIARES
======================================== */

const createEmailBody = (formData = {}) => {
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
  } = formData;

  let emailBody =
    "Nueva solicitud de cotización:\n\n";

  if (nombre) {
    emailBody += `👤 Nombre: ${nombre}\n`;
  }

  if (email) {
    emailBody += `📧 Correo electrónico: ${email}\n`;
  }

  if (idioma) {
    emailBody += `🌍 Idioma de traducción: ${idioma}\n`;
  }

  if (paisEmisor) {
    emailBody +=
      `📍 País emisor del documento: ${paisEmisor}\n`;
  }

  if (apostillado) {
    emailBody +=
      `📜 Documento apostillado: ${apostillado}\n`;
  }

  if (retiroUtrecht) {
    emailBody +=
      `🏢 Retiro en Utrecht Terwijde: ${retiroUtrecht}\n`;
  }

  if (
    retiroUtrecht !== "Sí" &&
    envioPostNL
  ) {
    emailBody +=
      `🚚 Envío por PostNL: ${envioPostNL}\n`;
  }

  if (tiempoEntrega) {
    emailBody +=
      `⏳ Tiempo de entrega: ${tiempoEntrega}\n`;
  }

  if (comentario) {
    emailBody +=
      `📝 Comentario del cliente: ${comentario}\n`;
  }

  return emailBody;
};

const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );

const getUploadedFiles = (req) => [
  ...(req.files?.archivos || []),
  ...(req.files?.archivo || []),
];

const validateUploadedFiles = (files = []) => {
  if (files.length === 0) {
    return {
      status: 400,
      message:
        "Debes adjuntar al menos un archivo.",
    };
  }

  if (files.length > MAX_FILES) {
    return {
      status: 400,
      message:
        `Puedes adjuntar hasta ${MAX_FILES} archivos.`,
    };
  }

  const totalBytes = files.reduce(
    (total, file) =>
      total + (file?.size || 0),
    0
  );

  if (totalBytes > MAX_TOTAL_BYTES) {
    return {
      status: 413,
      message:
        `El peso total supera ${MAX_TOTAL_MB} MB.`,
    };
  }

  return null;
};

/* ========================================
   SMTP ANTIGUO — RESPALDO
======================================== */

const createTransporter = () =>
  nodemailer.createTransport({
    host: "mailout.hostnet.nl",
    port: 587,
    secure: false,

    auth: {
      user: EMAIL_USER,
      pass: smtpPassword.value(),
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,

    tls: {
      rejectUnauthorized: false,
    },
  });

const sendQuotationEmailWithSmtp = async (
  formData = {}
) => {
  const { nombre, email } = formData;

  const transporter = createTransporter();
  const emailBody = createEmailBody(formData);

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL_RECIPIENT,
    replyTo: email || undefined,
    subject:
      "Nueva solicitud de cotización",
    text: emailBody,
  });

  console.log(
    `Correo SMTP enviado por ${
      nombre || "cliente"
    } (${email || "sin email"})`
  );
};

/* ========================================
   BREVO — NUEVO SISTEMA
======================================== */

const sendQuotationEmailWithBrevo = async ({
  formData,
  files,
}) => {
  const {
    nombre = "",
    email = "",
  } = formData;

  const brevo = new BrevoClient({
    apiKey: brevoApiKey.value(),
    timeoutInSeconds: 30,
    maxRetries: 2,
  });

  const attachments = files.map((file) => ({
    name: file.originalname,
    content: file.buffer.toString("base64"),
  }));

  const emailData = {
    sender: {
      name: "MY Translator",
      email: EMAIL_USER,
    },

    to: [
      {
        email: EMAIL_RECIPIENT,
        name: "MY Translator",
      },
    ],

    subject:
      "Nueva solicitud de cotización",

    textContent:
      createEmailBody(formData),

    attachment: attachments,
  };

  if (isValidEmail(email)) {
    emailData.replyTo = {
      email: email.trim(),
      name:
        nombre.trim() ||
        "Contacto Web",
    };
  }

  const result =
    await brevo.transactionalEmails.sendTransacEmail(
      emailData
    );

  console.log(
    `Correo Brevo enviado por ${
      nombre || "cliente"
    } (${email || "sin email"})`
  );

  return result;
};

/* ========================================
   ENVÍO ANTIGUO — 1.ª GENERACIÓN

   Se conserva temporalmente como respaldo.
======================================== */

exports.sendEmail = functionsV1
  .runWith({
    secrets: [smtpPassword],
  })
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).json({
          error: "Método no permitido",
        });
      }

      try {
        await sendQuotationEmailWithSmtp(
          req.body || {}
        );

        return res.status(200).json({
          message:
            "Correo enviado exitosamente",
        });
      } catch (error) {
        console.error(
          "Error en sendEmail:",
          error
        );

        return res.status(500).json({
          error:
            "Error al enviar el correo",
        });
      }
    });
  });

/* ========================================
   ENVÍO NUEVO — 2.ª GENERACIÓN

   Recibe FormData y archivos.
======================================== */

exports.sendEmailV2 = onRequest(
  {
    region: "europe-west1",

    secrets: [brevoApiKey],

    cors: true,

    minInstances: 1,
    maxInstances: 10,

    timeoutSeconds: 60,
    memory: "216MiB",
  },

  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Método no permitido",
      });
    }

  try {
    console.log("===== REQUEST DEBUG =====");
    console.log("Method:", req.method);
    console.log(
      "Content-Type:",
      req.headers["content-type"]
    );
    console.log(
      "Content-Length:",
      req.headers["content-length"]
    );
    console.log(
      "rawBody exists:",
      Boolean(req.rawBody)
    );
    console.log(
      "rawBody length:",
      req.rawBody?.length || 0
    );
    console.log("=========================");


      const {
        fields,
        files,
      } = await processMultipartForm(req);

      console.log(
        "Campos recibidos:",
        Object.keys(fields || {})
      );

      console.log(
        "Cantidad de archivos:",
        files?.length || 0
      );

      const fileValidationError =
        validateUploadedFiles(files);

      if (fileValidationError) {
        return res
          .status(fileValidationError.status)
          .json({
            error:
              fileValidationError.message,
          });
      }

      const formData = {
        nombre:
          fields?.nombre?.trim() || "",

        email:
          fields?.email?.trim() || "",

        idioma:
          fields?.idioma || "",

        paisEmisor:
          fields?.paisEmisor || "",

        apostillado:
          fields?.apostillado || "",

        retiroUtrecht:
          fields?.retiroUtrecht || "",

        envioPostNL:
          fields?.envioPostNL || "",

        tiempoEntrega:
          fields?.tiempoEntrega || "",

        comentario:
          fields?.comentario || "",
      };

      if (!formData.nombre) {
        return res.status(400).json({
          error:
            "El nombre es obligatorio.",
        });
      }

      if (!isValidEmail(formData.email)) {
        return res.status(400).json({
          error:
            "El correo electrónico no es válido.",
        });
      }

      await sendQuotationEmailWithBrevo({
        formData,
        files,
      });

      return res.status(200).json({
        ok: true,
        message:
          "Solicitud enviada correctamente",
      });
    } catch (error) {
      console.error(
        "Error en sendEmailV2:",
        error
      );

      if (
        error?.message?.startsWith(
          "Formato no permitido"
        )
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }

      if (
        error?.message ===
        "Unexpected end of form"
      ) {
        return res.status(400).json({
          error:
            "El formulario llegó incompleto. Intenta enviarlo nuevamente.",
        });
      }

      return res.status(500).json({
        error:
          "No se pudo enviar la solicitud",
      });
    }
  }
);