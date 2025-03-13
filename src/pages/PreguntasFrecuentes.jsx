import React, { useState } from "react";
import "../Styles/PreguntasFrecuentes.css";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const preguntas = [
    {
      pregunta: "¿Cómo se calcula el precio de una traducción? ",
      respuesta: (
        <div>
          <p><strong>Para poder pasarte un presupuesto, necesito que me envíes lo siguiente:</strong></p>
          <ul>
            <li><strong>Una copia del documento a traducir:</strong>(incluyendo legalizaciones y apostillas, si las tiene).</li>
            <li><strong>La fecha en que la necesitás.</strong> </li>
            <li><strong>El medio de entrega</strong>(si la querés recibir por correo postal o retirarla en persona).</li>
          </ul>
        </div>
      ),
    },
    
      {
        pregunta: "¿En cuánto tiempo estaría lista? ",
        respuesta: (
          <div>
            <p><strong>El tiempo de entrega depende de varios factores:</strong></p>
            <ul>
              <li><strong>Mi disponibilidad</strong>(si hay mucha carga de trabajo, puede demorar más).</li>
              <li><strong>La extensión y complejidad del documento.</strong></li>
              <li><strong>Si la solicitás con tiempo</strong> (lo ideal es pedirla con al menos 2 semanas de anticipación).</li>
              <li><strong>Si la necesitás con urgencia, puede tener un recargo adicional.</strong> </li>
            </ul>
          </div>
        ),
      },
      
      {
        pregunta: "¿Mi documento necesita apostilla?",
        respuesta: (
          <div>
            <p><strong>Depende de varios factores:</strong></p>
            <ul>
              <li><strong>Consultá con la entidad que va a recibir el documento.</strong> </li>
              <li><strong>Si fue emitido fuera de la Unión Europea, probablemente necesite apostilla.</strong></li>
              <li><strong>Cada país tiene sus propias reglas, así que es mejor verificar antes de pedir la traducción.</strong> </li>
            </ul>
          </div>
        ),
      },
      
      {
        pregunta: "¿La apostilla tiene que estar incluida en la traducción? ",
        respuesta: (
          <div>
            <p><strong>Sí, si tu documento tiene apostilla, también hay que traducirla parcialmente o mencionarla.</strong></p>
            <ul>
              <li><strong>La apostilla es parte del documento oficial.</strong>  </li>
              <li><strong>Puede influir en el precio final de la traducción.</strong></li>
              <li><strong>Antes de pedir la traducción, chequeá si tu documento necesita apostilla para evitar costos extra.</strong></li>
            </ul>
          </div>
        ),
      },
      
    {
      pregunta: "¿Qué documentos universitarios estamos autorizados a traducir? ",
      respuesta: (
        <div>
          <p><strong>Algunos ejemplos son:</strong></p>
          <ul>
            <li><strong>Diplomas:</strong> (licenciaturas, maestrías, etc.).</li>
            <li><strong>Certificados analíticos con las notas y créditos.</strong></li>
            <li><strong>Certificados de graduación:</strong> </li>
            <li><strong>Programas de estudios:</strong> </li>
            <li><strong>Certificados de inscripción </strong></li>
            <li><strong>Entre otros</strong> </li>
              <ul>
            </ul>
          </ul>
        </div>
      ),
    },
    {
      pregunta: "¿Cómo se puede abonar y dónde nos encontramos?",
      respuesta: (
        <div>
          <p><strong>Opciones de pago y ubicación:</strong></p>
          <ul>
            <li><strong>Se puede pagar por transferencia bancaria o iDEAL.</strong></li>
            <li><strong>Una vez recibido el pago, te mando la factura.</strong> </li>
            <li><strong>Coordinamos un día y horario para la entrega.</strong> </li>
            <li><strong>Podés retirarla en Utrecht, Terwijde.</strong></li>
          </ul>
        </div>
      ),
    },
    
    
    {
      pregunta: "¿Cuánto demora PostNL en enviar documentos?",
      respuesta: (
        <div>
          <ul>
            <li><strong>Depende del destino y del tipo de envío.</strong></li>
            <li><strong>Puede tardar entre 1 y 10 días hábiles.</strong> </li>
            <li><strong>En fechas festivas o períodos de alta demanda, puede demorar más.</strong> </li>
            <li><strong>Con código de rastreo, podés hacer el seguimiento.</strong> </li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿Hay diferencia de precio entre una traducción digital y en papel?",
      respuesta: (
        <div>
          <p><strong>No, el precio es el mismo.</strong></p>
          <ul>
            <li><strong>Las traductores jurados en Países Bajos NO temenos firma digital y por lo tanto NO estamos autoirzados a realizar traducciones digitales.</strong> </li>
            <li><strong>Nuestro trabajo es similar al de un notario, realizamos la traducción, la imprimimos, sellamos y firmamos manualmente.</strong> </li>
            <li><strong>Lo que sí puedo enviarte es una versión escaneada de la traducción impresa.</strong></li>
            <li><strong>Para algunos trámites se aceptan estas versions escaneadas, pero al final, lo que tiene validez es la traducción impresa, por lo que te sugiero que siempre la tengas con vos.</strong> </li>
            <li><strong>A la traducción impresa la podés pasar a buscar por mi oficina. Si querés que te organice el envío postal dentro de Países Bajos, ese servicio es adicional y tiene un costo de aprox. 10 euros + IVA.</strong> </li>
            <li><strong>El precio del envío puede enviar dependiendo del peso del sobre y del destino.</strong></li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿Qué documentos personales estoy autorizada a traducir? ",
      respuesta: (
        <div>
          <ul>
            <li>Actas de nacimiento</li>
            <li>Certificados de matrimonio</li>
            <li>Certificados de divorcio</li>
            <li>Certificados de soltería</li>
            <li>Actas de defunción</li>
            <li>Certificados de estado civil</li>
            <li>Entre otros</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿Puede otra persona retirar la traducción por mí? ",
      respuesta: (
        <div>
          <p><strong>Sí, claro. Solo necesitás enviarnos un email con:</strong></p>
          <ul>
            <li><strong>El nombre de la persona que va a retirarla.</strong></li>
            <li><strong>El día y la hora a la que la va a retirar.</strong> </li>

          </ul>
       
        </div>
      ),
    },
    
    {
      pregunta: "¿Qué pasa si el correo pierde la traducción?",
      respuesta: (
        <div>
          <p><strong>Nunca me ha passado, pero si llegara a ocurrir:</strong></p>
          <ul>
            <li><strong>Se imprime de nuevo la traducción certificada.</strong> </li>
            <li><strong>Se cobra un extra por la reimpresión.</strong> </li>
            <li><strong>También hay que abonar el costo del nuevo envío postal.</strong></li>
          </ul>
         </div>
      ),
    },
    
    {
      pregunta: "¿Es necesario certificar nuestra traducción? ",
      respuesta: (
        <div>
  
          <ul>
            <li><strong>Si la usás en los Países Bajos, no requiere certificación extra.</strong> </li>
            <li><strong>Podés presentarla directamente en la entidad que la pida.</strong> </li>
            <li><strong>Si la institución requiere certificación extra, mejor confirmarlo antes con la entidad u organización en la que vas a presentar la traducción.</strong> </li>
          </ul>
        </div>
      ),
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
     
    </div>
  );
};

export default PreguntasFrecuentes;
