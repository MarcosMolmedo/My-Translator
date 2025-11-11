import React from "react";
import "../Styles/SobreMi.css";

const SobreMi = () => {
  const linkedInUrl = "https://www.linkedin.com/in/yohanamalvasio/";

  return (
    <section className="about">
      <div className="about__card">
        <div className="about__columns">
          {/* Columna izquierda: Sobre mí + foto + botón */}
          <div className="about__column about__column--profile">
            <h2 className="about__title">Sobre mí</h2>
            <p className="about__text">
              Soy Traductora Pública Nacional de Inglés, egresada de la
              Universidad Nacional de Córdoba, con más de 20 años de experiencia
              en traducción, edición, revisión e interpretación.
            </p>

            <div className="about__image-wrapper">
              <img
                src="/sobremi3.0.png"
                alt="Yohana Malvasio trabajando"
                className="about__image"
              />
            </div>

            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="about__button about__button--secondary"
            >
              Conocer más en LinkedIn
            </a>
          </div>

          {/* Columna derecha: Experiencia + Especialización */}
          <div className="about__column about__column--details">
            <h3 className="about__subtitle">Experiencia</h3>
            <p className="about__text">
              Comencé mi carrera profesional enseñando inglés y español y ofreciendo traducciones, guiada por una profunda pasión por los idiomas. Cuando me mudé a Países Bajos, esa misma pasión me llevó a formar parte de TransPerfect, donde perfeccioné mi mirada sobre la calidad lingüística. En el 2024, obtuve mi matrícula como traductora jurada en los Países Bajos, tras haber jurado ante la Corte de Utrecht, y desde entonces ofrezco servicios de traducción jurada en este país.
            </p>

            <h3 className="about__subtitle about__subtitle--spaced">
              Especialización
            </h3>
            <p className="about__text">
              A lo largo de mi carrera he trabajado con proyectos de gran
              diversidad y complejidad, especialmente en:
            </p>
            <ul className="about__list">
              <li className="about__list-item">
                Medicina y farmacéutica: estudios clínicos, protocolos, informes
                médicos y certificados.
              </li>
              <li className="about__list-item">
                Jurídico y comercial: contratos, resoluciones, políticas de
                privacidad, acuerdos e inversión.
              </li>
              <li className="about__list-item">
                Tecnología: manuales agrotech, big data aplicado a la
                agricultura, maquinaria y dispositivos.
              </li>
              <li className="about__list-item">
                Otros proyectos: SOPs, manuales técnicos, contenidos
                gastronómicos, blogs y postulaciones.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
