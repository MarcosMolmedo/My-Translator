import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SobreMi from "./pages/SobreMi";
import Servicios from "./pages/Servicios"; 
import Opiniones from "./pages/Opiniones"; 
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";



function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre-mi" element={<SobreMi />} />
            <Route path="/servicios" element={<Servicios />} /> 
            <Route path="/opiniones" element={<Opiniones />} />
            <Route path="/preguntasfrecuentes" element={<PreguntasFrecuentes />} />

           

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
