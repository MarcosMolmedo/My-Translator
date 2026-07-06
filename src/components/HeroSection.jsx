import React from "react";
import { Link } from "react-router-dom";
import "../Styles/HeroSection.css";

const HeroSection = ({ translations }) => {
  const hero = translations.hero;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__container">
        <div className="hero__media">
          <img src="/bannerliso.png" alt={hero.imageAlt} className="hero__image" />
          <div className="hero__overlay" />

          <div className="hero__content">
            <p className="hero__eyebrow">{hero.eyebrow}</p>

            <h1 className="hero__title" id="hero-title">
              <span>{hero.titleLineOne}</span>
              <span>{hero.titleLineTwo}</span>
              <span>{hero.titleLineThree}</span>
            </h1>

            <span className="hero__title-line" aria-hidden="true" />

            <p className="hero__text">{hero.text}</p>

            <div className="hero__actions">
              <Link to="/cotizaciones" className="hero__button hero__button--primary">
                {hero.primaryCta}
                <span aria-hidden="true">→</span>
              </Link>

              <Link to="/servicios" className="hero__button hero__button--secondary">
                {hero.secondaryCta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="hero__highlights" aria-label="Puntos destacados">
              {hero.highlights.map((item) => (
                <article className="hero__highlight" key={item}>
                  <span className="hero__highlight-icon" aria-hidden="true">
                    ✦
                  </span>
                  <p className="hero__highlight-text">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;