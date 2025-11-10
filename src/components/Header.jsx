import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/Header.css";
import logo from "../assets/images/perfect_circular_logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link
          to="/"
          className="header__brand"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="My Translator Logo"
            className="header__logo"
          />
          <h1 className="header__title">MY Translator</h1>
        </Link>

        {/* Botón hamburguesa (solo mobile) */}
        <button
          className="header__hamburger"
          onClick={toggleMenu}
          type="button"
          aria-label="Menú de navegación"
          aria-expanded={isMenuOpen}
        >
          &#9776;
        </button>

        {/* NAV */}
        <nav
          className={`header__nav ${
            isMenuOpen ? "header__nav--open" : ""
          }`}
        >
          {/* Botón cierre (solo mobile) */}
          <button
            className="header__close"
            type="button"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            &times;
          </button>

          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link
                to="/"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                to="/sobre-mi"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Sobre mí
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                to="/servicios"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Servicios
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                to="/cotizaciones"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Cotizaciones
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                to="/preguntasfrecuentes"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Preguntas Frecuentes
              </Link>
            </li>
            <li className="header__nav-item">
              <Link
                to="/opiniones"
                className="header__nav-link"
                onClick={closeMenu}
              >
                Opiniones
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
