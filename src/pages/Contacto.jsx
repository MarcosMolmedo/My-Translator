import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Contacto.css";
import stickercontacto from "../assets/images/stickercontacto.png";
import linkedincontacto from "../assets/images/linkedincontacto.png";
import instagramcontacto from "../assets/images/instagramcontacto.png";
import gmailcontacto from "../assets/images/gmailcontacto.png";
import whatsappcontacto from "../assets/images/whatsappcontacto.png";

const Contacto = () => {
  return (
    <div className="contact-container">
      <img src={stickercontacto} alt="Sticker contacto" className="contact-sticker" />
      <div className="contact-message">
        <h3>Gracias por querer contactarte conmigo.</h3>
        <p>
          Te pido por favor que leas las <Link to="/preguntasfrecuentes">preguntas frecuentes aquí</Link>,
          y completes el siguiente formulario <Link to="/cotizaciones">aquí</Link> si deseas una cotización.
        </p>
        <p>
          Si te queda alguna duda, no dudes en contactarme por los canales oficiales.
        </p>
        <div className="contact-icons">
          <a href="https://www.linkedin.com/in/yohanamalvasio/" target="_blank" rel="noopener noreferrer">
            <img src={linkedincontacto} alt="LinkedIn" className="contact-icon" />
          </a>
          <a href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ==" target="_blank" rel="noopener noreferrer">
            <img src={instagramcontacto} alt="Instagram" className="contact-icon" />
          </a>
          <a href="mailto:malvasioyohana@gmail.com" target="_blank" rel="noopener noreferrer">
            <img src={gmailcontacto} alt="Gmail" className="contact-icon" />
          </a>
          <a href="https://wa.me/31620325639" target="_blank" rel="noopener noreferrer">
            <img src={whatsappcontacto} alt="WhatsApp" className="contact-icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
