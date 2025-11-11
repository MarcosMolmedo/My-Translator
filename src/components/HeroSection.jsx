import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/HeroSection.css";

const HeroSection = () => {
  const [isExtraSmallSubtitle, setIsExtraSmallSubtitle] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      // ⬅️ para anchos menores a 760px usamos la versión más corta
      setIsExtraSmallSubtitle(window.innerWidth < 760);
    };

    checkWidth(); // al cargar
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const subtitleText = isExtraSmallSubtitle
    ? "Documentos legales traducidos y reconocidos oficialmente."
    : "Documentos legales traducidos de forma rápida y reconocidos oficialmente.";

  return (
    <section className="hero">
      {/* Fondo principal */}
      <div className="hero__background">
        <img
          src="/bannerliso.png"
          alt="Traducciones juradas en los Países Bajos"
          className="hero__background-image"
        />
      </div>

      {/* Contenido centrado */}
      <div className="hero__content">
        <div className="hero__content-box">
          <h1 className="hero__title">
            Traducciones Juradas en los Países Bajos
          </h1>

          <p className="hero__subtitle">{subtitleText}</p>

          <Link to="/contacto" className="hero__cta">
            Contactame
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


