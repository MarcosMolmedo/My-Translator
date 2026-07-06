import React from "react";
import "../Styles/SobreMi.css";

const SobreMi = ({ translations }) => {
  const about = translations.about;
  const linkedInUrl = "https://www.linkedin.com/in/yohanamalvasio/";

  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about__container">
        <div className="about__intro">
          <span className="about__eyebrow">{about.eyebrow}</span>

          <h1 className="about__title" id="about-title">
            {about.title}
          </h1>

          <p className="about__lead">{about.lead}</p>
        </div>

        <div className="about__grid">
          <div className="about__image-card">
            <img
              src="/sobremi3.0.png"
              alt={about.imageAlt}
              className="about__image"
            />
          </div>

          <div className="about__content">
            <h2 className="about__heading">{about.storyTitle}</h2>

            {about.story.map((paragraph) => (
              <p className="about__text" key={paragraph}>
                {paragraph}
              </p>
            ))}

            <div className="about__credentials">
              {about.credentials.map((item) => (
                <article className="about__credential" key={item.title}>
                  <span className="about__credential-number">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="about__credential-title">{item.title}</h3>
                    <p className="about__credential-text">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="about__button"
            >
              {about.cta}
            </a>
          </div>
        </div>

        <div className="about__specialties">
          <div className="about__specialties-header">
            <span className="about__eyebrow">{about.specialtiesEyebrow}</span>
            <h2 className="about__section-title">{about.specialtiesTitle}</h2>
          </div>

          <div className="about__specialties-grid">
            {about.specialties.map((specialty) => (
              <article className="about__specialty" key={specialty.title}>
                <h3 className="about__specialty-title">{specialty.title}</h3>
                <p className="about__specialty-text">{specialty.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;