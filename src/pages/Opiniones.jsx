import React, { useState } from "react";
import { motion } from "framer-motion";
import "../Styles/Opiniones.css";
import logo from "../assets/images/perfect_circular_logo.png";

const opinionesData = [
  {
    id: 1,
    text: "Estoy muy agradecida a Yohanna por su impecable trabajo en la traduccion de documentos de Chile para ser utilizados en Paises Bajos. Al contactarla su respuesta fue inmediata y a pesar de estar en distintas ciudades en pocos dias recibi un trabajo impecable y muy profesional como traductora jurada en Paises Bajos. Realmente encontré a la mejor en este rubro. Muchas gracias Yohana.",
    author: "Carolina Mozó Leverington",
    profession: "Diseñadora Gráfica at Freelance C# Developer",
  },
  {
    id: 2,
    text: "I highly recommend Yohana for Spanish to English translation services in the Netherlands. I had the pleasure of requesting her services as translator recently, and she exceeded expectations in every aspect. She was incredibly responsive, delivering high-quality translations promptly. Additionally, she was always available to clarify any doubts and provide assistance, making the entire process smooth and efficient. I would not hesitate to engage her services again and recommend her to anyone seeking a reliable and skilled English translator.",
    author: "E. Abril Seyahian",
    profession: "Value and Evidence | Health Economics and Outcomes Research",
  },
  {
    id: 3,
    text: "Yohana es una persona muy profesional y atenta a las necesidades del cliente. Fue de mucha ayuda y mentoria sobre cómo darle seguimiento al proceso de legalización de documentos en Países Bajos. Definitivamente alguien que pone por delante a sus clientes y el servicio!!!",
    author: "Andrés Rodríguez Von Hauske",
    profession: "----",
  },
  {
    id: 4,
    text: "Yohana es una gran profesional, necesitábamos una traducción de la partida de matrimonio y por indicación contactamos con ella, y estamos muy contentos con el resultado, su trabajo es impecable.",
    author: "Elisa Souza Quevedo",
    profession: "",
  },
  {
    id: 5,
    text: "Yohana es muy profesional. Tuve que traducir un certificado matrimonial y todo fue perfecto.",
    author: "Gladis Rodríguez Hernández",
    profession: "Naval Engineer | Project Estimator at Damen Shiprepair Rotterdam",
  },
  {
    id: 6,
    text: "Yoahana translated my birth certificate from Spanish to English. She was professional and not only helped me with the translation, but also advised me on the documents I needed to register with the Amsterdam municipality. I recommend anyone in the Netherlands who needs a Spanish-English translator to contact Yoahana.",
    author: "Juan Pablo Poittevin Santana",
    profession: "Software Developer",
  },
  {
    id: 7,
    text: "I truthfully recommend Yohana Malvasio. She has done some translations for me and I have to say that she has done a impeccable job. She is really efficient, really clear with the times and fast as well. She was able to explain every question I had. If you are looking to translate Spanish to English in the Netherlands, she is one of the few in the country that is certified to do it and, in my experience, really professional.",
    author: "Nicolas Dabinovic",
    profession: "Especialista en operaciones y servicio al cliente",
  },
];

const Opiniones = () => {
  const [showComentarios, setShowComentarios] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(null);

  return (
    <div className="opiniones-page-container">
      {/* Logo Animado */}
      <motion.div
        className={`opiniones-logo-container ${
          showComentarios ? "opiniones-logo-background" : ""
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3 }}
        onAnimationComplete={() => setShowComentarios(true)}
      >
        <img src={logo} alt="Opiniones Logo" className="opiniones-logo" />
      </motion.div>

      {/* Comentarios */}
      {showComentarios && (
        <motion.div
          className="opiniones-comments-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {opinionesData.map((opinion) => (
            <motion.div
              key={opinion.id}
              className="opiniones-comment"
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedOpinion(opinion)}
            >
              <p>{opinion.text}</p>
              <p><strong>{opinion.author}</strong></p>
              <p>{opinion.profession}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Comentario Seleccionado */}
      {selectedOpinion && (
        <motion.div
          className="opiniones-selected-comment"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => setSelectedOpinion(null)}
        >
          <p>{selectedOpinion.text}</p>
          <p><strong>{selectedOpinion.author}</strong></p>
          <p>{selectedOpinion.profession}</p>
        </motion.div>
      )}
    </div>
  );
};

export default Opiniones;
