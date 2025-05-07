import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Contacto.css";
import banderas from "../assets/images/banderassinfondo.png";
import linkedincontacto from "../assets/images/linkedincontacto.png";
import instagramcontacto from "../assets/images/instagramcontacto.png";
import gmailcontacto from "../assets/images/gmailcontacto.png";
import whatsappcontacto from "../assets/images/whatsappcontacto.png";

const Contacto = () => {
  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <div className="contact-message">
          <h3 className="contact-title">¡Gracias por llegar hasta acá y escribirme!</h3>
          <p>
            Para agilizar el tiempo de respuesta, te recomiendo primero revisar las 
            <Link to="/preguntasfrecuentes" className="contact-highlight"> Preguntas Frecuentes</Link> y, en caso de requerir una cotización, 
            completar el siguiente <Link to="/cotizaciones" className="contact-highlight"> formulario</Link>.
          </p>
          <p>
            Si tu consulta no está contemplada en las Preguntas Frecuentes o aún tienes dudas, no dudes en contactarme a través de los canales oficiales.
          </p>
          <div className="contact-icons">
            <a href="https://www.linkedin.com/in/yohanamalvasio/" target="_blank" rel="noopener noreferrer">
              <img src={linkedincontacto} alt="LinkedIn" className="contact-icon" />
            </a>
            <a href="https://www.instagram.com/my_translator_nl?igsh=MXVwem5heXh6d2RtbQ==" target="_blank" rel="noopener noreferrer">
              <img src={instagramcontacto} alt="Instagram" className="contact-icon" />
            </a>
            <a href="mailto:info@malvasioyohana.nl" target="_blank" rel="noopener noreferrer">
              <img src={gmailcontacto} alt="Gmail" className="contact-icon" />
            </a>
            <a href="https://wa.me/31620325639" target="_blank" rel="noopener noreferrer">
              <img src={whatsappcontacto} alt="WhatsApp" className="contact-icon" />
            </a>
          </div>
        </div>
        <img src={banderas} alt="Banderas" className="contact-sticker" />
      </div>
    </div>
  );
};

export default Contacto;
