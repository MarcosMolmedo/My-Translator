import React from "react";
import "../Styles/SobreMi.css";

const SobreMi = () => {
  return (
    <div className="sobre-mi-wrapper">
      <section className="sobre-mi-container">
        <div className="sobre-mi-content">
          <div className="sobre-mi-imagen">
            <img src="/MalvasioYohana1.png" alt="Yohana Malvasio" />
          </div>
          <div className="sobre-mi-texto">
            <p>
              Hola, soy <strong>Yohana Malvasio</strong>, traductora jurada en Países Bajos. Estoy habilitada para traducir documentos del español a inglés y del inglés al español. Me especializo en la traducción de documentos legales, académicos y personales, asegurando el más alto nivel de precisión, confidencialidad y cumplimiento con los requisitos oficiales.
            </p>
            <p>
              Mi objetivo es facilitar que tus documentos sean aceptados sin inconvenientes tanto en los Países Bajos como en otros países. Trabajo con dedicación y atención al detalle para ofrecerte un servicio de alta calidad.
            </p>
            <p>
              Apasionada por los idiomas, disfruto conectando culturas a través de la comunicación. Si necesitás una traducción rápida, precisa y confiable, ¡estoy aquí para ayudarte!
            </p>
            <a
              href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="sobre-mi-btn"
            >
              Sígueme en Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreMi;
