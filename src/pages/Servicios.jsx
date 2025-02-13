import React from "react";
import "../Styles/Servicios.css";

const Servicios = () => {
  return (
    <div>
      {/* Imagen con animación */}
      <div className="servicios-hero">
        <img src="/YohaServicios2.png" alt="Yohana Malvasio" className="servicios-hero-image" />
      </div>

      {/* Texto ahora debajo de la imagen */}
      <div className="servicios-hero-text">
        <p>
          Yohana Malvasio es una traductora oficial de español a inglés, reconocida por su 
          profesionalismo y eficiencia en los Países Bajos. Ofrece servicios de traducción 
          jurada con el más alto nivel de precisión y confidencialidad, ideales para documentos 
          personales, académicos y comerciales.
        </p>
      </div>

      {/* Nueva sección con los cuadros organizados correctamente */}
      <div className="servicios-content">
        <section className="servicios-card">
          <h2 className="servicios-section-title">Actas y Doc. Personales</h2>
          <ul className="servicios-list">
            <li>Actas de nacimiento</li>
            <li>Certificados de matrimonio y divorcio</li>
            <li>Actas de defunción</li>
            <li>Certificados de estado civil</li>
          </ul>
        </section>

        <section className="servicios-card">
          <h2 className="servicios-section-title">Documentos Académicos</h2>
          <ul className="servicios-list">
            <li>Diplomas y títulos universitarios</li>
            <li>Certificados de estudios y analíticos</li>
            <li>Documentos de convalidación académica</li>
          </ul>
        </section>

        <section className="servicios-card">
          <h2 className="servicios-section-title">Doc. Comerciales y Legales</h2>
          <ul className="servicios-list">
            <li>Contratos y acuerdos legales</li>
            <li>Informes financieros</li>
            <li>Poderes notariales</li>
          </ul>
        </section>

        <section className="servicios-card">
          <h2 className="servicios-section-title">Servicios Especializados</h2>
          <ul className="servicios-list">
            <li>Apostillas de documentos emitidos en los Países Bajos</li>
            <li>Traducciones juradas reconocidas en Holanda</li>
            <li>Asesoría personalizada para trámites internacionales</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Servicios;
