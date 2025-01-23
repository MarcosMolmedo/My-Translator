import React from "react";
import "../Styles/HeroSection.css";


const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Traducciones Juradas en Los Países Bajos</h2>
        <p className="hero-description">Convierte tus documentos de forma rápida, precisa y efectiva.</p>
        <a href="#contact" className="cta-button">Contáctame</a>
      </div>
      <div className="hero-image">
        <img src="/yohana.jpg" alt="Yohana Malvasio" />
      </div>
    </section>
  );
};

export default HeroSection;
