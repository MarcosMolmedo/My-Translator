import React from "react";
import "../Styles/SobreMi.css";

const SobreMi = () => {
  return (
    <section id="sobre-mi" className="sobre-mi">
      <div className="container">
        <div className="about-content">
          <img
            src="/MalvasioYohana1.png" 
            alt="Yohana Malvasio"
            className="about-image"
          />
          <div className="about-text">
            <p>
              Hola, soy <strong>Yohana Malvasio</strong>, traductora jurada de español a inglés, 
              reconocida en los Países Bajos por mi profesionalismo y eficiencia. 
              Me especializo en la traducción de documentos legales, académicos y personales, 
              asegurando el más alto nivel de precisión, confidencialidad y cumplimiento con los requisitos oficiales.
            </p>
            <p>
              Mi objetivo es facilitar que tus documentos sean aceptados sin inconvenientes 
              tanto en los Países Bajos como en otros países. Trabajo con dedicación y 
              atención al detalle para ofrecerte un servicio de alta calidad.
            </p>
            <p>
              Apasionada por los idiomas, disfruto conectando culturas a través de la comunicación. 
              Si necesitas una traducción rápida, precisa y confiable, ¡estoy aquí para ayudarte!
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
