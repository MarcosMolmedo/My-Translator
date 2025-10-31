import React, { useState } from 'react';
import '../Styles/Cotizaciones.css';
import ContadorCircular from '../components/ContadorCircular';

const API_URL = 'http://localhost:3000/send-email';


// Límite total en MB
const MAX_TOTAL_MB = 20;
const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

const Cotizaciones = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    idioma: '',
    paisEmisor: '',
    apostillado: '',
    tiempoEntrega: '',
    retiroUtrecht: '',
    envioPostNL: 'No',
    comentario: '',
    archivos: [], // array de File
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [archivosError, setArchivosError] = useState('');

  const getTotalBytes = (files) => files.reduce((acc, f) => acc + (f?.size || 0), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Correo electrónico inválido');
    }

    if (name === 'retiroUtrecht' && value === 'Sí') {
      setFormData((prev) => ({
        ...prev,
        retiroUtrecht: value,
        envioPostNL: 'No', // Si retira en Utrecht, no se ofrece envío
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // === Archivos múltiples: acumular, deduplicar y validar ===
  const handleFilesChange = (e) => {
    const incoming = Array.from(e.target.files || []);
    if (incoming.length === 0) {
      setArchivosError('Debes adjuntar al menos un documento.');
      return;
    }

    // merge con los ya seleccionados
    let merged = [...formData.archivos, ...incoming];

    // dedup por name+size+lastModified
    const seen = new Set();
    merged = merged.filter((f) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // tope 5
    if (merged.length > 5) {
      setArchivosError('Puedes adjuntar hasta 5 archivos.');
      merged = merged.slice(0, 5);
    } else {
      setArchivosError('');
    }

    // validar peso total
    const totalBytes = getTotalBytes(merged);
    if (totalBytes > MAX_TOTAL_BYTES) {
      setArchivosError(`El peso total supera ${MAX_TOTAL_MB} MB. Reduce tamaño o cantidad de archivos.`);
      e.target.value = null; // reset para permitir re-selección
      return;
    }

    setFormData((prev) => ({ ...prev, archivos: merged }));
    e.target.value = null; // permite volver a elegir los mismos archivos si hace falta
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => {
      const next = [...prev.archivos];
      next.splice(index, 1);
      return { ...prev, archivos: next };
    });
    setArchivosError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // DEBUG: ver que realmente tengamos archivos antes de enviar
    console.log('DEBUG archivos:', formData.archivos.map(f => ({ name: f.name, size: f.size })));

    if (emailError) return;

    // Validaciones de archivos (JS, no nativas)
    if (formData.archivos.length === 0) {
      setArchivosError('Debes adjuntar al menos un documento.');
      return;
    }
    if (formData.archivos.length > 5) {
      setArchivosError('Puedes adjuntar hasta 5 archivos.');
      return;
    }
    if (getTotalBytes(formData.archivos) > MAX_TOTAL_BYTES) {
      setArchivosError(`El peso total supera ${MAX_TOTAL_MB} MB. Reduce el tamaño o cantidad de archivos.`);
      return;
    }

    setCargando(true);
    setMensaje('');

    const data = new FormData();

    // Campos de texto
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'archivos') data.append(key, value);
    });

    // Archivos (clave 'archivos' repetida)
    formData.archivos.forEach((f) => data.append('archivos', f));

    // DEBUG: ver el FormData real
    for (const [k, v] of data.entries()) {
      console.log('FD:', k, v instanceof File ? `${v.name} (${v.size})` : v);
    }

    try {
      const resp = await fetch(API_URL, { method: 'POST', body: data });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error('Backend error:', json);
        setMensaje(`Hubo un error al enviar la cotización: ${json.detail || json.error || resp.statusText}`);
      } else {
        setMensaje('¡Cotización enviada exitosamente!');
        setFormData({
          nombre: '',
          email: '',
          idioma: '',
          paisEmisor: '',
          apostillado: '',
          tiempoEntrega: '',
          retiroUtrecht: '',
          envioPostNL: 'No',
          comentario: '',
          archivos: [],
        });
        const fileInput = document.getElementById('archivos');
        if (fileInput) fileInput.value = '';
        setArchivosError('');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMensaje('Error de conexión. Inténtalo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cotizaciones-container">
      <h1>Solicitá tu Cotización</h1>

      {/* noValidate: evita que el navegador bloquee por validación nativa */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <fieldset disabled={cargando} style={{ border: 'none', padding: 0, margin: 0 }}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Tu correo electrónico"
            />
            {emailError && <p className="error">{emailError}</p>}
          </div>

          <div className="form-group">
            <label>¿A qué idioma deseás traducir el documento?</label>
            <select id="idioma" name="idioma" value={formData.idioma} onChange={handleChange} required>
              <option value="">Seleccioná una opción</option>
              <option value="es-en">Español - Inglés</option>
              <option value="en-es">Inglés - Español</option>
            </select>
          </div>

          <div className="form-group">
            <label>País emisor del documento:</label>
            <select
              id="paisEmisor"
              name="paisEmisor"
              value={formData.paisEmisor}
              onChange={handleChange}
              required
            >
              <option value="">Seleccioná un país</option>
              <option value="Argentina">Argentina</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Chile">Chile</option>
              <option value="México">México</option>
              <option value="España">España</option>
              <option value="Combinacion">Combinación de dos países</option>
              <option value="Otro">Otro país</option>
            </select>
          </div>

          <div className="form-group">
            <label>¿El documento está apostillado?</label>
            <div className="radio-group">
              <label><input type="radio" name="apostillado" value="Sí" onChange={handleChange} required /> Sí</label>
              <label><input type="radio" name="apostillado" value="No" onChange={handleChange} required /> No</label>
              <label><input type="radio" name="apostillado" value="No sé" onChange={handleChange} required /> No sé</label>
            </div>
          </div>

          <div className="form-group">
            <label>¿Cuándo necesitás que esté lista tu traducción?</label>
            <div className="radio-group">
              <label><input type="radio" name="tiempoEntrega" value="Menos de 5 días hábiles" onChange={handleChange} required /> Menos de 5 días hábiles (urgente)</label>
              <label><input type="radio" name="tiempoEntrega" value="Más de 5 días hábiles" onChange={handleChange} required /> Más de 5 días hábiles</label>
            </div>
          </div>

          <div className="form-group">
            <label>¿Vas a retirar tu traducción en Utrecht Terwijde?</label>
            <div className="radio-group">
              <label><input type="radio" name="retiroUtrecht" value="Sí" onChange={handleChange} required /> Sí</label>
              <label><input type="radio" name="retiroUtrecht" value="No" onChange={handleChange} required /> No</label>
            </div>
          </div>

          <div className="form-group">
            <label>¿Deseás que te envíe la traducción por PostNL?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="envioPostNL"
                  value="Sí"
                  onChange={handleChange}
                  required
                  disabled={formData.retiroUtrecht === 'Sí'}
                />{' '}
                Sí
              </label>
              <label>
                <input
                  type="radio"
                  name="envioPostNL"
                  value="No"
                  onChange={handleChange}
                  required
                  checked={formData.retiroUtrecht === 'Sí'}
                />{' '}
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Algún comentario que quieras agregar (opcional, máx. 300 caracteres):</label>
            <textarea
              id="comentario"
              name="comentario"
              maxLength="300"
              value={formData.comentario}
              onChange={handleChange}
              placeholder="Escribe aquí tu comentario..."
            />
          </div>

          {/* === Archivos múltiples === */}
          <div className="form-group">
            <label htmlFor="archivos">
              Cargá hasta 5 documentos (al menos 1 es obligatorio). Peso total máx: {MAX_TOTAL_MB} MB
            </label>
            <input
              type="file"
              id="archivos"
              name="archivos"
              multiple
              onChange={handleFilesChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            {/* Lista + quitar */}
            {formData.archivos.length > 0 && (
              <>
                <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                  {formData.archivos.map((f, i) => (
                    <li key={`${f.name}-${f.size}-${f.lastModified}`} style={{ marginBottom: 4 }}>
                      {f.name} — {(f.size / (1024 * 1024)).toFixed(2)} MB{' '}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="btn-link"
                        style={{ marginLeft: 8 }}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
                <small>
                  Total:&nbsp;{(getTotalBytes(formData.archivos) / (1024 * 1024)).toFixed(2)} MB
                </small>
              </>
            )}

            {archivosError && <p className="error">{archivosError}</p>}
          </div>

          <button type="submit" className="btn-enviar" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar'}
          </button>
        </fieldset>

        {cargando && <ContadorCircular duracion={35} />}
      </form>

      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
};

export default Cotizaciones;
