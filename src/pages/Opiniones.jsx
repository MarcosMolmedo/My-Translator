import React from "react";
import "../Styles/Opiniones.css";
import personaIcon from "../assets/images/iconoopiniones.png";

const testimonios = [
  {
    nombre: "Nicolas Dabinovic",
    rol: "Especialista en operaciones y servicio al cliente",
    fecha: "4 de abril de 2024, Nicolas fue cliente de Yohana",
    texto:
      "I truthfully recommend Yohana Malvasio. She has done some translations for me and I have to say that she has done an impeccable job. She is really efficient, really clear with the times and fast as well. She was able to explain every question I had. If you are looking to translate Spanish to English in the Netherlands, she is one of the few in the country that is certified to do it and, in my experience, really professional.",
  },
  {
    nombre: "Juan Pablo Poittevin Santana",
    rol: "Software Engineer",
    fecha: "11 de abril de 2024, Juan Pablo fue cliente de Yohana",
    texto:
      "Yohana translated my birth certificate from Spanish to English. She was professional and not only helped me with the translation, but also advised me on the documents I needed to register with the Amsterdam municipality. I recommend anyone in the Netherlands who needs a Spanish-English translator to contact Yohana.",
  },
  {
    nombre: "Gladis Rodríguez Hernández",
    rol: "Naval Engineer | Project Estimator at Damen Shiprepair Rotterdam | Specialized in Shiprepair and Shipbuilding Cost Analysis | Rotterdam-based",
    fecha: "17 de abril de 2024, Gladis fue cliente de Yohana",
    texto:
      "Yohana es muy profesional. Tuve que traducir un certificado matrimonial y todo fue perfecto.",
  },
  {
    nombre: "Elisa Souza Quevedo",
    rol: "",
    fecha: "22 de abril de 2024, Elisa fue cliente de Yohana",
    texto:
      "Yohana es una gran profesional, necesitábamos una traducción de la partida de matrimonio y por indicación contactamos con ella, y estamos muy contentos con el resultado, su trabajo es impecable.",
  },
  {
    nombre: "Andrés Rodríguez Von Hauske",
    rol: "Junior Architect | Collective Housing | Social & Sustainable Design | TU/e Graduate",
    fecha: "24 de abril de 2024, Andrés fue cliente de Yohana",
    texto:
      "Yohana es una persona muy profesional y atenta a las necesidades del cliente. Fue de mucha ayuda y mentoría sobre cómo darle seguimiento al proceso de legalización de documentos en Países Bajos. ¡Definitivamente alguien que pone por delante a sus clientes y el servicio!",
  },
  {
    nombre: "Abril Seyahian",
    rol: "Value and Evidence | Health Economics and Outcomes Research | HEOR",
    fecha: "25 de abril de 2024, Abril fue cliente de Yohana",
    texto:
      "I highly recommend Yohana for Spanish to English translation services in the Netherlands. I had the pleasure of requesting her services as translator recently, and she exceeded expectations in every aspect. She was incredibly responsive, delivering high-quality translations promptly. Additionally, she was always available to clarify any doubts and provide assistance, making the entire process smooth and efficient. I would not hesitate to engage her services again and recommend her to anyone seeking a reliable and skilled English translator.",
  },
  {
    nombre: "Paloma Rodríguez Guaraglia",
    rol: "",
    fecha: "Hace 2 semanas",
    texto:
      "La atención y servicio de Yohana es excelente y super recomendable. En mi caso debía solicitar una partida en el Registro Civil de Rotterdam y, a pesar de que su fuerte es la traducción, no solo logró conseguirme el documento, sino que también gestionó la apostilla de La Haya. Asimismo, una vez despachado a Argentina colaboró conmigo hasta el último momento para asegurar que el documento llegue a mis manos. Sin duda volvería a confiar en su profesionalismo y la recomendaría. A su vez la comunicación fue súper fluida y clara. Sin dudas recomiendo su servicio.",
  },
  {
    nombre: "Camila",
    rol: "",
    fecha: "Hace 6 meses",
    texto:
      "El servicio de Yohana es excelente. Debía traducir una partida y ella al instante respondió de manera muy amable y cálida. Una vez que corroboramos si los datos personales eran correctos, envió la partida por correo y en menos de una semana ya la tenía conmigo. ¡Sumamente recomendable!",
  },
  {
    nombre: "Andrea Montero",
    rol: "",
    fecha: "Hace 6 meses",
    texto:
      "Súper profesional, seria y puntual con las entregas. ¡Gracias Yoha por las traducciones! Súper recomendable.",
  },
  {
    nombre: "Matías Del Bel",
    rol: "",
    fecha: "Hace 5 horas",
    texto:
      "Excelente servicio. Contacté a Yohana porque necesitaba traducir unos documentos con urgencia, y no solo los entregó a tiempo, sino que además me asesoró durante todo el proceso. ¡Una experiencia realmente excelente!",
  },
  {
    nombre: "Robert Knoester",
    rol: "",
    fecha: "Hace 3 meses",
    texto:
      "Yohana has been very helpful a couple of times. Service is quick and communication is perfect. Attention to details and very friendly. She even helped me with finding another translator for Portuguese documents.",
  },
  {
    nombre: "Aracely Núñez Mejía",
    rol: "",
    fecha: "Hace 8 meses",
    texto:
      "Yoha's translation services are excellent. She offers sworn translations with a high level of professionalism, speed and attention to detail. Highly recommended!",
  },
  {
    nombre: "Camila",
    rol: "",
    fecha: "Hace 8 meses",
    texto:
      "Yohana helped me translate some documents I needed to come to the Netherlands. The translation was accurate and I got the papers on time so I'm really grateful. Thank you! ❤️",
  },
  {
    nombre: "Caro Gv",
    rol: "",
    fecha: "Hace 18 horas",
    texto:
      "Yohana is an excellent professional, reliable and friendly!",
  },
  {
    nombre: "Alison Ptrs",
    rol: "",
    fecha: "Hace 21 horas",
    texto:
      "Yohana is a very kind and professional woman. She is easy to interact with and flexible when it comes to scheduling time and date. She also provided me with more information about the translator job, which truly inspired me. I would definitely recommend working with her.",
  },
];

const Opiniones = () => {
  return (
    <section className="opiniones">
      <div className="opiniones__overlay">
        <div className="opiniones__content">
          <div className="opiniones__grid">
            {testimonios.map((item, index) => (
              <article key={index} className="opiniones__card">
                <div className="opiniones__avatar">
                  <img
                    src={personaIcon}
                    alt="Icono persona"
                    className="opiniones__avatar-icon"
                  />
                </div>

                <header className="opiniones__header">
                  <h3 className="opiniones__nombre">{item.nombre}</h3>
                  {item.rol && <p className="opiniones__rol">{item.rol}</p>}
                  <p className="opiniones__fecha">{item.fecha}</p>
                </header>

                <p className="opiniones__texto">{item.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Opiniones;
