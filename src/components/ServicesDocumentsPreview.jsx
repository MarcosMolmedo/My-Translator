import React from "react";
import {
  Baby,
  Home,
  GraduationCap,
  BriefcaseBusiness,
  UserRound,
  FileText,
  Gavel,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";

import "../Styles/ServicesDocumentsPreview.css";

const documentIcons = [
  Baby,
  Home,
  GraduationCap,
  BriefcaseBusiness,
  UserRound,
  FileText,
  Gavel,
  MoreHorizontal,
];

const ServicesDocumentsPreview = ({ translations }) => {
  const documents = translations.servicesDocumentsPreview;

  return (
    <section
      className="services-documents-preview"
      aria-labelledby="services-documents-preview-title"
    >
      <div className="services-documents-preview__container">
        <h2
          className="services-documents-preview__title"
          id="services-documents-preview-title"
        >
          {documents.title}
        </h2>

        <div className="services-documents-preview__grid">
          {documents.items.map((item, index) => {
            const Icon = documentIcons[index] || FileText;

            return (
              <article
                className="services-documents-preview__card"
                key={item}
              >
                <Icon
                  className="services-documents-preview__icon"
                  aria-hidden="true"
                />

                <h3 className="services-documents-preview__card-title">
                  {item}
                </h3>

                <ArrowRight
                  className="services-documents-preview__arrow"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesDocumentsPreview;