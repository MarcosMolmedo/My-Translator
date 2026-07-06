import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../Styles/Header.css";
import logo from "../assets/images/perfect_circular_logo.png";

const Header = ({ translations, language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const header = translations.header;

  const navLinks = [
    { label: header.home, path: "/" },
    { label: header.services, path: "/servicios" },
    { label: header.about, path: "/sobre-mi" },
    { label: header.faq, path: "/preguntasfrecuentes" },
    { label: header.reviews, path: "/opiniones" },
    { label: header.contact, path: "/contacto" },
  ];

  const languages = [
    { code: "es", label: "ES", flag: "🇪🇸", aria: "Cambiar idioma a español" },
    { code: "nl", label: "NL", flag: "🇳🇱", aria: "Taal wijzigen naar Nederlands" },
    { code: "en", label: "EN", flag: "🇬🇧", aria: "Change language to English" },
  ];

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    closeMenu();
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo-link" onClick={closeMenu}>
          <img src={logo} alt="My Translator" className="header__logo" />
        </Link>

        <button
          className={`header__hamburger ${
            isMenuOpen ? "header__hamburger--open" : ""
          }`}
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}
          aria-label="Navegación principal"
        >
          <ul className="header__nav-list">
            {navLinks.map((link) => (
              <li className="header__nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "header__nav-link header__nav-link--active"
                      : "header__nav-link"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="header__languages" aria-label="Selector de idioma">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                aria-label={item.aria}
                onClick={() => handleLanguageChange(item.code)}
                className={`header__language ${
                  language === item.code ? "header__language--active" : ""
                }`}
              >
                <span className="header__language-flag" aria-hidden="true">
                  {item.flag}
                </span>
                <span className="header__language-code">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;