import React from "react";
import "../Styles/Servicios.css";


import YohaImage from "../assets/images/YohaTranslations-22.jpg";

const Servicios = () => {
  return (
    <div className="servicios-container">
      <h1 className="servicios-title">Servicios de Traducción Jurada</h1>
      <div className="about-content">
        {/* Usa la imagen importada */}
        <img
          src={YohaImage}
          alt="Yohana Malvasio"
          className="about-image"
        />
        <div className="about-text">
          <p>
            Yohana Malvasio es una traductora oficial de español a inglés,
            reconocida por su profesionalismo y eficiencia en los Países Bajos.
            Ofrece servicios de traducción jurada con el más alto nivel de
            precisión y confidencialidad, ideales para documentos personales,
            académicos y comerciales.
          </p>
        </div>
      </div>
      <section className="servicio-section">
        <h2 className="section-title">Actas y Documentos Personales</h2>
        <ul className="servicio-list">
          <li>Actas de nacimiento</li>
          <li>Certificados de matrimonio y divorcio</li>
          <li>Actas de defunción</li>
          <li>Certificados de estado civil</li>
        </ul>
      </section>
      <section className="servicio-section">
        <h2 className="section-title">Documentos Académicos</h2>
        <ul className="servicio-list">
          <li>Diplomas y títulos universitarios</li>
          <li>Certificados de estudios y analíticos</li>
          <li>Documentos de convalidación académica</li>
        </ul>
      </section>
      <section className="servicio-section">
        <h2 className="section-title">Documentos Comerciales y Legales</h2>
        <ul className="servicio-list">
          <li>Contratos y acuerdos legales</li>
          <li>Informes financieros</li>
          <li>Poderes notariales</li>
        </ul>
      </section>
      <section className="servicio-section">
        <h2 className="section-title">Servicios Especializados</h2>
        <ul className="servicio-list">
          <li>Apostillas de documentos emitidos en los Países Bajos</li>
          <li>Traducciones juradas reconocidas en Holanda</li>
          <li>Asesoría personalizada para trámites internacionales</li>
        </ul>
      </section>
    </div>
  );
};

export default Servicios;
