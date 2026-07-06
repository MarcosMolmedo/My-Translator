import React from "react";
import { Link } from "react-router-dom";
import {
  UsersRound,
  Home,
  GraduationCap,
  ChartColumn,
  Shield,
  FileText,
  PenLine,
  CircleHelp,
  BadgeCheck,
  Landmark,
  Clock3,
  UserRound,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import "../Styles/Servicios.css";

const documentIcons = [
  UsersRound,
  Home,
  GraduationCap,
  ChartColumn,
  Shield,
  FileText,
  PenLine,
  CircleHelp,
];

const whyIcons = [BadgeCheck, Landmark, Clock3, UserRound];

const Servicios = ({ translations }) => {
  const services = translations.services;

  return (
    <main className="services">
      <section className="services-hero" aria-labelledby="services-hero-title">
        <div className="services-hero__content">
          <span className="services-hero__eyebrow">
            {services.hero.eyebrow}
          </span>

          <h1 className="services-hero__title" id="services-hero-title">
            {services.hero.title}
          </h1>

          <p className="services-hero__text">{services.hero.text}</p>

          <Link className="services-hero__button" to="/cotizaciones">
            {services.hero.button}
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        <div className="services-hero__image-wrapper" aria-hidden="true">
          <img
            className="services-hero__image"
            src="/services-hero-premium.png"
            alt=""
          />
        </div>
      </section>

      <section
        className="services-documents"
        aria-labelledby="services-documents-title"
      >
        <header className="services-documents__header">
          <h2
            className="services-documents__title"
            id="services-documents-title"
          >
            {services.documents.title}
          </h2>
        </header>

        <div className="services-documents__grid">
          {services.documents.items.map((item, index) => {
            const Icon = documentIcons[index];

            return (
              <article className="services-documents__card" key={item.title}>
                <div className="services-documents__icon" aria-hidden="true">
                  <Icon size={36} strokeWidth={1.55} />
                </div>

                <div className="services-documents__content">
                  <h3 className="services-documents__card-title">
                    {item.title}
                  </h3>

                  <p className="services-documents__card-text">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-why" aria-labelledby="services-why-title">
        <header className="services-why__header">
          <h2 className="services-why__title" id="services-why-title">
            {services.why.title}
          </h2>
        </header>

        <div className="services-why__grid">
          {services.why.items.map((item, index) => {
            const Icon = whyIcons[index];

            return (
              <article className="services-why__item" key={item.title}>
                <div className="services-why__icon" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.55} />
                </div>

                <h3 className="services-why__item-title">{item.title}</h3>
                <span className="services-why__line" aria-hidden="true" />
                <p className="services-why__item-text">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="services-cta" aria-labelledby="services-cta-title">
        <div className="services-cta__icon" aria-hidden="true">
          <MessageCircle size={44} strokeWidth={1.45} />
        </div>

        <div className="services-cta__content">
          <h2 className="services-cta__title" id="services-cta-title">
            {services.cta.title}
          </h2>

          <p className="services-cta__text">{services.cta.text}</p>
        </div>

        <Link className="services-cta__button" to="/cotizaciones">
          {services.cta.button}
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
};

export default Servicios;