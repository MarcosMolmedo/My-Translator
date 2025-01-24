import React, { useState } from "react";
import "../Styles/PreguntasFrecuentes.css";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const preguntas = [
    {
      pregunta: "¿CÓMO SE CALCULA EL PRECIO DE UNA TRADUCCIÓN?",
      respuesta: "El precio depende de varios factores, como el tamaño y la complejidad del documento.",
    },
    {
      pregunta: "¿EN CUÁNTO TIEMPO ESTARÍA LISTA?",
      respuesta: "Depende de la disponibilidad del traductor y la longitud del documento. Generalmente, se recomienda solicitarla con 2-3 semanas de anticipación.",
    },
    {
      pregunta: "¿MI DOCUMENTO NECESITA APOSTILLA?",
      respuesta: "Esto depende de la entidad a la que vayas a presentar el documento. Los documentos fuera de la Unión Europea usualmente requieren apostilla.",
    },
    {
      pregunta: "¿TIENE QUE ESTAR INCLUIDA LA APOSTILLA EN LA TRADUCCIÓN?",
      respuesta: "Sí, si el documento lleva apostilla, esta debe incluirse en la traducción, lo que también afecta el presupuesto.",
    },
    {
      pregunta: "¿EL TRADUCTOR NECESITA VER EL DOCUMENTO ORIGINAL?",
      respuesta: "Idealmente sí. Las traducciones de copias escaneadas no tienen validez legal en Países Bajos. En casos excepcionales, se puede traducir una copia escaneada, pero esto debe especificarse en la certificación.",
    },
    {
      pregunta: "¿CUÁNTO DEMORA POSTNL EN ENVIAR DOCUMENTOS?",
      respuesta: "El servicio de PostNL con código de rastreo suele tardar entre 1 y 10 días hábiles, dependiendo del destino y el servicio elegido.",
    },
    {
      pregunta: "¿CÓMO ENCARGO UNA TRADUCCIÓN? ¿CUÁLES SON LOS PASOS?",
      respuesta: "1. Solicitar un presupuesto.\n2. Acordar el modo y fecha de entrega.\n3. Hacer la transferencia por adelantado.\n4. Recibir tu traducción en la fecha y modo pactados.",
    },
    {
      pregunta: "¿CÓMO ME ASEGURO DE QUE UN TRADUCTOR ESTÁ MATRICULADO EN PAÍSES BAJOS?",
      respuesta: "Todos los traductores jurados en Países Bajos deben tener un número de matrícula emitido por el Bureau WBTV, una empresa registrada y una cuenta bancaria a su nombre.",
    },
  ];

  const toggleRespuesta = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const scrollToBottom = () => {
    document.querySelector(".preguntas-frecuentes").scrollBy({ top: 100, behavior: "smooth" });
  };

  return (
    <div className="preguntas-frecuentes">
      <h1 className="titulo">Preguntas Frecuentes</h1>
      <div className="contenedor-preguntas">
        {preguntas.map((item, index) => (
          <div className="pregunta-item" key={index}>
            <div
              className={`pregunta ${activeIndex === index ? "activa" : ""}`}
              onClick={() => toggleRespuesta(index)}
            >
              <span>{item.pregunta}</span>
              <span className="icono">{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && <div className="respuesta">{item.respuesta}</div>}
          </div>
        ))}
      </div>
      <div className="scroll-indicator" onClick={scrollToBottom}>
        ▼
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;
