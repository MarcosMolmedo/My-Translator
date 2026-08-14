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
    const fields = {};
    const files = [];
    const filePromises = [];

    let totalBytes = 0;
    let fileLimitReached = false;
    let invalidFile = null;
    let totalLimitReached = false;

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

    busboy.on("file", (fieldName, fileStream, fileInfo) => {
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
            if (totalLimitReached) {
              return;
            }

            fileSize += chunk.length;
            totalBytes += chunk.length;

            if (totalBytes > MAX_TOTAL_BYTES) {
              totalLimitReached = true;
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
            if (
              individualLimitReached ||
              totalLimitReached
            ) {
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
    });

    busboy.on("filesLimit", () => {
      fileLimitReached = true;
    });

    busboy.on("error", (error) => {
      reject(error);
    });

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

        if (totalLimitReached) {
          reject(
            new Error("TOTAL_FILE_SIZE_LIMIT")
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

    if (req.rawBody) {
      busboy.end(req.rawBody);
    } else {
      req.pipe(busboy);
    }
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
   CONFIRMACIÓN AUTOMÁTICA AL CLIENTE
======================================== */

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const isVacationPeriod = () => {
  const now = Date.now();

  // 14/08/2026 12:00 en Países Bajos
  const vacationStart = new Date(
    "2026-08-14T10:00:00Z"
  ).getTime();

  // 28/08/2026 00:00 en Países Bajos
  const vacationEnd = new Date(
    "2026-08-27T22:00:00Z"
  ).getTime();

  return now >= vacationStart && now < vacationEnd;
};

const getCustomerConfirmationContent = ({
  formData,
  files = [],
}) => {
  const {
    nombre = "",
    locale = "es",
    idioma = "",
    paisEmisor = "",
    apostillado = "",
    retiroUtrecht = "",
    envioPostNL = "",
    tiempoEntrega = "",
  } = formData;

  const safeName = escapeHtml(nombre);

  const deliveryMethod =
    retiroUtrecht === "Sí"
      ? "Utrecht Terwijde"
      : envioPostNL === "Sí"
      ? "PostNL"
      : "-";

  const languageDirection =
    idioma === "es-en"
      ? "Español → Inglés"
      : idioma === "en-es"
      ? "Inglés → Español"
      : idioma || "-";

  const vacationActive = isVacationPeriod();

  const translations = {
    es: {
      subject:
        "Hemos recibido su solicitud de cotización | Yohana Malvasio",

      greeting: `Estimado/a ${safeName},`,

      intro:
        "Gracias por solicitar una cotización. Su solicitud ha sido recibida correctamente.",

      response:
        "Revisaré la documentación y responderé personalmente a su solicitud a la mayor brevedad posible.",

      summaryTitle: "Resumen de su solicitud",

      language: "Traducción",
      country: "País emisor",
      apostille: "Apostilla",
      delivery: "Entrega",
      timeframe: "Plazo solicitado",
      files: "Archivos recibidos",

      modifyTitle: "¿Necesita modificar o agregar información?",

      modify:
        "Puede responder directamente a este correo indicando cualquier cambio o información adicional. No es necesario completar nuevamente el formulario.",

      vacationTitle: "IMPORTANTE — VACACIONES",

      vacation:
        "Estaré fuera de la oficina por vacaciones hasta el 27 de agosto. Todas las solicitudes continúan recibiéndose normalmente y serán atendidas a partir de mi regreso, por orden de recepción.",

      closing:
        "Gracias por su confianza.",

      regards: "Atentamente,",

      role:
        "Traductora Jurada de Inglés–Español",
    },

    en: {
      subject:
        "We have received your quotation request | Yohana Malvasio",

      greeting: `Dear ${safeName},`,

      intro:
        "Thank you for requesting a quotation. Your request has been received successfully.",

      response:
        "I will review your documentation and personally respond to your request as soon as possible.",

      summaryTitle: "Summary of your request",

      language: "Translation",
      country: "Issuing country",
      apostille: "Apostille",
      delivery: "Delivery",
      timeframe: "Requested timeframe",
      files: "Files received",

      modifyTitle:
        "Do you need to change or add any information?",

      modify:
        "You can reply directly to this email with any changes or additional information. There is no need to complete the form again.",

      vacationTitle: "IMPORTANT — HOLIDAY NOTICE",

      vacation:
        "I will be out of the office on holiday until August 27th. All quotation requests will continue to be received normally and will be handled upon my return, in the order in which they were received.",

      closing:
        "Thank you for your trust.",

      regards: "Best regards,",

      role:
        "English–Spanish Sworn Translator",
    },

    nl: {
      subject:
        "Uw offerteaanvraag is ontvangen | Yohana Malvasio",

      greeting: `Beste ${safeName},`,

      intro:
        "Bedankt voor uw offerteaanvraag. Uw aanvraag is succesvol ontvangen.",

      response:
        "Ik zal uw documenten bekijken en uw aanvraag zo snel mogelijk persoonlijk beantwoorden.",

      summaryTitle: "Samenvatting van uw aanvraag",

      language: "Vertaling",
      country: "Land van afgifte",
      apostille: "Apostille",
      delivery: "Levering",
      timeframe: "Gewenste termijn",
      files: "Ontvangen bestanden",

      modifyTitle:
        "Wilt u informatie wijzigen of toevoegen?",

      modify:
        "U kunt rechtstreeks op deze e-mail antwoorden met eventuele wijzigingen of aanvullende informatie. U hoeft het formulier niet opnieuw in te vullen.",

      vacationTitle: "BELANGRIJK — VAKANTIE",

      vacation:
        "Ik ben tot en met 27 augustus met vakantie. Alle offerteaanvragen worden tijdens deze periode normaal ontvangen en worden na mijn terugkomst op volgorde van ontvangst behandeld.",

      closing:
        "Bedankt voor uw vertrouwen.",

      regards: "Met vriendelijke groet,",

      role:
        "Beëdigd vertaler Engels–Spaans",
    },
  };

  const content =
    translations[locale] || translations.es;

  const summaryRows = [
    [content.language, languageDirection],
    [content.country, paisEmisor || "-"],
    [content.apostille, apostillado || "-"],
    [content.delivery, deliveryMethod],
    [content.timeframe, tiempoEntrega || "-"],
    [content.files, String(files.length)],
  ];

  const summaryHtml = summaryRows
    .map(
      ([label, value]) => `
        <tr>
          <td style="
            padding: 8px 12px;
            border-bottom: 1px solid #ececec;
            font-weight: 600;
            color: #101735;
          ">
            ${escapeHtml(label)}
          </td>

          <td style="
            padding: 8px 12px;
            border-bottom: 1px solid #ececec;
            color: #444444;
          ">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  const vacationHtml = vacationActive
    ? `
      <div style="
        margin: 24px 0;
        padding: 18px;
        background: #f7f6f3;
        border-left: 4px solid #101735;
        border-radius: 8px;
      ">
        <strong style="
          display: block;
          margin-bottom: 8px;
          color: #101735;
        ">
          ${content.vacationTitle}
        </strong>

        <span style="color: #444444;">
          ${content.vacation}
        </span>
      </div>
    `
    : "";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="
        margin: 0;
        padding: 0;
        background: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
        color: #222222;
      ">
        <div style="
          max-width: 640px;
          margin: 0 auto;
          padding: 32px 16px;
        ">
          <div style="
            background: #ffffff;
            border-radius: 12px;
            padding: 32px;
          ">
            <h2 style="
              margin-top: 0;
              color: #101735;
            ">
              MY Translator
            </h2>

            <p>${content.greeting}</p>

            <p>${content.intro}</p>

            <p>${content.response}</p>

            ${vacationHtml}

            <h3 style="
              margin-top: 28px;
              color: #101735;
            ">
              ${content.summaryTitle}
            </h3>

            <table style="
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 28px;
            ">
              ${summaryHtml}
            </table>

            <h3 style="color: #101735;">
              ${content.modifyTitle}
            </h3>

            <p>${content.modify}</p>

            <p style="margin-top: 28px;">
              ${content.closing}
            </p>

            <p>
              ${content.regards}<br><br>
              <strong>Yohana Malvasio</strong><br>
              ${content.role}<br>
              info@malvasioyohana.nl
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = [
    content.greeting,
    "",
    content.intro,
    content.response,
    "",
    vacationActive
      ? `${content.vacationTitle}\n${content.vacation}\n`
      : "",
    content.summaryTitle,
    ...summaryRows.map(
      ([label, value]) => `${label}: ${value}`
    ),
    "",
    content.modifyTitle,
    content.modify,
    "",
    content.closing,
    "",
    content.regards,
    "Yohana Malvasio",
    content.role,
    "info@malvasioyohana.nl",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: content.subject,
    htmlContent,
    textContent,
  };
};

const sendCustomerConfirmationWithBrevo = async ({
  formData,
  files,
}) => {
  const {
    nombre = "",
    email = "",
  } = formData;

  if (!isValidEmail(email)) {
    throw new Error("INVALID_CUSTOMER_EMAIL");
  }

  const brevo = new BrevoClient({
    apiKey: brevoApiKey.value(),
    timeoutInSeconds: 30,
    maxRetries: 2,
  });

  const {
    subject,
    htmlContent,
    textContent,
  } = getCustomerConfirmationContent({
    formData,
    files,
  });

  const result =
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Yohana Malvasio",
        email: EMAIL_USER,
      },

      to: [
        {
          email: email.trim(),
          name:
            nombre.trim() ||
            "Cliente",
        },
      ],

      replyTo: {
        email: EMAIL_USER,
        name: "Yohana Malvasio",
      },

      subject,
      htmlContent,
      textContent,
    });

  console.log(
    `Confirmación enviada a ${email}`
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
            "No se pudo enviar la solicitud",
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

  locale:
    ["es", "en", "nl"].includes(fields?.locale)
      ? fields.locale
      : "es",

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

try {
  await sendCustomerConfirmationWithBrevo({
    formData,
    files,
  });
} catch (confirmationError) {
  console.error(
    "La cotización llegó a Yohana, pero falló la confirmación al cliente:",
    confirmationError
  );
}

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

    /* ========================================
   GOOGLE REVIEWS

   Obtiene la valoración general y una
   selección de reseñas desde Google Places.
======================================== */

exports.getGoogleReviews = onRequest(
  {
    region: "europe-west1",

    secrets: [googlePlacesApiKey],

    cors: true,

    minInstances: 0,
    maxInstances: 5,

    timeoutSeconds: 30,
    memory: "256MiB",
  },

  async (req, res) => {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Método no permitido",
      });
    }

    try {
      const placeId =
        "ChIJB_uIrftvxkcRGRoIHC3xWXU";

      const apiKey =
        googlePlacesApiKey.value();

      const endpoint =
        `https://places.googleapis.com/v1/places/${placeId}`;

      const response = await fetch(endpoint, {
        method: "GET",

        headers: {
          "X-Goog-Api-Key": apiKey,

          "X-Goog-FieldMask": [
            "id",
            "displayName",
            "rating",
            "userRatingCount",
            "googleMapsUri",
            "reviews",
          ].join(","),
        },
      });

      if (!response.ok) {
        const googleError =
          await response.text();

        console.error(
          "Error de Google Places:",
          response.status,
          googleError
        );

        return res.status(502).json({
          error:
            "No se pudieron obtener las opiniones de Google",
        });
      }

      const place = await response.json();

     const reviews = (
  place.reviews || []
).map((review) => ({
  nombre:
    review.authorAttribution
      ?.displayName || "Cliente",

  foto:
    review.authorAttribution
      ?.photoUri || null,

  googleReviewUrl:
    place.googleMapsUri || null,

  estrellas:
    review.rating || 0,

  fecha:
    review.relativePublishTimeDescription || "",

  fechaPublicacion:
    review.publishTime || null,

  texto:
    review.text?.text || "",

  idioma:
    review.text?.languageCode || null,
}));

      return res.status(200).json({
        ok: true,

        negocio:
          place.displayName?.text ||
          "MY Translator",

        rating:
          place.rating || 0,

        totalOpiniones:
          place.userRatingCount || 0,

        googleMapsUrl:
          place.googleMapsUri || null,

        reviews,
      });
     
       } catch (error) {
      console.error(
        "Error en getGoogleReviews:",
        error
      );

      return res.status(500).json({
        error:
          "No se pudieron cargar las opiniones",
      });
    }
  }
);