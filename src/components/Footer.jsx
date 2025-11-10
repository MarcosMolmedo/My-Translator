import React from "react";
import "../Styles/Footer.css";

import GmailIcon from "../assets/images/logogmail.png";
import InstagramIcon from "../assets/images/logoinstagram.png";
import LinkedInIcon from "../assets/images/logolinkedln.png";
import WhatsAppIcon from "../assets/images/logowhatsapp.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__text footer__text--main">
          &copy; 2025 Yohana Malvasio - Todos los derechos reservados.
        </p>

        <p className="footer__text footer__address">
          Operettelaan 175, 3543 BP Utrecht
        </p>

        <ul className="footer__social-list">
          <li className="footer__social-item">
            <a
              className="footer__social-link"
              href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Afsd_profile%3AACoAAB_RFh0BLvW-WtEmr_x2AustxPGMcuMBM4E&keywords=yohana%20malvasio&origin=RICH_QUERY_SUGGESTION&position=0&searchId=83de0f77-5667-4e6c-912d-c57252c4dc65&sid=PSK&spellCorrectionEnabled=false"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="footer__social-icon"
                src={LinkedInIcon}
                alt="LinkedIn"
              />
            </a>
          </li>

          <li className="footer__social-item">
            <a
              className="footer__social-link"
              href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="footer__social-icon"
                src={InstagramIcon}
                alt="Instagram"
              />
            </a>
          </li>

          <li className="footer__social-item">
            <a
              className="footer__social-link"
              href="mailto:info@malvasioyohana.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="footer__social-icon"
                src={GmailIcon}
                alt="Gmail"
              />
            </a>
          </li>

          <li className="footer__social-item">
            <a
              className="footer__social-link"
              href="https://wa.me/31620325639"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="footer__social-icon"
                src={WhatsAppIcon}
                alt="WhatsApp"
              />
            </a>
          </li>
        </ul>

        <div className="footer__developer">
          <span className="footer__developer-text">
            Photos by{" "}
            <a
              className="footer__developer-link"
              href="https://www.murchstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Beatrice Murch 📷
            </a>
          </span>

          <span className="footer__divider">|</span>

          <span className="footer__developer-text">
            Developer by{" "}
            <a
              className="footer__developer-link"
              href="https://www.linkedin.com/in/marcos-manuel-olmedo/"
              target="_blank"
              rel="noopener noreferrer"
              title="Perfil de LinkedIn de Marcos M. Olmedo"
            >
              Marcos M Olmedo 💻
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
