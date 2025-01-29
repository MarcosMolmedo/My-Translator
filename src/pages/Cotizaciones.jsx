import React, { useState } from 'react';
import '../Styles/Cotizaciones.css'; 
const Cotizaciones = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    archivo: null,
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, archivo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('email', formData.email);
    if (formData.archivo) {
      data.append('archivo', formData.archivo);
    }

    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setMensaje('¡Cotización enviada exitosamente!');
        setFormData({ nombre: '', email: '', archivo: null });
      } else {
        setMensaje('Hubo un error al enviar la cotización.');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setMensaje('Error de conexión. Inténtalo más tarde.');
    }
  };

  return (
    <div className="cotizaciones-container">
      <h1>Solicita tu Cotización</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        </div>
        <div className="form-group">
          <label htmlFor="archivo">Cargar Documento:</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
        </div>
        <button type="submit" className="submit-button">Enviar</button>
      </form>
      {mensaje && <p className="message">{mensaje}</p>}
    </div>
  );
};

export default Cotizaciones;
