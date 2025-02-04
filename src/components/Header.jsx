import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../Styles/Header.css";
import logo from "../assets/images/perfect_circular_logo.png"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo-title" onClick={closeMenu}>
          <img src={logo} alt="My Translator Logo" className="logo" />
          <h1>My Translator</h1>
        </Link>
        <div 
          className="hamburger" 
          onClick={toggleMenu} 
          role="button" 
          tabIndex="0"
          aria-label="Menú de navegación" 
          aria-expanded={isMenuOpen}
        >
          &#9776;
        </div>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          {/* Botón de cierre "X" */}
          <div className="close-menu" onClick={closeMenu}>&times;</div>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
            <li><Link to="/sobre-mi" onClick={closeMenu}>Sobre mí</Link></li>
            <li><Link to="/servicios" onClick={closeMenu}>Servicios</Link></li>
            <li><Link to="/cotizaciones" onClick={closeMenu}>Cotizaciones</Link></li>
            <li><Link to="/preguntasfrecuentes" onClick={closeMenu}>Preguntas frecuentes</Link></li>
            <li><Link to="/opiniones" onClick={closeMenu}>Opiniones</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
