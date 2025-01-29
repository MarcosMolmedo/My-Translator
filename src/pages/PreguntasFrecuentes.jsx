import React, { useState } from "react";
import "../Styles/PreguntasFrecuentes.css";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const preguntas = [
    {
      pregunta: "¿CÓMO SE CALCULA EL PRECIO DE UNA TRADUCCIÓN?",
      respuesta:
        "Para poder enviar una cotización se necesita lo siguiente:\n" +
        "> Copia del documento a traducir, junto con sus legalizaciones y apostillas si las tuviera.\n" +
        "> Fecha de cuando se va a necesitar la traducción.\n" +
        "> Medio por el que se necesita la traducción (correo postal o retiro personal).",
    },
    {
      pregunta: "¿EN CUÁNTO TIEMPO ESTARÍA LISTA?",
      respuesta:
        "Depende de la disponibilidad del traductor y la longitud del documento. Generalmente, se recomienda solicitarla con 2-3 semanas de anticipación.",
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
      pregunta: "¿QUÉ DOCUMENTOS UNIVERSITARIOS ESTAMOS AUTORIZADOS A TRADUCIR?",
      respuesta:
        "Algunos ejemplos:\n" +
        "> Diplomas: certificados que acreditan títulos como licenciaturas o maestrías.\n" +
        "> Transcripciones académicas: Listado oficial de tus calificaciones (analítico).\n" +
        "> Certificados de graduación: Confirman que cumpliste con todos los requisitos.\n" +
        "> Programas o planes de estudios: Descripción de los contenidos de tus cursos.\n" +
        "> Documentos Administrativos:\n" +
        "Certificados de inscripción: Constancia de matrícula.\n" +
        "Cartas de buena conducta: Acreditan tu comportamiento en la universidad.\n" +
        "Certificados de pago: Comprobante de matrícula u otros costos.",
    },
    {
      pregunta: "¿CÓMO SE PUEDE ABONAR Y DÓNDE NOS ENCONTRAMOS FÍSICAMENTE?",
      respuesta:
        "Por transferencia bancaria y/o iDEAL.\n" +
        "Una vez recibido el pago, se emite la factura y coordinamos día y hora que te quede mejor.\n" +
        "Se puede retirar físicamente en Utrecht, Terwijde.",
    },
    {
      pregunta: "¿CUÁLES SON LOS REQUISITOS PARA CONVALIDAR UN TÍTULO UNIVERSITARIO EN LOS PAÍSES BAJOS?",
      respuesta:
        "1. Traducción jurada: Título y documentos académicos traducidos al neerlandés, inglés, alemán o francés por un traductor jurado.\n" +
        "2. Legalización o apostilla: Garantiza la autenticidad de tus documentos con la legalización o apostilla de la Haya (si corresponde).\n" +
        "3. Evaluación del diploma: Nuffic o IDW evaluarán el nivel académico de tu título en el sistema neerlandés.\n" +
        "4. Requisitos adicionales: Algunas instituciones pueden pedirte cartas de recomendación o programas específicos de estudio.",
    },
    {
      pregunta: "¿CUÁNTO DEMORA POSTNL EN ENVIAR DOCUMENTOS?",
      respuesta: "El servicio de PostNL con código de rastreo suele tardar entre 1 y 10 días hábiles, dependiendo del destino y el servicio elegido.",
    },
    {
      pregunta: "¿EXISTE DIFERENCIA DE PRECIO ENTRE UNA TRADUCCIÓN DIGITAL Y DE PAPEL?",
      respuesta:
        "En los Países Bajos no estamos autorizados a emitir traducciones con firma digital. Podemos enviarte una versión escaneada de la traducción impresa, por si alguna vez te la solicitan.\n" +
        "En cuanto a los costos, no hay diferencia de precio, pero si prefieres recibir la traducción impresa por correo postal, este servicio tiene un costo de aproximadamente 10 euros + IVA. El precio exacto dependerá del peso del sobre y el destino.",
    },
    {
      pregunta: "¿QUÉ DOCUMENTOS PERSONALES ESTAMOS AUTORIZADOS A TRADUCIR?",
      respuesta:
        "Actas de nacimiento.\n" +
        "Certificados de matrimonio.\n" +
        "Certificados de divorcio.\n" +
        "Certificados de soltería.\n" +
        "Actas de defunción.\n" +
        "Certificados de estado civil.",
    },
    {
      pregunta: "¿ES POSIBLE QUE OTRA PERSONA RETIRE LA TRADUCCIÓN POR MÍ?",
      respuesta:
        "Sí, claro que es posible. Solo tienes que enviarme un email con una solicitud que incluya:\n" +
        "1. Nombre de la persona que lo va a retirar.\n" +
        "2. Lugar donde se va a retirar el documento.\n" +
        "3. Horario en que esa persona pasará a recoger la traducción.\n" +
        "¿Prefieres que te lo envíe por correo postal? También es posible.",
    },
    {
      pregunta: "¿QUÉ PASA SI EL CORREO PIERDE LA TRADUCCIÓN?",
      respuesta:
        "Aunque nunca nos ha pasado, si sucede, la solución es reimprimirla. Esto conlleva un costo adicional tanto por la reimpresión de las copias certificadas como por los gastos de envío.",
    },
    {
      pregunta: "¿ES NECESARIO CERTIFICAR NUESTRA TRADUCCIÓN?",
      respuesta:
        "¡Quedate tranquilo! Si la traducción va a ser presentada dentro de los Países Bajos, no hace falta nada más. La traducción está lista para ser presentada directamente en la entidad u organización donde la necesites.",
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
