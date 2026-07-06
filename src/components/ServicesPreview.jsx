import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ServicesPreview.css";

const ServicesPreview = ({ translations }) => {
  const servicesPreview = translations.servicesPreview;

  return (
    <section className="services-preview" aria-labelledby="services-preview-title">
      <div className="services-preview__content">
        <span className="services-preview__eyebrow">
          {servicesPreview.eyebrow}
        </span>

        <h2 className="services-preview__title" id="services-preview-title">
          {servicesPreview.title}
        </h2>

        <p className="services-preview__text">
          {servicesPreview.text}
        </p>

        <Link className="services-preview__button" to="/servicios">
          {servicesPreview.button}
        </Link>
      </div>

      <div className="services-preview__image-wrapper" aria-hidden="true">
       
       <img
       className="services-preview__image"
       src="/services-hero.png"
       alt=""
      />
       
      </div>
    </section>
  );
};

export default ServicesPreview;