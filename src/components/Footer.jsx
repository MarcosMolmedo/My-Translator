import React from "react";
import "../Styles/Footer.css";
import GmailIcon from "../assets/images/gmail.png";
import InstagramIcon from "../assets/images/instagram.png";
import LinkedInIcon from "../assets/images/linkedin.png";
import WhatsAppIcon from "../assets/images/whatsapp.png";
import MarcosLogo from "../assets/images/logoMarcosolmedocompany.jpg.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Yohana Malvasio - Todos los derechos reservados.</p>
        <p className="address">Operettelaan 175, 3543 BP Utrecht</p>
        <ul className="social-links">
          <li>
            <a href="https://www.linkedin.com/search/results/all/?fetchDeterministicClustersOnly=true&heroEntityKey=urn%3Ali%3Afsd_profile%3AACoAAB_RFh0BLvW-WtEmr_x2AustxPGMcuMBM4E&keywords=yohana%20malvasio&origin=RICH_QUERY_SUGGESTION&position=0&searchId=83de0f77-5667-4e6c-912d-c57252c4dc65&sid=PSK&spellCorrectionEnabled=false" target="_blank" rel="noopener noreferrer">
              <img src={LinkedInIcon} alt="LinkedIn" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ==" target="_blank" rel="noopener noreferrer">
              <img src={InstagramIcon} alt="Instagram" />
            </a>
          </li>
          <li>
            <a href="mailto:info@malvasioyohana.nl" target="_blank" rel="noopener noreferrer">
              <img src={GmailIcon} alt="Gmail" />
            </a>
          </li>
          <li>
            <a href="https://wa.me/31620325639" target="_blank" rel="noopener noreferrer">
              <img src={WhatsAppIcon} alt="WhatsApp" />
            </a>
          </li>
        </ul>
        <div className="developer-seal">
  <span>
    Photos by{" "}
    <a 
      href="https://www.murchstudio.com/" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      Beatrice Murch 📷
    </a>
  </span>

  <span style={{ margin: "0 10px" }}>|</span>

  <span>
    Developed by{" "}
    <a
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
