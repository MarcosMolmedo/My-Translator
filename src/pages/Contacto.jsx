import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Contacto.css";
import linkedincontacto from "../assets/images/linkedincontacto.png";
import instagramcontacto from "../assets/images/instagramcontacto.png";
import gmailcontacto from "../assets/images/gmailcontacto.png";
import whatsappcontacto from "../assets/images/whatsappcontacto.png";

const Contacto = ({ translations }) => {
  const contact = translations.contact;

  return (
    <main className="contact">
      <section className="contact__hero" aria-labelledby="contact-title">
        <div className="contact__container contact__hero-container">
          <div className="contact__content">
            <p className="contact__eyebrow">{contact.eyebrow}</p>

            <h1 id="contact-title" className="contact__title">
              {contact.title}
            </h1>

            <p className="contact__intro">{contact.intro}</p>

            <div className="contact__actions" aria-label={contact.actionsLabel}>
              <a
                href="https://wa.me/31620325639"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__button contact__button--primary"
              >
                {contact.whatsappButton}
              </a>

              <Link
                to="/cotizaciones"
                className="contact__button contact__button--secondary"
              >
                {contact.quoteButton}
              </Link>
            </div>
          </div>

   <div className="contact__visual" aria-hidden="true">
  <img
    src="/contact-utrecht-window.png"
    alt=""
    className="contact__image"
  />
</div>
        </div>
      </section>

      <section className="contact__details" aria-labelledby="contact-details-title">
        <div className="contact__container contact__details-container">
          <div className="contact__info">
            <p className="contact__eyebrow">{contact.infoEyebrow}</p>

            <h2 id="contact-details-title" className="contact__section-title">
              {contact.infoTitle}
            </h2>

            <p className="contact__section-text">{contact.infoText}</p>

            <address className="contact__list">
              <a href="mailto:info@malvasioyohana.nl" className="contact__item">
                <span className="contact__item-label">{contact.emailLabel}</span>
                <span className="contact__item-value">info@malvasioyohana.nl</span>
              </a>

              <a
                href="https://wa.me/31620325639"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__item"
              >
                <span className="contact__item-label">{contact.whatsappLabel}</span>
                <span className="contact__item-value">+31 6 20325639</span>
              </a>

              <div className="contact__item">
                <span className="contact__item-label">{contact.locationLabel}</span>
                <span className="contact__item-value">Utrecht, Nederland</span>
              </div>

              <div className="contact__item">
                <span className="contact__item-label">{contact.hoursLabel}</span>
                <span className="contact__item-value">{contact.hoursValue}</span>
              </div>
            </address>
          </div>

          <div className="contact__card">
            <h2 className="contact__card-title">{contact.cardTitle}</h2>
            <p className="contact__card-text">{contact.cardText}</p>

            <div className="contact__quick-links">
              <Link to="/preguntasfrecuentes" className="contact__quick-link">
                {contact.faqLink}
              </Link>

              <Link to="/cotizaciones" className="contact__quick-link">
                {contact.quoteLink}
              </Link>
            </div>

            <div className="contact__social" aria-label={contact.socialLabel}>
                <a
                href="https://wa.me/31620325639"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label="WhatsApp"
              >
                <img src={whatsappcontacto} alt="" className="contact__social-icon" />
              </a>
              
                <a
                href="mailto:info@malvasioyohana.nl"
                className="contact__social-link"
                aria-label="Email"
              >
                <img src={gmailcontacto} alt="" className="contact__social-icon" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/yohanamalvasio/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label="LinkedIn"
              >
                <img src={linkedincontacto} alt="" className="contact__social-icon" />
              </a>

              <a
                href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="contact__social-link"
                aria-label="Instagram"
              >
                <img src={instagramcontacto} alt="" className="contact__social-icon" />
              </a>

        

        
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contacto;