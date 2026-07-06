import React, { useState } from "react";
import "../Styles/PreguntasFrecuentes.css";
import FaqIcon from "../assets/images/signosdepregunta.png";

const PreguntasFrecuentes = ({ translations }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const faq = translations.faq;

  const toggleRespuesta = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <main className="faq">
      <section className="faq__container" aria-labelledby="faq-title">
        <header className="faq__header">
          <div className="faq__header-icon-wrapper" aria-hidden="true">
            <img src={FaqIcon} alt="" className="faq__header-icon" />
          </div>

          <div>
            <p className="faq__eyebrow">{faq.eyebrow}</p>
            <h1 id="faq-title" className="faq__header-title">
              {faq.title}
            </h1>
            <p className="faq__intro">{faq.intro}</p>
          </div>
        </header>

        <div className="faq__list">
          {faq.items.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={item.question}
                className={`faq__item ${isActive ? "faq__item--active" : ""}`}
              >
                <button
                  type="button"
                  className={`faq__question ${
                    isActive ? "faq__question--active" : ""
                  }`}
                  onClick={() => toggleRespuesta(index)}
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq__question-text">{item.question}</span>
                  <span className="faq__question-toggle" aria-hidden="true">
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`faq__answer ${
                    isActive ? "faq__answer--visible" : ""
                  }`}
                >
                  {item.answerIntro && <p>{item.answerIntro}</p>}

                  {item.answerList && (
                    <ul>
                      {item.answerList.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PreguntasFrecuentes;