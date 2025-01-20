import React, { useState } from "react";
import "../Styles/Header.css";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <h1>My Translator</h1>
        <p>Yohana Malvasio Traductora Jurada en los Paises Bajos</p>
        <div className="hamburger" onClick={toggleMenu}>
          &#9776;
        </div>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li><a href="#home">Inicio</a></li>
            <li><a href="#about">Sobre mí</a></li>
            <li><a href="#services">Servicios</a></li>
            <li><a href="#contact">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
