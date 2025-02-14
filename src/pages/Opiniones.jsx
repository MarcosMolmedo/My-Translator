import React from "react";
import "../Styles/Opiniones.css";
import pinImage from "../assets/images/pin1.png"; // Imagen del pin

const opiniones = [
  { text: "¡Excelente servicio! La traducción fue rápida y precisa.", rotation: "-5deg" },
  { text: "Muy profesional. Mis documentos fueron aceptados sin problemas.", rotation: "8deg" },
  { text: "La mejor traductora que he contratado. 100% recomendada.", rotation: "-12deg" },
  { text: "Servicio impecable, comunicación clara y entrega rápida.", rotation: "6deg" },
  { text: "Me ayudó con mis documentos para la visa. Todo salió perfecto.", rotation: "-10deg" },
  { text: "No sabía cómo hacer la apostilla, pero me guió en todo el proceso.", rotation: "4deg" },
  { text: "Respuesta rápida y trato amable. Volveré a solicitar sus servicios.", rotation: "-8deg" },
  { text: "Súper recomendable, todo fue transparente y sencillo.", rotation: "10deg" }
];

const Opiniones = () => {
  return (
    <div className="opiniones-container">
      {opiniones.map((opinion, index) => (
        <div 
          key={index} 
          className={`opinion postit-${index + 1}`} 
          style={{ transform: `rotate(${opinion.rotation})` }} // Solo mantiene la rotación
        >
          <img src={pinImage} alt="Pin" className="pin-image" />
          <p className="opinion-text">“{opinion.text}”</p>
        </div>
      ))}
    </div>
  );
};

export default Opiniones;
