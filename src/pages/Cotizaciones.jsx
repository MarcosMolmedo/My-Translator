import React, { useEffect, useRef, useState } from "react";
import "../Styles/Cotizaciones.css";
import ContadorCircular from "../components/ContadorCircular";
import CotizacionIcon from "../assets/images/cotizacion-icon.png";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:10000/send-email"
    : "https://my-translator-backend.onrender.com/send-email";

const MAX_FILES = 5;
const MAX_TOTAL_MB = 20;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
];

const createInitialFormData = () => ({
  nombre: "",
  email: "",
  idioma: "",
  paisEmisor: "",
  apostillado: "",
  tiempoEntrega: "",
  retiroUtrecht: "",
  envioPostNL: "No",
  comentario: "",
  archivos: [],
});

const createInitialErrors = () => ({
  nombre: "",
  email: "",
  idioma: "",
  paisEmisor: "",
  paisDetalle: "",
  apostillado: "",
  tiempoEntrega: "",
  metodoEntrega: "",
  archivos: "",
});

const Cotizaciones = ({ translations }) => {
  const t = translations.quoteForm;

  const [formData, setFormData] = useState(createInitialFormData);
  const [paisDetalle, setPaisDetalle] = useState("");
  const [errors, setErrors] = useState(createInitialErrors);
  const [touched, setTouched] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const successTimerRef = useRef(null);

  const getTotalBytes = (files) =>
    files.reduce((total, file) => total + (file?.size || 0), 0);

  const getFileExtension = (fileName = "") =>
    fileName.split(".").pop()?.toLowerCase() || "";

  const isCountryDetailRequired =
    formData.paisEmisor === "Otro" ||
    formData.paisEmisor === "Combinacion";

  const metodoEntrega =
    formData.retiroUtrecht === "Sí"
      ? "retiro"
      : formData.envioPostNL === "Sí"
      ? "postnl"
      : "";

  const totalArchivosMB = (
    getTotalBytes(formData.archivos) /
    (1024 * 1024)
  ).toFixed(2);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const clearGeneralMessage = () => {
    if (mensaje) {
      setMensaje(null);
    }

    if (enviado) {
      setEnviado(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return t.validation.nameRequired;
        if (value.trim().length < 2) return t.validation.nameTooShort;
        return "";

      case "email": {
        if (!value.trim()) return t.validation.emailRequired;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value.trim())) {
          return t.validation.emailInvalid;
        }

        return "";
      }

      case "idioma":
        return value ? "" : t.validation.languageRequired;

      case "paisEmisor":
        return value ? "" : t.validation.countryRequired;

      case "paisDetalle":
        if (isCountryDetailRequired && !value.trim()) {
          return t.validation.countryDetailRequired;
        }
        return "";

      case "apostillado":
        return value ? "" : t.validation.apostilleRequired;

      case "tiempoEntrega":
        return value ? "" : t.validation.deliveryTimeRequired;

      case "metodoEntrega":
        return value ? "" : t.validation.deliveryMethodRequired;

      default:
        return "";
    }
  };

  const validateFiles = (files) => {
    if (files.length === 0) {
      return t.validation.fileRequired;
    }

    if (files.length > MAX_FILES) {
      return t.validation.fileLimit.replace(
        "{maxFiles}",
        String(MAX_FILES)
      );
    }

    if (getTotalBytes(files) > MAX_TOTAL_BYTES) {
      return t.validation.fileSize
        .replace("{maxMb}", String(MAX_TOTAL_MB));
    }

    return "";
  };

  const validateForm = () => {
    const nextErrors = {
      nombre: validateField("nombre", formData.nombre),
      email: validateField("email", formData.email),
      idioma: validateField("idioma", formData.idioma),
      paisEmisor: validateField(
        "paisEmisor",
        formData.paisEmisor
      ),
      paisDetalle: validateField("paisDetalle", paisDetalle),
      apostillado: validateField(
        "apostillado",
        formData.apostillado
      ),
      tiempoEntrega: validateField(
        "tiempoEntrega",
        formData.tiempoEntrega
      ),
      metodoEntrega: validateField(
        "metodoEntrega",
        metodoEntrega
      ),
      archivos: validateFiles(formData.archivos),
    };

    setErrors(nextErrors);

    setTouched({
      nombre: true,
      email: true,
      idioma: true,
      paisEmisor: true,
      paisDetalle: true,
      apostillado: true,
      tiempoEntrega: true,
      metodoEntrega: true,
      archivos: true,
    });

    return !Object.values(nextErrors).some(Boolean);
  };

  const updateFieldError = (name, value) => {
    if (!touched[name]) return;

    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    clearGeneralMessage();

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    updateFieldError(name, value);

    if (name === "paisEmisor") {
      if (value !== "Otro" && value !== "Combinacion") {
        setPaisDetalle("");
        setErrors((current) => ({
          ...current,
          paisDetalle: "",
        }));
      }
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));

    setErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  const handleCountryDetailChange = (event) => {
    const { value } = event.target;

    clearGeneralMessage();
    setPaisDetalle(value);

    if (touched.paisDetalle) {
      setErrors((current) => ({
        ...current,
        paisDetalle: value.trim()
          ? ""
          : t.validation.countryDetailRequired,
      }));
    }
  };

  const handleCountryDetailBlur = () => {
    setTouched((current) => ({
      ...current,
      paisDetalle: true,
    }));

    setErrors((current) => ({
      ...current,
      paisDetalle: validateField(
        "paisDetalle",
        paisDetalle
      ),
    }));
  };

  const handleDeliveryMethodChange = (event) => {
    const { value } = event.target;

    clearGeneralMessage();

    setFormData((current) => {
      if (value === "retiro") {
        return {
          ...current,
          retiroUtrecht: "Sí",
          envioPostNL: "No",
        };
      }

      return {
        ...current,
        retiroUtrecht: "No",
        envioPostNL: "Sí",
      };
    });

    setTouched((current) => ({
      ...current,
      metodoEntrega: true,
    }));

    setErrors((current) => ({
      ...current,
      metodoEntrega: "",
    }));
  };

  const processFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles || []);

    if (incoming.length === 0) return;

    clearGeneralMessage();

    const currentFiles = [...formData.archivos];
    const existingKeys = new Set(
      currentFiles.map(
        (file) =>
          `${file.name}-${file.size}-${file.lastModified}`
      )
    );

    const acceptedFiles = [...currentFiles];
    const rejectedTypeFiles = [];
    const rejectedSizeFiles = [];
    let reachedFileLimit = false;

    incoming.forEach((file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      const extension = getFileExtension(file.name);

      if (existingKeys.has(fileKey)) return;

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        rejectedTypeFiles.push(file.name);
        return;
      }

      if (acceptedFiles.length >= MAX_FILES) {
        reachedFileLimit = true;
        return;
      }

      const nextTotal =
        getTotalBytes(acceptedFiles) + file.size;

      if (nextTotal > MAX_TOTAL_BYTES) {
        rejectedSizeFiles.push(file.name);
        return;
      }

      acceptedFiles.push(file);
      existingKeys.add(fileKey);
    });

    setFormData((current) => ({
      ...current,
      archivos: acceptedFiles,
    }));

    setTouched((current) => ({
      ...current,
      archivos: true,
    }));

    let fileError = "";

    if (rejectedTypeFiles.length > 0) {
      fileError = t.validation.fileType.replace(
        "{files}",
        rejectedTypeFiles.join(", ")
      );
    } else if (rejectedSizeFiles.length > 0) {
      fileError = t.validation.fileSizeRejected
        .replace("{files}", rejectedSizeFiles.join(", "))
        .replace("{maxMb}", String(MAX_TOTAL_MB));
    } else if (reachedFileLimit) {
      fileError = t.validation.fileLimit.replace(
        "{maxFiles}",
        String(MAX_FILES)
      );
    } else {
      fileError = validateFiles(acceptedFiles);
    }

    setErrors((current) => ({
      ...current,
      archivos: fileError,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFilesChange = (event) => {
    processFiles(event.target.files);
  };

  const handleRemoveFile = (indexToRemove) => {
    clearGeneralMessage();

    setFormData((current) => {
      const nextFiles = current.archivos.filter(
        (_, index) => index !== indexToRemove
      );

      setErrors((currentErrors) => ({
        ...currentErrors,
        archivos: validateFiles(nextFiles),
      }));

      return {
        ...current,
        archivos: nextFiles,
      };
    });
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragging(false);
    processFiles(event.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    setPaisDetalle("");
    setErrors(createInitialErrors());
    setTouched({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildBackendComment = () => {
    const detail = paisDetalle.trim();
    const comment = formData.comentario.trim();

    if (!isCountryDetailRequired || !detail) {
      return comment;
    }

    const countryDetailText = `${t.countryDetailBackendLabel}: ${detail}`;

    return comment
      ? `${countryDetailText}\n\n${comment}`
      : countryDetailText;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearGeneralMessage();

    if (!validateForm()) {
      setMensaje({
        type: "error",
        text: t.validation.formError,
      });
      return;
    }

    setCargando(true);
    setEnviado(false);
    setMensaje(null);

    const data = new FormData();

    /*
      IMPORTANTE:
      Se mantienen exactamente las claves que recibe el backend.
    */
    data.append("nombre", formData.nombre.trim());
    data.append("email", formData.email.trim());
    data.append("idioma", formData.idioma);
    data.append("paisEmisor", formData.paisEmisor);
    data.append("apostillado", formData.apostillado);
    data.append(
      "tiempoEntrega",
      formData.tiempoEntrega
    );
    data.append(
      "retiroUtrecht",
      formData.retiroUtrecht
    );
    data.append("envioPostNL", formData.envioPostNL);
    data.append("comentario", buildBackendComment());

    formData.archivos.forEach((file) => {
      data.append("archivos", file);
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: data,
      });

      const responseData = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        console.error("Backend error:", responseData);

        setMensaje({
          type: "error",
          text: t.backendError,
        });

        return;
      }

      resetForm();
      setEnviado(true);

      setMensaje({
        type: "success",
        title: t.successTitle,
        text: t.successText,
      });

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }

      successTimerRef.current = setTimeout(() => {
        setEnviado(false);
      }, 4000);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      setMensaje({
        type: "error",
        text: t.connectionError,
      });
    } finally {
      setCargando(false);
    }
  };

  const getFieldErrorId = (fieldName) =>
    `cotizaciones-${fieldName}-error`;

  return (
    <main className="cotizaciones">
      <div className="cotizaciones__container">
        <header className="cotizaciones__hero">
          <div className="cotizaciones__hero-content">
            <span className="cotizaciones__eyebrow">
              {t.eyebrow}
            </span>

            <h1 className="cotizaciones__title">
              {t.title}
            </h1>

            <p className="cotizaciones__intro">
              {t.intro}
            </p>

            <ul
              className="cotizaciones__trust-list"
              aria-label={t.trustListLabel}
            >
              {t.trustItems.map((item) => (
                <li
                  key={item}
                  className="cotizaciones__trust-item"
                >
                  <span
                    className="cotizaciones__trust-icon"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="cotizaciones__hero-symbol"
            aria-hidden="true"
          >
            <span className="cotizaciones__hero-symbol-ring">
              <img
                src={CotizacionIcon}
                alt=""
                className="cotizaciones__icon"
              />
            </span>
          </div>
        </header>

        <div className="cotizaciones__layout">
         
          <section
            className="cotizaciones__form-card"
            aria-labelledby="cotizaciones-form-title"
          >
            <div className="cotizaciones__form-header">
              <span className="cotizaciones__form-step">
                {t.formEyebrow}
              </span>

              <h2
                id="cotizaciones-form-title"
                className="cotizaciones__form-title"
              >
                {t.formTitle}
              </h2>

              <p className="cotizaciones__form-intro">
                {t.formIntro}
              </p>
            </div>

            <form
              className="cotizaciones__form"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              noValidate
            >
              <fieldset
                disabled={cargando}
                className="cotizaciones__fieldset"
              >
                <legend className="cotizaciones__sr-only">
                  {t.formLegend}
                </legend>

                <section className="cotizaciones__section">
                  <div className="cotizaciones__section-heading">
                    <span className="cotizaciones__section-number">
                      01
                    </span>

                    <div>
                      <h3 className="cotizaciones__section-title">
                        {t.personalTitle}
                      </h3>

                      <p className="cotizaciones__section-text">
                        {t.personalText}
                      </p>
                    </div>
                  </div>

                  <div className="cotizaciones__grid cotizaciones__grid--two">
                    <div className="cotizaciones__group">
                      <label
                        htmlFor="nombre"
                        className="cotizaciones__label"
                      >
                        {t.nameLabel}
                        <span aria-hidden="true"> *</span>
                      </label>

                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className={`cotizaciones__input ${
                          errors.nombre
                            ? "cotizaciones__input--error"
                            : ""
                        }`}
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t.namePlaceholder}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.nombre)}
                        aria-describedby={
                          errors.nombre
                            ? getFieldErrorId("nombre")
                            : undefined
                        }
                      />

                      {errors.nombre && (
                        <p
                          id={getFieldErrorId("nombre")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.nombre}
                        </p>
                      )}
                    </div>

                    <div className="cotizaciones__group">
                      <label
                        htmlFor="email"
                        className="cotizaciones__label"
                      >
                        {t.emailLabel}
                        <span aria-hidden="true"> *</span>
                      </label>

                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`cotizaciones__input ${
                          errors.email
                            ? "cotizaciones__input--error"
                            : ""
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t.emailPlaceholder}
                        autoComplete="email"
                        inputMode="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email
                            ? getFieldErrorId("email")
                            : undefined
                        }
                      />

                      {errors.email && (
                        <p
                          id={getFieldErrorId("email")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="cotizaciones__section">
                  <div className="cotizaciones__section-heading">
                    <span className="cotizaciones__section-number">
                      02
                    </span>

                    <div>
                      <h3 className="cotizaciones__section-title">
                        {t.documentTitle}
                      </h3>

                      <p className="cotizaciones__section-text">
                        {t.documentText}
                      </p>
                    </div>
                  </div>

                  <div className="cotizaciones__grid cotizaciones__grid--two">
                    <div className="cotizaciones__group">
                      <label
                        htmlFor="idioma"
                        className="cotizaciones__label"
                      >
                        {t.languageLabel}
                        <span aria-hidden="true"> *</span>
                      </label>

                      <div className="cotizaciones__select-wrapper">
                        <select
                          id="idioma"
                          name="idioma"
                          className={`cotizaciones__select ${
                            errors.idioma
                              ? "cotizaciones__select--error"
                              : ""
                          }`}
                          value={formData.idioma}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={Boolean(errors.idioma)}
                          aria-describedby={
                            errors.idioma
                              ? getFieldErrorId("idioma")
                              : undefined
                          }
                        >
                          <option value="">
                            {t.selectOption}
                          </option>

                          <option value="es-en">
                            {t.spanishEnglish}
                          </option>

                          <option value="en-es">
                            {t.englishSpanish}
                          </option>
                        </select>
                      </div>

                      {errors.idioma && (
                        <p
                          id={getFieldErrorId("idioma")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.idioma}
                        </p>
                      )}
                    </div>

                    <div className="cotizaciones__group">
                      <label
                        htmlFor="paisEmisor"
                        className="cotizaciones__label"
                      >
                        {t.countryLabel}
                        <span aria-hidden="true"> *</span>
                      </label>

                      <div className="cotizaciones__select-wrapper">
                        <select
                          id="paisEmisor"
                          name="paisEmisor"
                          className={`cotizaciones__select ${
                            errors.paisEmisor
                              ? "cotizaciones__select--error"
                              : ""
                          }`}
                          value={formData.paisEmisor}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-invalid={Boolean(
                            errors.paisEmisor
                          )}
                          aria-describedby={
                            errors.paisEmisor
                              ? getFieldErrorId("paisEmisor")
                              : undefined
                          }
                        >
                          <option value="">
                            {t.selectCountry}
                          </option>

                          <option value="Argentina">
                            {t.argentina}
                          </option>

                          <option value="Uruguay">
                            {t.uruguay}
                          </option>

                          <option value="Chile">
                            {t.chile}
                          </option>

                          <option value="México">
                            {t.mexico}
                          </option>

                          <option value="España">
                            {t.spain}
                          </option>

                          <option value="Combinacion">
                            {t.countryCombination}
                          </option>

                          <option value="Otro">
                            {t.otherCountry}
                          </option>
                        </select>
                      </div>

                      {errors.paisEmisor && (
                        <p
                          id={getFieldErrorId("paisEmisor")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.paisEmisor}
                        </p>
                      )}
                    </div>
                  </div>

                  {isCountryDetailRequired && (
                    <div className="cotizaciones__group cotizaciones__group--revealed">
                      <label
                        htmlFor="paisDetalle"
                        className="cotizaciones__label"
                      >
                        {formData.paisEmisor === "Combinacion"
                          ? t.countryCombinationDetailLabel
                          : t.otherCountryDetailLabel}
                        <span aria-hidden="true"> *</span>
                      </label>

                      <input
                        type="text"
                        id="paisDetalle"
                        name="paisDetalle"
                        className={`cotizaciones__input ${
                          errors.paisDetalle
                            ? "cotizaciones__input--error"
                            : ""
                        }`}
                        value={paisDetalle}
                        onChange={handleCountryDetailChange}
                        onBlur={handleCountryDetailBlur}
                        placeholder={
                          formData.paisEmisor === "Combinacion"
                            ? t.countryCombinationPlaceholder
                            : t.otherCountryPlaceholder
                        }
                        aria-invalid={Boolean(
                          errors.paisDetalle
                        )}
                        aria-describedby={
                          errors.paisDetalle
                            ? getFieldErrorId("paisDetalle")
                            : undefined
                        }
                      />

                      {errors.paisDetalle && (
                        <p
                          id={getFieldErrorId("paisDetalle")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.paisDetalle}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="cotizaciones__question">
                    <fieldset className="cotizaciones__choice-fieldset">
                      <legend className="cotizaciones__choice-legend">
                        {t.apostilleLabel}
                        <span aria-hidden="true"> *</span>
                      </legend>

                      <p className="cotizaciones__choice-help">
                        {t.apostilleHelp}
                      </p>

                      <div className="cotizaciones__choice-grid cotizaciones__choice-grid--three">
                        {[
                          {
                            value: "Sí",
                            label: t.yes,
                          },
                          {
                            value: "No",
                            label: t.no,
                          },
                          {
                            value: "No sé",
                            label: t.dontKnow,
                          },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`cotizaciones__choice ${
                              formData.apostillado ===
                              option.value
                                ? "cotizaciones__choice--selected"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name="apostillado"
                              value={option.value}
                              checked={
                                formData.apostillado ===
                                option.value
                              }
                              onChange={handleChange}
                              className="cotizaciones__choice-input"
                            />

                            <span
                              className="cotizaciones__choice-control"
                              aria-hidden="true"
                            />

                            <span className="cotizaciones__choice-label">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      {errors.apostillado && (
                        <p
                          id={getFieldErrorId("apostillado")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.apostillado}
                        </p>
                      )}
                    </fieldset>
                  </div>

                  <div className="cotizaciones__question">
                    <fieldset className="cotizaciones__choice-fieldset">
                      <legend className="cotizaciones__choice-legend">
                        {t.deliveryLabel}
                        <span aria-hidden="true"> *</span>
                      </legend>

                      <p className="cotizaciones__choice-help">
                        {t.deliveryHelp}
                      </p>

                      <div className="cotizaciones__choice-grid cotizaciones__choice-grid--two">
                        <label
                          className={`cotizaciones__choice cotizaciones__choice--large ${
                            formData.tiempoEntrega ===
                            "Menos de 3 días hábiles"
                              ? "cotizaciones__choice--selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="tiempoEntrega"
                            value="Menos de 3 días hábiles"
                            checked={
                              formData.tiempoEntrega ===
                              "Menos de 3 días hábiles"
                            }
                            onChange={handleChange}
                            className="cotizaciones__choice-input"
                          />

                          <span
                            className="cotizaciones__choice-control"
                            aria-hidden="true"
                          />

                          <span className="cotizaciones__choice-content">
                            <span className="cotizaciones__choice-label">
                              {t.urgentDelivery}
                            </span>

                            <span className="cotizaciones__choice-description">
                              {t.urgentDeliveryText}
                            </span>
                          </span>
                        </label>

                        <label
                          className={`cotizaciones__choice cotizaciones__choice--large ${
                            formData.tiempoEntrega ===
                            "Más de 3 días hábiles"
                              ? "cotizaciones__choice--selected"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="tiempoEntrega"
                            value="Más de 3 días hábiles"
                            checked={
                              formData.tiempoEntrega ===
                              "Más de 3 días hábiles"
                            }
                            onChange={handleChange}
                            className="cotizaciones__choice-input"
                          />

                          <span
                            className="cotizaciones__choice-control"
                            aria-hidden="true"
                          />

                          <span className="cotizaciones__choice-content">
                            <span className="cotizaciones__choice-label">
                              {t.normalDelivery}
                            </span>

                            <span className="cotizaciones__choice-description">
                              {t.normalDeliveryText}
                            </span>
                          </span>
                        </label>
                      </div>

                      {errors.tiempoEntrega && (
                        <p
                          id={getFieldErrorId("tiempoEntrega")}
                          className="cotizaciones__error"
                          role="alert"
                        >
                          {errors.tiempoEntrega}
                        </p>
                      )}
                    </fieldset>
                  </div>
                </section>

                <section className="cotizaciones__section">
                  <div className="cotizaciones__section-heading">
                    <span className="cotizaciones__section-number">
                      03
                    </span>

                    <div>
                      <h3 className="cotizaciones__section-title">
                        {t.deliveryMethodTitle}
                      </h3>

                      <p className="cotizaciones__section-text">
                        {t.deliveryMethodText}
                      </p>
                    </div>
                  </div>

                  <fieldset className="cotizaciones__choice-fieldset">
                    <legend className="cotizaciones__sr-only">
                      {t.deliveryMethodTitle}
                    </legend>

                    <div className="cotizaciones__choice-grid cotizaciones__choice-grid--two">
                      <label
                        className={`cotizaciones__choice cotizaciones__choice--large ${
                          metodoEntrega === "retiro"
                            ? "cotizaciones__choice--selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="metodoEntrega"
                          value="retiro"
                          checked={metodoEntrega === "retiro"}
                          onChange={handleDeliveryMethodChange}
                          className="cotizaciones__choice-input"
                        />

                        <span
                          className="cotizaciones__choice-control"
                          aria-hidden="true"
                        />

                        <span className="cotizaciones__choice-content">
                          <span className="cotizaciones__choice-label">
                            {t.pickupOption}
                          </span>

                          <span className="cotizaciones__choice-description">
                            {t.pickupOptionText}
                          </span>
                        </span>
                      </label>

                      <label
                        className={`cotizaciones__choice cotizaciones__choice--large ${
                          metodoEntrega === "postnl"
                            ? "cotizaciones__choice--selected"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="metodoEntrega"
                          value="postnl"
                          checked={metodoEntrega === "postnl"}
                          onChange={handleDeliveryMethodChange}
                          className="cotizaciones__choice-input"
                        />

                        <span
                          className="cotizaciones__choice-control"
                          aria-hidden="true"
                        />

                        <span className="cotizaciones__choice-content">
                          <span className="cotizaciones__choice-label">
                            {t.postnlOption}
                          </span>

                          <span className="cotizaciones__choice-description">
                            {t.postnlOptionText}
                          </span>
                        </span>
                      </label>
                    </div>

                    {errors.metodoEntrega && (
                      <p
                        id={getFieldErrorId("metodoEntrega")}
                        className="cotizaciones__error"
                        role="alert"
                      >
                        {errors.metodoEntrega}
                      </p>
                    )}
                  </fieldset>

                  <div className="cotizaciones__group cotizaciones__group--textarea">
                    <label
                      htmlFor="comentario"
                      className="cotizaciones__label"
                    >
                      {t.commentLabel}
                      <span className="cotizaciones__optional">
                        {t.optional}
                      </span>
                    </label>

                    <textarea
                      id="comentario"
                      name="comentario"
                      maxLength={300}
                      className="cotizaciones__textarea"
                      value={formData.comentario}
                      onChange={handleChange}
                      placeholder={t.commentPlaceholder}
                    />

                    <div className="cotizaciones__character-count">
                      {formData.comentario.length}/300
                    </div>
                  </div>
                </section>

                <section className="cotizaciones__section">
                  <div className="cotizaciones__section-heading">
                    <span className="cotizaciones__section-number">
                      04
                    </span>

                    <div>
                      <h3 className="cotizaciones__section-title">
                        {t.filesTitle}
                      </h3>

                      <p className="cotizaciones__section-text">
                        {t.filesText}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`cotizaciones__dropzone ${
                      dragging
                        ? "cotizaciones__dropzone--dragging"
                        : ""
                    } ${
                      errors.archivos
                        ? "cotizaciones__dropzone--error"
                        : ""
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="archivos"
                      name="archivos"
                      multiple
                      className="cotizaciones__file-input"
                      onChange={handleFilesChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      tabIndex={-1}
                    />

                    <div
                      className="cotizaciones__dropzone-icon"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                      >
                        <path
                          d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <h4 className="cotizaciones__dropzone-title">
                      {t.dropzoneTitle}
                    </h4>

                    <p className="cotizaciones__dropzone-text">
                      {t.dropzoneText}
                    </p>

                    <button
                      type="button"
                      className="cotizaciones__file-button"
                      onClick={openFileDialog}
                    >
                      {t.selectFiles}
                    </button>

                    <p className="cotizaciones__dropzone-help">
                      {t.fileFormats
                        .replace(
                          "{maxFiles}",
                          String(MAX_FILES)
                        )
                        .replace(
                          "{maxMb}",
                          String(MAX_TOTAL_MB)
                        )}
                    </p>
                  </div>

                  {errors.archivos && (
                    <p
                      id={getFieldErrorId("archivos")}
                      className="cotizaciones__error"
                      role="alert"
                    >
                      {errors.archivos}
                    </p>
                  )}

                  {formData.archivos.length > 0 && (
                    <div className="cotizaciones__files">
                      <div className="cotizaciones__files-header">
                        <h4 className="cotizaciones__files-title">
                          {t.selectedFiles}
                        </h4>

                        <span className="cotizaciones__files-total">
                          {totalArchivosMB} MB / {MAX_TOTAL_MB} MB
                        </span>
                      </div>

                      <ul className="cotizaciones__file-list">
                        {formData.archivos.map((file, index) => (
                          <li
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            className="cotizaciones__file-item"
                          >
                            <span
                              className="cotizaciones__file-type"
                              aria-hidden="true"
                            >
                              {getFileExtension(
                                file.name
                              ).toUpperCase()}
                            </span>

                            <span className="cotizaciones__file-information">
                              <span className="cotizaciones__file-name">
                                {file.name}
                              </span>

                              <span className="cotizaciones__file-size">
                                {(
                                  file.size /
                                  (1024 * 1024)
                                ).toFixed(2)}{" "}
                                MB
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFile(index)
                              }
                              className="cotizaciones__file-remove"
                              aria-label={`${t.removeFile} ${file.name}`}
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                <div className="cotizaciones__submit-area">
                  <p className="cotizaciones__consent">
                    {t.consentText}
                  </p>

                  <button
                    type="submit"
                    className={`cotizaciones__button ${
                      enviado
                        ? "cotizaciones__button--sent"
                        : ""
                    }`}
                    disabled={cargando}
                  >
                    <span>
                      {cargando
                        ? t.sending
                        : enviado
                        ? t.sent
                        : t.submit}
                    </span>

                    {!cargando && (
                      <span
                        className="cotizaciones__button-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </button>

                  <div className="cotizaciones__submit-meta">
                    <span>{t.freeQuote}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.noCommitment}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.responseTime}</span>
                  </div>
                </div>
              </fieldset>

              {cargando && (
                <div
                  className="cotizaciones__loading"
                  aria-live="polite"
                >
                  <ContadorCircular duracion={35} />
                </div>
              )}
            </form>

            {mensaje && (
              <div
                className={`cotizaciones__message cotizaciones__message--${mensaje.type}`}
                role={mensaje.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                <span
                  className="cotizaciones__message-icon"
                  aria-hidden="true"
                >
                  {mensaje.type === "success" ? "✓" : "!"}
                </span>

                <div>
                  {mensaje.title && (
                    <h3 className="cotizaciones__message-title">
                      {mensaje.title}
                    </h3>
                  )}

                  <p className="cotizaciones__message-text">
                    {mensaje.text}
                  </p>
                </div>
              </div>
            )}
            </section>
        </div>

        <aside className="cotizaciones__sidebar">
          <span className="cotizaciones__sidebar-eyebrow">
            {t.processEyebrow}
          </span>

          <h2 className="cotizaciones__sidebar-title">
            {t.processTitle}
          </h2>

          <ol className="cotizaciones__steps">
            {t.processSteps.map((step, index) => (
              <li
                key={step.title}
                className="cotizaciones__step"
              >
                <span className="cotizaciones__step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="cotizaciones__step-title">
                    {step.title}
                  </h3>

                  <p className="cotizaciones__step-text">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="cotizaciones__privacy-card">
            <span
              className="cotizaciones__privacy-icon"
              aria-hidden="true"
            >
              ◇
            </span>

            <div>
              <h3 className="cotizaciones__privacy-title">
                {t.privacyTitle}
              </h3>

              <p className="cotizaciones__privacy-text">
                {t.privacyText}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Cotizaciones;
