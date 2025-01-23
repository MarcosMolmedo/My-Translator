import "../Styles/SobreMi.css";
import YohaTranslations from "../assets/images/YohaTranslations.jpg";

const SobreMi = () => {
  return (
    <section id="sobre-mi" className="sobre-mi">
      <div className="container">
        <h2>Sobre mí</h2>
        <div className="about-content">
          <img
            src={YohaTranslations}
            alt="Yohana Malvasio"
            className="about-image"
          />
          <div className="about-text">
            <p>
              Hola, soy <strong>Yohana Malvasio</strong>, traductora jurada con experiencia en traducciones de
              documentos legales, académicos y personales. Mi objetivo es ayudarte a que tus documentos
              sean aceptados sin problemas en Países Bajos y en otros países. Trabajo con dedicación y
              precisión para ofrecerte un servicio de alta calidad.
            </p>
            <p>
              Además, soy apasionada por los idiomas y disfruto conectando culturas a través de la
              comunicación. Si necesitas una traducción rápida y confiable, ¡estoy aquí para ayudarte!
            </p>
            <a
              href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Sígueme en Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
