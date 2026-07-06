
import React from "react";
import { Award, Building2, Sparkles, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/ServicesWhyPreview.css";

const ServicesWhyPreview = ({ translations }) => {
  const why = translations.servicesWhyPreview;

  const icons = [Award, Building2, Sparkles, HeartHandshake];

  return (
    <section className="services-why-preview" aria-labelledby="services-why-title">
      <div className="services-why-preview__container">
        <div className="services-why-preview__content">
          <p className="services-why-preview__eyebrow">{why.eyebrow}</p>

          <div className="services-why-preview__grid">
            {why.items.map((item, index) => {
              const Icon = icons[index];

              return (
                <article className="services-why-preview__item" key={item.title}>
                  <div className="services-why-preview__icon" aria-hidden="true">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>

                  <h3 className="services-why-preview__item-title">
                    {item.title}
                  </h3>

                  <p className="services-why-preview__item-text">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="services-why-preview__cta">
            <div>
              <h2 className="services-why-preview__cta-title" id="services-why-title">
                {why.cta.title}
              </h2>
              <p className="services-why-preview__cta-text">
                {why.cta.text}
              </p>
            </div>

            <Link className="services-why-preview__cta-button" to="/contacto">
              {why.cta.button}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesWhyPreview;