import React from "react";
import "../Styles/Footer.css";

import logo from "../assets/images/perfect_circular_logo.png";

const Footer = ({ translations }) => {
  const footer = translations.footer;

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <img className="footer__logo" src={logo} alt={footer.logoAlt} />

          <div>
            <h2 className="footer__brand-title">{footer.brand}</h2>
            <p className="footer__brand-text">{footer.description}</p>
          </div>
        </div>

        <nav className="footer__column" aria-label={footer.quickLinksTitle}>
          <h3 className="footer__title">{footer.quickLinksTitle}</h3>
          <ul className="footer__list">
            {footer.quickLinks.map((link) => (
              <li key={link.label}>
                <a className="footer__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__column" aria-label={footer.servicesTitle}>
          <h3 className="footer__title">{footer.servicesTitle}</h3>
          <ul className="footer__list">
            {footer.services.map((service) => (
              <li key={service.label}>
                <a className="footer__link" href={service.href}>
                  {service.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__column">
          <h3 className="footer__title">{footer.contactTitle}</h3>
          <ul className="footer__list">
            <li>
              <a className="footer__link" href={`mailto:${footer.email}`}>
                {footer.email}
              </a>
            </li>
            <li>
              <a className="footer__link" href={footer.whatsappHref}>
                {footer.phone}
              </a>
            </li>
            <li className="footer__muted">{footer.address}</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">{footer.copyright}</p>

        <p className="footer__credits">
          
      
          <span className="footer__separator">|</span>
          {footer.developedBy}{" "}
          <a
            className="footer__credit-link"
            href="https://www.linkedin.com/in/marcos-manuel-olmedo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Marcos M Olmedo
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;