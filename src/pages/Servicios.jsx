import React, { useState, useEffect } from "react";
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
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % serviciosData.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div className="servicios-page-container">
      <div className="servicios-carousel">
        {serviciosData.map((servicio, i) => (
          <div
            key={i}
            className={`servicios-page-card ${i === index ? "active" : "inactive"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
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
