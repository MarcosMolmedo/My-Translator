import React, { useState } from "react";
import "../Styles/PreguntasFrecuentes.css";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const preguntas = [
    {
      pregunta: "¿CÓMO SE CALCULA EL PRECIO DE UNA TRADUCCIÓN?",
      respuesta: (
        <div>
          <p><strong>Para poder enviar una cotización se necesita lo siguiente:</strong></p>
          <ul>
            <li><strong>Copia del documento a traducir:</strong> junto con sus legalizaciones y apostillas si las tuviera.</li>
            <li><strong>Fecha estimada:</strong> Indicar para cuándo se necesita la traducción.</li>
            <li><strong>Medio de entrega:</strong> Especificar si se enviará por correo postal o si se retirará en persona.</li>
          </ul>
        </div>
      ),
    },
    
      {
        pregunta: "¿EN CUÁNTO TIEMPO ESTARÍA LISTA?",
        respuesta: (
          <div>
            <p><strong>El tiempo de entrega depende de varios factores:</strong></p>
            <ul>
              <li><strong>Disponibilidad del traductor:</strong> Si hay carga de trabajo alta, el tiempo puede extenderse.</li>
              <li><strong>Longitud y complejidad del documento:</strong> Documentos más largos o técnicos requieren más tiempo.</li>
              <li><strong>Solicitud anticipada:</strong> Se recomienda solicitar la traducción con al menos 2-3 semanas de anticipación.</li>
              <li><strong>Urgencias:</strong> Las traducciones encargadas con urgencia pueden llevar un recargo adicional.</li>
            </ul>
          </div>
        ),
      },
      
      {
        pregunta: "¿MI DOCUMENTO NECESITA APOSTILLA?",
        respuesta: (
          <div>
            <p><strong>La necesidad de apostilla depende de varios factores:</strong></p>
            <ul>
              <li><strong>Entidad de destino:</strong> Es importante consultar con la organización que recibirá el documento.</li>
              <li><strong>Documentos emitidos fuera de la Unión Europea:</strong> Generalmente, requieren apostilla para ser válidos en los Países Bajos.</li>
              <li><strong>Reglas específicas:</strong> Cada país tiene normativas diferentes, por lo que es recomendable verificar antes de solicitar la traducción.</li>
            </ul>
          </div>
        ),
      },
      
      {
        pregunta: "¿TIENE QUE ESTAR INCLUIDA LA APOSTILLA EN LA TRADUCCIÓN?",
        respuesta: (
          <div>
            <p><strong>Sí, si el documento lleva apostilla, debe incluirse en la traducción.</strong></p>
            <ul>
              <li><strong>Obligatoriedad:</strong> La apostilla forma parte del documento oficial y debe ser traducida junto con el resto del contenido.</li>
              <li><strong>Impacto en el presupuesto:</strong> La inclusión de la apostilla puede afectar el costo total de la traducción.</li>
              <li><strong>Recomendación:</strong> Antes de solicitar la traducción, verifica si tu documento necesita apostilla para evitar costos adicionales inesperados.</li>
            </ul>
          </div>
        ),
      },
      
    {
      pregunta: "¿QUÉ DOCUMENTOS UNIVERSITARIOS ESTAMOS AUTORIZADOS A TRADUCIR?",
      respuesta: (
        <div>
          <p><strong>Algunos ejemplos:</strong></p>
          <ul>
            <li><strong>Diplomas:</strong> certificados que acreditan títulos como licenciaturas o maestrías.</li>
            <li><strong>Transcripciones académicas:</strong> Listado oficial de tus calificaciones (analítico).</li>
            <li><strong>Certificados de graduación:</strong> Confirman que cumpliste con todos los requisitos.</li>
            <li><strong>Programas o planes de estudios:</strong> Descripción de los contenidos de tus cursos.</li>
            <li><strong>Documentos Administrativos:</strong></li>
            <ul>
              <li><strong>Certificados de inscripción:</strong> Constancia de matrícula.</li>
              <li><strong>Cartas de buena conducta:</strong> Acreditan tu comportamiento en la universidad.</li>
              <li><strong>Certificados de pago:</strong> Comprobante de matrícula u otros costos.</li>
            </ul>
          </ul>
        </div>
      ),
    },
    {
      pregunta: "¿CÓMO SE PUEDE ABONAR Y DÓNDE NOS ENCONTRAMOS FÍSICAMENTE?",
      respuesta: (
        <div>
          <p><strong>Opciones de pago y ubicación:</strong></p>
          <ul>
            <li><strong>Métodos de pago:</strong> Se acepta transferencia bancaria y/o iDEAL.</li>
            <li><strong>Factura:</strong> Una vez recibido el pago, se emite la factura correspondiente.</li>
            <li><strong>Coordinación de retiro:</strong> Se acuerda un día y horario conveniente para la entrega.</li>
            <li><strong>Ubicación:</strong> Se puede retirar físicamente en Utrecht, Terwijde.</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿CUÁLES SON LOS REQUISITOS PARA CONVALIDAR UN TÍTULO UNIVERSITARIO EN LOS PAÍSES BAJOS?",
      respuesta: (
        <div>
          <p><strong>Para convalidar un título universitario en los Países Bajos, se requiere lo siguiente:</strong></p>
          <ul>
            <li><strong>Traducción jurada:</strong> El título y los documentos académicos deben estar traducidos al neerlandés, inglés, alemán o francés por un traductor jurado.</li>
            <li><strong>Legalización o apostilla:</strong> Se debe garantizar la autenticidad de los documentos con la legalización o apostilla de La Haya (si corresponde).</li>
            <li><strong>Evaluación del diploma:</strong> Nuffic o IDW evaluarán el nivel académico de tu título en el sistema neerlandés.</li>
            <li><strong>Requisitos adicionales:</strong> Algunas instituciones pueden solicitar cartas de recomendación o programas específicos de estudio.</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿CUÁNTO DEMORA POSTNL EN ENVIAR DOCUMENTOS?",
      respuesta: (
        <div>
          <p><strong>El tiempo de entrega de PostNL depende de varios factores:</strong></p>
          <ul>
            <li><strong>Seguimiento:</strong> Se recomienda utilizar el servicio con código de rastreo para monitorear el envío.</li>
            <li><strong>Tiempo estimado:</strong> Puede tardar entre 1 y 10 días hábiles, dependiendo del destino y tipo de servicio seleccionado.</li>
            <li><strong>Destino del envío:</strong> Los envíos dentro de los Países Bajos suelen ser más rápidos que los envíos internacionales.</li>
            <li><strong>Factores externos:</strong> En fechas festivas o periodos de alta demanda, el tiempo de entrega puede extenderse.</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿EXISTE DIFERENCIA DE PRECIO ENTRE UNA TRADUCCIÓN DIGITAL Y DE PAPEL?",
      respuesta: (
        <div>
          <p><strong>En los Países Bajos, no estamos autorizados a emitir traducciones con firma digital.</strong></p>
          <ul>
            <li><strong>Formato digital:</strong> Podemos enviarte una versión escaneada de la traducción impresa para que la tengas disponible si la necesitas.</li>
            <li><strong>Costo:</strong> No hay diferencia de precio entre la versión digital y la impresa.</li>
            <li><strong>Envío por correo postal:</strong> Si prefieres recibir la traducción impresa, el envío tiene un costo adicional de aproximadamente 10 euros + IVA.</li>
            <li><strong>Variaciones en el costo del envío:</strong> El precio exacto dependerá del peso del sobre y del destino del envío.</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿QUÉ DOCUMENTOS PERSONALES ESTAMOS AUTORIZADOS A TRADUCIR?",
      respuesta: (
        <div>
          <p><strong>Estamos autorizados a traducir los siguientes documentos personales:</strong></p>
          <ul>
            <li>Actas de nacimiento</li>
            <li>Certificados de matrimonio</li>
            <li>Certificados de divorcio</li>
            <li>Certificados de soltería</li>
            <li>Actas de defunción</li>
            <li>Certificados de estado civil</li>
          </ul>
        </div>
      ),
    },
    
    {
      pregunta: "¿ES POSIBLE QUE OTRA PERSONA RETIRE LA TRADUCCIÓN POR MÍ?",
      respuesta: (
        <div>
          <p><strong>Sí, claro que es posible. Solo debes enviarnos un email con la siguiente información:</strong></p>
          <ul>
            <li><strong>Nombre:</strong> Indicar el nombre de la persona que retirará la traducción.</li>
            <li><strong>Lugar de retiro:</strong> Especificar la ubicación donde se retirará el documento.</li>
            <li><strong>Horario:</strong> Indicar en qué momento la persona pasará a recoger la traducción.</li>
          </ul>
          <p>¿Prefieres que te lo enviemos por correo postal? También es posible.</p>
        </div>
      ),
    },
    
    {
      pregunta: "¿QUÉ PASA SI EL CORREO PIERDE LA TRADUCCIÓN?",
      respuesta: (
        <div>
          <p><strong>Aunque nunca nos ha pasado, en caso de que suceda, la solución es la siguiente:</strong></p>
          <ul>
            <li><strong>Reimpresión:</strong> Se realizará una nueva impresión de la traducción certificada.</li>
            <li><strong>Costo adicional:</strong> Se aplicará un cargo extra por la reimpresión de las copias certificadas.</li>
            <li><strong>Gastos de envío:</strong> También se deberá abonar nuevamente el costo del envío postal.</li>
          </ul>
         </div>
      ),
    },
    
    {
      pregunta: "¿ES NECESARIO CERTIFICAR NUESTRA TRADUCCIÓN?",
      respuesta: (
        <div>
          <p><strong>¡Quedate traquilo! No es necesario certificar la traducción.</strong></p>
          <ul>
            <li><strong>Presentación en los Países Bajos:</strong> Si la traducción se usará dentro de los Países Bajos, no requiere certificación adicional.</li>
            <li><strong>Uso directo:</strong> La traducción está lista para ser presentada directamente en la entidad u organización donde la necesites.</li>
            <li><strong>Casos especiales:</strong> Si la institución que solicita la traducción requiere certificación extra, es recomendable confirmarlo con antelación.</li>
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
