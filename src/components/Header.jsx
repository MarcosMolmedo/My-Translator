import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../Styles/Header.css";
import logo from "../assets/images/perfect_circular_logo.png"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo-title">
          <img src={logo} alt="My Translator Logo" className="logo" />
          <h1>My Translator</h1>
        </div>
        <div className="hamburger" onClick={toggleMenu} aria-label="Menu" aria-expanded={isMenuOpen}>
          &#9776;
        </div>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/sobre-mi">Sobre mí</Link></li>
            <li><Link to="/Servicios">Servicios</Link></li>
            <li><Link to="/quotes">Cotizaciones</Link></li>
            <li><Link to="/faq">Preguntas frecuentes</Link></li>
            <li><Link to="/testimonials">Testimonios</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
