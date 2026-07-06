import { Link } from "react-router-dom";
import "../Styles/FinalCta.css";

const FinalCta = ({ translations }) => {
  const cta = translations.finalCta;

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__container">
        <div className="final-cta__content">
          <p className="final-cta__eyebrow">{cta.eyebrow}</p>

          <h2 className="final-cta__title" id="final-cta-title">
            {cta.title}
          </h2>

          <p className="final-cta__text">{cta.text}</p>
        </div>

        <Link className="final-cta__button" to="/contacto">
          {cta.button}
        </Link>
      </div>
    </section>
  );
};

export default FinalCta;