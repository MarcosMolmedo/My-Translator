import React from "react";
import "../Styles/Servicios.css";

// 👇 Ahora apuntando a src/assets/images
import IconActas from "../assets/images/servicios actas-34.png";
import IconAcademicos from "../assets/images/servicios doc academico-35.png";
import IconLegales from "../assets/images/servicios doc legales-36.png";
import IconEspecializados from "../assets/images/servicios especializados-37.png";

const serviciosData = [
  {
    title: "Actas y Doc. Personales",
    items: [
      "Actas de nacimiento",
      "Certificados de matrimonio y divorcio",
      "Actas de defunción",
      "Certificados de estado civil",
    ],
    icon: IconActas,
    iconPosition: "bottom",
  },
  {
    title: "Documentos Académicos",
    items: [
      "Diplomas y títulos universitarios",
      "Certificados de estudios y analíticos",
      "Documentos de convalidación académica",
    ],
    icon: IconAcademicos,
    iconPosition: "top",
  },
  {
    title: "Doc. Comerciales y Legales",
    items: [
      "Contratos y acuerdos legales",
      "Informes financieros",
      "Poderes notariales",
    ],
    icon: IconLegales,
    iconPosition: "bottom",
  },
  {
    title: "Servicios Especializados",
    items: [
      "Apostillas de documentos emitidos en los Países Bajos",
      "Traducciones juradas reconocidas en Holanda",
      "Asesoría personalizada para trámites internacionales",
    ],
    icon: IconEspecializados,
    iconPosition: "top",
  },
];

const Servicios = () => {
  return (
    <section className="services">
      <div className="services__container">
        <div className="services__grid">
          {serviciosData.map((servicio, index) => (
            <article key={index} className="services__card">
              <h2 className="services__card-title">{servicio.title}</h2>

              <ul className="services__list">
                {servicio.items.map((item, idx) => (
                  <li key={idx} className="services__list-item">
                    <span className="services__bullet" />
                    <span className="services__item-text">{item}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`services__icon-wrapper services__icon-wrapper--${servicio.iconPosition}`}
              >
                <img
                  src={servicio.icon}
                  alt={servicio.title}
                  className="services__icon"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicios;
