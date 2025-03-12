import React from "react";
import "../Styles/Servicios.css";

const serviciosData = [
  {
    title: "Actas y Doc. Personales",
    items: [
      "Actas de nacimiento",
      "Certificados de matrimonio y divorcio",
      "Actas de defunción",
      "Certificados de estado civil",
    ],
  },
  {
    title: "Documentos Académicos",
    items: [
      "Diplomas y títulos universitarios",
      "Certificados de estudios y analíticos",
      "Documentos de convalidación académica",
    ],
  },
  {
    title: "Doc. Comerciales y Legales",
    items: ["Contratos y acuerdos legales", "Informes financieros", "Poderes notariales"],
  },
  {
    title: "Servicios Especializados",
    items: [
      "Apostillas de documentos emitidos en los Países Bajos",
      "Traducciones juradas reconocidas en Holanda",
      "Asesoría personalizada para trámites internacionales",
    ],
  },
];

const Servicios = () => {
  return (
    <div className="servicios-page-container">
      <div className="servicios-grid">
        {serviciosData.map((servicio, i) => (
          <div key={i} className="servicios-page-card">
            <h2 className="servicios-page-title">{servicio.title}</h2>
            <ul className="servicios-page-list">
              {servicio.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
