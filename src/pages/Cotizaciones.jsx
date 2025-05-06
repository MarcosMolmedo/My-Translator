import React, { useState } from 'react';
import '../Styles/Cotizaciones.css';
import ContadorCircular from '../components/ContadorCircular';


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
    archivo: null,
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [archivoError, setArchivoError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? '' : 'Correo electrónico inválido');
    }

    if (name === 'retiroUtrecht' && value === 'Sí') {
      setFormData((prevState) => ({
        ...prevState,
        retiroUtrecht: value,
        envioPostNL: 'No',
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoError('');
      setFormData({ ...formData, archivo: file });
    } else {
      setArchivoError('Debes adjuntar un documento.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || archivoError || !formData.archivo) {
      setArchivoError(!formData.archivo ? 'Debes adjuntar un documento.' : '');
      return;
    }

    setCargando(true);
    setMensaje('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'archivo' && value) {
        data.append('archivo', value);
      } else {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch('https://my-translator.onrender.com/send-email', {
        method: "POST",
        body: data // ✅ Este es el FormData correcto que construiste
      });
      
      
      

      if (response.ok) {
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
          archivo: null,
        });
        document.getElementById('archivo').value = '';
      } else {
        setMensaje('Hubo un error al enviar la cotización.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMensaje('Error de conexión. Inténtalo más tarde.');
    }

    setCargando(false);
  };

  return (
    <div className="cotizaciones-container">
      <h1>Solicitá tu Cotización</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
  <fieldset disabled={cargando} style={{ border: 'none', padding: 0, margin: 0 }}>

        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Tu nombre" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Tu correo electrónico" />
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
          <select id="paisEmisor" name="paisEmisor" value={formData.paisEmisor} onChange={handleChange} required>
            <option value="">Seleccioná un país</option>
            <option value="Argentina">Argentina</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Chile">Chile</option>
            <option value="México">México</option>
            <option value="España">España</option>
            <option value="Combinacion">Combinacion de dos paises</option>
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
            <label><input type="radio" name="envioPostNL" value="Sí" onChange={handleChange} required disabled={formData.retiroUtrecht === 'Sí'} /> Sí</label>
            <label><input type="radio" name="envioPostNL" value="No" onChange={handleChange} required checked={formData.retiroUtrecht === 'Sí'} /> No</label>
          </div>
        </div>

        <div className="form-group">
          <label>Algún comentario que quieras agregar (opcional, máx. 300 caracteres):</label>
          <textarea id="comentario" name="comentario" maxLength="300" value={formData.comentario} onChange={handleChange} placeholder="Escribe aquí tu comentario..." />
        </div>

        <div className="form-group">
          <label htmlFor="archivo">Cargá una copia de tu documento por favor (obligatorio):</label>
          <input type="file" id="archivo" name="archivo" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" required />
          {archivoError && <p className="error">{archivoError}</p>}
        </div>

        <button type="submit" className="btn-enviar" disabled={cargando}>
  {cargando ? "Enviando..." : "Enviar"}
</button>
</fieldset>

{cargando && <ContadorCircular duracion={35} />}
      </form>

      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
};

export default Cotizaciones;
