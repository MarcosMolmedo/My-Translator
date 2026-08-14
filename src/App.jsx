import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import SobreMi from "./pages/SobreMi";
import Servicios from "./pages/Servicios";
import Opiniones from "./pages/Opiniones";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import Cotizaciones from "./pages/Cotizaciones";
import Contacto from "./pages/Contacto";

import { es } from "./locales/es";
import { en } from "./locales/en";
import { nl } from "./locales/nl";

function App() {
  const [language, setLanguage] = useState("es");

  const translations = {
    es,
    en,
    nl,
  }[language];

  return (
    <Router>
      <div className="app-container">
        <Header
          translations={translations}
          language={language}
          setLanguage={setLanguage}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home translations={translations} />} />

            <Route
              path="/sobre-mi"
              element={<SobreMi translations={translations} />}
            />

            <Route
              path="/servicios"
              element={<Servicios translations={translations} />}
            />

            <Route
              path="/opiniones"
              element={<Opiniones translations={translations} />}
            />

            <Route
              path="/preguntasfrecuentes"
              element={<PreguntasFrecuentes translations={translations} />}
            />
   
            <Route
            path="/cotizaciones"
             element={ <Cotizaciones translations={translations} language={language}
             />
             }
             />

            <Route
              path="/contacto"
              element={<Contacto translations={translations} />}
            />
          </Routes>
        </main>

        <Footer translations={translations} />
      </div>
    </Router>
  );
}

export default App;