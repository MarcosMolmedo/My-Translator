import React from "react";
import { Link } from "react-router-dom";
import "../Styles/HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Traducciones Juradas en Los Países Bajos</h2>
        <p className="hero-description">
        Traducí tus documentos de forma rápida, precisa y efectiva.
        </p>
        <Link to="/contacto" className="cta-button">Contactame</Link> {}
      </div>
      <div className="hero-image">
        <img src="/Central1.png" alt="Yohana Malvasio" />
        
      </div>
    </section>
  );
};

export default HeroSection;
