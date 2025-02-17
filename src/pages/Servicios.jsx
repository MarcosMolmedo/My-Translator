import React from "react";
import "../Styles/Servicios.css";

const Servicios = () => {
  return (
    <div className="servicios-page-container">
      <div className="servicios-page-content">
        <section className="servicios-page-card">
          <h2 className="servicios-page-title">Actas y Doc. Personales</h2>
          <ul className="servicios-page-list">
            <li>Actas de nacimiento</li>
            <li>Certificados de matrimonio y divorcio</li>
            <li>Actas de defunción</li>
            <li>Certificados de estado civil</li>
          </ul>
        </section>

        <section className="servicios-page-card">
          <h2 className="servicios-page-title">Documentos Académicos</h2>
          <ul className="servicios-page-list">
            <li>Diplomas y títulos universitarios</li>
            <li>Certificados de estudios y analíticos</li>
            <li>Documentos de convalidación académica</li>
          </ul>
        </section>

        <section className="servicios-page-card">
          <h2 className="servicios-page-title">Doc. Comerciales y Legales</h2>
          <ul className="servicios-page-list">
            <li>Contratos y acuerdos legales</li>
            <li>Informes financieros</li>
            <li>Poderes notariales</li>
          </ul>
        </section>

        <section className="servicios-page-card">
          <h2 className="servicios-page-title">Servicios Especializados</h2>
          <ul className="servicios-page-list">
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